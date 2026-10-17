# Weryfikacja / Verification

## Wynik odbioru — 2026-10-17 / Delivery result

**14/14 testów przeszło**, walidacja danych i budowa `dist/` zakończyły się powodzeniem. W rzeczywistej przeglądarce sprawdzono pełny numer zastępowany maską, nieznany fragment, pusty wynik filtra, szczegóły rekordu, zmianę PL/EN z zachowaniem pól formularza i lokalny szkic bez zdjęć. Szkic zamaskował także testowy numer w uwagach, a baza pozostała bez zmian. Zdjęcia obu referencyjnych części wczytały się poprawnie. Widok mobilny sprawdzono przy 390 × 844; dokument nie przekraczał szerokości viewportu, a tabela miała własne przewijanie.

**14/14 tests passed**, data validation and the `dist/` build succeeded. Browser checks covered full-serial masking, unknown lookup, empty filtered results, record details, PL/EN switching with form values retained and a no-photo local draft. The draft also redacted the test serial in notes; the dataset was unchanged. Both external reference photos loaded. The mobile layout was checked at 390 × 844 with no document-level horizontal overflow and a separately scrollable table.

Nie opublikowano strony ani Issue: nie wskazano docelowego repozytorium. Nie potwierdzono wykonania workflow na GitHub ani zdalnego otwarcia formularza w tym repozytorium. Przygotowano rzeczywiste pliki formularzy i workflow oraz przetestowano generowanie bezpiecznego linku lokalnie. / No site or Issue was published because no target repository was supplied. Remote workflow execution and Issue Form opening in that repository remain to be verified after deployment. Actual form/workflow files are included, and safe link generation was tested locally.

## Testy automatyczne / Automated checks

Uruchom / Run:

```sh
npm test
npm run validate
npm run build
```

Testy obejmują / Tests cover:

- Pełny i zamaskowany numer: ten sam wynik i brak końcówki w wyniku. / Full and masked serials produce equivalent results without the suffix.
- Maski `****` i `XXXX`, małe litery, spacje, oba rekordy startowe. / Both mask styles, lowercase, spaces and both seed records.
- HA/HL: wyłącznie bateria; ekran pozostaje nieznany. / HA/HL infer battery only; screen remains unknown.
- Nieznane numery: brak obserwacji, niezależny status reguły baterii. / Unknown numbers return no observations independently from battery rules.
- Niepoprawne dane, HTML, adres URL i niejednoznaczny zapis. / Invalid input, HTML, URL and ambiguous formats.
- Sprzeczne potwierdzone modele przy tej samej masce, sprzeczne dane baterii i reguły. / Conflicting reported models, battery evidence and rules.
- Potwierdzone zgłoszenie z tą samą maską nadal nie identyfikuje konsoli odwiedzającego. / A confirmed same-mask report still does not identify a visitor’s console.
- Sześć filtrów, ich składanie, pusty wynik i historia ekranu/płyty. / All six filters, composition, empty results and both parts histories.
- Redakcja numeru w szkicu i linku GitHub; brak fikcyjnego repozytorium. / Draft and GitHub URL redaction; no fabricated repository target.
- Eksport CSV: maski, ID, cudzysłowy, formuły i zakończenia wierszy. / CSV masking, IDs, quotes, formula neutralization and line endings.
- Spójność produkcyjnych danych i warunki potwierdzania dowodów. / Production data and evidence invariants.
- Rzeczywisty serwer lokalny: HTML, JS, CSS, JSON, dokumentacja, 404 i blokada konfiguracji repozytorium. / Actual local HTTP server: HTML, JS, CSS, JSON, documentation, 404 and hidden repository configuration.

Fikstury syntetyczne są wyłącznie w testach; build ich nie publikuje. / Synthetic fixtures exist only in tests and are not published.

## Kontrola ręczna / Manual verification

Sprawdź desktop i telefon, zmianę PL/EN, oba przykłady, wyszukiwanie nieznanego numeru, filtry, podgląd rekordu, pobieranie CSV/JSON, formularz bez zdjęć, lokalny podgląd szkicu i brak pozorowanego zapisu. Po konfiguracji repozytorium sprawdź rzeczywiste otwarcie formularza GitHub, nie publikując próbnego Issue w bazie. / Inspect desktop/mobile layouts, PL/EN, both examples, unknown lookup, filters, report detail, exports, a no-photo contribution and local draft preview. After configuring a real repository, verify the GitHub form without publishing a test report into the dataset.

Na działającym GitHub Pages sprawdź link formularza, rzeczywisty adres wdrożenia i dostępność zewnętrznych zdjęć. Tych efektów nie może potwierdzić test lokalny. / After actual deployment, verify the Issue Form link, deployed URL and external image availability. Local tests cannot establish those remote outcomes.
