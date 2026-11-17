// DaaC demo — dane przykładowe. Skopiowane z ~/Projects/artefakty/mapa-firmy-3d/index.html
// (działy, procesy, przepływy, wzorcowy etap FIN-03 E3, programy, struktury danych, integracje). Jedyna zmiana: kolory kategorii to nazwy tokenów z :root zamiast wartości.
// Na końcu: dopasowanie do modelu 19 składowych w trzech warstwach (Definicja · Przebieg · Delegowanie na AI).

// ===================== działy, procesy, przepływy =====================
const DZIALY = {
  'Zarząd':             { poz: 'zarzad', x: -12, y: 4.6, z: -16, w: 9, d: 4.4 },
  'Controlling':        { poz: 'zarzad', x: 6, y: 4.6, z: -16, w: 22, d: 4.4 },
  'Marketing':          { poz: 'lancuch', x: -13.5, y: 0, z: -5.2, w: 6.4, d: 4.4 },
  'Badania i rozwój':   { poz: 'lancuch', x: -13.5, y: 0, z: 5, w: 6.4, d: 4.4 },
  'Sprzedaż B2B':       { poz: 'lancuch', x: -4.5, y: 0, z: -7.8, w: 6.4, d: 3.4 },
  'Sprzedaż B2C':       { poz: 'lancuch', x: -4.5, y: 0, z: -2.6, w: 6.4, d: 3.4 },
  'Kreacja produktu':   { poz: 'lancuch', x: -4.5, y: 0, z: 5, w: 6.4, d: 4.4 },
  'Produkcja':          { poz: 'lancuch', x: 4.5, y: 0, z: 0, w: 6.4, d: 5.6 },
  'Logistyka':          { poz: 'lancuch', x: 13.5, y: 0, z: 0, w: 6.4, d: 5.6 },
  'Zakupy':             { poz: 'wsparcie', x: -17.5, y: -3.2, z: 16, w: 6.2, d: 4.8 },
  'HR':                 { poz: 'wsparcie', x: -10.5, y: -3.2, z: 16, w: 6.2, d: 4.8 },
  'Dział prawny':       { poz: 'wsparcie', x: -3.5, y: -3.2, z: 16, w: 6.2, d: 4.8 },
  'Jakość i ISO':       { poz: 'wsparcie', x: 3.5, y: -3.2, z: 16, w: 6.2, d: 4.8 },
  'IT':                 { poz: 'wsparcie', x: 10.5, y: -3.2, z: 16, w: 6.2, d: 4.8 },
  'Finanse':            { poz: 'wsparcie', x: 17.5, y: -3.2, z: 16, w: 6.2, d: 4.8 },
};
// więcej przestrzeni: działy szersze i głębsze, rozsunięte proporcjonalnie (układ zostaje ten sam)
Object.values(DZIALY).forEach(d => { d.x *= 1.35; d.w *= 1.35; d.z *= 1.2; d.d *= 1.2; });
const POZIOMY = { zarzad: ['Zarządzanie', '--t-zarzad'], lancuch: ['Łańcuch wartości', '--t-lancuch'], wsparcie: ['Wsparcie', '--t-wsparcie'] };
const hash = t => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const WARSTWY = [
  { n: 'Statyczna', k: 'stat', el: ['Role', 'Kompetencje i szkolenia', 'Wiedza', 'Kroki', 'Formularze i szablony', 'Mitygacja', 'Podstawy prawne', 'Integracje', 'Dostępy', 'Kontrakt danych'] },
  { n: 'Dynamiczna', k: 'dyn', el: ['Warunki wstępne', 'Wejście', 'Wyjście', 'Stan instancji', 'Ślad (log)'] },
  { n: 'Agentowa', k: 'ag', el: ['Agent', 'Autonomia per krok', 'Skill', 'Narzędzia', 'Guardrails', 'HITL', 'Metryki'] },
];
const PRIO = { 'Role': 'M', 'Kompetencje i szkolenia': 'C', 'Wiedza': 'M', 'Kroki': 'M', 'Formularze i szablony': 'C', 'Mitygacja': 'M', 'Podstawy prawne': 'S', 'Integracje': 'S', 'Dostępy': 'S', 'Kontrakt danych': 'M',
  'Warunki wstępne': 'M', 'Wejście': 'M', 'Wyjście': 'M', 'Stan instancji': 'W', 'Ślad (log)': 'S', 'Agent': 'S', 'Autonomia per krok': 'M', 'Skill': 'C', 'Narzędzia': 'C', 'Guardrails': 'S', 'HITL': 'S', 'Metryki': 'W' };
const WSZ = WARSTWY.flatMap(w => w.el), AGENTOWE = WARSTWY[2].el;
const poPrio = k => WSZ.filter(n => PRIO[n] === k);
const wylosuj = (lista, k, z) => [...lista].sort((a, b) => hash(z + a) - hash(z + b)).slice(0, k);
// braki składowych z poziomu dojrzałości procesu (dane przykładowe, deterministyczne)
const generuj = (dojr, z) => {
  const h = hash(z), cw = [...poPrio('C'), ...poPrio('W')];
  if (dojr === 'dojrzały') return { brak: wylosuj(cw, 1 + h % 2, z), nd: [] };
  if (dojr === 'średni') return { brak: [...(h % 3 === 0 ? wylosuj(poPrio('M'), 1, z) : []), ...wylosuj(poPrio('S'), h % 3, z), ...wylosuj(cw, 2, z)], nd: [] };
  const bezAg = l => l.filter(n => !AGENTOWE.includes(n));
  return { brak: [...wylosuj(bezAg(poPrio('M')), 2 + h % 2, z), ...wylosuj(bezAg(poPrio('S')), 3, z), ...wylosuj(bezAg(cw), 2, z)], nd: AGENTOWE };
};
const P = (id, n, od, do_, wl, dojr, etapy) => ({ id, n, od, do: do_, wl, dojr,
  etapy: etapy.map((e, i) => ({ n: e[0], rola: e[1], ...(e[2] || generuj(dojr, id + i)) })) });
