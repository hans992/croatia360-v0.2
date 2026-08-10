import type { Locale } from '@/lib/i18n/settings';

type MarketplaceCopy = {
  navBoatTours: string;
  homeEyebrow: string;
  homeTitle: string;
  homeDescription: string;
  homeCta: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  date: string;
  guests: string;
  experienceType: string;
  allTypes: string;
  privateTour: string;
  sharedTour: string;
  boatRental: string;
  search: string;
  availableTitle: string;
  resultsOne: string;
  resultsMany: string;
  clearFilters: string;
  noMatchTitle: string;
  noMatchDescription: string;
  showAll: string;
  upTo: string;
  from: string;
  pricing: string;
  onRequest: string;
  viewExperience: string;
  backToBoats: string;
  requestToBook: string;
  checkAvailability: string;
  operatorConfirmsPrice: string;
  departure: string;
  capacity: string;
  duration: string;
  name: string;
  email: string;
  phone: string;
  desiredDate: string;
  guestCount: string;
  operatorMessage: string;
  operatorMessagePlaceholder: string;
  requestBooking: string;
  sending: string;
  noCharge: string;
  success: string;
  genericError: string;
  networkError: string;
};

const en: MarketplaceCopy = {
  navBoatTours: 'Boat tours',
  homeEyebrow: 'Croatia360 Experiences',
  homeTitle: 'Boat tours & private charters in Zadar',
  homeDescription: 'Browse real local operators, filter by date and group size, and request a booking directly through Croatia360.',
  homeCta: 'Explore Zadar boat tours',
  heroEyebrow: 'Local boat experiences from Zadar',
  heroTitle: 'Boat tours & private boat rentals in Zadar',
  heroDescription: 'Discover local operators, private day trips and boat rentals around Kornati, Telašćica and the Zadar archipelago. Choose your date and group size, then request a booking directly.',
  date: 'Date', guests: 'Guests', experienceType: 'Experience type', allTypes: 'All types', privateTour: 'Private tour', sharedTour: 'Shared tour', boatRental: 'Boat rental', search: 'Search',
  availableTitle: 'Available boat experiences', resultsOne: 'experience matches your search.', resultsMany: 'experiences match your search.', clearFilters: 'Clear filters',
  noMatchTitle: 'No exact match yet', noMatchDescription: 'Try fewer guests, another experience type or remove the date filter. Croatia360 is currently onboarding additional Zadar operators.', showAll: 'Show all Zadar boats',
  upTo: 'up to', from: 'From', pricing: 'Pricing', onRequest: 'On request', viewExperience: 'View experience', backToBoats: 'Back to Zadar boat tours',
  requestToBook: 'Request to book', checkAvailability: 'Check availability', operatorConfirmsPrice: 'The operator confirms availability and the final price.', departure: 'Departure', capacity: 'Capacity', duration: 'Duration',
  name: 'Full name', email: 'Email', phone: 'Phone', desiredDate: 'Desired date', guestCount: 'Number of guests', operatorMessage: 'Message to operator', operatorMessagePlaceholder: 'Special requests, departure time or a question…', requestBooking: 'Request booking', sending: 'Sending…', noCharge: 'No charge is made until the operator confirms the date and final price.', success: 'Request received. The operator can now confirm availability and the final price.', genericError: 'The request could not be sent. Please try again.', networkError: 'A network error occurred. Please try again.',
};

