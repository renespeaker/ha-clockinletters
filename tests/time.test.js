// Prüft die Zeitlogik der Karte ohne Browser: node tests/time.test.js
const assert = require("assert");

// Minimale Browser-Attrappen, damit die Datei in Node geladen werden kann
global.HTMLElement = class {};
global.customElements = { get: () => true, define: () => {} };
global.window = {};
global.document = { getElementById: () => null };
console.info = () => {};

const { GREETINGS, greetingFromState, greetingForMinute, parseColorCode, normalizeColorCode, colorCodeOf, RAL_CLASSIC, computeWords, wordsToText, GRID_EN, LAYOUTS, wallClock, parseTime, inTimeWindow, hsToRgb, isActive } = require("../clockinletters-card.js");

const de = (h, m, cfg = {}) =>
  wordsToText(computeWords(new Date(2026, 0, 1, h, m), { show_es_ist: true, dialect: "west", zwanzig: "zwanzig", ...cfg }).words);
const en = (h, m) => wordsToText(computeWords(new Date(2026, 0, 1, h, m), { show_es_ist: true, language: "en" }).words, GRID_EN);
const dots = (h, m) => computeWords(new Date(2026, 0, 1, h, m), { show_es_ist: true }).dots;

const cases = [
  [de(1, 0), "ES IST EIN UHR"],
  [de(13, 5), "ES IST FÜNF NACH EINS"],
  [de(3, 15), "ES IST VIERTEL NACH DREI"],
  [de(3, 20), "ES IST ZWANZIG NACH DREI"],
  [de(3, 25), "ES IST FÜNF VOR HALB VIER"],
  [de(3, 30), "ES IST HALB VIER"],
  [de(3, 35), "ES IST FÜNF NACH HALB VIER"],
  [de(3, 40), "ES IST ZWANZIG VOR VIER"],
  [de(3, 45), "ES IST VIERTEL VOR VIER"],
  [de(11, 55), "ES IST FÜNF VOR ZWÖLF"],
  [de(0, 0), "ES IST ZWÖLF UHR"],
  [de(3, 15, { dialect: "ost" }), "ES IST VIERTEL VIER"],
  [de(3, 45, { dialect: "ost" }), "ES IST DREIVIERTEL VIER"],
  [de(3, 20, { zwanzig: "halb" }), "ES IST ZEHN VOR HALB VIER"],
  [de(3, 40, { zwanzig: "halb" }), "ES IST ZEHN NACH HALB VIER"],
  [en(7, 0), "IT IS SEVEN OCLOCK"],
  [en(7, 15), "IT IS A QUARTER PAST SEVEN"],
  [en(7, 25), "IT IS TWENTY FIVE PAST SEVEN"],
  [en(7, 30), "IT IS HALF PAST SEVEN"],
  [en(6, 35), "IT IS TWENTY FIVE TO SEVEN"],
  [en(7, 45), "IT IS A QUARTER TO EIGHT"],
  [en(11, 55), "IT IS FIVE TO TWELVE"],
  [en(0, 0), "IT IS TWELVE OCLOCK"],
  [dots(9, 3), 3],
  [dots(9, 5), 0],
];

for (const [actual, expected] of cases) assert.strictEqual(actual, expected);

// Weitere Sprachen
const say = (lang, h, m) => {
  const r = computeWords(new Date(2026, 0, 1, h, m), { show_es_ist: true, language: lang });
  return wordsToText(r.words, LAYOUTS[lang].grid);
};
const more = [
  ["nl", 2, 0, "HET IS TWEE UUR"],
  ["nl", 2, 5, "HET IS VIJF OVER TWEE"],
  ["nl", 2, 15, "HET IS KWART OVER TWEE"],
  ["nl", 2, 20, "HET IS TIEN VOOR HALF DRIE"],
  ["nl", 2, 25, "HET IS VIJF VOOR HALF DRIE"],
  ["nl", 2, 30, "HET IS HALF DRIE"],
  ["nl", 2, 35, "HET IS VIJF OVER HALF DRIE"],
  ["nl", 2, 40, "HET IS TIEN OVER HALF DRIE"],
  ["nl", 2, 45, "HET IS KWART VOOR DRIE"],
  ["nl", 11, 55, "HET IS VIJF VOOR TWAALF"],
  ["nl", 0, 0, "HET IS TWAALF UUR"],
  ["fr", 1, 0, "IL EST UNE HEURE"],
  ["fr", 2, 0, "IL EST DEUX HEURES"],
  ["fr", 2, 5, "IL EST DEUX HEURES CINQ"],
  ["fr", 2, 15, "IL EST DEUX HEURES ET QUART"],
  ["fr", 2, 25, "IL EST DEUX HEURES VINGT-CINQ"],
  ["fr", 2, 30, "IL EST DEUX HEURES ET DEMIE"],
  ["fr", 2, 35, "IL EST TROIS HEURES MOINS VINGT-CINQ"],
  ["fr", 2, 45, "IL EST TROIS HEURES MOINS LE QUART"],
  ["fr", 2, 50, "IL EST TROIS HEURES MOINS DIX"],
  ["fr", 12, 0, "IL EST MIDI"],
  ["fr", 12, 30, "IL EST MIDI ET DEMI"],
  ["fr", 11, 45, "IL EST MIDI MOINS LE QUART"],
  ["fr", 0, 10, "IL EST MINUIT DIX"],
  ["fr", 23, 55, "IL EST MINUIT MOINS CINQ"],
  ["fr", 13, 0, "IL EST UNE HEURE"],
  ["fr", 9, 0, "IL EST NEUF HEURES"],
  ["fr", 10, 5, "IL EST DIX HEURES CINQ"],
  ["fr", 5, 10, "IL EST CINQ HEURES DIX"],
  ["es", 1, 0, "ES LA UNA"],
  ["es", 2, 0, "SON LAS DOS"],
  ["es", 2, 5, "SON LAS DOS Y CINCO"],
  ["es", 2, 15, "SON LAS DOS Y CUARTO"],
  ["es", 2, 25, "SON LAS DOS Y VEINTICINCO"],
  ["es", 2, 30, "SON LAS DOS Y MEDIA"],
  ["es", 2, 35, "SON LAS TRES MENOS VEINTICINCO"],
  ["es", 0, 45, "ES LA UNA MENOS CUARTO"],
  ["es", 12, 40, "ES LA UNA MENOS VEINTE"],
  ["es", 11, 50, "SON LAS DOCE MENOS DIEZ"],
  ["es", 10, 10, "SON LAS DIEZ Y DIEZ"],
];
for (const [lang, h, m, expected] of more) assert.strictEqual(say(lang, h, m), expected, `${lang} ${h}:${m}`);