const PROCESY = [
  P('ZRZ-01', 'Strategia i cele roczne', 'Zarząd', 'Zarząd', 'Prezes zarządu', 'średni', [['Analiza sytuacji', 'Zarząd'], ['Cele i KPI', 'Zarząd'], ['Komunikacja celów', 'Prezes zarządu']]),
  P('ZRZ-02', 'Posiedzenie zarządu i uchwały', 'Zarząd', 'Zarząd', 'Prezes zarządu', 'dojrzały', [['Agenda', 'Asystent zarządu'], ['Materiały', 'Agent raportowy'], ['Uchwały', 'Zarząd']]),
  P('JAK-01', 'System zarządzania jakością ISO 9001', 'Jakość i ISO', 'Jakość i ISO', 'Pełnomocnik ds. jakości', 'średni', [['Przegląd dokumentacji', 'Pełnomocnik ds. jakości'], ['Audyt wewnętrzny', 'Audytor'], ['Przegląd zarządzania', 'Zarząd']]),
  P('JAK-02', 'Działania korygujące (CAPA)', 'Jakość i ISO', 'Produkcja', 'Pełnomocnik ds. jakości', 'szkic', [['Zgłoszenie niezgodności', 'Kontroler jakości'], ['Analiza przyczyn', 'Inżynier jakości'], ['Działanie', 'Kierownik produkcji'], ['Weryfikacja skuteczności', 'Pełnomocnik ds. jakości']]),
  P('PRA-01', 'Przegląd umów', 'Dział prawny', 'Sprzedaż B2B', 'Radca prawny', 'średni', [['Wpływ umowy', 'Handlowiec'], ['Analiza ryzyk', 'Prawnik'], ['Akceptacja', 'Radca prawny']]),
  P('PRA-02', 'RODO i ochrona danych', 'Dział prawny', 'Dział prawny', 'Inspektor ochrony danych', 'szkic', [['Rejestr czynności', 'IOD'], ['Ocena skutków', 'IOD'], ['Obsługa incydentów', 'IOD']]),
  P('MKT-01', 'Kampania marketingowa', 'Marketing', 'Marketing', 'Kierownik marketingu', 'średni', [['Plan kampanii', 'Marketer'], ['Treści', 'Agent treści'], ['Publikacja', 'Marketer'], ['Pomiar', 'Analityk']]),
  P('MKT-02', 'Generowanie i kwalifikacja leadów', 'Marketing', 'Sprzedaż B2B', 'Kierownik marketingu', 'średni', [['Formularze i landing', 'Marketer'], ['Scoring leadów', 'Agent marketing automation'], ['Przekazanie do handlowca', 'Marketer']]),
  P('RD-01', 'Badanie rynku i potrzeb', 'Badania i rozwój', 'Badania i rozwój', 'Kierownik R&D', 'szkic', [['Hipotezy', 'Analityk'], ['Badanie', 'Agent badawczy'], ['Wnioski', 'Kierownik R&D']]),
  P('RD-02', 'Prototyp i testy', 'Badania i rozwój', 'Kreacja produktu', 'Kierownik R&D', 'średni', [['Koncepcja', 'Inżynier'], ['Prototyp', 'Inżynier'], ['Testy', 'Laborant'], ['Decyzja go/no-go', 'Zarząd']]),
  P('KP-01', 'Specyfikacja i karta produktu', 'Kreacja produktu', 'Kreacja produktu', 'Product manager', 'średni', [['Specyfikacja', 'Product manager'], ['Projekt opakowania', 'Projektant'], ['Karta produktu', 'Agent treści']]),
  P('KP-02', 'Wprowadzenie produktu na rynek', 'Kreacja produktu', 'Sprzedaż B2C', 'Product manager', 'średni', [['Plan wprowadzenia', 'Product manager'], ['Cena i marża', 'Controller'], ['Materiały sprzedażowe', 'Marketer'], ['Start sprzedaży', 'Kierownik e-commerce']]),
  P('B2B-01', 'Ofertowanie i umowa ramowa', 'Sprzedaż B2B', 'Sprzedaż B2B', 'Dyrektor sprzedaży B2B', 'średni', [['Kwalifikacja', 'Handlowiec'], ['Oferta', 'Handlowiec'], ['Negocjacje', 'Dyrektor sprzedaży'], ['Umowa', 'Prawnik']]),
  P('B2B-02', 'Zamówienie hurtowe', 'Sprzedaż B2B', 'Produkcja', 'Dyrektor sprzedaży B2B', 'średni', [['Przyjęcie zamówienia', 'Opiekun klienta'], ['Sprawdzenie zdolności', 'Planista'], ['Potwierdzenie terminu', 'Opiekun klienta']]),
  P('B2C-01', 'Sklep internetowy i zamówienie', 'Sprzedaż B2C', 'Sprzedaż B2C', 'Kierownik e-commerce', 'średni', [['Zamówienie', 'Klient'], ['Płatność', 'System płatności'], ['Potwierdzenie', 'Agent sklepu']]),
  P('B2C-02', 'Reklamacje i zwroty', 'Sprzedaż B2C', 'Logistyka', 'Kierownik obsługi klienta', 'szkic', [['Zgłoszenie', 'Klient'], ['Ocena', 'Konsultant'], ['Zwrot towaru', 'Magazynier'], ['Rozliczenie', 'Księgowa']]),
  P('PR-01', 'Planowanie produkcji', 'Produkcja', 'Produkcja', 'Kierownik produkcji', 'dojrzały', [['Prognoza popytu', 'Agent planowania'], ['Plan zdolności', 'Planista'], ['Harmonogram', 'Planista']]),
  P('PR-02', 'Realizacja zlecenia produkcyjnego', 'Produkcja', 'Logistyka', 'Kierownik produkcji', 'dojrzały', [['Zlecenie', 'Planista'], ['Pobranie surowców', 'Magazynier'], ['Produkcja', 'Brygadzista'], ['Przyjęcie wyrobu', 'Magazynier']]),
  P('PR-03', 'Kontrola jakości', 'Produkcja', 'Produkcja', 'Kierownik jakości', 'średni', [['Próbkowanie', 'Kontroler jakości'], ['Badanie', 'Laborant'], ['Decyzja i niezgodności', 'Kierownik jakości']]),
  P('LOG-01', 'Magazyn i kompletacja', 'Logistyka', 'Logistyka', 'Kierownik logistyki', 'dojrzały', [['Przyjęcie', 'Magazynier'], ['Składowanie', 'Agent WMS'], ['Kompletacja', 'Magazynier']]),
  P('LOG-02', 'Wysyłka i protokół odbioru', 'Logistyka', 'Logistyka', 'Kierownik logistyki', 'dojrzały', [['Wysyłka', 'Spedytor'], ['Transport', 'Przewoźnik'], ['Protokół odbioru', 'Kierowca']]),
  P('ZAK-01', 'Zakup surowców', 'Zakupy', 'Produkcja', 'Kierownik zakupów', 'średni', [['Zapotrzebowanie MRP', 'Agent planowania'], ['Zamówienie', 'Kupiec'], ['Dostawa', 'Magazynier'], ['Kontrola dostawy', 'Kontroler jakości']]),
  P('ZAK-02', 'Kwalifikacja dostawcy', 'Zakupy', 'Zakupy', 'Kierownik zakupów', 'szkic', [['Zgłoszenie dostawcy', 'Kupiec'], ['Audyt', 'Kierownik jakości'], ['Decyzja', 'Kierownik zakupów']]),
  P('HR-01', 'Rekrutacja', 'HR', 'HR', 'HR Business Partner', 'średni', [['Zapotrzebowanie', 'Przełożony'], ['Ogłoszenie', 'Agent rekrutacji'], ['Rozmowy', 'Rekruter'], ['Oferta', 'HR Business Partner']]),
  P('HR-02', 'Onboarding pracownika', 'HR', 'IT', 'HR Business Partner', 'średni', [['Umowa', 'Kadry'], ['Dostępy i sprzęt', 'Administrator IT'], ['Szkolenie BHP', 'Specjalista BHP'], ['Okres próbny', 'Przełożony']]),
  P('IT-01', 'Nadawanie i odbieranie dostępów', 'IT', 'IT', 'Administrator IT', 'dojrzały', [['Wniosek', 'Przełożony'], ['Akceptacja', 'Właściciel systemu'], ['Nadanie', 'Agent IAM']]),
  P('IT-03', 'Incydent bezpieczeństwa', 'IT', 'IT', 'Administrator IT', 'średni', [['Zgłoszenie', 'Każdy'], ['Triage', 'Administrator IT'], ['Obsługa', 'Administrator IT'], ['Wnioski', 'Zarząd']]),
  P('FIN-02', 'Fakturowanie sprzedaży', 'Sprzedaż B2B', 'Finanse', 'Kierownik księgowości', 'średni', [
    ['Potwierdzenie wartości', 'Opiekun klienta', { brak: ['Kompetencje i szkolenia', 'Metryki'], nd: [] }],
    ['Wystawienie w KSeF', 'Księgowa', { brak: ['Stan instancji', 'Metryki'], nd: [] }],
    ['Wysłanie do klienta', 'Opiekun klienta', { brak: ['Warunki wstępne', 'Podstawy prawne', 'Guardrails', 'Formularze i szablony', 'Stan instancji', 'Metryki'], nd: [] }],
    ['Monitoring płatności', 'Księgowa', { brak: ['Wiedza', 'Mitygacja', 'Warunki wstępne', 'Podstawy prawne', 'Integracje', 'Dostępy', 'Ślad (log)', 'Kompetencje i szkolenia', 'Formularze i szablony', 'Stan instancji'], nd: ['Agent', 'Autonomia per krok', 'Skill', 'Narzędzia', 'Guardrails', 'HITL', 'Metryki'] }]]),
  P('FIN-03', 'Obieg faktury kosztowej', 'Zakupy', 'Finanse', 'Kierownik księgowości', 'dojrzały', [['Odbiór z KSeF', 'Robot KSeF'], ['Opis merytoryczny', 'Zamawiający'], ['Akceptacja', 'Kierownik budżetu', { brak: ['Stan instancji', 'Metryki'], nd: [] }], ['Księgowanie', 'Księgowa'], ['Płatność', 'Skarbnik']]),
  P('FIN-05', 'Rozliczenie VAT i JPK', 'Finanse', 'Finanse', 'Główna księgowa', 'dojrzały', [['Uzgodnienie rejestrów', 'Księgowa'], ['JPK_V7', 'Agent JPK'], ['Wysyłka', 'Główna księgowa']]),
  P('FIN-07', 'Zamknięcie miesiąca', 'Finanse', 'Controlling', 'Główna księgowa', 'średni', [['Uzgodnienia', 'Księgowa'], ['Rozliczenia międzyokresowe', 'Księgowa'], ['Zamknięcie okresu', 'Główna księgowa'], ['Pakiet dla controllingu', 'Agent raportowy']]),
  P('CTR-01', 'Raportowanie zarządcze', 'Controlling', 'Controlling', 'Kontroler finansowy', 'szkic', [['Zebranie danych', 'Agent raportowy'], ['Analiza odchyleń', 'Kontroler'], ['Raport', 'Kontroler'], ['Prezentacja zarządowi', 'Dyrektor finansowy']]),
  P('CTR-02', 'Budżetowanie', 'Controlling', 'Controlling', 'Kontroler finansowy', 'średni', [['Założenia', 'Zarząd'], ['Budżety działów', 'Kierownicy działów'], ['Konsolidacja', 'Kontroler']]),
  P('CTR-04', 'Analiza sprzedaży i marketingu', 'Controlling', 'Controlling', 'Kontroler finansowy', 'średni', [['Zebranie danych z kanałów', 'Agent raportowy'], ['Marża i ROI per kanał', 'Kontroler'], ['Rekomendacje', 'Kontroler']]),
  P('CTR-05', 'Analiza portfela produktów', 'Controlling', 'Controlling', 'Kontroler finansowy', 'szkic', [['Wyniki produktów po wprowadzeniu', 'Agent raportowy'], ['Zwrot z inwestycji R&D', 'Kontroler'], ['Decyzja: rozwijać / wycofać', 'Zarząd']]),
  P('CTR-06', 'Analiza kosztów operacyjnych', 'Controlling', 'Controlling', 'Kontroler finansowy', 'średni', [['Koszty działów', 'Agent raportowy'], ['Odchylenia od budżetu', 'Kontroler'], ['Plan oszczędności', 'Kontroler']]),
  P('CTR-03', 'Kalkulacja kosztu produktu', 'Controlling', 'Controlling', 'Kontroler finansowy', 'średni', [['Normy zużycia', 'Technolog'], ['Koszty pośrednie', 'Kontroler'], ['Kalkulacja', 'Agent raportowy']]),
];
// przepływy danych: [proces, etap (od 1), proces, etap, obiekt]
const PRZEPLYWY = [
  ['MKT-01', 4, 'MKT-02', 1, 'Segmenty odbiorców'],
  ['MKT-02', 3, 'B2B-01', 1, 'Kwalifikowany lead'],
  ['RD-01', 3, 'RD-02', 1, 'Raport z badania'],
  ['RD-02', 4, 'KP-01', 1, 'Zatwierdzony prototyp'],
  ['KP-01', 3, 'KP-02', 1, 'Karta produktu'],
  ['KP-01', 1, 'PR-01', 2, 'Specyfikacja techniczna'],
  ['KP-02', 4, 'B2C-01', 1, 'Produkt w sklepie'],
  ['CTR-03', 3, 'KP-02', 2, 'Koszt jednostkowy'],
  ['B2B-01', 4, 'B2B-02', 1, 'Umowa ramowa'],
  ['B2B-02', 1, 'PR-01', 1, 'Zamówienie hurtowe'],
  ['B2C-01', 1, 'LOG-01', 3, 'Zamówienie ze sklepu'],
  ['PR-01', 1, 'ZAK-01', 1, 'Zapotrzebowanie MRP'],
  ['PR-01', 3, 'PR-02', 1, 'Harmonogram produkcji'],
  ['ZAK-02', 3, 'ZAK-01', 2, 'Lista kwalifikowanych dostawców'],
  ['ZAK-01', 3, 'PR-02', 2, 'Surowce na stanie'],
  ['ZAK-01', 2, 'FIN-03', 1, 'Faktura od dostawcy'],
  ['PR-02', 3, 'PR-03', 1, 'Partia produkcyjna'],
  ['PR-03', 3, 'LOG-01', 1, 'Zwolniona partia'],
  ['LOG-01', 3, 'LOG-02', 1, 'Kompletacja'],
  ['LOG-02', 3, 'FIN-02', 1, 'Protokół odbioru'],
  ['B2C-02', 4, 'FIN-05', 1, 'Korekta sprzedaży'],
  ['FIN-02', 2, 'FIN-05', 1, 'Rejestr VAT sprzedaży'],
  ['FIN-03', 4, 'FIN-05', 1, 'Rejestr VAT zakupu'],
  ['FIN-02', 4, 'FIN-07', 1, 'Należności'],
  ['FIN-03', 5, 'FIN-07', 1, 'Zobowiązania'],
  ['FIN-07', 4, 'CTR-01', 1, 'Pakiet miesięczny'],
  ['CTR-02', 3, 'CTR-01', 2, 'Budżet'],
  ['MKT-01', 4, 'CTR-04', 1, 'Wyniki kampanii'],
  ['MKT-02', 2, 'CTR-04', 1, 'Lejek leadów'],
  ['B2B-01', 4, 'CTR-04', 1, 'Umowy i marże B2B'],
  ['B2C-01', 3, 'CTR-04', 1, 'Sprzedaż sklepu'],
  ['B2C-02', 3, 'CTR-04', 1, 'Zwroty'],
  ['RD-02', 4, 'CTR-05', 1, 'Decyzje go/no-go'],
  ['KP-02', 4, 'CTR-05', 1, 'Start sprzedaży produktu'],
  ['PR-02', 4, 'CTR-06', 1, 'Zużycie i czas produkcji'],
  ['LOG-02', 2, 'CTR-06', 1, 'Koszty transportu'],
  ['ZAK-01', 2, 'CTR-06', 1, 'Ceny zakupu'],
  ['HR-01', 4, 'CTR-06', 1, 'Koszty zatrudnienia'],
  ['IT-01', 3, 'CTR-06', 1, 'Koszty IT i licencji'],
  ['JAK-02', 4, 'CTR-06', 1, 'Koszty niezgodności'],
  ['CTR-04', 3, 'CTR-01', 1, 'Analiza sprzedaży'],
  ['CTR-05', 3, 'CTR-01', 1, 'Analiza portfela'],
  ['CTR-06', 3, 'CTR-01', 1, 'Analiza kosztów'],
  ['CTR-06', 1, 'CTR-03', 2, 'Koszty pośrednie'],
  ['ZRZ-01', 2, 'CTR-02', 1, 'Cele i KPI'],
  ['CTR-01', 4, 'ZRZ-02', 2, 'Raport zarządczy'],
  ['JAK-01', 2, 'ZRZ-02', 1, 'Wyniki audytu'],
  ['PR-03', 3, 'JAK-02', 1, 'Niezgodność'],
  ['PRA-01', 3, 'B2B-01', 4, 'Zaakceptowana umowa'],
  ['HR-01', 4, 'HR-02', 1, 'Nowy pracownik'],
  ['HR-02', 2, 'IT-01', 1, 'Wniosek o dostępy'],
];
const ocenaP = p => ({ pct: Math.round(p.etapy.reduce((s, e) => s + e.pct, 0) / p.etapy.length), kl: p.etapy.some(e => e.kl === 'bad') ? 'bad' : p.etapy.some(e => e.kl === 'warn') ? 'warn' : 'ok' });
// dział, w którym wykonuje się każdy etap (domyślnie dział startowy procesu)
const ETAP_DZ = {
  'MKT-02': ['Marketing', 'Marketing', 'Sprzedaż B2B'],
  'RD-02': ['Badania i rozwój', 'Badania i rozwój', 'Badania i rozwój', 'Zarząd'],
  'KP-02': ['Kreacja produktu', 'Controlling', 'Marketing', 'Sprzedaż B2C'],
  'B2B-02': ['Sprzedaż B2B', 'Produkcja', 'Sprzedaż B2B'],
  'B2C-02': ['Sprzedaż B2C', 'Sprzedaż B2C', 'Logistyka', 'Finanse'],
  'PR-02': ['Produkcja', 'Logistyka', 'Produkcja', 'Logistyka'],
  'ZAK-01': ['Zakupy', 'Zakupy', 'Logistyka', 'Jakość i ISO'],
  'HR-02': ['HR', 'IT', 'HR', 'HR'],
  'FIN-02': ['Sprzedaż B2B', 'Finanse', 'Sprzedaż B2B', 'Finanse'],
  'FIN-03': ['Finanse', 'Zakupy', 'Zakupy', 'Finanse', 'Finanse'],
  'FIN-07': ['Finanse', 'Finanse', 'Finanse', 'Controlling'],
  'JAK-02': ['Produkcja', 'Jakość i ISO', 'Produkcja', 'Jakość i ISO'],
  'PRA-01': ['Sprzedaż B2B', 'Dział prawny', 'Dział prawny'],
};
PROCESY.forEach(p => {
  p.etapy.forEach((e, i) => {
    e.dz = ETAP_DZ[p.id]?.[i] || p.od;
    const wym = WSZ.length - e.nd.length; e.pct = Math.round((wym - e.brak.length) / wym * 100);
    e.kl = e.brak.some(n => PRIO[n] === 'M') ? 'bad' : e.brak.some(n => PRIO[n] === 'S') ? 'warn' : 'ok';
  });
  p.dzialy = [...new Set(p.etapy.map(e => e.dz))];
  p.trasa = p.etapy.map(e => e.dz).filter((d, i, a) => i === 0 || d !== a[i - 1]).join(' → ');
});
const procesyDzialu = d => PROCESY.filter(p => p.dzialy.includes(d));
const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ===================== wzorcowo wypełniony etap: FIN-03 E3 „Akceptacja” =====================
const T = t => ({ typ: 'tekst', t }), L = (t, opis) => ({ typ: 'link', t, opis }), K = (nr, kto, t, aut) => ({ typ: 'krok', nr, kto, t, aut }), F = (k, v) => ({ typ: 'pole', k, v });
const TRESC = {
  'FIN-03#2': {
    cel: 'Potwierdzić, że koszt mieści się w budżecie MPK i jest zgodny z zamówieniem, zanim faktura trafi do księgowania.',
    skl: {
      'Role': [F('A', 'Kierownik budżetu (właściciel MPK) — akceptuje albo odrzuca'), F('R', 'Agent obiegu faktur — przygotowuje pakiet i sprawdza budżet'), F('C', 'Kontroler finansowy — druga akceptacja powyżej 50 000 zł'), F('I', 'Księgowa — dostaje decyzję i księguje')],
      'Kompetencje i szkolenia': [L('Zasady budżetowania i MPK', 'SZK-CTR-02 · przeszkoleni 9 z 10 kierowników'), L('Akceptacja dokumentów w ERP', 'SZK-ERP-03 · nagranie 12 min')],
      'Wiedza': [T('Akceptacja nie sprawdza poprawności faktury (to robi E2), tylko celowość kosztu: czy mieści się w budżecie MPK i czy wynika z zamówienia.'), L('Polityka budżetowa 2026', 'Drive › Controlling › Polityki'), L('Limity akceptacji wg MPK', 'Drive › Controlling › Macierz limitów')],
      'Kroki': [Object.assign(K(1, 'Agent obiegu faktur', 'Składa pakiet: faktura, opis merytoryczny, zamówienie', 'A3'), { kr: 'Składa pakiet' }), Object.assign(K(2, 'Agent obiegu faktur', 'Sprawdza budżet MPK i limit akceptującego', 'A3'), { kr: 'Sprawdza budżet' }), Object.assign(K(3, 'Kierownik budżetu', 'Akceptuje albo odrzuca z komentarzem — do 2 dni rob.', 'A0'), { kr: 'Akceptuje / odrzuca' }), K(4, 'Agent obiegu faktur', 'Bramka: brutto powyżej 50 000 zł?', 'A3'), Object.assign(K(5, 'Kontroler finansowy', 'Druga akceptacja — do 1 dnia rob.', 'A0'), { kr: 'Druga akceptacja' }), Object.assign(K(6, 'Agent obiegu faktur', 'Zapisuje decyzję w ERP, przekazuje do księgowania', 'A3'), { kr: 'Zapisuje decyzję' })],
      'Formularze i szablony': [L('Odrzucenie faktury — przyczyny', 'formularz · ERP › Akceptacje'), L('Zrzut ekranu: akceptacja w ERP', 'do tutorialu · Drive › Fakturowanie › Zrzuty')],
      'Mitygacja': [F('R1', 'Akceptacja ponad budżet → ERP blokuje decyzję przy przekroczeniu, eskalacja do kontrolera'), F('R2', 'Brak akceptacji w terminie → przypomnienie po 1 dniu, eskalacja po 2'), F('R3', 'Akceptacja przez nieuprawnionego → uprawnienia z macierzy MPK, przegląd kwartalny')],
      'Podstawy prawne': [L('Ustawa o rachunkowości, art. 21', 'dowód księgowy i jego sprawdzenie'), L('Polityka rachunkowości — instrukcja obiegu dokumentów', 'dokument wewnętrzny, rozdz. 4'), L('Regulamin podpisywania dokumentów', 'pełnomocnictwa i limity kwotowe')],
      'Integracje': [F('ERP', 'moduł akceptacji · API'), F('MCP ERP', 'narzędzie agenta: odczyt budżetu, zapis statusu'), F('Teams', 'powiadomienia i przypomnienia')],
      'Dostępy': [F('Kierownik budżetu', 'ERP · akceptacja tylko własnych MPK'), F('Kontroler finansowy', 'ERP · akceptacja powyżej progu'), F('Agent obiegu faktur', 'ERP · odczyt budżetu, zapis statusu — bez akceptacji')],
      'Kontrakt danych': [F('wejście', 'Faktura opisana ← FIN-03 E2: nr KSeF, MPK, kwota, zamówienie, opis'), F('wyjście', 'Faktura zaakceptowana → FIN-03 E4: decyzja, kto, kiedy, komentarz')],
      'Warunki wstępne': [T('Faktura ma opis merytoryczny (E2 zakończony).'), T('MPK przypisane, budżet MPK otwarty na okres.'), T('Akceptujący ma ważne uprawnienie w macierzy MPK.')],
      'Wejście': [F('faktura', 'FV/2026/11/0412 · 18 450,00 zł brutto (fikcyjna)'), F('MPK', '410 · Produkcja'), F('zamówienie', 'ZAK/2026/0388')],
      'Wyjście': [F('decyzja', 'zaakceptowana · 13.11 10:42'), F('akceptujący', 'Kierownik budżetu MPK 410')],
      'Ślad (log)': [F('13.11 09:15', 'Agent: pakiet złożony, budżet OK (wykorzystanie 62%)'), F('13.11 09:15', 'Agent: brutto poniżej progu — bez drugiej akceptacji'), F('13.11 10:42', 'Kierownik budżetu: akceptacja'), F('13.11 10:42', 'Agent: status zapisany, przekazano do E4')],
      'Agent': [F('AGT-obieg-faktur', 'v1.3 · właściciel: Kierownik księgowości')],
      'Autonomia per krok': [F('1, 2, 4, 6', 'A3 — agent autonomiczny'), F('3, 5', 'A0 — decyzja wyłącznie człowieka')],
      'Skill': [L('akceptacja-kosztu', 'składany z Wiedzy i Kroków tego etapu')],
      'Narzędzia': [F('MCP ERP', 'budżet MPK, status faktury'), F('Teams', 'powiadomienia')],
      'Guardrails': [T('Nie akceptuje za człowieka — kroki 3 i 5 są zawsze A0.'), T('Nie zmienia kwot ani MPK.'), T('Przy przekroczeniu budżetu blokuje i eskaluje.')],
      'HITL': [F('krok 3', 'Kierownik budżetu — zawsze'), F('krok 5', 'Kontroler — powyżej 50 000 zł')],
    },
  },
};
Object.assign(TRESC['FIN-03#2'], {
  fazy: [['Przygotowanie', [1, 2]], ['Decyzja', [3, 4, 5]], ['Zamknięcie', [6]]],
  erd: [
    { id: 'faktura', n: 'Faktura opisana', sys: 'ERP', rola: 'wejście', cel: 'Faktura po opisie merytorycznym (E2) — przedmiot akceptacji.', pola: [['PK', 'nr_ksef', 'tekst', 'jednoznaczny numer faktury z KSeF'], ['FK', 'mpk', 'kod', 'z którego budżetu idzie koszt'], ['', 'kwota_brutto', 'kwota', 'porównanie z limitem i progiem 50 000 zł'], ['FK', 'zamowienie', 'tekst', 'dowód, że koszt był zamówiony'], ['', 'opis', 'tekst', 'opis merytoryczny z E2']] },
    { id: 'budzet', n: 'Budżet MPK', sys: 'ERP', cel: 'Plan kosztów miejsca powstawania kosztów na okres.', pola: [['PK', 'mpk', 'kod', 'miejsce powstawania kosztów'], ['', 'okres', 'miesiąc', 'czy budżet jest otwarty'], ['', 'limit', 'kwota', 'plan na okres'], ['', 'wykorzystanie', 'kwota', 'ile już zaakceptowano — agent sprawdza przed decyzją']] },
    { id: 'decyzja', n: 'Decyzja akceptacji', sys: 'ERP', rola: 'wyjście', cel: 'Wynik etapu — trafia do księgowania (E4).', pola: [['PK', 'id', 'uuid', 'identyfikator decyzji'], ['FK', 'nr_ksef', 'tekst', 'której faktury dotyczy'], ['', 'status', 'enum', 'zaakceptowana / odrzucona'], ['FK', 'akceptujacy', 'osoba', 'kto podjął decyzję — audyt'], ['', 'czas', 'data', 'kiedy — kontrola terminu 2 dni'], ['', 'komentarz', 'tekst', 'przyczyna odrzucenia']] },
    { id: 'upraw', n: 'Uprawnienie akceptacji', sys: 'Macierz uprawnień', cel: 'Kto może akceptować koszty którego MPK i do jakiej kwoty.', pola: [['PK', 'osoba', 'osoba', 'akceptujący'], ['FK', 'mpk', 'kod', 'zakres uprawnienia'], ['', 'limit_kwoty', 'kwota', 'powyżej — druga akceptacja'], ['', 'wazne_do', 'data', 'przegląd kwartalny uprawnień']] },
    { id: 'przyp', n: 'Przypomnienie', sys: 'Teams', utw: true, cel: 'Brakuje dziś — bez niego ryzyko R2 (brak akceptacji w terminie) jest tylko na papierze.', pola: [['FK', 'nr_ksef', 'tekst', 'której faktury dotyczy'], ['', 'do_kogo', 'osoba', 'akceptujący, potem kontroler'], ['', 'po_dniach', 'liczba', '1 — przypomnienie, 2 — eskalacja']] },
  ],
  przeplywy: [['s', 1], [1, 2], [2, 3], [3, 4], [4, 5, 'tak'], [4, 6, 'nie'], [5, 6], [6, 'e']],
  erdUklad: {
    strefy: [{ n: 'ERP', opis: 'system wewnętrzny', x: 20, w: 550 }, { n: 'Macierz uprawnień', opis: 'IAM', x: 590, w: 270 }, { n: 'Teams', opis: 'powiadomienia', x: 880, w: 240 }],
    poz: { faktura: [40, 80], budzet: [350, 80], decyzja: [40, 230], upraw: [640, 80], przyp: [900, 230] },
    rodzaj: { faktura: 'core', decyzja: 'out', budzet: 'dict', upraw: 'dict', przyp: 'ext' },
  },
  erdRel: [['faktura', 'budzet', 'sprawdza', 'N:1'], ['budzet', 'decyzja', 'ogranicza', '1:N'], ['upraw', 'budzet', 'czy wolno', 'N:1'], ['decyzja', 'przyp', 'brak decyzji 1 dzień', '1:0..1'], ['faktura', 'decyzja', 'dotyczy', '1:1']],
});
Object.entries({
  1: { opis: 'Agent zbiera fakturę z KSeF, opis merytoryczny z E2 i zamówienie z ZAK-01 w jeden pakiet do decyzji.', narz: 'MCP ERP', wy: 'Pakiet akceptacji', termin: 'od razu' },
  2: { opis: 'Porównuje kwotę z wolnym budżetem MPK i limitem akceptującego. Przy przekroczeniu blokuje i eskaluje.', narz: 'MCP ERP', wy: 'Wynik kontroli budżetu', termin: 'od razu', ryz: ['R1', 'R3'] },
  3: { opis: 'Kierownik budżetu widzi pakiet z wynikiem kontroli i decyduje. Odrzucenie wymaga przyczyny z formularza.', narz: 'ERP — ekran akceptacji', wy: 'Decyzja', termin: '2 dni rob.', ryz: ['R2'] },
  4: { opis: 'Brutto powyżej 50 000 zł wymaga drugiej akceptacji kontrolera.', narz: 'reguła w ERP', termin: 'od razu' },
  5: { opis: 'Kontroler finansowy potwierdza koszt powyżej progu.', narz: 'ERP — ekran akceptacji', wy: 'Druga decyzja', termin: '1 dzień rob.', ryz: ['R2'] },
  6: { opis: 'Zapisuje decyzję, akceptującego i czas, zmienia status i przekazuje fakturę do księgowania (E4).', narz: 'MCP ERP, Teams', wy: 'Faktura zaakceptowana → E4', termin: 'od razu' },
}).forEach(([nr, d]) => Object.assign(TRESC['FIN-03#2'].skl['Kroki'].find(k => k.nr === +nr), d));
Object.assign(TRESC['FIN-03#2'].skl['Kroki'].find(k => k.nr === 4), { kr: 'Powyżej progu?' });
// technologia kroków: w jakim oprogramowaniu się dzieje i co robi z danymi (R czyta · W zapisuje · C tworzy) — encje z ERD
Object.entries({
  1: { sys: { 'KSeF': 'pobranie faktury', 'ERP': 'opis, zamówienie (MCP)' }, dane: { faktura: 'R' } },
  2: { sys: { 'ERP': 'budżet MPK (MCP)', 'Macierz uprawnień': 'limit osoby' }, dane: { budzet: 'R', upraw: 'R' } },
  3: { sys: { 'ERP': 'ekran akceptacji' }, dane: { faktura: 'R', decyzja: 'C' } },
  4: { sys: { 'ERP': 'reguła progu' }, dane: { faktura: 'R' } },
  5: { sys: { 'ERP': 'ekran akceptacji' }, dane: { decyzja: 'W' } },
  6: { sys: { 'ERP': 'status, przekazanie', 'Teams': 'przypomnienie' }, dane: { decyzja: 'W', budzet: 'W', przyp: 'C' } },
}).forEach(([nr, d]) => Object.assign(TRESC['FIN-03#2'].skl['Kroki'].find(k => k.nr === +nr), d));
Object.assign(TRESC['FIN-03#2'], { daneWe: { faktura: 'I' }, daneWy: { decyzja: 'O' } });

