// app/api/chat/route.ts
import { generateText, type ModelMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { BRAND } from '@/lib/brand';

function getErrorMessage(error: unknown): string {
  if (error == null) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes('exceeded your current quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
      return 'The AI service is temporarily unavailable due to usage limits. Please try again in a minute.';
    }
    return msg;
  }
  try { return JSON.stringify(error); } catch { return 'Could not stringify error object'; }
}

export const runtime = 'edge';

const localeToLanguage: Record<string, string> = {
  hr: 'Croatian (hrvatski)',
  en: 'English',
  de: 'German (Deutsch)',
  it: 'Italian (italiano)',
  fr: 'French (français)',
  cs: 'Czech (čeština)',
  pl: 'Polish (polski)',
  hu: 'Hungarian (magyar)',
};

const baseSystemPrompt = `Ti si SARA AI, concierge za ${BRAND.name}, marketplace za izlete brodom, privatne chartere i najam brodova na Jadranu.

Tvoj primarni zadatak je pomoći korisniku odabrati vrstu iskustva na moru prema polazištu, datumu, broju gostiju, budžetu, željenom trajanju i interesima poput kupanja, skrivenih uvala, Kornata, Telašćice, snorkelanja, obiteljskog izleta ili privatnog chartera. ${BRAND.name} trenutno je posebno fokusiran na ponudu iz Zadra.

KLJUČNA PRAVILA ZA MARKETPLACE:
- Nikada ne izmišljaj dostupnost, cijene, operatora, brod ili potvrđenu rezervaciju.
- Ako nemaš stvarne podatke o dostupnosti ili cijeni, reci da ih treba provjeriti kroz aktualnu ponudu i potvrdu operatora.
- Za konkretne Zadar boat upite usmjeri korisnika na /zadar/boat-tours kao mjesto gdje može vidjeti stvarne marketplace ponude i poslati request-to-book.
- Objasni da slanje zahtjeva nije naplata. Operator prvo potvrđuje termin i konačnu cijenu, a eventualni depozit ide kroz siguran payment flow.
- Ne tvrdi da je booking potvrđen samo zato što je request poslan.

Sekundarno možeš pomagati s putovanjem po Hrvatskoj i obalnim destinacijama: itinerari, plaže, gastronomija, prijevoz, otoci i praktični savjeti. Kod planiranja prikupi samo informacije koje su potrebne i vodi razgovor prirodno.

Kada je poruka nejasna ili vrlo kratka, postavi jedno kratko pitanje za pojašnjenje. Ako je zahtjev dovoljno jasan, odgovori direktno bez nepotrebnog ispitivanja. Fokus ostaje na Hrvatskoj i Jadranu. Ne odgovaraj na političke ili nacionalističke rasprave; ljubazno preusmjeri na putovanje. Nemoj koristiti bold tekst.`;

function buildSystemPrompt(locale: string): string {
  const lang = localeToLanguage[locale] || localeToLanguage.en;
  return `KRITIČNO – Odgovaraj UVIJEK isključivo na jeziku: ${lang}.\n\n` + baseSystemPrompt;
}

export async function POST(req: Request) {
  let body: { messages?: { role?: string; content?: string }[]; locale?: string } = {};
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json({ error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY in environment variables.' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    body = await req.json();
    const locale = (typeof body?.locale === 'string' && body.locale) ? body.locale : 'en';
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    const modelMessages = rawMessages.map((m: { role?: string; content?: string }) => ({
      role: (m.role === 'user' || m.role === 'assistant' || m.role === 'system') ? m.role : 'user',
      content: typeof m.content === 'string' ? m.content : '',
    }));

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      messages: modelMessages as ModelMessage[],
      system: buildSystemPrompt(locale),
      maxRetries: 0,
    });

    return Response.json({ message: text });
  } catch (error) {
    const errMsg = getErrorMessage(error);
    const isQuotaError = errMsg.includes('usage limits') || errMsg.includes('quota') || errMsg.includes('429');

    console.error('[API Route Error]', {
      timestamp: new Date().toISOString(),
      errorDetails: error,
      errorMessage: errMsg,
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    if (isQuotaError && process.env.CHAT_DEMO_MODE_ON_QUOTA === 'true') {
      const lastUserMsg = (Array.isArray(body?.messages) ? body.messages : []).filter((m: { role?: string }) => m.role === 'user').pop();
      const query = lastUserMsg?.content?.toLowerCase().trim() ?? '';
      const isUnclear = query.length < 15 || /^(hi|hello|hey|bok|zdravo|help|pomoć|što\??|what\??|tell me|reci mi|more|više)$/i.test(query);
      const demoResponse = isUnclear
        ? `Hi! I can help you choose a boat trip or private charter from Zadar. Tell me your group size and what kind of day on the water you want.\n\n*[${BRAND.name} demo mode – AI quota exceeded.]*`
        : query.includes('boat') || query.includes('brod') || query.includes('kornat') || query.includes('island')
          ? `For real Zadar boat options, open the Boat tours section and compare the current marketplace experiences. I can still help you decide between a private tour, shared trip or rental based on your group and plans.\n\n*[${BRAND.name} demo mode – AI quota exceeded.]*`
          : `I can help plan the coastal part of your Croatia trip and narrow down boat experiences. Tell me where you are staying, your dates and what you enjoy.\n\n*[${BRAND.name} demo mode – AI quota exceeded.]*`;

      return Response.json({ message: demoResponse });
    }

    return Response.json({ error: errMsg }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