// Raster: 10 Zeilen à 11 Buchstaben, alle Wörter liegen im Raster und in Lesereihenfolge
for (const [lang, layout] of Object.entries(LAYOUTS)) {
  assert.strictEqual(layout.grid.length, 10, lang);
  for (const row of layout.grid) assert.strictEqual([...row].length, 11, `${lang}: ${row}`);
  for (let m = 0; m < 24 * 60; m++) {
    const { words } = computeWords(new Date(2026, 0, 1, Math.floor(m / 60), m % 60), { show_es_ist: true, language: lang });
    let last = -1;
    for (const [r, c, l] of words) {
      assert.ok(r >= 0 && r < 10 && c >= 0 && c + l <= 11, `${lang} ${m}: Wort außerhalb`);
      const pos = r * 11 + c;
      assert.ok(pos > last, `${lang} ${Math.floor(m / 60)}:${m % 60}: Wörter nicht in Lesereihenfolge`);
      last = pos + l - 1;
    }
  }
}

// Jede Minute des Tages muss ohne Fehler eine Uhrzeit liefern
for (let m = 0; m < 24 * 60; m++) {
  for (const language of Object.keys(LAYOUTS)) {
    const r = computeWords(new Date(2026, 0, 1, Math.floor(m / 60), m % 60), { show_es_ist: true, language });
    assert.ok(r.words.length >= 3 && r.words.every((w) => w.length === 3));
  }
}

// Zeitzonen: 12:00 UTC
const noonUtc = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
assert.deepStrictEqual(wallClock(noonUtc, "Europe/Berlin"), { h: 13, m: 0, s: 0 }); // Winterzeit
assert.deepStrictEqual(wallClock(new Date(Date.UTC(2026, 6, 15, 12, 0, 0)), "Europe/Berlin"), { h: 14, m: 0, s: 0 }); // Sommerzeit
assert.deepStrictEqual(wallClock(noonUtc, "America/New_York"), { h: 7, m: 0, s: 0 });
assert.deepStrictEqual(wallClock(new Date(Date.UTC(2026, 0, 15, 23, 30, 0)), "Europe/Berlin"), { h: 0, m: 30, s: 0 }); // Mitternacht = 0, nicht 24
assert.strictEqual(wallClock(noonUtc, "Kein/Gueltig").h, noonUtc.getHours()); // unbekannte Zone -> Gerät

// Nacht-Zeitfenster
assert.strictEqual(parseTime("22:00:00"), 22 * 60);
assert.strictEqual(parseTime("6:30"), 6 * 60 + 30);
assert.strictEqual(parseTime("", 99), 99);
const night = (hhmm) => inTimeWindow(parseTime(hhmm), parseTime("22:00"), parseTime("06:30"));
assert.strictEqual(night("23:15"), true);
assert.strictEqual(night("00:00"), true);
assert.strictEqual(night("06:29"), true);
assert.strictEqual(night("06:30"), false);
assert.strictEqual(night("12:00"), false);
assert.strictEqual(night("21:59"), false);
assert.strictEqual(inTimeWindow(parseTime("14:00"), parseTime("13:00"), parseTime("15:00")), true); // Fenster am Tag
assert.strictEqual(inTimeWindow(parseTime("14:00"), parseTime("13:00"), parseTime("13:00")), false); // leeres Fenster

