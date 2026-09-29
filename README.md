# Clock in Letters – Wortuhr für Home Assistant

Eine Lovelace-Karte als Wortuhr: Die Uhrzeit wird in leuchtenden
deutschen Wörtern in einem 11×10-Buchstabenraster angezeigt. Vier Punkte in den
Ecken zeigen die Minuten zwischen den 5-Minuten-Schritten an.

![Screenshot](screenshot.png)

*(Links die Standardfarben, rechts eine Messing-Variante – beide um 21:38 Uhr:
„ES IST FÜNF NACH HALB ZEHN“ + 3 Punkte)*

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

Im Dashboard **Karte hinzufügen → „Clock in Letters“** auswählen – alle
Optionen lassen sich im visuellen Editor einstellen. Oder per YAML:

```yaml
type: custom:clockinletters-card
```

Beispiel mit eigenen Farben:

```yaml
type: custom:clockinletters-card
background: "#c9a227"
color_on: "#1a1a1a"
color_off: "rgba(0, 0, 0, 0.15)"
glow: false
```

## Optionen

| Option        | Standard                              | Beschreibung |
|---------------|---------------------------------------|--------------|
| `color_on`    | `#ffffff`                             | Farbe der aktiven Buchstaben/Punkte (jede CSS-Farbe) |
| `color_off`   | `rgba(255, 255, 255, 0.12)`           | Farbe der inaktiven Buchstaben |
| `background`  | `#111111`                             | Hintergrund (auch Verläufe, z. B. `linear-gradient(...)`) |
| `glow`        | `true`                                | Leucht-Effekt für aktive Buchstaben |
| `show_dots`   | `true`                                | Minuten-Punkte in den Ecken |
| `show_es_ist` | `true`                                | „ES IST“ anzeigen |
| `dialect`     | `west`                                | `west`: „Viertel nach / Viertel vor“ – `ost`: „Viertel vier / Dreiviertel vier“ |
| `zwanzig`     | `zwanzig`                             | `zwanzig`: „Zwanzig nach / vor“ – `halb`: „Zehn vor halb / Zehn nach halb“ |
| `font_family` | `'Helvetica Neue', Arial, sans-serif` | Schriftart |
| `rounded`     | `true`                                | Abgerundete Kartenecken (Theme-Standard) |
| `padding`     | `8%`                                  | Innenabstand des Buchstabenrasters |

Tipp: Mit `color_on: var(--primary-color)` übernimmt die Uhr die Akzentfarbe
deines Themes.

## Vorschau ohne Home Assistant

`preview.html` im Browser öffnen.
