# Clock in Letters – Wortuhr für Home Assistant

Eine Lovelace-Karte als Wortuhr: Die Uhrzeit wird in leuchtenden
Wörtern – auf Deutsch, Englisch, Niederländisch, Französisch oder Spanisch in einem 11×10-Buchstabenraster angezeigt. Vier Punkte in den
Ecken zeigen die Minuten zwischen den 5-Minuten-Schritten an.

![Screenshot](https://raw.githubusercontent.com/renespeaker/ha-clockinletters/main/images/screenshot.png)

*(Oliv auf Englisch an der Wand, Walnuss auf Deutsch und Kupfer in 3D-Ansicht)*

## Installation

### Manuell

1. `clockinletters-card.js` nach `/config/www/clockinletters-card.js` kopieren.
2. In Home Assistant: **Einstellungen → Dashboards → ⋮ → Ressourcen → Ressource hinzufügen**
   - URL: `/local/clockinletters-card.js`
   - Typ: **JavaScript-Modul**
3. Browser neu laden (ggf. Cache leeren).

### Über HACS (als benutzerdefiniertes Repository)

In HACS **⋮ → Benutzerdefinierte Repositories** öffnen,
`https://github.com/renespeaker/ha-clockinletters` mit Typ **Dashboard** hinzufügen
und die Karte installieren. (Das Repo ist nicht in der HACS-Standardliste.)

## Verwendung

Im Dashboard **Karte hinzufügen → „Clock in Letters“** auswählen. Der
Karten-Editor hat aufklappbare Menüs, in denen du alles einstellen kannst:

- **Schrift** – Schriftart (Auswahlliste oder eigener Name), Schriftgröße, Schriftstärke
- **Material & Look** – realistische Darstellung (Oberflächenstruktur, Lichtreflex,
  LED-Leuchten, das auf die Platte strahlt), Oberfläche (Hochglanz, gebürstetes
  Metall, Matt, Holz, Rost), Wandmontage mit Schatten, 3D-Ansicht mit Plattenkante
  und Stege in O, Q, D wie bei ausgefrästen Buchstaben
- **Farb-Vorlage** – Oliv, Anthrazit, Schwarz, Weiß, Messing, Gold auf Schwarz, Kupfer, Edelstahl,
  Walnuss, Rost, Rot, Nachtblau, Matrix, Pink oder die Farben deines Home-Assistant-Themes
- **Farben** – Farbwähler für aktive und inaktive Buchstaben und den Hintergrund,
  Deckkraft der inaktiven Buchstaben, Leucht-Effekt und dessen Stärke
- **Anzeige** – Minuten-Punkte, „ES IST“, abgerundete Ecken, Innenabstand
- **Sprache & Sprechweise** – Deutsch oder Englisch; „Viertel nach / vor“ oder „Viertel / Dreiviertel“,
  „Zwanzig nach“ oder „Zehn vor halb“

Oder per YAML:

```yaml
type: custom:clockinletters-card
```

Beispiel: Oliv, Englisch, an der Wand:

```yaml
type: custom:clockinletters-card
theme: oliv
language: en
wall_mount: true
font_family: Barlow
font_size: 85
```

## Große Monitore, Tablets & Vollbild

Die Uhr ist komplett vektorbasiert und skaliert auf jede Größe und Auflösung
(Handy, Full HD, 4K, Retina) – Schrift, Leuchten und Oberflächenstruktur
wachsen mit.

- **An Bildschirmhöhe anpassen** (`fit_screen`, Standard an): Die Uhr wird nie
  höher als der sichtbare Bildschirm und bleibt auf breiten Monitoren quadratisch
  und zentriert.
- **Vollbild:** Uhr antippen/anklicken → Vollbild, erneut antippen oder `Esc` →
  zurück. Im Vollbild wird die Uhr so groß wie möglich dargestellt, der
  Mauszeiger ausgeblendet und der Bildschirm wach gehalten (sofern der Browser
  das unterstützt, benötigt HTTPS).
- Nach Standby oder Tab-Wechsel zeigt die Uhr sofort wieder die richtige Zeit.

**Tipp für ein Wand-Tablet oder einen Monitor:** Eine eigene Dashboard-Ansicht
vom Typ **Panel (einzelne Karte)** anlegen und nur diese Karte hineinlegen. Die Karte
erkennt die Panel-Ansicht und füllt automatisch die ganze Fläche unter der
HA-Kopfzeile – randlos, auf jedem Bildschirmformat. Mit `panel_fill: always` füllt die Uhr
die Fläche in jeder Ansicht, mit `panel_fill: off` bleibt sie quadratisch:

```yaml
views:
  - title: Uhr
    type: panel
    cards:
      - type: custom:clockinletters-card
        theme: oliv
```

## Nachtmodus

Nachts dimmt die Uhr automatisch – im Menü **Nachtmodus** oder per YAML:

```yaml
type: custom:clockinletters-card
night_mode: sun          # off, sun, time oder entity
night_brightness: 30     # Helligkeit nachts in %
night_hide_unlit: true   # nachts nur die leuchtenden Buchstaben
```

- `sun` – dunkel, solange die Sonne untergegangen ist (`sun.sun`)
- `time` – festes Zeitfenster, z. B. `night_start: "22:00"` und `night_end: "06:30"`
- `entity` – dunkel, solange eine Entität „an“ ist, z. B. `night_entity: input_boolean.nachtmodus`.
  So lässt sich der Nachtmodus mit Automationen, Bewegungsmeldern oder Szenen steuern.

## Größe & Position

Normalerweise ist die Uhr quadratisch und passt sich automatisch an. Im Menü
**Größe & Position** lassen sich Breite (X) und Höhe (Y) frei einstellen – per
Schieberegler in % oder per Pixel – und die Uhr verschieben:

```yaml
type: custom:clockinletters-card
custom_size: true
width: 100          # Breite
width_unit: "%"     # % der Kartenbreite oder px
height: 100         # Höhe
height_unit: vh     # % der Bildschirmhöhe (unter der HA-Kopfzeile) oder px
offset_x: 0         # Verschiebung in px nach rechts (negativ = links)
offset_y: 0         # Verschiebung in px nach unten (negativ = oben)
```

Mit `width: 100` / `height: 100` füllt die Uhr den ganzen Bildschirm, die Buchstaben
verteilen sich über die volle Fläche. Die Schriftgröße richtet sich nach der kürzeren
Seite. Im Vollbild füllt eine frei eingestellte Uhr den ganzen Bildschirm.

## Antippen: Vollbild und Info-Anzeige

- **Antippen** schaltet das Vollbild ein/aus (`tap_action: fullscreen`)
- **Doppeltippen** zeigt für ein paar Sekunden Wochentag, Datum und frei wählbare Werte
  im Stil der Uhr (`double_tap_action: info`)

```yaml
type: custom:clockinletters-card
info_entities:
  - sensor.aussentemperatur
  - sensor.luftfeuchte_wohnzimmer
info_duration: 8
```

## Grüße & Nachrichten

### Grußzeilen

Im Menü **Grüße & Nachrichten** (standardmäßig aus) lassen sich Grußzeilen einschalten –
wahlweise **oben, unten, links oder rechts** neben der Uhr:

- **Guten Morgen** – standardmäßig 5–10 Uhr
- **Guten Mittag** – 11:30–14 Uhr
- **Guten Abend** – 18–22 Uhr
- **Gute Nacht** – 22–5 Uhr

Die Uhrzeiten sind einstellbar. Die Grüße gibt es in allen Sprachen der Uhr
(Good morning, Good afternoon, Goedemiddag, Bonjour, Buenos días …).

Statt nach Uhrzeit kann auch eine **Entität** den Gruß bestimmen – z. B. ein
`input_select` mit den Optionen „Morgen“, „Mittag“, „Abend“, „Nacht“, „Aus“. So lässt sich der Gruß
per Automation steuern (z. B. „Guten Morgen“ erst, wenn jemand aufgestanden ist).

```yaml
type: custom:clockinletters-card
greeting: true
greeting_position: bottom          # top, bottom, left, right
greeting_entity: input_select.uhr_gruss   # optional
```

### Anlässe

Im Menü **Anlässe** (standardmäßig aus) erscheinen besondere Grüße groß im Stil der Uhr –
in der gewählten Sprache:

| Anlass | Wann |
|---|---|
| Frohe Ostern | Ostersonntag und -montag (Datum wird jedes Jahr berechnet) |
| Frohe Weihnachten | 24.–26. Dezember |
| Frohes neues Jahr | Silvester ab 18 Uhr und Neujahr |
| Happy Birthday + Name | an den eingetragenen Geburtstagen |
| Herzlichen Glückwunsch | solange die Glückwunsch-Entität an ist (z. B. `input_boolean`) |

Wie oft und wie lange der Gruß erscheint, stellst du selbst ein – z. B. alle 15 Minuten
für 30 Sekunden, jede Minute für 10 Sekunden, oder dauerhaft statt der Uhr.

```yaml
type: custom:clockinletters-card
occasions: true
birthdays: "15.03. Anna, 02.11. Max"
congrats_entity: input_boolean.glueckwunsch
occasion_display: interval   # oder permanent
occasion_interval: 15        # alle 15 Minuten …
occasion_duration: 30        # … für 30 Sekunden
occasion_color: RAL 3020     # optional, z. B. Rot
```

### Nachrichten

Der Text einer Entität erscheint im Stil der Uhr – z. B. von einem `input_text`, den
Automationen setzen:

```yaml
type: custom:clockinletters-card
message_entity: input_text.uhr_nachricht
message_duration: 30     # Sekunden; 0 = solange die Entität Text hat
```

Beispiel-Automation: Am Abend vor der Müllabfuhr „MÜLL RAUS“ anzeigen

```yaml
automation:
  - alias: Uhr – Müll raus
    trigger:
      - platform: time
        at: "19:00:00"
    condition:
      - condition: state
        entity_id: sensor.muellabfuhr_morgen   # dein Abfall-Sensor
        state: "on"
    action:
      - service: input_text.set_value
        target:
          entity_id: input_text.uhr_nachricht
        data:
          value: "Müll raus!"
```

Ist `message_duration: 0`, bleibt die Nachricht stehen, bis die Entität wieder leer ist
(`input_text.set_value` mit `value: ""`).

## Home Assistant einbinden

```yaml
type: custom:clockinletters-card
color_entity: light.wohnzimmer          # Buchstaben in der Farbe der Lampe (wenn sie an ist)
alert_entities:                         # ist eine davon aktiv, leuchtet die Uhr rot und pulsiert
  - binary_sensor.haustuer
  - alarm_control_panel.haus
presence_entity: binary_sensor.bewegung_flur   # keine Bewegung -> gedimmt wie nachts
```

Als „aktiv“ gelten u. a. die Zustände `on`, `open`, `triggered`, `pending`, `unlocked`,
`detected` und `home`.

## Uhrzeit

- Die Uhr zeigt die Zeit in der Zeitzone, die in deinem **HA-Benutzerprofil** eingestellt ist
  (`time_zone: auto`). Mit `time_zone: server` immer in der Zeitzone des HA-Servers,
  mit `time_zone: local` in der des Geräts.
- Geht die Uhr des Geräts falsch (z. B. Kiosk-Tablet oder Raspberry Pi ohne Internetzeit),
  gleicht die Karte sie automatisch mit der Uhr des HA-Servers ab – stündlich und nach dem
  Aufwachen aus dem Standby (`sync_server_time`, Standard an).

## Eigene Farben: Hex, RGB oder RAL

Neben jedem Farbwähler gibt es ein Feld **Farbcode**. Dort – oder direkt im YAML –
lässt sich jede Farbe als Hex-, RGB- oder RAL-Code eingeben:

```yaml
type: custom:clockinletters-card
background: RAL 6003      # RAL Classic (auch "6003" oder "RAL-6003")
color_on: "#F7F9EF"       # Hex (auch "#fff" oder "F7F9EF")
color_off: 230, 228, 218  # RGB (auch "rgb(230, 228, 218)")
off_opacity: 45
```

Alle 215 RAL-Classic-Farben sind enthalten. RAL-Farben sind für Lack definiert und
lassen sich am Bildschirm nur annähernd darstellen.

## Farb-Vorlagen

![Farb-Vorlagen](https://raw.githubusercontent.com/renespeaker/ha-clockinletters/main/images/themes.png)

```yaml
type: custom:clockinletters-card
theme: kupfer
wall_mount: true
```

## Optionen

| Option          | Standard          | Beschreibung |
|-----------------|-------------------|--------------|
| `theme`         | `schwarz`         | Farb-Vorlage: `oliv`, `anthrazit`, `schwarz`, `weiss`, `messing`, `gold`, `kupfer`, `edelstahl`, `walnuss`, `rost`, `rot`, `nachtblau`, `matrix`, `pink`, `ha` (Farben des HA-Themes) oder `eigene`. Einzeln gesetzte Farben überschreiben die Vorlage. |
| `realistic`     | `true`            | Realistische Darstellung: Oberflächenstruktur, Lichtreflex, Kanten und LED-Leuchten |
| `finish`        | `auto`            | Oberfläche: `auto` (passend zur Vorlage), `glanz`, `gebuerstet`, `matt`, `holz`, `rost`, `flach` |
| `wall_mount`    | `false`           | Uhr hängt mit Schatten auf der Karte wie an der Wand (Kartenhintergrund = Wand) |
| `view_3d`       | `false`           | Schräge 3D-Ansicht mit sichtbarer Plattenkante |
| `stencil`       | `true`            | Stege in O, Ö, Q, D wie bei ausgefrästen Buchstaben |
| `language`      | `de`              | Sprache des Buchstabenrasters: `de`, `en`, `nl`, `fr`, `es` |
| `fit_screen`    | `true`            | Uhr nie höher als der Bildschirm (quadratisch, zentriert) |
| `tap_action`    | `fullscreen`      | Beim Antippen: `fullscreen`, `info` oder `none` |
| `double_tap_action` | `info`        | Beim Doppeltippen: `info`, `fullscreen` oder `none` |
| `info_entities` | –                 | Werte für die Info-Anzeige, z. B. Temperatur |
| `info_duration` | `8`               | Sekunden, bis wieder die Uhr erscheint |
| `fullscreen_background` | `[0, 0, 0]` | Hintergrund im Vollbild |
| `keep_awake`    | `true`            | Bildschirm im Vollbild wach halten |
| `night_mode`    | `off`             | Nachtmodus: `off`, `sun`, `time`, `entity` |
| `night_start` / `night_end` | `22:00` / `06:30` | Zeitfenster für `night_mode: time` |
| `night_entity`  | –                 | Entität für `night_mode: entity` (an = Nacht) |
| `night_brightness` | `35`           | Helligkeit nachts in % |
| `night_hide_unlit` | `false`        | Nachts nur die leuchtenden Buchstaben zeigen |
| `presence_entity` | –               | Anwesenheit/Bewegung: ist sie aus, wird gedimmt wie nachts |
| `color_entity`  | –                 | Licht-Entität: leuchtende Buchstaben übernehmen deren Farbe |
| `alert_entities` | –                | Liste von Entitäten: ist eine aktiv, leuchtet die Uhr in `alert_color` |
| `alert_color`   | `[255, 45, 45]`   | Farbe bei Alarm |
| `alert_pulse`   | `true`            | Bei Alarm pulsieren |
| `transition`    | `cascade`         | Minutenwechsel: `cascade` (Buchstabe für Buchstabe), `fade`, `none` |
| `burn_in_protection` | `false`      | Uhr jede Minute minimal verschieben (Dauerbetrieb, OLED) |
| `greeting`      | `false`           | Grußzeilen (Guten Morgen/Abend, Gute Nacht) anzeigen |
| `greeting_position` | `bottom`      | `top`, `bottom`, `left`, `right` |
| `greeting_entity` | –               | Entität bestimmt den Gruß (Zustand „Morgen“, „Abend“, „Nacht“, sonst keiner) |
| `greeting_morning_start` / `_end` | `05:00` / `10:00` | Zeitraum „Guten Morgen“ |
| `greeting_noon_start` / `_end` | `11:30` / `14:00` | Zeitraum „Guten Mittag“ |
| `greeting_evening_start` | `18:00`  | Ab wann „Guten Abend“ |
| `greeting_night_start` | `22:00`    | Ab wann „Gute Nacht“ (bis Morgen-Beginn) |
| `occasions`     | `false`           | Anlässe anzeigen |
| `occasion_easter` / `_christmas` / `_newyear` | `true` | Einzelne Anlässe an/aus |
| `birthdays`     | –                 | Geburtstage, z. B. `"15.03. Anna, 02.11. Max"` |
| `congrats_entity` | –               | Entität für „Herzlichen Glückwunsch“ (an = anzeigen) |
| `occasion_display` | `interval`     | `interval` (regelmäßig) oder `permanent` (statt der Uhr) |
| `occasion_interval` | `15`          | Alle x Minuten einblenden |
| `occasion_duration` | `30`          | Für x Sekunden |
| `occasion_color` | –                | Eigene Farbe für Anlässe (Hex, RGB, RAL) |
| `message_entity` | –                | Entität, deren Text als Nachricht erscheint (z. B. `input_text`) |
| `message_duration` | `30`           | Sekunden; `0` = solange die Entität Text hat |
| `panel_fill`    | `auto`            | Bildschirm füllen: `auto` (in Panel-Ansicht), `always` (immer), `off` (quadratisch) |
| `custom_size`   | `false`           | Breite und Höhe frei einstellen |
| `width` / `width_unit` | `100` / `%` | Breite in `%` (der Karte) oder `px` |
| `height` / `height_unit` | `100` / `vh` | Höhe in `vh` (% der Bildschirmhöhe) oder `px` |
| `offset_x` / `offset_y` | `0` / `0` | Verschiebung in px |
| `time_zone`     | `auto`            | `auto` (wie im HA-Profil), `server` oder `local` |
| `sync_server_time` | `true`         | Geräte-Uhr mit der Uhr des HA-Servers abgleichen |
| `font_family`   | `Barlow`          | Schriftart: `Barlow` (DIN-ähnlich, Google Fonts), `Helvetica Neue`, `Roboto`, `Arial`, `Verdana`, `Trebuchet MS`, `Georgia`, `Times New Roman`, `Courier New` oder eine Google-Schrift (`Barlow`, `Josefin Sans`, `Montserrat`, `Raleway`, `Poppins`, `Oswald`, `Quicksand`, `Comfortaa`, `Orbitron`, `Playfair Display`, `Roboto Mono`). Auch jeder andere CSS-Schriftname ist möglich. |
| `font_size`     | `85`              | Schriftgröße in % (50–130) |
| `font_weight`   | `"400"`           | Schriftstärke `"100"` (hauchdünn) bis `"900"` (extra fett) |
| `color_on`      | `[255, 255, 255]` | Farbe der aktiven Buchstaben/Punkte – `[r, g, b]`, Hex, RGB, RAL (`RAL 9010`) oder CSS (`"var(--primary-color)"`) |
| `color_off`     | `[255, 255, 255]` | Farbe der inaktiven Buchstaben |
| `off_opacity`   | `15`              | Deckkraft der inaktiven Buchstaben in % |
| `background`    | `[17, 17, 17]`    | Hintergrund – `[r, g, b]` oder CSS (auch `linear-gradient(...)`) |
| `glow`          | `true`            | Leucht-Effekt an/aus |
| `glow_strength` | `35`              | Stärke des Leucht-Effekts in % |
| `show_dots`     | `true`            | Minuten-Punkte in den Ecken |
| `show_es_ist`   | `true`            | „ES IST“ / „IT IS“ anzeigen |
| `rounded`       | `true`            | Abgerundete Kartenecken (Theme-Standard) |
| `padding`       | `16`              | Innenabstand in % |
| `dialect`       | `west`            | nur Deutsch – `west`: „Viertel nach / Viertel vor“ – `ost`: „Viertel vier / Dreiviertel vier“ |
| `zwanzig`       | `zwanzig`         | nur Deutsch – `zwanzig`: „Zwanzig nach / vor“ – `halb`: „Zehn vor halb / Zehn nach halb“ |

Google-Schriften werden beim ersten Anzeigen aus dem Internet geladen.
Ohne Internetzugang wird eine Ersatzschrift verwendet.

## Updates

Neue Versionen erscheinen als [Releases](https://github.com/renespeaker/ha-clockinletters/releases)
und werden in HACS als Update angezeigt. Was sich geändert hat, steht in der
[CHANGELOG.md](CHANGELOG.md). Nach einem Update den Browser-Cache leeren.

### Neue Version veröffentlichen (für Entwickler)

1. `CARD_VERSION` in `clockinletters-card.js` erhöhen, z. B. auf `1.6.0`
2. Eintrag `## [1.6.0] – Datum` in `CHANGELOG.md` ergänzen
3. Auf `main` pushen – GitHub legt den Tag `v1.6.0` und das Release mit der
   Karten-Datei automatisch an

Tests lokal ausführen: `node tests/time.test.js`

## Welche Version läuft?

Oben im Karten-Menü steht die geladene Version („Clock in Letters – Version …“). Zeigt
sie nach einem Update noch die alte Nummer, den Browser-Cache leeren bzw. in der
Companion-App „Frontend-Cache zurücksetzen“.

## Vorschau ohne Home Assistant

`preview.html` im Browser öffnen.

## Lizenz

MIT – siehe [LICENSE](LICENSE).

Die RAL-Classic-Farbwerte stammen aus dem Paket
[ral-colors](https://github.com/ieskudero/ral-colors) von Ibon Eskudero (MIT-Lizenz).
