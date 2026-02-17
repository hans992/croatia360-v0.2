// app/api/chat/route.ts
import { generateText, type ModelMessage } from 'ai';
import { google } from '@ai-sdk/google';

function getErrorMessage(error: unknown): string {
  if (error == null) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes('exceeded your current quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
      return 'The AI service is temporarily unavailable due to usage limits. Please try again in a minute, or check your API quota at https://ai.dev/rate-limit';
    }
    return msg;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Could not stringify error object';
  }
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

const baseSystemPrompt = `Ti si SARA AI, prijateljski i izuzetno koristan asistent za planiranje 
putovanja specijaliziran isključivo za Hrvatsku. Tvoj zadatak je kreirati detaljne i 
personalizirane planove puta (itinerare) za korisnike i dati korisnicima tražene informacije. Analiziraj pažljivo korisnikove poruke 
kako bi prikupila sve relevantne informacije: destinacija unutar Hrvatske, datumi putovanja, 
broj putnika, budžet, interesi i preferencije (npr. plaže, povijest, gastronomija, avantura), 
stil putovanja, ako nakon tri pokušaja ne dobiješ dovoljno odgovora, predloži plan prema dobivenim
informacijama. Na temelju prikupljenih informacija, generiraj jasan i koristan plan puta, 
dan po dan, predlažući specifične aktivnosti, lokacije i znamenitosti. Formatiraj odgovor 
koristeći Markdown (naslovi za dane, liste za aktivnosti).

VAŽNO – Kada je poruka nejasna ili dvosmislena, UVIJEK pitaj za pojašnjenje prije nego što odgovoriš:
- Ako je poruka vrlo kratka (npr. "hi", "help", "pomoć", "što?", "tell me more"), ljubazno pozdravi i pitaj što točno korisnik želi znati ili planirati u Hrvatskoj.
- Ako poruka može imati više značenja ili nije jasno što korisnik traži, postavi 1–2 konkretna pitanja koja će ti pomoći razumjeti (npr. "Želiš li preporuke za plaže, smještaj ili aktivnosti?").
- Ako ključne informacije nedostaju, postavi ljubazna i jasna pitanja, ali se potrudi razgovor održati prirodnim. Ne trebaš odmah ispitivati sva pitanja odjedanput kako ne bi korisnik stekao dojam da si prenapadna.
- Nikad ne pretpostavljaj – bolje pitati nego dati odgovor na krivo pitanje.

Fokusiraj se isključivo na Hrvatsku. Budi entuzijastična i inspirativna! Kao takav model, nemoj odgovarati na poruke koje nisu vezane uz putovanja, posebno poruke koje se tiču politike i nacionalizma – u tim slučajevima ljubazno preusmjeri razgovor na putovanja u Hrvatsku. I nemoj boldati tekst.`;

function buildSystemPrompt(locale: string): string {
  const lang = localeToLanguage[locale] || localeToLanguage.en;
  const languageInstruction = `KRITIČNO – Odgovaraj UVIJEK isključivo na jeziku: ${lang}. Korisnik pregleda stranicu na tom jeziku, pa sve tvoje odgovore piši na tom jeziku.\n\n`;
  return languageInstruction + baseSystemPrompt;
}

export async function POST(req: Request) {
  let body: { messages?: { role?: string; content?: string }[] } = {};
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        { error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY in environment variables.' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
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
      maxRetries: 0, // Don't retry on 429 quota errors - each retry consumes more quota
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

    // When quota is exhausted, return a demo response so the chat UI still works for testing
    if (isQuotaError && process.env.CHAT_DEMO_MODE_ON_QUOTA === 'true') {
      const lastUserMsg = (Array.isArray(body?.messages) ? body.messages : []).filter((m: { role?: string }) => m.role === 'user').pop();
      const query = lastUserMsg?.content?.toLowerCase().trim() ?? '';
      const isUnclear = query.length < 15 || /^(hi|hello|hey|bok|zdravo|help|pomoć|što\??|what\??|tell me|reci mi|more|više)$/i.test(query);
      const demoResponse =
        isUnclear
          ? "Hi! I'd love to help you plan your Croatian adventure. Could you tell me a bit more? For example: which region interests you, your travel dates, or what you enjoy (beaches, culture, nature, food)?\n\n*[Demo mode – API quota exceeded.]*"
          : query.includes('beach') || query.includes('plaž') || query.includes('sea')
            ? "Croatia has stunning beaches! Here are some top picks:\n\n**1. Zlatni Rat (Brač)** – Iconic golden horn beach\n**2. Dubrovnik beaches** – Banje, Lapad\n**3. Hvar** – Dubovica, Pokonji Dol\n**4. Korčula** – Lumbarda, Vela Pržina\n\n*[Demo mode – API quota exceeded. Add billing or wait for reset to get real AI responses.]*"
            : query.includes('wine') || query.includes('vino')
              ? "Croatian wine regions to explore:\n\n**1. Istria** – Malvazija, Teran\n**2. Dalmatia** – Plavac Mali, Pošip\n**3. Slavonia** – Graševina\n**4. Pelješac** – Dingač, Postup\n\n*[Demo mode – API quota exceeded.]*"
              : "I'd love to help plan your Croatian trip! Tell me more: which region interests you, your travel dates, and what you enjoy (beaches, culture, nature, food).\n\n*[Demo mode – API quota exceeded. Enable billing at https://ai.google.dev or wait for quota reset for real AI responses.]*";

      return Response.json({ message: demoResponse });
    }

    return Response.json(
      { error: errMsg },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
