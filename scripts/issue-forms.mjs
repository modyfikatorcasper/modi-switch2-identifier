import {mkdir,writeFile} from 'node:fs/promises';
const fields=[
 ['input','serial','Fragment numeru','Serial fragment',true,'Tylko 3 litery + 6 cyfr, opcjonalnie ****. Nigdy pełny numer.','Only 3 letters + 6 digits, optionally ****. Never the full serial.'],
 ['input','console_model','Model konsoli','Console model',false,'Jeśli dostępny, np. BEE-001.','If available, e.g. BEE-001.'],
 ['input','print_code','Kod nadruku','Print code',false,'Jeśli dostępny.','If available.'],
 ['input','country','Kraj zakupu','Purchase country',true,'Podaj kraj lub „nieustalony”.','Country, or “unknown”.'],
 ['input','purchase_month','Przybliżona data zakupu','Approximate purchase date',false,'RRRR-MM lub przybliżenie; nie zgaduj.','YYYY-MM or an approximation; do not guess.'],
 ['input','bundle','Zestaw / bundle','Bundle',false],
 ['dropdown','battery','Konstrukcja baterii — oględziny','Battery construction — inspection',true,'unknown = nieustalona; earlier = potwierdzona wcześniejsza; user-replaceable = potwierdzona wymieniana przez użytkownika. Nie przepisuj wniosku z prefiksu jako oględzin.','unknown; earlier = physically confirmed earlier construction; user-replaceable = physically confirmed user-replaceable construction. A prefix inference is not an inspection.',['unknown','earlier','user-replaceable']],
 ['dropdown','panel','Oznaczenie panelu','Panel marking',true,'unread = nieodczytane; other = inne, wpisz w uwagach. Bez czytelnego zdjęcia oznaczenie pozostaje niepotwierdzone.','unread = not read; other = specify in notes. A marking is unconfirmed without a legible photo.',['unread','ZD079KA-03A','LS079T1SX10P','LS0DAS7081','other']],
 ['dropdown','ribbon_print','Nadruk na szerokiej taśmie','Wide ribbon print',true,'unknown = nieustalone; present = obecny; absent = brak; unreadable = nieczytelny; unresolved = nierozstrzygnięte.','Use only what you can document.',['unknown','present','absent','unreadable','unresolved']],
 ['dropdown','left_wing','Lewe skrzydełko','Left wing',true,'Tył modułu, oznaczenie ustawione czytelnie. present = obecne; absent = brak; unknown = nieustalone; unresolved = nierozstrzygnięte. Ta cecha nie identyfikuje producenta.','Back of module, marking upright. This feature does not identify the manufacturer.',['unknown','present','absent','unresolved']],
 ['dropdown','right_wing','Prawe skrzydełko','Right wing',true,'Ta sama orientacja co przy lewym skrzydełku.','Same orientation as for the left wing.',['unknown','present','absent','unresolved']],
 ['input','ribbon_tip','Kształt końcówki taśmy','Ribbon tip shape',false,'Opis lub nieustalony.','Description, or unknown.'],
 ['input','small_connector','Położenie i orientacja małego złącza','Small connector position and orientation',false,'Opis lub nieustalone.','Description, or unknown.'],
 ['input','under_board','Przebieg taśmy pod płytą','Ribbon routing under the board',false,'Tylko jeśli widoczny podczas serwisu. Nie rozbieraj sprawnej konsoli wyłącznie dla zgłoszenia.','Only if visible during service. Do not open a working console solely to report.'],
 ['dropdown','screen_history','Historia ekranu','Screen history',true,'unknown = historia nieznana; factory = fabryczny; replaced = wymieniony.','unknown = history unknown; factory = factory-installed; replaced = replaced.',['unknown','factory','replaced']],
 ['dropdown','board_history','Historia płyty','Motherboard history',true,'unknown = historia nieznana; factory = fabryczna; replaced = wymieniona.','unknown = history unknown; factory = factory-installed; replaced = replaced.',['unknown','factory','replaced']],
 ['textarea','evidence','Zdjęcia lub linki do dowodów','Photos or evidence links',false,'Opcjonalne. Dołącz zdjęcia tutaj lub podaj linki. Zamaskuj końcówki numerów, kody QR i dane osobowe. Zwiąż zdjęcie oznaczenia i geometrii z tym samym egzemplarzem. Brak zdjęć wnętrza = ekran nieznany.','Optional. Attach photos or provide links. Mask serial suffixes, QR codes and personal data. Link marking and geometry photos to the same unit. No internal evidence = display unknown.'],
 ['textarea','notes','Uwagi / powiązane zgłoszenia','Notes / related reports',false,'Podaj inne oznaczenie, niepewności i link do wcześniejszego zgłoszenia tej konsoli. Ten sam fragment numeru nie oznacza tego samego egzemplarza.','Include other markings, uncertainties and any earlier report for this console. A matching fragment does not establish the same unit.']
];
const quote=JSON.stringify;
const dir=new URL('../.github/ISSUE_TEMPLATE/',import.meta.url);
await mkdir(dir,{recursive:true});
for(const lang of ['pl','en']) {
  const pl=lang==='pl';
  const lines=[`name: ${quote(pl?'Dodaj obserwację Nintendo Switch 2':'Report a Nintendo Switch 2 observation')}`,`description: ${quote(pl?'Zgłoszenie właściciela lub serwisanta. Weryfikacja jest ręczna.':'Owner or technician report. Verification is manual.')}`,`title: "[Report] "`,'body:', '  - type: markdown', '    attributes:',`      value: ${quote(pl?'## MODI / Modyfikator / Modibox\nTylko Nintendo Switch 2. To zgłoszenie będzie publiczne. Nie podawaj pełnego numeru. Nie rozbieraj sprawnej konsoli wyłącznie dla zgłoszenia. Wysłanie Issue nie dodaje automatycznie rekordu do bazy.':'## MODI / Modyfikator / Modibox\nNintendo Switch 2 only. This report will be public. Never include a full serial. Do not open a working console solely to report. Submitting an Issue does not automatically add a database record.')}`];
  for(const [type,id,labelPL,labelEN,required,descPL,descEN,values] of fields) {
    lines.push(`  - type: ${type}`,`    id: ${id}`,'    attributes:',`      label: ${quote(pl?labelPL:labelEN)}`);
    if(descPL)lines.push(`      description: ${quote(pl?descPL:descEN)}`);
    if(values) {lines.push('      options:',...values.map(v=>'        - '+quote(v)),'      default: 0');}
    lines.push('    validations:',`      required: ${required}`);
  }
  lines.push('  - type: checkboxes','    id: consent','    attributes:',`      label: ${quote(pl?'Prywatność i status zgłoszenia':'Privacy and report status')}`,'      options:',`        - label: ${quote(pl?'Rozumiem, że zgłoszenie jest publiczne. Zamaskowałem numery na zdjęciach i usunąłem dane osobowe. Weryfikacja nie jest automatyczna.':'I understand this report is public. I have masked serials in photos and removed personal data. Verification is not automatic.')}`,'          required: true');
  await writeFile(new URL(`report-${lang}.yml`,dir),lines.join('\n')+'\n');
}
await writeFile(new URL('config.yml',dir),'blank_issues_enabled: false\n');
console.log('Generated PL/EN GitHub Issue Forms.');
