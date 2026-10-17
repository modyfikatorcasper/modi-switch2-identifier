# Moderacja / Moderation

## PL

Nie ma automatycznej synchronizacji Issues z bazą. Zamknięcie lub oznaczenie Issue nie zmienia JSON. Moderator ręcznie ocenia materiały, akceptuje zakres ustaleń, dodaje lub poprawia rekord przez PR i łączy zmianę. Dopiero skuteczna publikacja pokazuje aktualizację na stronie.

1. **Prywatność.** Najpierw sprawdź tekst, zdjęcia, kody QR i nazwy plików. Zostaw najwyżej 3 litery + 6 cyfr. Nie kopiuj pełnych numerów do repozytorium, commitów ani komentarzy. Jeśli dane są już publiczne w Issue, poproś autora o redakcję, usuń ujawnienia dostępnymi narzędziami moderacji i w razie potrzeby użyj pomocy GitHub do usunięcia wrażliwej historii. Samo zamknięcie Issue nie usuwa danych.
2. **Zakres i źródło.** Tylko Nintendo Switch 2. Zapisz URL Issue i źródła. Właściciel bez zdjęć wnętrza może mieć poprawne zgłoszenie z ekranem nieznanym. Nie proś o rozbieranie sprawnej konsoli wyłącznie dla dowodu.
3. **Własne ID.** Użyj następnego wolnego `MODI-0003` itd. Nigdy nie używaj maski jako klucza rekordu. Gdy autor uzupełnia ten sam rekord, aktualizuj go z zachowaniem ID i historii zmian. Dwa zgłoszenia z taką samą maską mogą dotyczyć różnych konsol.
4. **Duplikaty.** Sprawdź wcześniejsze Issues, historię serwisu i powiązania zdjęć. `not-reviewed` = niesprawdzone, `possible-duplicate` = możliwy duplikat, `reviewed` = przegląd wykonany. Ten ostatni status nie oznacza automatycznie niezależnej konsoli. Opisz ustalenia w uwagach; nie publikuj liczby niezależnych konsol bez osobnej weryfikacji.
5. **Części i bateria.** Oddziel ekran i płytę: fabryczna / wymieniona / nieznana. `batteryObserved` opisuje rzeczywiste oględziny, nie regułę HA/HL. Niezgodność z regułą zapisz jako `conflicting` i wyjaśnij — nie nadpisuj źródła Nintendo jednostkowym zgłoszeniem. Ekran po wymianie ma dodatkowo `screen-replaced`; nie służy do wnioskowania o montażu fabrycznym.
6. **Dowody.** Zdjęcie geometrii pozwala na `construction-photo`, gdy dotyczy tego egzemplarza. `panel-confirmed` wymaga czytelnego kodu (`kind: panel-marking`, `sameUnit: true`, `readable: true`) oraz dowodu powiązania z fragmentem konsoli (`kind: serial-link`, `sameUnit: true`), np. zestawu ujęć kontekstowych ze zredagowanym numerem. Nie wystarczy referencyjne zdjęcie części z oferty.
7. **Ostrożne rozstrzygnięcia.** Brak czytelnego kodu: `panelModel: null`, status `screen-unknown`. Jeśli geometria przypomina premierową, dopuszczalny opis to „original-style assembly, panel marking unverified”. Nie wpisuj automatycznie `ZD079KA-03A`. Skrzydełka nie rozstrzygają producenta. Różne potwierdzone modele przy tej samej masce wymagają wyjaśnienia; mogą też wynikać z kolizji maski lub równoległych modułów.
8. **Zapis.** Uzupełnij `data/observations.json`, a nowe źródło dodaj do `data/sources.json`. Nieznane wartości to `null` lub jawne enumy z `DATA.md`, nigdy zgadywany kraj/data/model. Notatki PL i EN muszą przekazywać ten sam zakres pewności. Nowy kod panelu wymaga osobnej pozycji katalogu i źródła. Zaktualizuj daty pliku obserwacji i konfiguracji.
9. **Kontrola i publikacja.** Uruchom `npm test`, `npm run validate`, `npm run build`; sprawdź wynik w przeglądarce. W PR wskaż źródło, zaakceptowane ustalenia i nierozstrzygnięte cechy. Po scaleniu sprawdź rzeczywiste powodzenie GitHub Pages. Dopiero wtedy można powiedzieć, że rekord jest publicznie w bazie. Nie publikuj numeru pełnego ani fikcyjnych rekordów testowych.

