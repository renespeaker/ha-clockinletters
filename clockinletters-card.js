/**
 * Clock in Letters – Wortuhr-Karte für Home Assistant (Lovelace)
 *
 * Zeigt die Uhrzeit als leuchtende Wörter in einem 11x10 Buchstabenraster,
 * plus vier Eck-Punkte für die Minuten zwischen den 5-Minuten-Schritten.
 */

const CARD_VERSION = "1.1.0";

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
  // Farben: [r, g, b] (Farbwähler im Editor) oder beliebiger CSS-Farbwert
  color_on: [255, 255, 255],
  color_off: [255, 255, 255],
  off_opacity: 15, // Deckkraft der inaktiven Buchstaben in %
  background: [17, 17, 17],
  glow: true,
  glow_strength: 35, // Stärke des Leucht-Effekts in %
  show_dots: true,
  show_es_ist: true,
  dialect: "west", // west: VIERTEL NACH / VIERTEL VOR – ost: VIERTEL / DREIVIERTEL
  zwanzig: "zwanzig", // zwanzig: ZWANZIG NACH – halb: ZEHN VOR HALB
  font_family: "Helvetica Neue",
  font_size: 100, // in % der Standardgröße
  font_weight: "300",
  rounded: true,
  padding: 8, // Innenabstand in %
};

// Auswahl im Editor: Name -> CSS font-family
const FONT_STACKS = {
  "Helvetica Neue": "'Helvetica Neue', Helvetica, Arial, sans-serif",
  Roboto: "Roboto, 'Helvetica Neue', Arial, sans-serif",
  Arial: "Arial, sans-serif",
  Verdana: "Verdana, Geneva, sans-serif",
  "Trebuchet MS": "'Trebuchet MS', sans-serif",
  Georgia: "Georgia, 'Times New Roman', serif",
  "Times New Roman": "'Times New Roman', Times, serif",
  "Courier New": "'Courier New', Courier, monospace",
};

// Werden bei Bedarf von Google Fonts nachgeladen (Internetzugang nötig)
const GOOGLE_FONTS = [
  "Josefin Sans",
  "Montserrat",
  "Raleway",
  "Poppins",
  "Oswald",
  "Quicksand",
  "Comfortaa",
  "Orbitron",
  "Playfair Display",
  "Roboto Mono",
];

function resolveFont(name) {
  if (!name) return FONT_STACKS[DEFAULTS.font_family];
  if (FONT_STACKS[name]) return FONT_STACKS[name];
  if (GOOGLE_FONTS.includes(name)) {
    loadGoogleFont(name);
    return `'${name}', sans-serif`;
  }
  return name; // freie Eingabe, z. B. "'Meine Schrift', serif"
}