// ===================== technologia: programy =====================
const KAT_T = {
  rdzen: ['Rdzeń', '--accent'], operacje: ['Operacje i łańcuch dostaw', '--p-morski'], handel: ['Sprzedaż i klient', '--p-roz'],
  produkt: ['Produkt i rozwój', '--p-niebieski'], finanse: ['Finanse i prawo', '--violet'], ludzie: ['Ludzie', '--p-brzoskwinia'], biuro: ['Biuro i komunikacja', '--p-szary'],
};
const PROGRAMY = {
  'ERP': 'rdzen',
  'MES': 'operacje', 'APS': 'operacje', 'WMS': 'operacje', 'TMS': 'operacje', 'SCADA': 'operacje', 'CMMS': 'operacje', 'QMS': 'operacje', 'EDI': 'operacje', 'Portal dostawcy': 'operacje',
  'CRM': 'handel', 'e-Sklep': 'handel', 'Portal B2B': 'handel', 'Marketing automation': 'handel', 'Helpdesk': 'handel', 'Ankiety': 'handel',
  'PLM': 'produkt', 'CAD': 'produkt', 'Jira': 'produkt',
  'KSeF': 'finanse', 'Bankowość': 'finanse', 'BI': 'finanse', 'Rejestr umów': 'finanse', 'DMS': 'finanse', 'Podpis elektroniczny': 'finanse',
  'Kadry i płace': 'ludzie', 'Rekrutacja (ATS)': 'ludzie', 'e-Learning': 'ludzie', 'Intranet': 'ludzie',
  'Excel': 'biuro', 'Outlook': 'biuro', 'Teams': 'biuro', 'SharePoint': 'biuro', 'Entra ID': 'biuro',
};
// „dom” programowy działu: pierwszy — najczęstszy program główny jego etapów
const DOM_T = {
  'Zarząd': ['BI', 'Teams', 'SharePoint', 'Outlook'], 'Controlling': ['BI', 'ERP', 'Excel'],
  'Marketing': ['Marketing automation', 'CRM', 'e-Sklep', 'Ankiety'], 'Badania i rozwój': ['PLM', 'Jira', 'CAD', 'Ankiety'],
  'Sprzedaż B2B': ['CRM', 'ERP', 'Portal B2B', 'EDI'], 'Sprzedaż B2C': ['e-Sklep', 'CRM', 'Helpdesk', 'ERP'],
  'Kreacja produktu': ['PLM', 'CAD', 'Jira', 'SharePoint'], 'Produkcja': ['MES', 'APS', 'ERP', 'SCADA', 'CMMS'],
  'Logistyka': ['WMS', 'TMS', 'ERP', 'EDI'], 'Zakupy': ['ERP', 'Portal dostawcy', 'Excel'],
  'HR': ['Kadry i płace', 'Rekrutacja (ATS)', 'e-Learning', 'Intranet'], 'Dział prawny': ['Rejestr umów', 'DMS', 'Podpis elektroniczny'],
  'Jakość i ISO': ['QMS', 'DMS', 'MES'], 'IT': ['Helpdesk', 'Jira', 'Entra ID', 'SharePoint'], 'Finanse': ['ERP', 'KSeF', 'Bankowość', 'BI'],
};
const BIURO = ['Excel', 'Outlook', 'Teams', 'SharePoint'];
// FIN-03 wypełniony ręcznie — zgodnie z pasem technologii w BPMN etapu E3
const RECZNE_T = { 'FIN-03': [['KSeF', 'ERP'], ['ERP', 'Outlook'], ['ERP', 'KSeF', 'Teams'], ['ERP'], ['Bankowość', 'ERP']] };
PROCESY.forEach(p => p.etapy.forEach((e, i) => {
  const r = RECZNE_T[p.id]?.[i];
  if (r) { e.sys = r; return; }
  const dom = DOM_T[e.dz] || ['Excel'], h = hash(p.id + '#' + i + e.n);
  const s = [dom[h % 10 < 6 ? 0 : h % 10 < 9 ? 1 : 2] || dom[0]];
  const ile = [1, 2, 2, 3, 1, 2, 3, 2][(h >> 4) % 8];
  for (let k = 1; s.length < ile && k < 9; k++) {
    const kand = (h >> (6 + k)) % 3 === 0 ? BIURO[(h >> k) % BIURO.length] : dom[(h >> (k + 2)) % dom.length];
    if (!s.includes(kand)) s.push(kand);
  }
  e.sys = s;
}));
const PROG = {};
Object.entries(PROGRAMY).forEach(([n, kat]) => { PROG[n] = { n, kat, et: [], dod: [] }; });
PROCESY.forEach(p => p.etapy.forEach((e, i) => e.sys.forEach((s, k) => (k ? PROG[s].dod : PROG[s].et).push({ p, i }))));
Object.keys(PROG).forEach(n => { if (!PROG[n].et.length && !PROG[n].dod.length) delete PROG[n]; });
// ---------- dwie osie programu: warstwa (wysokość w 3D) i model nabycia (krawędź płyty); flaga „zarabia” — złota poświata ----------
const WARSTWY_T = {
  wlasne: [8.4, 'Własne i produkt', 'to, co nas wyróżnia'],
  dziedzinowe: [4.2, 'Dziedzinowe', 'jak firma pracuje'],
  zewn: [0, 'Zewnętrzne i systemowe', 'reguły dyktuje ktoś inny'],
  fundament: [-4.2, 'Fundament', 'narzędzia, na których stoi wszystko'],
};
const MODELE_T = { kupione: ['kupione', 'licencja'], dzierzawione: ['dzierżawione', 'SaaS'], wlasne: ['własne', 'własne'], publiczne: ['publiczne', 'publiczne'] };
const OPIS_T = {
  'ERP': ['dziedzinowe', 'kupione'], 'MES': ['dziedzinowe', 'kupione'], 'APS': ['dziedzinowe', 'kupione'], 'WMS': ['dziedzinowe', 'kupione'], 'TMS': ['dziedzinowe', 'dzierzawione'],
  'SCADA': ['dziedzinowe', 'kupione'], 'CMMS': ['dziedzinowe', 'kupione'], 'QMS': ['dziedzinowe', 'kupione'], 'PLM': ['dziedzinowe', 'kupione'], 'Kadry i płace': ['dziedzinowe', 'kupione'],
  'DMS': ['dziedzinowe', 'kupione'], 'CRM': ['dziedzinowe', 'dzierzawione'], 'Marketing automation': ['dziedzinowe', 'dzierzawione'], 'Helpdesk': ['dziedzinowe', 'dzierzawione'],
  'Jira': ['dziedzinowe', 'dzierzawione'], 'CAD': ['dziedzinowe', 'dzierzawione'], 'e-Learning': ['dziedzinowe', 'dzierzawione'], 'Rekrutacja (ATS)': ['dziedzinowe', 'dzierzawione'],
  'BI': ['dziedzinowe', 'dzierzawione'], 'Ankiety': ['dziedzinowe', 'dzierzawione'],
  'KSeF': ['zewn', 'publiczne'], 'Bankowość': ['zewn', 'publiczne'], 'Podpis elektroniczny': ['zewn', 'publiczne'], 'EDI': ['zewn', 'dzierzawione'],
  'e-Sklep': ['wlasne', 'wlasne', 1], 'Portal B2B': ['wlasne', 'wlasne', 1], 'Portal dostawcy': ['wlasne', 'wlasne'], 'Intranet': ['wlasne', 'wlasne'], 'Rejestr umów': ['wlasne', 'wlasne'],
  'Excel': ['fundament', 'dzierzawione'], 'Outlook': ['fundament', 'dzierzawione'], 'Teams': ['fundament', 'dzierzawione'], 'SharePoint': ['fundament', 'dzierzawione'], 'Entra ID': ['fundament', 'dzierzawione'],
};
const ZLOTO = '--caution';