### Statusy są niezależnymi etykietami

Rekord może mieć kilka statusów, np. geometrię na zdjęciach i ekran nieznany. `panel-confirmed` nie może współwystępować z `screen-unknown`. Status `unverified` oznacza, że ocena dowodów nie została zakończona — usuń go po zakończeniu odpowiedniej weryfikacji. `conflicting` może współistnieć z fotografiami; opisuje niespójność, nie brak materiału. Zachowuj sprzeczne dane i opisuj ich źródła zamiast arbitralnie wybierać model.

Reguły identyfikacji przechowuj osobno w `data/rules.json`. Każda ma ID, źródło i uzasadnienie PL/EN. Nie dodawaj reguły ekranowej na podstawie małej próby, wpisu sprzedawcy lub prefiksu baterii. Obecny kontrakt i walidator celowo dopuszczają wyłącznie reguły baterii; identyfikacja ekranu wymagałaby osobnego przeglądu metody i zmiany kodu.

## EN

Issues are not synchronized automatically. Closing or labeling an Issue does not modify the dataset. A moderator reviews evidence, accepts the supported claims, updates JSON through a reviewed change, and verifies successful deployment.

1. **Privacy first.** Check text, photos, QR codes and filenames before copying anything. Keep only three letters plus six digits. Never copy full serials into Git history. If already disclosed in a public Issue, request redaction, use available moderation tools and GitHub support where history removal is needed. Closing an Issue does not remove disclosed data.
2. **Scope and sources.** Nintendo Switch 2 only. Preserve the Issue URL and source provenance. Owner reports without internal photos are welcome with display unknown. Do not request unnecessary disassembly.
3. **Report identity.** Assign the next unused `MODI-0003` etc. A mask is not a key. Update an existing report under its original ID when it is the same submission being supplemented. Identical fragments can represent different consoles.
4. **Duplicates.** Inspect prior Issues, service history and image links. Use `not-reviewed`, `possible-duplicate` or `reviewed`; document conclusions. “Reviewed” alone does not establish independence. Do not convert report counts into independent-console counts.
5. **Parts history.** Record screen and board history separately. `batteryObserved` is inspection evidence, not prefix inference. Document discrepancies with `conflicting`. Add `screen-replaced` when applicable and exclude replacement parts from claims about factory installation.
6. **Evidence levels.** Same-unit geometry photos support `construction-photo`. `panel-confirmed` requires a legible `panel-marking` image with `sameUnit: true` and `readable: true`, plus a `serial-link` evidence item with `sameUnit: true`. A redacted context sequence can establish the linkage. A parts-listing photo alone cannot.
7. **Unknowns and conflicts.** Without a readable marking use `panelModel: null` and `screen-unknown`. An original-style assembly does not automatically become `ZD079KA-03A`. Wings do not identify the manufacturer. Conflicting models for one masked fragment may involve collisions, replacements or parallel assemblies; retain and explain the evidence.
8. **Data update.** Edit observations, add sources, and use nulls or the documented enums rather than guesses. PL/EN notes must express the same uncertainty. New panel codes need independent catalogue entries and provenance. Update dataset/config dates.
9. **Review and deployment.** Run tests, validation and build, then inspect the UI. Explain accepted evidence and unresolved details in the PR. Only a merged data change and a successful deployment make a report visible in the public database.

Evidence statuses can overlap; construction photos may coexist with display unknown. Confirmed panel marking and display unknown cannot coexist. Remove `unverified` when the relevant evidence review finishes. Conflicts can coexist with photographs and must remain explained.

Rules live separately from observations, with IDs, sources and bilingual rationale. The current schema deliberately permits battery rules only. Any future display inference method needs a separate evidence and code review; a small sample, a reseller label or HA/HL alone is insufficient.
