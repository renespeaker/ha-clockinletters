// Prüft die Zeitlogik der Karte ohne Browser: node tests/time.test.js
const assert = require("assert");

// Minimale Browser-Attrappen, damit die Datei in Node geladen werden kann
global.HTMLElement = class {};
global.customElements = { get: () => true, define: () => {} };
global.window = {};
global.document = { getElementById: () => null };
console.info = () => {};

const { computeWords, wordsToText, GRID_EN } = require("../clockinletters-card.js");

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

console.log(`OK – ${cases.length} Uhrzeiten und alle 1440 Minuten geprüft`);
