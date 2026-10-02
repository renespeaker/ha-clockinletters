# Clock in Letters – Wortuhr für Home Assistant

Eine Lovelace-Karte als Wortuhr: Die Uhrzeit wird in leuchtenden
deutschen oder englischen Wörtern in einem 11×10-Buchstabenraster angezeigt. Vier Punkte in den
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
vom Typ **Panel** anlegen und nur diese Karte hineinlegen – dann füllt die Uhr
die ganze Ansicht:

```yaml
views:
  - title: Uhr
    type: panel
    cards:
      - type: custom:clockinletters-card
        theme: oliv
```

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
| `language`      | `de`              | Sprache des Buchstabenrasters: `de` oder `en` |
| `fit_screen`    | `true`            | Uhr nie höher als der Bildschirm (quadratisch, zentriert) |
| `tap_action`    | `fullscreen`      | Beim Antippen: `fullscreen` (Vollbild ein/aus) oder `none` |
| `fullscreen_background` | `[0, 0, 0]` | Hintergrund im Vollbild |
| `keep_awake`    | `true`            | Bildschirm im Vollbild wach halten |
| `font_family`   | `Barlow`          | Schriftart: `Barlow` (DIN-ähnlich, Google Fonts), `Helvetica Neue`, `Roboto`, `Arial`, `Verdana`, `Trebuchet MS`, `Georgia`, `Times New Roman`, `Courier New` oder eine Google-Schrift (`Barlow`, `Josefin Sans`, `Montserrat`, `Raleway`, `Poppins`, `Oswald`, `Quicksand`, `Comfortaa`, `Orbitron`, `Playfair Display`, `Roboto Mono`). Auch jeder andere CSS-Schriftname ist möglich. |
| `font_size`     | `85`              | Schriftgröße in % (50–130) |
| `font_weight`   | `"400"`           | Schriftstärke `"100"` (hauchdünn) bis `"900"` (extra fett) |
| `color_on`      | `[255, 255, 255]` | Farbe der aktiven Buchstaben/Punkte – `[r, g, b]` oder CSS-Farbe (`"#ffcc00"`, `"var(--primary-color)"`) |
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

## Vorschau ohne Home Assistant

`preview.html` im Browser öffnen.
