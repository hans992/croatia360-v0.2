// app/api/chat/route.ts
import { streamText, type Message } from 'ai';
import { google } from '@ai-sdk/google'; // Import the Google provider from the Vercel AI SDK

// Helper function to extract a meaningful error message from various error types.
function getErrorMessage(error: unknown): string {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    // Return the specific error message if available
    return error.message;
  }
  // Fallback for other types of errors
  try {
    return JSON.stringify(error);
  } catch {
    return 'Could not stringify error object';
  }
}

// Ensure the correct environment variable for the Google API key is set.
// The Vercel AI SDK's Google provider typically expects GOOGLE_GENERATIVE_AI_API_KEY.
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error("FATAL: Missing Google API Key (GOOGLE_GENERATIVE_AI_API_KEY) in environment variables.");
  // Throw an error during startup if the key is missing.
  throw new Error("Missing Google API Key (GOOGLE_GENERATIVE_AI_API_KEY) in environment variables.");
}

// Configure the route to run on the Edge runtime for potentially better performance and lower cost.
export const runtime = 'edge';

// Define the main POST handler for the chat API endpoint.
export async function POST(req: Request) {
  try {
    // Extract the message history from the request body.
    const { messages }: { messages: Message[] } = await req.json();

    // Define the system prompt to guide the AI's behavior and persona.
    const systemPrompt = `Ti si SARA AI, prijateljski i izuzetno koristan asistent za planiranje 
    putovanja specijaliziran isključivo za Hrvatsku. Tvoj zadatak je kreirati detaljne i 
    personalizirane planove puta (itinerare) za korisnike. Analiziraj pažljivo korisnikove poruke 
    kako bi prikupila sve relevantne informacije: destinacija unutar Hrvatske, datumi putovanja, 
    broj putnika, budžet, interesi i preferencije (npr. plaže, povijest, gastronomija, avantura), 
    stil putovanja, ako nakon tri pokušaja ne dobiješ dovoljno odgovora, predloži plan prema dobivenim
    informacijama. Na temelju prikupljenih informacija, generiraj jasan i koristan plan puta, 
    dan po dan, predlažući specifične aktivnosti, lokacije i znamenitosti. Formatiraj odgovor 
    koristeći Markdown (naslovi za dane, liste za aktivnosti). Ako ključne informacije nedostaju, 
    postavi ljubazna i jasna pitanja. Fokusiraj se isključivo na Hrvatsku. Budi entuzijastična i 
    inspirativna! Kao takav model, nemoj odgovarati na poruke koje nisu vezane uz potovanja, posebno
    poruke koje se tiču politike i nacionalizma.`;

    // Call the AI model using streamText for a streaming response.
    const result = await streamText({
      // Specify the Google model to use (e.g., 'gemini-1.5-flash' for speed and cost-effectiveness).
      model: google('gemini-1.5-flash'),
      // Pass the chat message history.
      messages: messages,
      // Pass the system prompt to define the AI's role.
      system: systemPrompt,
      // Define a callback to log potential errors occurring *during* the stream generation on the backend.
      async onError(error) {
        console.error("[API Route Error] Error during streamText execution:", {
          timestamp: new Date().toISOString(),
          errorDetails: error,
          errorMessage: getErrorMessage(error)
        });
        // This log is crucial for debugging backend issues that don't throw exceptions caught by the main try/catch.
      },
    });

    // Return the streaming response to the client.
    // Use getErrorMessage to forward meaningful error messages instead of the default "An error occurred."
    return result.toDataStreamResponse({
       getErrorMessage: getErrorMessage
    });

  } catch (error) {
    // Catch errors that occur *outside* the streamText internal error handling (e.g., issues with req.json()).
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