// Lampenfarbe (Farbton/Sättigung) und aktive Zustände
assert.deepStrictEqual(hsToRgb(0, 100), [255, 0, 0]);
assert.deepStrictEqual(hsToRgb(120, 100), [0, 255, 0]);
assert.deepStrictEqual(hsToRgb(240, 100), [0, 0, 255]);
assert.deepStrictEqual(hsToRgb(30, 0), [255, 255, 255]);
for (const st of ["on", "open", "triggered", "unlocked", "home"]) assert.ok(isActive(st), st);
for (const st of ["off", "closed", "disarmed", "locked", "not_home", "unavailable"]) assert.ok(!isActive(st), st);

// Farbcodes: Hex, RGB, RAL
assert.strictEqual(Object.keys(RAL_CLASSIC).length, 215);
assert.deepStrictEqual(parseColorCode("#4B573E"), [75, 87, 62]);
assert.deepStrictEqual(parseColorCode("#fff"), [255, 255, 255]);
assert.deepStrictEqual(parseColorCode("4b573e"), [75, 87, 62]);
assert.deepStrictEqual(parseColorCode("rgb(1, 2, 3)"), [1, 2, 3]);
assert.deepStrictEqual(parseColorCode("76, 75, 45"), [76, 75, 45]);
assert.deepStrictEqual(parseColorCode("76 75 45"), [76, 75, 45]);
assert.deepStrictEqual(parseColorCode("76;75;45"), [76, 75, 45]);
assert.deepStrictEqual(parseColorCode("RAL 6003"), [75, 87, 62]);
assert.deepStrictEqual(parseColorCode("ral6003"), [75, 87, 62]);
assert.deepStrictEqual(parseColorCode("RAL-9005"), [10, 10, 13]);
assert.deepStrictEqual(parseColorCode("7016"), [55, 63, 67]);
for (const bad of ["", "#12", "#12345", "RAL 1234", "300, 0, 0", "rot", "var(--primary-color)", "12,34"]) {
  assert.strictEqual(parseColorCode(bad), null, bad);
}
assert.strictEqual(normalizeColorCode("ral 6003"), "RAL 6003");
assert.strictEqual(normalizeColorCode("4b573e"), "#4B573E");
assert.deepStrictEqual(normalizeColorCode("76, 75, 45"), [76, 75, 45]);
assert.strictEqual(colorCodeOf([75, 87, 62]), "#4B573E");
assert.strictEqual(colorCodeOf("RAL 6003"), "RAL 6003");

// Grußzeilen: Wörter liegen richtig, alle Zeilen gleich lang
const expectGreet = {
  de: { morning: "GUTEN MORGEN", evening: "GUTEN ABEND", night: "GUTE NACHT" },
  en: { morning: "GOOD MORNING", evening: "GOOD EVENING", night: "GOOD NIGHT" },
  nl: { morning: "GOEDE MORGEN", evening: "GOEDE AVOND", night: "GOEDE NACHT" },
  fr: { morning: "BONJOUR", evening: "BON SOIR", night: "BONNE NUIT" },
  es: { morning: "BUENOS DÍAS", evening: "BUENAS TARDES", night: "BUENAS NOCHES" },
};
for (const [lang, g] of Object.entries(GREETINGS)) {
  for (const orient of ["h", "v"]) {
    const def = g[orient];
    const width = [...def.rows[0]].length;
    if (orient === "h") assert.strictEqual(width, 11, `${lang} h`);
    for (const row of def.rows) assert.strictEqual([...row].length, width, `${lang} ${orient}: ${row}`);
    for (const key of ["morning", "evening", "night"]) {
      const text = def[key].map(([r, c, l]) => [...def.rows[r]].slice(c, c + l).join("")).join(" ");
      assert.strictEqual(text.replace(/ /g, ""), expectGreet[lang][key].replace(/ /g, ""), `${lang} ${orient} ${key}`);
    }
  }
}
const gcfg = { greeting_morning_start: "05:00", greeting_morning_end: "10:00", greeting_evening_start: "18:00", greeting_night_start: "22:00" };
const g = (hhmm) => greetingForMinute(parseTime(hhmm), gcfg);
assert.strictEqual(g("04:59"), "night");
assert.strictEqual(g("05:00"), "morning");
assert.strictEqual(g("09:59"), "morning");
assert.strictEqual(g("10:00"), null);
assert.strictEqual(g("17:59"), null);
assert.strictEqual(g("18:00"), "evening");
assert.strictEqual(g("22:00"), "night");
assert.strictEqual(g("00:30"), "night");
for (const [state, key] of [["Morgen", "morning"], ["Guten Abend", "evening"], ["nacht", "night"], ["night", "night"], ["Aus", null], ["off", null], ["", null]]) {
  assert.strictEqual(greetingFromState(state), key, state);
}

console.log(`OK – ${cases.length} Uhrzeiten, alle 1440 Minuten, Zeitzonen, Nachtfenster, Farbcodes und Grüße geprüft`);
