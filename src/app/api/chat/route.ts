// app/api/chat/route.ts
import { streamText, type Message } from 'ai';
import { google } from '@ai-sdk/google'; 

function getErrorMessage(error: unknown): string {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    
    return error.message;
  }
  
  try {
    return JSON.stringify(error);
  } catch {
    return 'Could not stringify error object';
  }
}

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error("FATAL: Missing Google API Key (GOOGLE_GENERATIVE_AI_API_KEY) in environment variables.");
  
  throw new Error("Missing Google API Key (GOOGLE_GENERATIVE_AI_API_KEY) in environment variables.");
}

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    
    const { messages }: { messages: Message[] } = await req.json();

    const systemPrompt = `Ti si SARA AI, prijateljski i izuzetno koristan asistent za planiranje 
    putovanja specijaliziran isključivo za Hrvatsku. Tvoj zadatak je kreirati detaljne i 
    personalizirane planove puta (itinerare) za korisnike i dati korisnicima tražene informacije. Analiziraj pažljivo korisnikove poruke 
    kako bi prikupila sve relevantne informacije: destinacija unutar Hrvatske, datumi putovanja, 
    broj putnika, budžet, interesi i preferencije (npr. plaže, povijest, gastronomija, avantura), 
    stil putovanja, ako nakon tri pokušaja ne dobiješ dovoljno odgovora, predloži plan prema dobivenim
    informacijama. Na temelju prikupljenih informacija, generiraj jasan i koristan plan puta, 
    dan po dan, predlažući specifične aktivnosti, lokacije i znamenitosti. Formatiraj odgovor 
    koristeći Markdown (naslovi za dane, liste za aktivnosti). Ako ključne informacije nedostaju, 
    postavi ljubazna i jasna pitanja, ali se potrudi razgovor održati prirodnim. Ne trebaš odmah ispitivati sva
    pitanja odjedanput kako ne bi korisnik stekao dojam da si prenapadna. Fokusiraj se isključivo na 
    Hrvatsku. Budi entuzijastična i inspirativna! Kao takav model, nemoj odgovarati na poruke koje nisu vezane uz potovanja, posebno
    poruke koje se tiču politike i nacionalizma. I nemoj boldati tekst.`;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      
      messages: messages,
      system: systemPrompt,
      async onError(error) {
        console.error("[API Route Error] Error during streamText execution:", {
          timestamp: new Date().toISOString(),
          errorDetails: error,
          errorMessage: getErrorMessage(error)
        });
      },
    });

    return result.toDataStreamResponse({
       getErrorMessage: getErrorMessage
    });

  } catch (error) {

    console.error("[API Route Error] Error in main POST handler catch block:", {
       timestamp: new Date().toISOString(),
       errorDetails: error,
       errorMessage: getErrorMessage(error),
       errorStack: error instanceof Error ? error.stack : undefined
    });

    const errorMessage = getErrorMessage(error);
    // Return a standard 500 error response if something goes wrong outside the stream processing.
    return new Response(JSON.stringify({ error: `Server error: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
