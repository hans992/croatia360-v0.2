// app/privacy-policy/page.tsx
export default function PrivacyPolicy() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Uvjeti korištenja i Politika privatnosti</h1>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">1. Općenito</h2>
          <p>
            Ova stranica koristi usluge umjetne inteligencije (AI) putem Gemini API sustava za pružanje personaliziranih
            odgovora i preporuka. Korištenjem ove stranice prihvaćate ove uvjete i suglasni ste s obradom vaših podataka
            u skladu s ovim pravilima.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">2. Prikupljanje i obrada podataka</h2>
          <p>
            Prikupljamo osnovne informacije koje dobrovoljno dajete, kao što su vaše ime, email adresa, poruke poslane
            putem kontakt forme i eventualne informacije unesene u chatbot.
          </p>
          <p>
            Ovi podaci mogu se koristiti za: </p>
            <ul className="list-disc ml-6">
              <li>odgovaranje na vaše upite,</li>
              <li>unaprjeđenje korisničkog iskustva,</li>
              <li>analizu i poboljšanje usluge.</li>
            </ul>
          
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">3. Dijeljenje podataka</h2>
          <p>
            Vaši podaci neće biti prodani trećim stranama. Podaci mogu biti dijeljeni s vanjskim servisima samo u svrhu
            funkcioniranja aplikacije, kao što su: </p>
            <ul className="list-disc ml-6">
              <li>Gemini AI API (za obradu unosa i generiranje odgovora)</li>
              <li>Zapier (za slanje podataka u Google Sheets)</li>
              <li>Mail server (za slanje emailova)</li>
            </ul>
            <p>
              Ovi servisi imaju vlastite politike privatnosti i sigurnosti podataka. Preporučujemo da ih pročitate.
            Svi podaci šalju se sigurnim putem i u skladu su s GDPR regulacijom.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">4. Vaša prava</h2>
          <p>
            Imate pravo pristupa svojim podacima, ispravka netočnih podataka, brisanja podataka te pravo na prigovor.
            Za ostvarivanje svojih prava, kontaktirajte nas putem kontakt forme.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">5. Kolačići</h2>
          <p>
            Stranica može koristiti kolačiće (cookies) za osnovnu funkcionalnost. Ne koristimo kolačiće za oglašavanje ili praćenje korisnika u marketinške svrhe.
          </p>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Promjene</h2>
          <p>
            Zadržavamo pravo izmjene ovih uvjeta. Promjene će biti objavljene na ovoj stranici i stupaju na snagu
            objavom.
          </p>
        </section>
      </div>
    );
  }
  