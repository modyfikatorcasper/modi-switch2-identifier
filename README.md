# MODI Nintendo Switch 2 Screen Identifier — Community Research

![MODI Diagnostic Lab](assets/modi-logo.svg)

[Wersja polska](https://modyfikatorcasper.github.io/modi-switch2-identifier/?lang=pl) · [English](https://modyfikatorcasper.github.io/modi-switch2-identifier/?lang=en) · [GitHub](https://github.com/modyfikatorcasper/modi-switch2-identifier) · [MODI Diagnostic Lab / Research](https://modyfikatorcasper.github.io/#research) · [Branding / Identyfikacja](docs/BRANDING.md)

**Modyfikator89 · tylko Nintendo Switch 2 / Nintendo Switch 2 only**

Społecznościowy projekt badawczy ekranów Nintendo Switch 2: statyczna, dwujęzyczna baza obserwacji i lokalne sprawdzanie numeru. Nie ustalono reguły pozwalającej identyfikować ekran z numeru seryjnego. / A community screen research project for Nintendo Switch 2: a static bilingual observation database with local serial lookup. No serial-to-display identification rule has been established.

The interface supports shareable `?lang=pl` and `?lang=en` language links. Only the language is written to the URL; serial input remains local. / Interfejs obsługuje linki `?lang=pl` i `?lang=en`. Do adresu trafia tylko język, nigdy wpisany numer.

## Polski

### Uruchomienie

Wymagany Node.js 22 lub nowszy. Projekt nie wymaga instalacji paczek, kluczy API ani backendu.

```sh
npm test
npm run validate
npm start
```

Otwórz lokalny adres podany przez serwer (`http://127.0.0.1:4173`). Nie otwieraj `index.html` przez `file://`: przeglądarka może zablokować pobieranie plików JSON. `PORT` pozwala zmienić port serwera. Serwer deweloperski nie zapisuje numerów ani dziennika żądań.

### Publikacja na GitHub Pages

1. Umieść **zawartość tego katalogu**, razem z `.github/`, w swoim repozytorium. Domyślna gałąź w workflow to `main`; przy innej nazwie zmień oba warunki w `.github/workflows/pages.yml`.
2. Włącz Issues w ustawieniach repozytorium. Szablony zgłoszeń muszą być na domyślnej gałęzi.
3. W **Settings → Pages → Build and deployment → Source** wybierz **GitHub Actions**.
4. Wypchnij zmiany na `main` lub uruchom workflow „Validate and deploy GitHub Pages”. Testy i walidacja muszą przejść przed wdrożeniem.
5. Rzeczywisty adres odczytaj z wyniku wdrożenia lub Settings → Pages. Projekt nie zawiera wymyślonego adresu publikacji.

Dokumentacja wdrożenia: [GitHub Pages — custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Składnia formularzy: [GitHub Issue Forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms).

Workflow buduje `dist/` i automatycznie wpisuje `GITHUB_REPOSITORY` do **wynikowego** `data/config.json`. Dzięki temu linki do zgłoszeń działają także na własnej domenie. Nie zmienia pliku źródłowego. Przy wdrażaniu poza tym workflow ustaw `githubRepository` w `data/config.json` na rzeczywiste `właściciel/repozytorium`. Przy pustej konfiguracji strona rozpoznaje typowy adres `*.github.io`; na localhost pokazuje pobranie szkicu oraz informację o braku konfiguracji.

```sh
npm run build
node scripts/serve.mjs --dist
```

Wynik `dist/` można też opublikować na dowolnym statycznym hostingu. Ścieżki są względne, więc projekt działa pod podkatalogiem GitHub Pages. Workflow wdraża tylko zawartość strony, bez testów i fikstur testowych. Aktualizuj Node i wersje GitHub Actions zgodnie z polityką swojego repozytorium.

### Co jest gotowe

- Wyszukiwarka pełnych i zamaskowanych numerów oraz prefiksów. HA/HL określa wyłącznie konstrukcję baterii według źródła Nintendo.
- Dwa ostrożne rekordy Modyfikator89: `HLE400924****` i `HAE109492****`. Żaden nie ma oznaczenia panelu potwierdzonego zdjęciem. Nie dostarczono zdjęć powiązanych z tymi egzemplarzami.
- Sześć filtrów bazy: prefiks, panel, bateria, kraj, dowody i historia części. CSV obejmuje aktualnie przefiltrowane rekordy; JSON udostępnia cały zbiór. Build generuje także `dist/data/observations.csv`.
- Poradnik, katalog trzech oznaczeń, jawne źródła i statusy. Zdjęcia referencyjne można wczytać z zewnętrznego źródła lub otworzyć osobno. Nie stanowią dowodów dla rekordów startowych. Ich kopie nie są dołączone do projektu; linki mogą przestać działać. Kod i dane strony nie wymagają ich dostępności.
- Kompletny lokalny formularz, podgląd szkicu, pobieranie JSON i przekazanie zamaskowanych pól do GitHub Issue Forms PL/EN. Zgłoszenie publikuje sam użytkownik, po sprawdzeniu formularza GitHub. Konto GitHub jest wymagane do wysłania Issue.
- Ręczna moderacja: Issue **nie** trafia automatycznie do publicznej bazy. Po akceptacji moderator aktualizuje JSON i łączy zmianę z gałęzią publikacji.

### Granice wiedzy i prywatność

Nie wykazano związku zakresu numerów z modelem ekranu. Modyfikator89 zgłasza ten sam rodzaj ekranu o pierwotnej konstrukcji dla obu numerów HLE i HAE, opisując parę jako V1/V2. To obserwacja serwisowa, a nie potwierdzenie kodu `ZD079KA-03A`; żadnemu rekordowi nie przypisano niedostarczonych zdjęć ani cech taśmy. Nierozstrzygnięty opis skrzydełek nie służy jako reguła producenta. Oferta części nie dowodzi montażu fabrycznego ani poprawy parametrów. Nie mamy jeszcze własnych testów porównawczych ani zweryfikowanych wyników dla zgłoszonego wariantu.

Pełny numer wpisany w wyszukiwarkę pozostaje w pamięci przeglądarki i po sprawdzeniu jest zastępowany maską. Nie jest wpisywany do URL, storage ani analityki. Nie ma analityki, zewnętrznych fontów ani backendu. Żądania JSON idą wyłącznie do hosta strony. Zewnętrzne zdjęcia są pobierane dopiero po kliknięciu i bez `Referer`. GitHub otrzymuje szkic wyłącznie po świadomym otwarciu linku przez użytkownika; ten link zawiera już maskę. Eksport CSV zabezpiecza tekst przed interpretacją jako formuły w arkuszu.

Automatyczne maskowanie wykrywa ciągi `3 litery + co najmniej 7 cyfr` w polach tekstowych. Nie rozpoznaje tekstu na zdjęciach, kodów QR, danych osobowych ani dowolnych rozdzielonych zapisów numeru: autor zgłoszenia musi je sprawdzić. GitHub Issue Forms nie potrafi wymusić maski wyrażeniem regularnym; moderator ma sprawdzić ją przed skopiowaniem danych. Nie zachęcaj do rozbierania sprawnej konsoli tylko dla zgłoszenia.

Liczymy **zgłoszenia**, nie niezależne konsole. Maska nie jest unikalnym identyfikatorem. Każdy rekord ma ID i pole kontroli duplikatów. Dla rekordów startowych kontrola duplikatów nie została wykonana.

### Pliki

| Plik | Rola |
| --- | --- |
| `index.html`, `assets/` | Strona, interfejs PL/EN, lokalna logika |
| `data/observations.json` | Obserwacje, statusy, historia, dowody |
| `data/rules.json` | Oddzielne reguły baterii i ograniczenia identyfikacji, z uzasadnieniami |
| `data/panels.json` | Osobne modele i statusy katalogu |
| `data/sources.json` | Źródła i daty dostępu |
| `data/reference-images.json` | Zewnętrzne zdjęcia referencyjne i autorstwo |
| `.github/ISSUE_TEMPLATE/` | Gotowe publiczne formularze zgłoszeń PL/EN |
| `.github/workflows/pages.yml` | Testy, walidacja, build i GitHub Pages |
| `docs/GUIDE.md` | [Poradnik rozpoznawania](docs/GUIDE.md) |
| `docs/PANELS.md` | [Katalog modeli ze źródłami](docs/PANELS.md) |
| `docs/MODERATION.md` | [Instrukcja moderacji i dodawania danych](docs/MODERATION.md) |
| `docs/DATA.md` | [Format danych](docs/DATA.md) |
| `docs/QA.md` | [Zakres weryfikacji](docs/QA.md) |

Formularze są już wygenerowane. Edytuj `scripts/issue-forms.mjs`, a potem uruchom `node scripts/issue-forms.mjs`, aby odtworzyć obie wersje. Formularze mogą mieć różne etykiety PL/EN, ale wspólne ID pól i wartości techniczne, dzięki czemu link przekazuje spójne dane. Testy nie łączą się z siecią i nie wysyłają Issue.

Strona udostępnia listy wyboru. Po przejściu do GitHub wybrane wartości trafiają do pól tekstowych o tych samych ID, z opisanymi wartościami dozwolonymi. GitHub nie przenosi niezawodnie wartości list przez URL; pola tekstowe zachowują pełny szkic. Sprawdź je przed wysłaniem.

## English

### Run locally

Requires Node.js 22+. No package installation, API keys or backend are required.

```sh
npm test
npm run validate
npm start
```

Open the printed HTTP URL, normally `http://127.0.0.1:4173`. Do not use `file://`, where JSON loading may be blocked. Set `PORT` to change the development port. The local server does not log requests or serials.

### Publish to GitHub Pages

1. Commit the **contents of this directory**, including `.github/`, to your repository. The workflow assumes `main`; change both branch conditions if needed.
2. Enable Issues. Templates must exist on the default branch.
3. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main`, or run the deployment workflow manually. It tests, validates and builds before deployment.
5. Read the real published URL from the deployment output or Pages settings.

The workflow inserts the actual `GITHUB_REPOSITORY` into the built configuration, including for custom domains. For another deployment method, set `githubRepository` in `data/config.json` to your actual `owner/repository`. When unset, standard `*.github.io` URLs are detected; localhost offers draft download with an explicit configuration notice. `npm run build` produces `dist/`; `node scripts/serve.mjs --dist` previews it. Relative URLs support project Pages subpaths.

The website offers dropdowns. Their selected values transfer to matching text fields in GitHub, with the allowed values documented. GitHub dropdown URL prefills are not reliable; text fields preserve the complete draft. Review them before submitting.

### Evidence and operation

HA/HL lookup concerns battery construction only. The two seed records are author-supplied Modyfikator89 observations, with no linked photos or confirmed panel markings. The author describes the pair as V1/V2 and reports the same **original-style assembly, panel marking unverified** in both records. Neither record is assigned a catalogue model without evidence.

The database offers six composable filters, filtered CSV export and full JSON download. The guide compares externally linked reference parts photos, separately from the seed reports. These photos require an explicit load click and may become unavailable; they are not bundled or covered by the code license. Wings remain unresolved as a manufacturer indicator. Seller “V1/V2” labels are distinct from console revisions. Compatibility and performance are not established here. We do not yet have our own comparative tests or verified results for the reported variant. The two LS… markings remain separate catalogue entries.

Owners may report without opening a working console. The local form creates a reviewable JSON draft and, when configured, a prefilled GitHub Issue Form. The user must review and submit it on GitHub. Issues are public, require a GitHub account, and are manually reviewed. A report enters the dataset only after acceptance and an actual JSON update. See the bilingual [moderation guide](docs/MODERATION.md), [identification guide](docs/GUIDE.md), [panel catalogue](docs/PANELS.md), [data contract](docs/DATA.md) and [verification notes](docs/QA.md).

### Privacy

Full serial input is handled locally and replaced with a mask after lookup. It is never written to the URL, browser storage, analytics or a backend. The site has no analytics or remote fonts. Data files load from the same host. Reference photos contact the external photo host only after a click, without a Referer header. Only the masked draft is placed in a GitHub link when the visitor chooses to open it. CSV exports neutralize spreadsheet formula interpretation.

Text redaction detects three letters followed by seven or more consecutive digits. It cannot inspect photos, QR codes, personal information or every separated serial format. Contributors must review all material. GitHub Issue Forms cannot enforce serial patterns with a regex; moderators must inspect submissions. Never open a working console solely to contribute.

Report counts are not independent-console counts. Masked fragments can collide, so each report has its own ID and duplicate-review state. Seed duplicates have not been ruled out. There are no fabricated production samples or confidence percentages. Synthetic regression fixtures stay under `tests/` and are excluded from the build.

### Sources and licensing

Official battery rules: [Nintendo support](https://www.nintendo.com/fr-fr/Assistance/Depannage/Battery-replacement/Comment-verifier-si-votre-console-Nintendo-Switch-2-contient-une-batterie-amovible-3212762.html). Parts observations: [Nintendo Patents Watch](https://ninpatentswatch.com/2026/06/29/new-sharp-assembled-switch-2-lcd-panel-in-the-wild/) and its [LS0DAS7081 post](https://bsky.app/profile/ninpatentswatch.bsky.social/post/3mubr6n5ckk2h). Collection context only: [GBAtemp serial database](https://gbatemp.net/threads/nintendo-switch-2-serial-number-database.673146/). Full source metadata is in `data/sources.json`.

Original code and documentation: MIT, see [LICENSE](LICENSE). External photographs and quoted source material retain their owners’ rights and are excluded from that grant. This is an independent project; Nintendo Switch 2 is a Nintendo trademark.