function loadGoogleFont(name) {
  const id = `clockinletters-font-${name.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    name
  )}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

/** [r, g, b] oder CSS-String -> CSS-Farbe */
function toCss(value, fallback) {
  if (Array.isArray(value) && value.length >= 3) return `rgb(${value.slice(0, 3).join(", ")})`;
  if (typeof value === "string" && value.trim()) return value;
  return toCss(fallback);
}

/** CSS-Farbe (#rgb, #rrggbb, rgb()) -> [r, g, b], sonst unverändert */
function toRgb(value) {
  if (typeof value !== "string") return value;
  const v = value.trim();
  let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = [...h].map((x) => x + x).join("");
    return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
  }
  m = v.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (m) return [+m[1], +m[2], +m[3]];
  return value;
}

function clamp(n, min, max, fallback) {
  const x = Number(n);
  return Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : fallback;
}

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
    const on = toCss(c.color_on, DEFAULTS.color_on);
    const offBase = toCss(c.color_off, DEFAULTS.color_off);
    const offOpacity = clamp(c.off_opacity, 0, 100, DEFAULTS.off_opacity);
    const off = `color-mix(in srgb, ${offBase} ${offOpacity}%, transparent)`;
    const bg = toCss(c.background, DEFAULTS.background);
    const fontSize = (6 * clamp(c.font_size, 30, 150, 100)) / 100;
    const glow = c.glow ? clamp(c.glow_strength, 0, 100, DEFAULTS.glow_strength) / 100 : 0;
    const padding = typeof c.padding === "string" ? c.padding : `${clamp(c.padding, 0, 25, 8)}%`;

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
          --ct-on: ${on};
          --ct-off: ${off};
          --ct-bg: ${bg};
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
          inset: ${padding};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: ${resolveFont(c.font_family)};
          font-weight: ${c.font_weight || DEFAULTS.font_weight};
          font-size: ${fontSize}cqi;
          line-height: 1;
          user-select: none;
        }
        .row {
          display: flex;
          justify-content: space-between;
        }
        .l {
          flex: 1 1 0;
          text-align: center;
          color: var(--ct-off);
          transition: color 0.8s ease, text-shadow 0.8s ease;
        }
        .l.on {
          color: var(--ct-on);
          ${glow ? `text-shadow: 0 0 ${glow}em var(--ct-on);` : ""}
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
          ${glow ? `box-shadow: 0 0 ${glow * 4}cqi var(--ct-on);` : ""}
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
      this._form.computeLabel = (s) => s.title || LABELS[s.name] || s.name;
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
    const data = { ...DEFAULTS, ...this._config };
    for (const key of ["color_on", "color_off", "background"]) data[key] = toRgb(data[key]);
    if (typeof data.padding === "string") data.padding = parseFloat(data.padding) || DEFAULTS.padding;
    this._form.data = data;
  }
}

const LABELS = {
  font_family: "Schriftart",
  font_size: "Schriftgröße (%)",
  font_weight: "Schriftstärke",
  color_on: "Farbe aktive Buchstaben",
  color_off: "Farbe inaktive Buchstaben",
  off_opacity: "Deckkraft inaktive Buchstaben (%)",
  background: "Hintergrundfarbe",
  glow: "Leucht-Effekt",
  glow_strength: "Stärke Leucht-Effekt (%)",
  show_dots: "Minuten-Punkte in den Ecken",
  show_es_ist: "„ES IST“ anzeigen",
  rounded: "Abgerundete Ecken",
  padding: "Innenabstand (%)",
  dialect: "Viertel-Schreibweise",
  zwanzig: "20 / 40 Minuten",
};

const slider = (min, max, step = 1) => ({
  number: { min, max, step, mode: "slider", unit_of_measurement: "%" },
});

const SCHEMA = [
  {
    type: "expandable",
    name: "schrift",
    flatten: true,
    title: "Schrift",
    icon: "mdi:format-font",
    expanded: true,
    schema: [
      {
        name: "font_family",
        selector: {
          select: {
            mode: "dropdown",
            custom_value: true,
            options: [
              ...Object.keys(FONT_STACKS).map((f) => ({ value: f, label: f })),
              ...GOOGLE_FONTS.map((f) => ({ value: f, label: `${f} (Google Fonts)` })),
            ],
          },
        },
      },
      { name: "font_size", selector: slider(50, 130) },
      {
        name: "font_weight",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "100", label: "Hauchdünn (100)" },
              { value: "200", label: "Extra leicht (200)" },
              { value: "300", label: "Leicht (300)" },
              { value: "400", label: "Normal (400)" },
              { value: "500", label: "Mittel (500)" },
              { value: "600", label: "Halbfett (600)" },
              { value: "700", label: "Fett (700)" },
              { value: "900", label: "Extra fett (900)" },
            ],
          },
        },
      },
    ],
  },
  {
    type: "expandable",
    name: "farben",
    flatten: true,
    title: "Farben",
    icon: "mdi:palette",
    schema: [
      { name: "color_on", selector: { color_rgb: {} } },
      { name: "color_off", selector: { color_rgb: {} } },
      { name: "off_opacity", selector: slider(0, 100) },
      { name: "background", selector: { color_rgb: {} } },
      { name: "glow", selector: { boolean: {} } },
      { name: "glow_strength", selector: slider(0, 100) },
    ],
  },
  {
    type: "expandable",
    name: "anzeige",
    flatten: true,
    title: "Anzeige",
    icon: "mdi:cog",
    schema: [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "show_dots", selector: { boolean: {} } },
          { name: "show_es_ist", selector: { boolean: {} } },
          { name: "rounded", selector: { boolean: {} } },
        ],
      },
      { name: "padding", selector: slider(0, 20) },
    ],
  },
  {
    type: "expandable",
    name: "sprache",
    flatten: true,
    title: "Sprechweise",
    icon: "mdi:message-text-clock",
    schema: [
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

if (typeof module !== "undefined") module.exports = { computeWords, wordsToText, toCss, toRgb, resolveFont };
