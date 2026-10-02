// Prüft die Zeitlogik der Karte ohne Browser: node tests/time.test.js
const assert = require("assert");

// Minimale Browser-Attrappen, damit die Datei in Node geladen werden kann
global.HTMLElement = class {};
global.customElements = { get: () => true, define: () => {} };
global.window = {};
global.document = { getElementById: () => null };
console.info = () => {};

const { computeWords, wordsToText, GRID_EN, wallClock, parseTime, inTimeWindow, hsToRgb, isActive } = require("../clockinletters-card.js");

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

// Jede Minute des Tages muss ohne Fehler eine Uhrzeit liefern
for (let m = 0; m < 24 * 60; m++) {
  for (const language of ["de", "en"]) {
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

console.log(`OK – ${cases.length} Uhrzeiten, alle 1440 Minuten, Zeitzonen und Nachtfenster geprüft`);