// ===================== dane: struktury danych i integracje =====================
const KAT_D = {
  podmiot: ['Kontrahenci', '--p-roz'], produkt: ['Produkt i materiał', '--p-niebieski'], dokument: ['Dokumenty handlowe', '--p-morski'],
  finanse: ['Finanse', '--violet'], operacje: ['Produkcja i magazyn', '--p-brzoskwinia'], ludzie: ['Ludzie', '--p-limonka'], wiedza: ['Treści i wiedza', '--p-szary'],
};
// program: [nazwa struktury, domena, pola, źródło prawdy]
const STRUKTURY = {
  'ERP': [['KONTRAHENCI', 'podmiot', 'NIP · nazwa · adres · rachunek · termin płatności · limit kredytowy', 1], ['INDEKSY', 'produkt', 'kod · nazwa · JM · grupa · cena ewidencyjna · stawka VAT', 1],
    ['BOM', 'produkt', 'wyrób · składnik · ilość · JM · wersja'], ['ZAM_SPRZ', 'dokument', 'numer · kontrahent · pozycje · termin · status', 1], ['ZAM_ZAKUP', 'dokument', 'numer · dostawca · pozycje · termin · status', 1],
    ['FAKTURY_SPRZ', 'finanse', 'numer · data · kontrahent · netto · VAT · nr KSeF', 1], ['FAKTURY_ZAK', 'finanse', 'nr dostawcy · nr KSeF · netto · VAT · termin'],
    ['DOK_MAG', 'operacje', 'typ PZ/WZ/RW · magazyn · indeks · ilość · partia'], ['ROZRACHUNKI', 'finanse', 'kontrahent · dokument · kwota · termin · saldo', 1], ['DEKRETY', 'finanse', 'konto Wn · konto Ma · kwota · okres · dokument źródłowy', 1]],
  'MES': [['ZLECENIA_PROD', 'operacje', 'numer · wyrób · ilość · gniazdo · status', 1], ['OPERACJE', 'operacje', 'zlecenie · operacja · czas · operator', 1], ['PARTIE', 'operacje', 'nr partii · wyrób · data · ilość · status QC', 1], ['MATERIAL', 'produkt', 'kod · nazwa · JM']],
  'APS': [['PLAN_PROD', 'operacje', 'zlecenie · gniazdo · start · koniec', 1], ['ZDOLNOSCI', 'operacje', 'gniazdo · zmiana · wydajność', 1], ['PROGNOZA', 'dokument', 'indeks · okres · ilość · trafność', 1]],
  'WMS': [['LOKACJE', 'operacje', 'kod · strefa · pojemność', 1], ['STANY', 'operacje', 'indeks · lokacja · partia · ilość', 1], ['KOMPLETACJE', 'operacje', 'zamówienie · pozycje · kompletujący · status', 1], ['ARTYKUL', 'produkt', 'kod · EAN · wymiary · waga']],
  'TMS': [['PRZESYLKI', 'operacje', 'numer · przewoźnik · odbiorca · waga · status', 1], ['PRZEWOZNICY', 'podmiot', 'nazwa · NIP · cennik', 1], ['PROTOKOLY', 'dokument', 'przesyłka · data · podpis · uwagi', 1]],
  'SCADA': [['TAGI', 'operacje', 'maszyna · sygnał · wartość · znacznik czasu', 1], ['ALARMY', 'operacje', 'maszyna · kod · priorytet · czas', 1]],
  'CMMS': [['MASZYNY', 'operacje', 'kod · gniazdo · producent · nr seryjny', 1], ['ZLECENIA_UR', 'operacje', 'maszyna · typ · data · koszt', 1]],
  'QMS': [['NIEZGODNOSCI', 'dokument', 'numer · partia · opis · przyczyna · działanie', 1], ['WYNIKI_BADAN', 'operacje', 'partia · parametr · wynik · norma', 1], ['AUDYTY', 'wiedza', 'obszar · data · ustalenia · status', 1]],
  'EDI': [['ORDERS', 'dokument', 'GLN · numer · pozycje · termin'], ['DESADV', 'dokument', 'przesyłka · SSCC · pozycje']],
  'Portal dostawcy': [['Dostawca', 'podmiot', 'NIP · nazwa · kontakt · certyfikaty'], ['Ocena dostawcy', 'podmiot', 'jakość · terminowość · wynik', 1], ['Zapytanie ofertowe', 'dokument', 'indeks · ilość · termin · oferty', 1]],
  'CRM': [['Account', 'podmiot', 'nazwa · NIP · branża · opiekun'], ['Contact', 'podmiot', 'imię · nazwisko · e-mail · telefon · firma', 1], ['Lead', 'podmiot', 'źródło · scoring · status', 1],
    ['Opportunity', 'dokument', 'klient · wartość · etap · data zamknięcia', 1], ['Quote', 'dokument', 'szansa · pozycje · rabat · ważność', 1]],
  'e-Sklep': [['customer', 'podmiot', 'e-mail · adres · zgody', 1], ['product', 'produkt', 'SKU · nazwa · cena · opis · zdjęcia'], ['order', 'dokument', 'numer · klient · koszyk · płatność · status', 1],
    ['payment', 'finanse', 'zamówienie · bramka · kwota · status', 1], ['return', 'dokument', 'zamówienie · pozycje · powód', 1]],
  'Portal B2B': [['Klient B2B', 'podmiot', 'NIP · nazwa · warunki handlowe'], ['Cennik', 'produkt', 'klient · indeks · cena · rabat', 1], ['Zamówienie B2B', 'dokument', 'numer · klient · pozycje']],
  'Marketing automation': [['Kontakt', 'podmiot', 'e-mail · segment · zgody'], ['Segment', 'podmiot', 'reguła · liczność', 1], ['Kampania', 'wiedza', 'kanał · budżet · wyniki', 1], ['Formularz', 'wiedza', 'landing · pola · konwersja', 1]],
  'Helpdesk': [['Zgłoszenie', 'dokument', 'numer · zgłaszający · kategoria · priorytet · status', 1], ['Klient', 'podmiot', 'e-mail · nazwa'], ['Reklamacja', 'dokument', 'zamówienie · produkt · opis · decyzja', 1]],
  'Ankiety': [['Ankieta', 'wiedza', 'pytania · grupa · termin', 1], ['Odpowiedzi', 'wiedza', 'ankieta · respondent · wyniki', 1]],
  'PLM': [['Item', 'produkt', 'numer · nazwa · rewizja · status cyklu', 1], ['BOM inżynierski', 'produkt', 'item · składnik · ilość · rewizja', 1], ['Specyfikacja', 'wiedza', 'item · parametry · normy', 1], ['ECO', 'dokument', 'zmiana · uzasadnienie · akceptacja', 1]],
  'CAD': [['Model 3D', 'produkt', 'plik · item · rewizja', 1], ['Rysunek', 'produkt', 'arkusz · wymiary · tolerancje', 1]],
  'Jira': [['Issue', 'wiedza', 'klucz · typ · status · przypisany', 1], ['Sprint', 'wiedza', 'cel · daty · zakres', 1]],
  'KSeF': [['Faktura FA(3)', 'finanse', 'Podmiot1 · Podmiot2 · P_1 data · P_15 brutto · nr KSeF', 1], ['UPO', 'finanse', 'nr KSeF · data przyjęcia · skrót', 1]],
  'Bankowość': [['Wyciąg', 'finanse', 'rachunek · data · saldo · operacje', 1], ['Przelew', 'finanse', 'odbiorca · rachunek · kwota · tytuł · split payment'], ['Odbiorca', 'podmiot', 'nazwa · rachunek']],
  'BI': [['F_SPRZEDAZ', 'finanse', 'data · klient · produkt · netto · marża'], ['F_KOSZTY', 'finanse', 'MPK · konto · okres · kwota'], ['D_KLIENT', 'podmiot', 'klient · segment · region'],
    ['D_PRODUKT', 'produkt', 'indeks · grupa · linia'], ['KPI', 'wiedza', 'miara · okres · wartość · cel', 1]],
  'Rejestr umów': [['Umowa', 'dokument', 'strona · przedmiot · wartość · okres · ryzyka', 1], ['Strona umowy', 'podmiot', 'nazwa · NIP · reprezentacja']],
  'DMS': [['Dokument', 'wiedza', 'typ · wersja · właściciel · obieg', 1], ['Obieg', 'wiedza', 'dokument · krok · akceptujący', 1]],
  'Podpis elektroniczny': [['Koperta', 'dokument', 'dokument · sygnatariusze · status', 1]],
  'Kadry i płace': [['Pracownik', 'ludzie', 'PESEL · stanowisko · dział · umowa', 1], ['Lista płac', 'finanse', 'okres · pracownik · brutto · ZUS · PIT', 1], ['Nieobecność', 'ludzie', 'pracownik · typ · od · do', 1]],
  'Rekrutacja (ATS)': [['Kandydat', 'ludzie', 'imię · CV · etap · ocena', 1], ['Wakat', 'ludzie', 'stanowisko · dział · widełki', 1]],
  'e-Learning': [['Kurs', 'wiedza', 'temat · moduły · test', 1], ['Zaliczenie', 'ludzie', 'pracownik · kurs · data · wynik', 1], ['Uczestnik', 'ludzie', 'pracownik · dział']],
  'Intranet': [['Ogłoszenie', 'wiedza', 'tytuł · treść · grupa', 1], ['Profil', 'ludzie', 'imię · dział · telefon']],
  'Excel': [['Budżet.xlsx', 'finanse', 'MPK · miesiąc · plan', 1], ['Kalkulacja kosztu.xlsx', 'finanse', 'indeks · materiał · robocizna · narzut', 1], ['Lista dostawców.xlsx', 'podmiot', 'nazwa · NIP · telefon · uwagi']],
  'Outlook': [['Kontakty', 'podmiot', 'imię · e-mail · firma'], ['Kalendarz', 'wiedza', 'spotkanie · uczestnicy · termin', 1]],
  'Teams': [['Kanał', 'wiedza', 'zespół · wątki · pliki', 1], ['Spotkanie', 'wiedza', 'termin · uczestnicy · nagranie', 1]],
  'SharePoint': [['Biblioteka', 'wiedza', 'witryna · uprawnienia', 1], ['Plik', 'wiedza', 'ścieżka · wersja · autor']],
  'Entra ID': [['Użytkownik', 'ludzie', 'login · dział · role · MFA', 1], ['Grupa', 'ludzie', 'nazwa · członkowie · uprawnienia', 1]],
};
// integracje: [źródło, cel, sposób] — dane płyną ze źródła do celu
const INTEGRACJE = [
  ['ERP/KONTRAHENCI', 'CRM/Account', 'sync'], ['ERP/KONTRAHENCI', 'Bankowość/Odbiorca', 'eksport'], ['ERP/KONTRAHENCI', 'BI/D_KLIENT', 'ETL'], ['ERP/KONTRAHENCI', 'Portal B2B/Klient B2B', 'API'],
  ['ERP/KONTRAHENCI', 'Portal dostawcy/Dostawca', 'sync'], ['ERP/KONTRAHENCI', 'Excel/Lista dostawców.xlsx', 'ręcznie'], ['ERP/KONTRAHENCI', 'Rejestr umów/Strona umowy', 'ręcznie'],
  ['e-Sklep/customer', 'Helpdesk/Klient', 'API'], ['e-Sklep/customer', 'Marketing automation/Kontakt', 'API'], ['CRM/Contact', 'Marketing automation/Kontakt', 'sync'], ['CRM/Contact', 'Outlook/Kontakty', 'sync'],
  ['Marketing automation/Formularz', 'CRM/Lead', 'API'],
  ['PLM/Item', 'ERP/INDEKSY', 'API'], ['CAD/Model 3D', 'PLM/Item', 'plik'], ['PLM/BOM inżynierski', 'ERP/BOM', 'API'], ['PLM/ECO', 'Jira/Issue', 'API'],
  ['ERP/INDEKSY', 'e-Sklep/product', 'API'], ['ERP/INDEKSY', 'WMS/ARTYKUL', 'sync'], ['ERP/INDEKSY', 'MES/MATERIAL', 'sync'], ['ERP/INDEKSY', 'BI/D_PRODUKT', 'ETL'],
  ['CRM/Opportunity', 'ERP/ZAM_SPRZ', 'ręcznie'], ['e-Sklep/order', 'ERP/ZAM_SPRZ', 'API'], ['Portal B2B/Zamówienie B2B', 'ERP/ZAM_SPRZ', 'API'], ['EDI/ORDERS', 'ERP/ZAM_SPRZ', 'EDI'],
  ['ERP/ZAM_SPRZ', 'APS/PROGNOZA', 'sync'], ['APS/PLAN_PROD', 'MES/ZLECENIA_PROD', 'API'], ['MES/PARTIE', 'WMS/STANY', 'API'], ['MES/PARTIE', 'ERP/DOK_MAG', 'sync'],
  ['SCADA/TAGI', 'MES/OPERACJE', 'OPC UA'], ['SCADA/ALARMY', 'CMMS/ZLECENIA_UR', 'API'], ['ERP/ZAM_SPRZ', 'WMS/KOMPLETACJE', 'sync'], ['WMS/KOMPLETACJE', 'TMS/PRZESYLKI', 'API'],
  ['TMS/PRZESYLKI', 'EDI/DESADV', 'EDI'], ['Portal dostawcy/Zapytanie ofertowe', 'ERP/ZAM_ZAKUP', 'API'],
  ['ERP/FAKTURY_SPRZ', 'KSeF/Faktura FA(3)', 'API'], ['KSeF/Faktura FA(3)', 'ERP/FAKTURY_ZAK', 'API'], ['KSeF/UPO', 'ERP/FAKTURY_SPRZ', 'API'],
  ['ERP/ROZRACHUNKI', 'Bankowość/Przelew', 'eksport'], ['Bankowość/Wyciąg', 'ERP/ROZRACHUNKI', 'import'], ['e-Sklep/payment', 'ERP/ROZRACHUNKI', 'API'],
  ['ERP/DEKRETY', 'BI/F_KOSZTY', 'ETL'], ['ERP/FAKTURY_SPRZ', 'BI/F_SPRZEDAZ', 'ETL'], ['ERP/DEKRETY', 'Excel/Kalkulacja kosztu.xlsx', 'ręcznie'], ['Excel/Budżet.xlsx', 'BI/KPI', 'plik'],
  ['Marketing automation/Kampania', 'BI/KPI', 'ETL'], ['Ankiety/Odpowiedzi', 'BI/KPI', 'ETL'], ['CMMS/ZLECENIA_UR', 'ERP/DEKRETY', 'eksport'],
  ['Kadry i płace/Lista płac', 'ERP/DEKRETY', 'eksport'], ['Kadry i płace/Pracownik', 'Entra ID/Użytkownik', 'provisioning'], ['Rekrutacja (ATS)/Kandydat', 'Kadry i płace/Pracownik', 'ręcznie'],
  ['Kadry i płace/Pracownik', 'e-Learning/Uczestnik', 'sync'], ['Entra ID/Użytkownik', 'Intranet/Profil', 'SSO'],
  ['Rejestr umów/Umowa', 'Podpis elektroniczny/Koperta', 'API'], ['Podpis elektroniczny/Koperta', 'DMS/Dokument', 'API'], ['DMS/Dokument', 'SharePoint/Plik', 'sync'],
  ['e-Sklep/return', 'Helpdesk/Reklamacja', 'API'], ['Helpdesk/Reklamacja', 'QMS/NIEZGODNOSCI', 'ręcznie'], ['Helpdesk/Zgłoszenie', 'Jira/Issue', 'eskalacja'],
];

