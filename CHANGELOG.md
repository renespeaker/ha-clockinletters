# Änderungen

Alle Versionen der Karte „Clock in Letters“. Die neueste steht oben.

## [1.13.0] – 2026-10-03

- In einer Panel-Ansicht füllt die Uhr automatisch die ganze Fläche unter der
  HA-Kopfzeile – randlos und für jedes Bildschirmformat (abschaltbar)

## [1.12.0] – 2026-10-03

- Grußzeilen: „Guten Mittag“ (Good afternoon, Goedemiddag …), Zeitraum einstellbar
- Anlässe (standardmäßig aus): Frohe Ostern, Frohe Weihnachten, Frohes neues Jahr,
  Happy Birthday mit Namen, Herzlichen Glückwunsch über eine Entität – in der gewählten
  Sprache, groß im Stil der Uhr; Takt, Dauer, Daueranzeige und Farbe einstellbar

## [1.11.0] – 2026-10-03

- Grußzeilen „Guten Morgen / Guten Abend / Gute Nacht“ (in allen Sprachen), oben, unten,
  links oder rechts; nach Uhrzeit oder gesteuert über eine Entität – standardmäßig aus
- Nachrichten: Text einer Entität (z. B. `input_text`) erscheint im Stil der Uhr –
  für eine einstellbare Dauer oder dauerhaft

## [1.10.0] – 2026-10-02

- Farben per Code eingeben: Hex (`#4B573E`), RGB (`75, 87, 62`) oder RAL (`RAL 6003`) –
  im Menü neben jedem Farbwähler oder direkt im YAML; alle 215 RAL-Classic-Farben

## [1.9.0] – 2026-10-02

- Größe & Position: Breite (X) und Höhe (Y) frei einstellbar – per Schieberegler in %
  oder in Pixeln; Uhr in X/Y verschiebbar. Mit 100 % × 100 % füllt sie den ganzen Bildschirm

## [1.8.0] – 2026-10-02

- Neue Sprachen: Niederländisch, Französisch, Spanisch
- Doppeltippen zeigt Wochentag, Datum und frei wählbare Werte (z. B. Außentemperatur)
- Antippen/Doppeltippen frei belegbar (Vollbild, Info, nichts)

## [1.7.0] – 2026-10-02

- Minutenwechsel Buchstabe für Buchstabe (wählbar: Kaskade, Überblenden, sofort)
- Farbe aus Home Assistant: Buchstaben in der Farbe einer Lampe; Alarmfarbe mit Pulsieren,
  wenn z. B. eine Tür offen oder die Alarmanlage ausgelöst ist
- Anwesenheit: ohne Bewegung wird die Uhr gedimmt
- Schutz vor Einbrennen für Displays im Dauerbetrieb
- Behoben: Minuten-Punkte leuchteten seit 1.5.1 nicht mehr nach

## [1.6.0] – 2026-10-02

- Nachtmodus: dimmt nach Sonnenuntergang, in einem festen Zeitfenster oder über eine
  Entität; wahlweise nur die leuchtenden Buchstaben
- Uhrzeit in der Zeitzone aus dem HA-Benutzerprofil (oder fest Server/Gerät)
- Falsch gehende Geräte-Uhren werden automatisch mit dem HA-Server abgeglichen

## [1.5.2] – 2026-10-02

- Versionen erscheinen jetzt als Releases und werden in HACS als Update angezeigt
- HACS-Beschreibung korrigiert (hacs.json, Bilder in der Beschreibung)

## [1.5.1] – 2026-10-01

- Läuft jetzt auch in älteren Browsern (Kiosk-Browser, Wandmonitore):
  nicht leuchtende Buchstaben waren dort voll weiß, und die Uhr wurde unten abgeschnitten
- Farben des Home-Assistant-Themes werden beim Wechsel (hell/dunkel) neu übernommen

## [1.5.0] – 2026-09-29

- Passt sich jeder Bildschirmgröße an und wird nie höher als der Bildschirm
- Vollbild per Antippen (Esc oder erneut antippen zum Beenden), Bildschirm bleibt wach
- Nach Standby wird sofort die richtige Uhrzeit angezeigt

## [1.4.0] – 2026-09-29

- Englisches Buchstabenraster („IT IS HALF PAST SEVEN“)
- Neue Vorlagen Oliv und Anthrazit; ausgefräster Look mit hellen, nicht leuchtenden Buchstaben
- Schrift Barlow (DIN-ähnlich), Stege in O, Q, D, optionale 3D-Ansicht

## [1.3.0] – 2026-09-29

- Realistische Darstellung: Hochglanz, gebürstetes Metall, Holz, Rost, Matt,
  LED-Leuchten, Lichtreflexe, Wandmontage mit Schatten

## [1.2.0] – 2026-09-29

- Farb-Vorlagen (Schwarz, Weiß, Messing, Kupfer, Walnuss, …)

## [1.1.0] – 2026-09-29

- Einstellungsmenü mit Schriftart, Schriftgröße, Farbwählern und Schiebereglern

## [1.0.0] – 2026-09-29

- Erste Version: deutsche Wortuhr mit Minuten-Punkten
