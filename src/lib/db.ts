// src/lib/db.ts

// Primjer: Zamijenite 'any' s konkretnim tipom vašeg klijenta
// import { SupabaseClient } from '@supabase/supabase-js'; // Primjer za Supabase

const databaseUrl = process.env.DB_URL; // Koristite const
// let _client: SupabaseClient | undefined; // Primjer s tipom i _ ako se ne koristi globalno
let _client: any; // Ostavljam any ako ne znate točan tip, ali idealno je specificirati

if (!databaseUrl && process.env.NODE_ENV !== "development") { // Malo opreznija provjera
  // U developmentu možda ne želite baciti grešku odmah
  // console.warn("DB_URL is not set, database functionality might be limited.");
} else if (!databaseUrl) {
    // console.error("FATAL: Missing Database URL in production environment variables.");
    // throw new Error("Missing Database URL in production environment variables.");
}


// Vaša stvarna logika za inicijalizaciju baze podataka
// if (databaseUrl && !_client) {
//   _client = createClient(databaseUrl, process.env.SUPABASE_ANON_KEY); // Primjer
// }

// export { _client as dbClient }; // Eksportirajte ako je potrebno