// ===================== model: 19 składowych w trzech warstwach =====================
// Mapa 3D nosi starsze nazewnictwo (22 składowe: Statyczna / Dynamiczna / Agentowa). Koncept model-procesow
// ma 19 składowych: Definicja / Przebieg / Delegowanie na AI. Tu przepisujemy braki etapów na 19 i liczymy kompletność od nowa.
const WARSTWY_M = [
  { n: 'Definicja', k: 'def', co: 'co i jak', el: ['Role', 'Kompetencje i szkolenia', 'Wiedza', 'Kroki', 'Formularze i szablony', 'Zarządzanie ryzykiem', 'Podstawy prawne', 'Integracje', 'Kontrakt danych'] },
  { n: 'Przebieg', k: 'prz', co: 'gdzie go widać w programach', el: ['Warunki wstępne', 'Wejście', 'Wyjście', 'Status sprawy', 'Ślad (log)'] },
  { n: 'Delegowanie na AI', k: 'del', co: 'kto wykonuje', el: ['Agent', 'Autonomia per krok', 'Uzupełnienia skilla', 'Guardrails', 'Metryki'] },
];
const PRIO_M = { 'Role': 'M', 'Wiedza': 'M', 'Kroki': 'M', 'Zarządzanie ryzykiem': 'M', 'Kontrakt danych': 'M', 'Warunki wstępne': 'M', 'Wejście': 'M', 'Wyjście': 'M', 'Autonomia per krok': 'M',
  'Podstawy prawne': 'S', 'Integracje': 'S', 'Ślad (log)': 'S', 'Agent': 'S', 'Guardrails': 'S',
  'Kompetencje i szkolenia': 'C', 'Formularze i szablony': 'C', 'Uzupełnienia skilla': 'C', 'Status sprawy': 'C', 'Metryki': 'W' };
