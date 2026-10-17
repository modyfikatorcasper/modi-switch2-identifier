# Format danych / Data contract

Pliki JSON są źródłem prawdy. / JSON files are the source of truth.

| Pole / Field | Znaczenie / Meaning |
| --- | --- |
| `id` | Unikalne ID zgłoszenia `MODI-0001`; never a serial-based key |
| `serialFragment` | Exactly 3 uppercase letters + 6 digits, no suffix |
| `serialMasked` | Fragment + literal `****`; never a full serial |
| `sourceIds` | Nonempty references into `sources.json` |
| `issueUrl` | Actual accepted Issue URL, or `null` for author-supplied seeds |
| `consoleModel`, `printCode`, `country`, `purchaseMonth`, `bundle` | Documented text or `null`; month uses `YYYY-MM` |
| `batteryObserved` | `earlier`, `user-replaceable`, `unknown`; physical inspection only |
| `panelModel` | Exact catalogue ID, or `null`; read together with evidence status |
| `assemblyStyle` | `original-style`, `other`, `unknown`; style is not a model confirmation |
| `evidenceStatuses` | Array of evidence-status values below |
| `screenHistory`, `boardHistory` | Independently: `factory`, `replaced`, `unknown` |
| `features.wideRibbonPrint` | `present`, `absent`, `unreadable`, `unknown`, `unresolved` |
| `features.leftWing`, `features.rightWing` | Separate fields: `present`, `absent`, `unknown`, `unresolved` |
| `features.ribbonTip`, `features.smallConnector`, `features.underBoardRoute` | Documented text or `null` |
| `evidence` | Evidence items: `url`, `kind`, `sameUnit` boolean, `readable` boolean |
| `evidence[].kind` | `panel-marking`, `construction`, `serial-link`, `battery` |
| `duplicateReview` | `not-reviewed`, `possible-duplicate`, `reviewed`; not a unique-console guarantee |
| `notes.pl`, `notes.en` | Same claim and uncertainty in both languages |

Statusy / Statuses:

| Wartość / Value | PL | EN |
| --- | --- | --- |
| `unverified` | zgłoszenie nieweryfikowane | unverified report |
| `construction-photo` | cechy konstrukcyjne udokumentowane zdjęciami | construction documented by photos |
| `panel-confirmed` | oznaczenie panelu potwierdzone zdjęciem | panel marking confirmed by photo |
| `conflicting` | sprzeczne dane | conflicting data |
| `screen-replaced` | ekran po wymianie | replaced screen |
| `screen-unknown` | ekran nieznany | screen unknown |

`rules.json` zawiera tylko reguły baterii i ograniczenia identyfikacji. Każda reguła ma źródło i uzasadnienie; `screenPredictionEnabled` pozostaje `false`. / Rules cover battery construction and identification constraints only. Every rule has sources and rationale; display prediction stays disabled.

Walidacja kontroluje m.in. unikalne ID, maskowanie, źródła, enumy, historię i minimalne warunki potwierdzenia zdjęciami. Nie zastępuje oceny autentyczności zdjęć, zgodności egzemplarza, duplikatów ani praw do materiałów. / Validation checks structural and evidence invariants, but cannot authenticate images, same-unit claims, duplicate independence or media rights.

CSV ma jeden wiersz na zgłoszenie, a nie na niezależną konsolę. `battery_prefix_rule` to wniosek z reguły, `battery_observed` to oględziny. Rozwinięte cechy i pełne metadane pozostają w JSON. / CSV has one row per report, not per independent console. Rule-derived and inspected battery values are separate; full features and metadata remain in JSON.