const copies: Partial<Record<Locale, MarketplaceCopy>> = {
  hr: { ...en, navBoatTours: 'Izleti brodom', homeTitle: 'Izleti brodom i privatni charter u Zadru', homeDescription: 'Pregledajte stvarne lokalne operatere, filtrirajte po datumu i veličini grupe te pošaljite zahtjev za rezervaciju izravno kroz Croatia360.', homeCta: 'Istraži izlete brodom u Zadru', heroEyebrow: 'Lokalna iskustva brodom iz Zadra', heroTitle: 'Izleti brodom i privatni najam brodova u Zadru', heroDescription: 'Otkrijte lokalne operatere, privatne cjelodnevne izlete i najam brodova za Kornate, Telašćicu i zadarski arhipelag. Odaberite datum i broj gostiju te pošaljite zahtjev za rezervaciju.', date: 'Datum', guests: 'Gosti', experienceType: 'Vrsta iskustva', allTypes: 'Sve vrste', privateTour: 'Privatni izlet', sharedTour: 'Grupni izlet', boatRental: 'Najam broda', search: 'Pretraži', availableTitle: 'Dostupna iskustva brodom', resultsOne: 'iskustvo odgovara pretrazi.', resultsMany: 'iskustava odgovara pretrazi.', clearFilters: 'Očisti filtre', noMatchTitle: 'Još nema točnog podudaranja', noMatchDescription: 'Pokušajte s manjim brojem gostiju, drugom vrstom iskustva ili uklonite datum. Croatia360 trenutno uključuje dodatne operatere iz Zadra.', showAll: 'Prikaži sve brodove u Zadru', upTo: 'do', from: 'Od', pricing: 'Cijena', onRequest: 'Na upit', viewExperience: 'Pogledaj iskustvo', backToBoats: 'Natrag na izlete brodom u Zadru', requestToBook: 'Zahtjev za rezervaciju', checkAvailability: 'Provjeri dostupnost', operatorConfirmsPrice: 'Operator potvrđuje dostupnost i konačnu cijenu.', departure: 'Polazak', capacity: 'Kapacitet', duration: 'Trajanje', name: 'Ime i prezime', phone: 'Telefon', desiredDate: 'Željeni datum', guestCount: 'Broj gostiju', operatorMessage: 'Poruka operatoru', operatorMessagePlaceholder: 'Posebne želje, vrijeme polaska ili pitanje…', requestBooking: 'Zatraži rezervaciju', sending: 'Šaljem…', noCharge: 'Nema naplate dok operator ne potvrdi termin i konačnu cijenu.', success: 'Upit je zaprimljen. Operator sada može potvrditi dostupnost i konačnu cijenu.', genericError: 'Upit nije moguće poslati. Pokušajte ponovno.', networkError: 'Došlo je do mrežne greške. Pokušajte ponovno.' },
  de: { ...en, navBoatTours: 'Bootstouren', homeTitle: 'Bootstouren & private Charter in Zadar', homeDescription: 'Entdecke lokale Anbieter, filtere nach Datum und Gruppengröße und sende deine Buchungsanfrage direkt über Croatia360.', homeCta: 'Bootstouren in Zadar entdecken', heroEyebrow: 'Lokale Bootserlebnisse ab Zadar', heroTitle: 'Bootstouren & private Bootsvermietung in Zadar', heroDescription: 'Entdecke lokale Anbieter, private Tagesausflüge und Bootsvermietungen rund um Kornati, Telašćica und den Zadar-Archipel. Wähle Datum und Gruppengröße und sende direkt eine Buchungsanfrage.', date: 'Datum', guests: 'Gäste', experienceType: 'Erlebnisart', allTypes: 'Alle Arten', privateTour: 'Private Tour', sharedTour: 'Gruppentour', boatRental: 'Bootsvermietung', search: 'Suchen', availableTitle: 'Verfügbare Bootserlebnisse', resultsOne: 'Erlebnis passt zu deiner Suche.', resultsMany: 'Erlebnisse passen zu deiner Suche.', clearFilters: 'Filter löschen', noMatchTitle: 'Noch kein exakter Treffer', noMatchDescription: 'Versuche weniger Gäste, eine andere Erlebnisart oder entferne den Datumsfilter. Croatia360 nimmt derzeit weitere Anbieter aus Zadar auf.', showAll: 'Alle Boote in Zadar anzeigen', upTo: 'bis zu', from: 'Ab', pricing: 'Preis', onRequest: 'Auf Anfrage', viewExperience: 'Erlebnis ansehen', backToBoats: 'Zurück zu Bootstouren in Zadar', requestToBook: 'Buchungsanfrage', checkAvailability: 'Verfügbarkeit prüfen', operatorConfirmsPrice: 'Der Anbieter bestätigt Verfügbarkeit und Endpreis.', departure: 'Abfahrt', capacity: 'Kapazität', duration: 'Dauer', name: 'Vor- und Nachname', phone: 'Telefon', desiredDate: 'Wunschdatum', guestCount: 'Anzahl Gäste', operatorMessage: 'Nachricht an Anbieter', operatorMessagePlaceholder: 'Besondere Wünsche, Abfahrtszeit oder Frage…', requestBooking: 'Buchung anfragen', sending: 'Wird gesendet…', noCharge: 'Es erfolgt keine Zahlung, bevor der Anbieter Termin und Endpreis bestätigt.', success: 'Anfrage erhalten. Der Anbieter kann nun Verfügbarkeit und Endpreis bestätigen.', genericError: 'Die Anfrage konnte nicht gesendet werden. Bitte erneut versuchen.', networkError: 'Ein Netzwerkfehler ist aufgetreten. Bitte erneut versuchen.' },
  it: { ...en, navBoatTours: 'Tour in barca', homeTitle: 'Tour in barca e charter privati a Zara', homeCta: 'Scopri i tour in barca a Zara', heroTitle: 'Tour in barca e noleggio privato a Zara', date: 'Data', guests: 'Ospiti', experienceType: 'Tipo di esperienza', allTypes: 'Tutti i tipi', privateTour: 'Tour privato', sharedTour: 'Tour condiviso', boatRental: 'Noleggio barca', search: 'Cerca', availableTitle: 'Esperienze in barca disponibili', clearFilters: 'Cancella filtri', noMatchTitle: 'Nessuna corrispondenza esatta', showAll: 'Mostra tutte le barche a Zara', upTo: 'fino a', from: 'Da', pricing: 'Prezzo', onRequest: 'Su richiesta', viewExperience: 'Vedi esperienza', backToBoats: 'Torna ai tour in barca a Zara', requestToBook: 'Richiesta di prenotazione', checkAvailability: 'Verifica disponibilità', departure: 'Partenza', capacity: 'Capacità', duration: 'Durata', name: 'Nome e cognome', phone: 'Telefono', desiredDate: 'Data desiderata', guestCount: 'Numero di ospiti', operatorMessage: 'Messaggio all’operatore', requestBooking: 'Richiedi prenotazione', sending: 'Invio…' },
  fr: { ...en, navBoatTours: 'Excursions en bateau', homeTitle: 'Excursions en bateau et charters privés à Zadar', homeCta: 'Découvrir les excursions à Zadar', heroTitle: 'Excursions et location de bateaux privés à Zadar', date: 'Date', guests: 'Voyageurs', experienceType: 'Type d’expérience', allTypes: 'Tous les types', privateTour: 'Excursion privée', sharedTour: 'Excursion partagée', boatRental: 'Location de bateau', search: 'Rechercher', availableTitle: 'Expériences en bateau disponibles', clearFilters: 'Effacer les filtres', noMatchTitle: 'Aucun résultat exact', showAll: 'Voir tous les bateaux à Zadar', upTo: 'jusqu’à', from: 'À partir de', pricing: 'Prix', onRequest: 'Sur demande', viewExperience: 'Voir l’expérience', backToBoats: 'Retour aux excursions à Zadar', requestToBook: 'Demande de réservation', checkAvailability: 'Vérifier la disponibilité', departure: 'Départ', capacity: 'Capacité', duration: 'Durée', name: 'Nom complet', phone: 'Téléphone', desiredDate: 'Date souhaitée', guestCount: 'Nombre de voyageurs', operatorMessage: 'Message à l’opérateur', requestBooking: 'Demander une réservation', sending: 'Envoi…' },
  cs: { ...en, navBoatTours: 'Výlety lodí', homeTitle: 'Výlety lodí a soukromé charterové plavby v Zadaru', homeCta: 'Prozkoumat výlety lodí v Zadaru', heroTitle: 'Výlety lodí a soukromý pronájem lodí v Zadaru', date: 'Datum', guests: 'Hosté', experienceType: 'Typ zážitku', allTypes: 'Všechny typy', privateTour: 'Soukromý výlet', sharedTour: 'Sdílený výlet', boatRental: 'Pronájem lodě', search: 'Hledat', availableTitle: 'Dostupné zážitky na lodi', clearFilters: 'Vymazat filtry', noMatchTitle: 'Zatím žádná přesná shoda', showAll: 'Zobrazit všechny lodě v Zadaru', upTo: 'až', from: 'Od', pricing: 'Cena', onRequest: 'Na vyžádání', viewExperience: 'Zobrazit zážitek', backToBoats: 'Zpět na výlety lodí v Zadaru', requestToBook: 'Žádost o rezervaci', checkAvailability: 'Ověřit dostupnost', departure: 'Odjezd', capacity: 'Kapacita', duration: 'Délka', name: 'Jméno a příjmení', phone: 'Telefon', desiredDate: 'Požadované datum', guestCount: 'Počet hostů', operatorMessage: 'Zpráva provozovateli', requestBooking: 'Požádat o rezervaci', sending: 'Odesílání…' },
  pl: { ...en, navBoatTours: 'Rejsy łodzią', homeTitle: 'Rejsy i prywatne czartery w Zadarze', homeCta: 'Odkryj rejsy w Zadarze', heroTitle: 'Rejsy i prywatny wynajem łodzi w Zadarze', date: 'Data', guests: 'Goście', experienceType: 'Rodzaj atrakcji', allTypes: 'Wszystkie typy', privateTour: 'Prywatny rejs', sharedTour: 'Rejs grupowy', boatRental: 'Wynajem łodzi', search: 'Szukaj', availableTitle: 'Dostępne atrakcje na łodzi', clearFilters: 'Wyczyść filtry', noMatchTitle: 'Brak dokładnego dopasowania', showAll: 'Pokaż wszystkie łodzie w Zadarze', upTo: 'do', from: 'Od', pricing: 'Cena', onRequest: 'Na zapytanie', viewExperience: 'Zobacz ofertę', backToBoats: 'Wróć do rejsów w Zadarze', requestToBook: 'Zapytanie o rezerwację', checkAvailability: 'Sprawdź dostępność', departure: 'Wypłynięcie', capacity: 'Liczba osób', duration: 'Czas trwania', name: 'Imię i nazwisko', phone: 'Telefon', desiredDate: 'Preferowana data', guestCount: 'Liczba gości', operatorMessage: 'Wiadomość do operatora', requestBooking: 'Poproś o rezerwację', sending: 'Wysyłanie…' },
  hu: { ...en, navBoatTours: 'Hajókirándulások', homeTitle: 'Hajókirándulások és privát charterek Zadarban', homeCta: 'Zadari hajókirándulások', heroTitle: 'Hajókirándulások és privát hajóbérlés Zadarban', date: 'Dátum', guests: 'Vendégek', experienceType: 'Élmény típusa', allTypes: 'Minden típus', privateTour: 'Privát túra', sharedTour: 'Csoportos túra', boatRental: 'Hajóbérlés', search: 'Keresés', availableTitle: 'Elérhető hajós élmények', clearFilters: 'Szűrők törlése', noMatchTitle: 'Még nincs pontos találat', showAll: 'Összes zadari hajó', upTo: 'legfeljebb', from: 'Ettől', pricing: 'Ár', onRequest: 'Kérésre', viewExperience: 'Élmény megtekintése', backToBoats: 'Vissza a zadari hajókirándulásokhoz', requestToBook: 'Foglalási kérelem', checkAvailability: 'Elérhetőség ellenőrzése', departure: 'Indulás', capacity: 'Kapacitás', duration: 'Időtartam', name: 'Teljes név', phone: 'Telefon', desiredDate: 'Kívánt dátum', guestCount: 'Vendégek száma', operatorMessage: 'Üzenet a szolgáltatónak', requestBooking: 'Foglalás kérése', sending: 'Küldés…' },
};

export function getMarketplaceCopy(locale: string): MarketplaceCopy {
  return copies[locale as Locale] ?? en;
}
