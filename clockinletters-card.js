/**
 * Clock in Letters – Wortuhr-Karte für Home Assistant (Lovelace)
 *
 * Zeigt die Uhrzeit als leuchtende Wörter in einem 11x10 Buchstabenraster,
 * plus vier Eck-Punkte für die Minuten zwischen den 5-Minuten-Schritten.
 */

const CARD_VERSION = "1.0.0";

const GRID = [
  "ESKISTAFÜNF",
  "ZEHNZWANZIG",
  "DREIVIERTEL",
  "VORFUNKNACH",
  "HALBAELFÜNF",
  "EINSXAMZWEI",
  "DREIPMJVIER",
  "SECHSNLACHT",
  "SIEBENZWÖLF",
  "ZEHNEUNKUHR",
];

// [Zeile, Startspalte, Länge]
const WORDS = {
  ES: [0, 0, 2],
  IST: [0, 3, 3],
  M_FUENF: [0, 7, 4],
  M_ZEHN: [1, 0, 4],
  M_ZWANZIG: [1, 4, 7],
  DREIVIERTEL: [2, 0, 11],
  VIERTEL: [2, 4, 7],
  VOR: [3, 0, 3],
  NACH: [3, 7, 4],
  HALB: [4, 0, 4],
  UHR: [9, 8, 3],
};

const HOURS = [
  [8, 6, 5], // 0/12 ZWÖLF
  [5, 0, 4], // 1 EINS
  [5, 7, 4], // 2 ZWEI
  [6, 0, 4], // 3 DREI
  [6, 7, 4], // 4 VIER
  [4, 7, 4], // 5 FÜNF
  [7, 0, 5], // 6 SECHS
  [8, 0, 6], // 7 SIEBEN
  [7, 7, 4], // 8 ACHT
  [9, 3, 4], // 9 NEUN
  [9, 0, 4], // 10 ZEHN
  [4, 5, 3], // 11 ELF
];
const HOUR_EIN = [5, 0, 3]; // "EIN UHR"

const DEFAULTS = {
  color_on: "#ffffff",
  color_off: "rgba(255, 255, 255, 0.12)",
  background: "#111111",
  glow: true,
  show_dots: true,
  show_es_ist: true,
  dialect: "west", // west: VIERTEL NACH / VIERTEL VOR – ost: VIERTEL / DREIVIERTEL
  zwanzig: "zwanzig", // zwanzig: ZWANZIG NACH – halb: ZEHN VOR HALB
  font_family: "'Helvetica Neue', Arial, sans-serif",
  rounded: true,
  padding: "8%",
};

/** Liefert die zu leuchtenden Wörter und die Anzahl der Eck-Punkte. */
function computeWords(date, cfg) {
  const minute = date.getMinutes();
  const step = Math.floor(minute / 5);
  let hour = date.getHours() % 12;
  const words = [];

  if (cfg.show_es_ist) words.push(WORDS.ES, WORDS.IST);

  let nextHour = false;
  switch (step) {
    case 0:
      break;
    case 1:
      words.push(WORDS.M_FUENF, WORDS.NACH);
      break;
    case 2:
      words.push(WORDS.M_ZEHN, WORDS.NACH);
      break;
    case 3:
      if (cfg.dialect === "ost") {
        words.push(WORDS.VIERTEL);
        nextHour = true;
      } else {
        words.push(WORDS.VIERTEL, WORDS.NACH);
      }
      break;
    case 4:
      if (cfg.zwanzig === "halb") {
        words.push(WORDS.M_ZEHN, WORDS.VOR, WORDS.HALB);
        nextHour = true;
      } else {
        words.push(WORDS.M_ZWANZIG, WORDS.NACH);
      }
      break;
    case 5:
      words.push(WORDS.M_FUENF, WORDS.VOR, WORDS.HALB);
      nextHour = true;
      break;
    case 6:
      words.push(WORDS.HALB);
      nextHour = true;
      break;
    case 7:
      words.push(WORDS.M_FUENF, WORDS.NACH, WORDS.HALB);
      nextHour = true;
      break;
    case 8:
      if (cfg.zwanzig === "halb") {
        words.push(WORDS.M_ZEHN, WORDS.NACH, WORDS.HALB);
      } else {
        words.push(WORDS.M_ZWANZIG, WORDS.VOR);
      }
      nextHour = true;
      break;
    case 9:
      words.push(cfg.dialect === "ost" ? WORDS.DREIVIERTEL : WORDS.VIERTEL);
      if (cfg.dialect !== "ost") words.push(WORDS.VOR);
      nextHour = true;
      break;
    case 10:
      words.push(WORDS.M_ZEHN, WORDS.VOR);
      nextHour = true;
      break;
    case 11:
      words.push(WORDS.M_FUENF, WORDS.VOR);
      nextHour = true;
      break;
  }

  if (nextHour) hour = (hour + 1) % 12;

  if (step === 0) {
    words.push(hour === 1 ? HOUR_EIN : HOURS[hour], WORDS.UHR);
  } else {
    words.push(HOURS[hour]);
  }

  return { words, dots: minute % 5 };
}

/** Menschlich lesbarer Text, z. B. für Screenreader. */
function wordsToText(words) {
  return words.map(([r, c, l]) => GRID[r].substr(c, l)).join(" ");
}

class ClockInLettersCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("clockinletters-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    this._config = { ...DEFAULTS, ...(config || {}) };
    this._built = false;
    if (this.isConnected) this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    return 6;
  }

  getGridOptions() {
    return { columns: 6, rows: "auto", min_columns: 3 };
  }

  connectedCallback() {
    this._render();
    this._schedule();
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
    this._timer = null;
  }

  _schedule() {
    clearTimeout(this._timer);
    const now = new Date();
    const ms = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;
    this._timer = setTimeout(() => {
      this._update();
      this._schedule();
    }, ms);
  }

  _render() {
    if (!this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const c = this._config;

    const letters = GRID.map(
      (row, r) =>
        `<div class="row">${[...row]
          .map((ch, i) => `<span class="l" data-r="${r}" data-c="${i}">${ch}</span>`)
          .join("")}</div>`
    ).join("");

    const dots = c.show_dots
      ? [1, 2, 3, 4].map((n) => `<span class="dot d${n}"></span>`).join("")
      : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --ct-on: ${c.color_on};
          --ct-off: ${c.color_off};
          --ct-bg: ${c.background};
        }
        ha-card {
          display: block;
          background: var(--ct-bg);
          overflow: hidden;
          ${c.rounded ? "" : "border-radius: 0;"}
        }
        .face {
          position: relative;
          aspect-ratio: 1 / 1;
          width: 100%;
          container-type: inline-size;
          box-sizing: border-box;
        }
        .grid {
          position: absolute;
          inset: ${c.padding};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: ${c.font_family};
          font-weight: 300;
          font-size: 6cqi;
          line-height: 1;
          user-select: none;
        }
        .row {
          display: flex;
          justify-content: space-between;
        }
        .l {
          width: 1em;
          text-align: center;
          color: var(--ct-off);
          transition: color 0.8s ease, text-shadow 0.8s ease;
        }
        .l.on {
          color: var(--ct-on);
          ${c.glow ? "text-shadow: 0 0 0.35em var(--ct-on);" : ""}
        }
        .dot {
          position: absolute;
          width: 1.4cqi;
          height: 1.4cqi;
          border-radius: 50%;
          background: var(--ct-off);
          transition: background 0.8s ease, box-shadow 0.8s ease;
        }
        .dot.on {
          background: var(--ct-on);
          ${c.glow ? "box-shadow: 0 0 1.5cqi var(--ct-on);" : ""}
        }
        .d1 { top: 3.3cqi; left: 3.3cqi; }
        .d2 { top: 3.3cqi; right: 3.3cqi; }
        .d3 { bottom: 3.3cqi; right: 3.3cqi; }
        .d4 { bottom: 3.3cqi; left: 3.3cqi; }
      </style>
      <ha-card>
        <div class="face" role="img">
          ${dots}
          <div class="grid">${letters}</div>
        </div>
      </ha-card>
    `;
    this._cells = [...this.shadowRoot.querySelectorAll(".l")];
    this._dots = [...this.shadowRoot.querySelectorAll(".dot")];
    this._face = this.shadowRoot.querySelector(".face");
    this._built = true;
    this._update();
  }

  _update() {
    if (!this._built) return;
    const { words, dots } = computeWords(new Date(), this._config);
    const lit = new Set();
    for (const [r, c, l] of words) {
      for (let i = c; i < c + l; i++) lit.add(r * 11 + i);
    }
    this._cells.forEach((el, idx) => el.classList.toggle("on", lit.has(idx)));
    this._dots.forEach((el, idx) => el.classList.toggle("on", idx < dots));
    this._face.setAttribute("aria-label", wordsToText(words));
  }
}

class ClockInLettersCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
  }

  _render() {
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => LABELS[s.name] || s.name;
      this._form.addEventListener("value-changed", (ev) => {
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config: ev.detail.value },
            bubbles: true,
            composed: true,
          })
        );
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = SCHEMA;
    this._form.data = { ...DEFAULTS, ...this._config };
  }
}

const LABELS = {
  color_on: "Farbe aktiv (CSS)",
  color_off: "Farbe inaktiv (CSS)",
  background: "Hintergrund (CSS)",
  glow: "Leucht-Effekt",
  show_dots: "Minuten-Punkte in den Ecken",
  show_es_ist: "„ES IST“ anzeigen",
  dialect: "Viertel-Schreibweise",
  zwanzig: "20 / 40 Minuten",
  font_family: "Schriftart",
  rounded: "Abgerundete Ecken",
  padding: "Innenabstand (z. B. 8%)",
};

const SCHEMA = [
  {
    type: "grid",
    name: "",
    schema: [
      { name: "color_on", selector: { text: {} } },
      { name: "color_off", selector: { text: {} } },
      { name: "background", selector: { text: {} } },
      { name: "padding", selector: { text: {} } },
    ],
  },
  {
    name: "dialect",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "west", label: "Viertel nach / Viertel vor" },
          { value: "ost", label: "Viertel / Dreiviertel" },
        ],
      },
    },
  },
  {
    name: "zwanzig",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "zwanzig", label: "Zwanzig nach / Zwanzig vor" },
          { value: "halb", label: "Zehn vor halb / Zehn nach halb" },
        ],
      },
    },
  },
  { name: "font_family", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "glow", selector: { boolean: {} } },
      { name: "show_dots", selector: { boolean: {} } },
      { name: "show_es_ist", selector: { boolean: {} } },
      { name: "rounded", selector: { boolean: {} } },
    ],
  },
];

if (!customElements.get("clockinletters-card")) {
  customElements.define("clockinletters-card", ClockInLettersCard);
  customElements.define("clockinletters-card-editor", ClockInLettersCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "clockinletters-card")) {
  window.customCards.push({
    type: "clockinletters-card",
    name: "Clock in Letters",
    description: "Wortuhr – die Uhrzeit in leuchtenden Wörtern.",
    preview: true,
  });
}

console.info(
  `%c CLOCKINLETTERS-CARD %c v${CARD_VERSION} `,
  "color: #111; background: #fff; font-weight: 700;",
  "color: #fff; background: #111;"
);

if (typeof module !== "undefined") module.exports = { computeWords, wordsToText };
