import type { Locale } from '@/lib/i18n/settings';

export interface FaqItem {
  questionKey?: string;
  answerKey?: string;
  question?: string;
  answer?: string;
}

const en: FaqItem[] = [
  { question: 'What is AdriaticByBoat?', answer: 'AdriaticByBoat helps you discover boat tours, private charters and rentals from local operators on the Adriatic. We are starting with Zadar and expanding the marketplace as more operators join.' },
  { question: 'How does request-to-book work?', answer: 'Choose an experience, date and group size, then send a booking request. The local operator checks availability and confirms the final price before any payment step is created.' },
  { question: 'When do I pay?', answer: 'There is no charge when you send a request. After the operator accepts the date and sets the final quote, AdriaticByBoat may send you a secure Stripe Checkout link for the configured deposit. Payment is considered received only after Stripe confirms it.' },
  { question: 'Is my booking confirmed after I submit a request?', answer: 'No. A request is not a confirmed booking. The operator must first accept it, and where a deposit is required the booking is confirmed only after the verified payment is recorded.' },
  { question: 'What is the cancellation policy?', answer: 'Cancellation terms can depend on the specific operator and experience. The applicable terms should be shown or communicated before payment. If anything is unclear, contact us or the operator before paying a deposit.' },
  { question: 'Who operates the boat?', answer: 'Boat trips and rentals are provided by the local operator shown with the experience. AdriaticByBoat provides the discovery, request, booking and payment workflow between you and participating operators.' },
  { question: 'Can SARA AI help me choose?', answer: 'Yes. SARA AI can help narrow down options based on your group, preferred activities and style of trip. For availability and prices, the marketplace inventory and operator confirmation remain the source of truth.' },
  { question: 'How can I contact AdriaticByBoat?', answer: 'Use the Contact page for support or questions about a request. For questions about a specific accepted request, you can also reply to the booking emails you receive.' },
];

const hr: FaqItem[] = [
  { question: 'Što je AdriaticByBoat?', answer: 'AdriaticByBoat pomaže pronaći izlete brodom, privatne chartere i najam brodova od lokalnih operatora na Jadranu. Počinjemo sa Zadrom i širimo ponudu kako se priključuju novi operatori.' },
  { question: 'Kako funkcionira zahtjev za rezervaciju?', answer: 'Odaberite iskustvo, datum i broj gostiju te pošaljite zahtjev. Lokalni operator provjerava dostupnost i potvrđuje konačnu cijenu prije bilo kakve naplate.' },
  { question: 'Kada plaćam?', answer: 'Slanje zahtjeva se ne naplaćuje. Nakon što operator prihvati termin i postavi konačnu ponudu, AdriaticByBoat može poslati siguran Stripe Checkout link za dogovoreni depozit. Plaćanje se smatra zaprimljenim tek nakon Stripe potvrde.' },
  { question: 'Je li rezervacija potvrđena čim pošaljem zahtjev?', answer: 'Ne. Zahtjev nije potvrđena rezervacija. Operator ga prvo mora prihvatiti, a ako je potreban depozit, rezervacija se potvrđuje nakon verificirane uplate.' },
  { question: 'Koji su uvjeti otkazivanja?', answer: 'Uvjeti otkazivanja mogu ovisiti o konkretnom operatoru i iskustvu. Primjenjivi uvjeti trebaju biti prikazani ili komunicirani prije plaćanja. Ako nešto nije jasno, javite nam se ili kontaktirajte operatora prije uplate depozita.' },
  { question: 'Tko pruža uslugu izleta ili najma?', answer: 'Izlet ili najam pruža lokalni operator naveden uz iskustvo. AdriaticByBoat omogućuje pronalazak ponude, slanje zahtjeva, booking workflow i plaćanje između gosta i uključenih operatora.' },
  { question: 'Može li mi SARA AI pomoći pri odabiru?', answer: 'Da. SARA AI može suziti izbor prema veličini grupe, željenim aktivnostima i stilu izleta. Za dostupnost i cijene izvor istine ostaju stvarna ponuda i potvrda operatora.' },
  { question: 'Kako mogu kontaktirati AdriaticByBoat?', answer: 'Za podršku ili pitanja o zahtjevu koristite Contact stranicu. Za konkretan prihvaćen zahtjev možete odgovoriti i na booking email koji ste primili.' },
];

const de: FaqItem[] = [
  { question: 'Was ist AdriaticByBoat?', answer: 'AdriaticByBoat hilft dir, Bootstouren, private Charter und Bootsvermietungen von lokalen Anbietern an der Adria zu finden. Wir starten in Zadar und erweitern das Angebot schrittweise.' },
  { question: 'Wie funktioniert eine Buchungsanfrage?', answer: 'Wähle Erlebnis, Datum und Gruppengröße und sende eine Anfrage. Der lokale Anbieter prüft die Verfügbarkeit und bestätigt den Endpreis, bevor ein Zahlungsschritt erstellt wird.' },
  { question: 'Wann bezahle ich?', answer: 'Für die Anfrage wird nichts berechnet. Nach Bestätigung des Termins und des finalen Angebots kann AdriaticByBoat einen sicheren Stripe-Checkout-Link für die vereinbarte Anzahlung senden. Die Zahlung gilt erst nach Stripe-Bestätigung als eingegangen.' },
  { question: 'Ist meine Buchung nach der Anfrage bestätigt?', answer: 'Nein. Eine Anfrage ist noch keine bestätigte Buchung. Der Anbieter muss sie zuerst annehmen; falls eine Anzahlung erforderlich ist, wird die Buchung nach der verifizierten Zahlung bestätigt.' },
  { question: 'Welche Stornierungsbedingungen gelten?', answer: 'Die Bedingungen können je nach Anbieter und Erlebnis unterschiedlich sein. Die jeweils geltenden Bedingungen sollten vor der Zahlung angezeigt oder mitgeteilt werden. Bei Unklarheiten bitte vor der Anzahlung nachfragen.' },
  ...en.slice(5),
];

export function getFaqItems(locale: string): FaqItem[] {
  const copies: Partial<Record<Locale, FaqItem[]>> = { en, hr, de };
  return copies[locale as Locale] ?? en;
}

export const faqItems = en;