const NAZWA_M = { 'Mitygacja': 'Zarządzanie ryzykiem', 'Stan instancji': 'Status sprawy', 'Skill': 'Uzupełnienia skilla' };
const WSZ_M = WARSTWY_M.flatMap(w => w.el), DELEG_M = WARSTWY_M[2].el;
const naModel = l => [...new Set(l.map(n => NAZWA_M[n] || n).filter(n => WSZ_M.includes(n)))];
PROCESY.forEach(p => {
  p.etapy.forEach(e => {
    e.brak = naModel(e.brak); e.nd = naModel(e.nd);
    const wym = WSZ_M.length - e.nd.length; e.pct = Math.round((wym - e.brak.length) / wym * 100);
    e.kl = e.brak.some(n => PRIO_M[n] === 'M') ? 'bad' : e.brak.some(n => PRIO_M[n] === 'S') ? 'warn' : 'ok';
  });
});
// poziom delegowania na AI per etap (dane przykładowe, deterministyczne): A0 człowiek · A1 asystent · A2 agent z akceptacją · A3 agent autonomiczny
const AUTONOMIA = [['A0', 'Człowiek', 'agent nie uczestniczy'], ['A1', 'Asystent', 'agent przygotowuje, człowiek wykonuje'], ['A2', 'Agent z akceptacją', 'agent wykonuje, człowiek zatwierdza'], ['A3', 'Agent autonomiczny', 'człowiek dostaje wyjątki']];
PROCESY.forEach(p => p.etapy.forEach((e, i) => {
  const h = hash('aut' + p.id + i);
  e.aut = e.nd.length ? 0 : /Agent|Robot|System/.test(e.rola) ? (e.kl === 'bad' ? 2 : 3) : p.dojr === 'dojrzały' ? 1 + h % 2 : h % 3 === 0 ? 1 : 0;
}));
// kto dziś wykonuje etap (dane przykładowe, spójne z poziomem delegowania): agent · człowiek z asystentem AI · człowiek z programem dziedzinowym · człowiek ręcznie (w etapie są narzędzia biurowe: Excel, Outlook, Teams, SharePoint)
PROCESY.forEach(p => p.etapy.forEach(e => { e.wyk = e.aut >= 2 ? 'agent' : e.aut === 1 ? 'asystent' : e.sys.some(x => BIURO.includes(x)) ? 'czlowiek' : 'tech'; }));
// wyspa = program bez żadnej integracji automatycznej (nic albo tylko „ręcznie”)
const progStr = s => s.split('/')[0];
Object.values(PROG).forEach(t => {
  const moje = INTEGRACJE.filter(([a, b]) => progStr(a) === t.n || progStr(b) === t.n);
  t.wyspa = !moje.some(([, , jak]) => jak !== 'ręcznie');
});
