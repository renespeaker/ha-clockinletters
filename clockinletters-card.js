/**
 * Clock in Letters – Wortuhr-Karte für Home Assistant (Lovelace)
 *
 * Zeigt die Uhrzeit als leuchtende Wörter in einem 11x10 Buchstabenraster,
 * plus vier Eck-Punkte für die Minuten zwischen den 5-Minuten-Schritten.
 */

const CARD_VERSION = "1.3.0";

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
  theme: "schwarz", // Farb-Vorlage, siehe THEMES
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
  realistic: true, // Oberfläche, Lichtreflex und LED-Leuchten wie bei einer echten Wortuhr
  finish: "auto", // Oberfläche: auto (passend zur Vorlage), glanz, gebuerstet, matt, holz, rost, flach
  wall_mount: false, // Uhr schwebt mit Schatten auf der Karte wie an der Wand
};

// Farb-Vorlagen: setzen Farben, Deckkraft und Leucht-Effekt.
// Einzelne Werte in der Konfiguration überschreiben die Vorlage.
const THEMES = {
  schwarz: {
    finish: "glanz",
    label: "⚫ Schwarz",
    values: { background: [17, 17, 17], color_on: [255, 255, 255], color_off: [255, 255, 255], off_opacity: 15, glow: true, glow_strength: 35 },
  },
  weiss: {
    finish: "glanz",
    label: "⚪ Weiß",
    values: { background: [242, 241, 237], color_on: [25, 25, 25], color_off: [0, 0, 0], off_opacity: 10, glow: false, glow_strength: 35 },
  },
  messing: {
    finish: "gebuerstet",
    label: "🟡 Messing",
    values: { background: [168, 134, 58], color_on: [22, 20, 16], color_off: [0, 0, 0], off_opacity: 15, glow: false, glow_strength: 35 },
  },
  gold: {
    finish: "glanz",
    label: "✨ Gold auf Schwarz",
    values: { background: [20, 18, 14], color_on: [240, 196, 90], color_off: [240, 196, 90], off_opacity: 12, glow: true, glow_strength: 45 },
  },
  kupfer: {
    finish: "gebuerstet",
    label: "🟠 Kupfer",
    values: { background: [150, 82, 48], color_on: [255, 240, 222], color_off: [0, 0, 0], off_opacity: 18, glow: true, glow_strength: 25 },
  },
  edelstahl: {
    finish: "gebuerstet",
    label: "🔘 Edelstahl",
    values: { background: [170, 174, 178], color_on: [18, 18, 18], color_off: [0, 0, 0], off_opacity: 12, glow: false, glow_strength: 35 },
  },
  walnuss: {
    finish: "holz",
    label: "🟤 Walnuss",
    values: { background: [86, 58, 38], color_on: [255, 214, 150], color_off: [0, 0, 0], off_opacity: 25, glow: true, glow_strength: 35 },
  },
  rot: {
    finish: "glanz",
    label: "🔴 Rot",
    values: { background: [165, 22, 32], color_on: [255, 255, 255], color_off: [0, 0, 0], off_opacity: 20, glow: true, glow_strength: 30 },
  },
  nachtblau: {
    finish: "matt",
    label: "🔵 Nachtblau",
    values: { background: [10, 25, 45], color_on: [120, 200, 255], color_off: [255, 255, 255], off_opacity: 10, glow: true, glow_strength: 60 },
  },
  matrix: {
    finish: "matt",
    label: "🟢 Matrix",
    values: { background: [4, 14, 6], color_on: [70, 255, 120], color_off: [70, 255, 120], off_opacity: 10, glow: true, glow_strength: 50 },
  },
  rost: {
    finish: "rost",
    label: "🧱 Rost",
    values: { background: [122, 62, 30], color_on: [255, 236, 212], color_off: [20, 8, 0], off_opacity: 30, glow: true, glow_strength: 35 },
  },
  pink: {
    finish: "glanz",
    label: "🩷 Pink",
    values: { background: [225, 85, 145], color_on: [255, 255, 255], color_off: [0, 0, 0], off_opacity: 15, glow: true, glow_strength: 30 },
  },
  ha: {
    finish: "matt",
    label: "🏠 Home-Assistant-Theme",
    values: {
      background: "var(--ha-card-background, var(--card-background-color))",
      color_on: "var(--primary-color)",
      color_off: "var(--primary-text-color)",
      off_opacity: 12,
      glow: true,
      glow_strength: 30,
    },
  },
};
// Oberflächen als SVG-Rauschen (keine Bilddateien nötig)
function noise(baseFrequency, octaves, alpha, size = 400) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='${octaves}' stitchTiles='stitch'/>` +
    `<feColorMatrix values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 ${alpha}'/></filter>` +
    `<rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

const FINISHES = {
  flach: "",
  glanz: "",
  matt: `background-image: ${noise("0.8", 2, 0.35, 200)}; background-blend-mode: soft-light;`,
  gebuerstet: `
    background-image: linear-gradient(100deg, rgba(255,255,255,0.18), rgba(0,0,0,0.12) 35%, rgba(255,255,255,0.14) 60%, rgba(0,0,0,0.18)),
      ${noise("0.0015 0.9", 3, 0.6)};
    background-size: 100% 100%, 400px 400px;
    background-blend-mode: soft-light, overlay;`,
  holz: `
    background-image: ${noise("0.004 0.09", 4, 1, 500)}, ${noise("0.02 0.5", 2, 0.6, 300)};
    background-blend-mode: overlay, soft-light;`,
  rost: `
    background-image: ${noise("0.012", 5, 1, 500)}, ${noise("0.09", 4, 0.8, 300)},
      radial-gradient(circle at 30% 25%, rgba(200, 110, 40, 0.5), transparent 60%);
    background-blend-mode: overlay, soft-light, normal;`,
};

const SHEENS = {
  glanz:
    "linear-gradient(125deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0) 38.5%, rgba(255,255,255,0) 100%)",
  gebuerstet: "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 45%, rgba(0,0,0,0.12))",
  matt: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.06), rgba(0,0,0,0.12) 90%)",
  holz: "linear-gradient(160deg, rgba(255,255,255,0.07), rgba(0,0,0,0.15))",
  rost: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05), rgba(0,0,0,0.25) 95%)",
};

function resolveFinish(config) {
  if (config.finish && config.finish !== "auto") return config.finish;
  const theme = THEMES[config.theme];
  return (theme && theme.finish) || "glanz";
}

const THEME_KEYS = ["background", "color_on", "color_off", "off_opacity", "glow", "glow_strength"];

/** Konfiguration mit Standardwerten und Farb-Vorlage zusammenführen. */
function withTheme(config) {
  const theme = THEMES[(config && config.theme) || DEFAULTS.theme];
  return { ...DEFAULTS, ...(theme ? theme.values : {}), ...(config || {}) };
}

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
    this._config = withTheme(config);
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
    const realistic = c.realistic !== false;
    const finish = realistic ? resolveFinish(c) : "flach";
    const wall = realistic && c.wall_mount;

    const letters = GRID.map(
      (row, r) =>
        `<div class="row">${[...row]
          .map((ch, i) => `<span class="l" data-r="${r}" data-c="${i}">${ch}</span>`)
          .join("")}</div>`
    ).join("");

    const dots = c.show_dots
      ? [1, 2, 3, 4].map((n) => `<span class="dot d${n}"></span>`).join("")
      : "";

    // Leuchten: im realistischen Modus mehrlagig wie eine hinterleuchtete LED
    const letterGlow = !glow
      ? ""
      : realistic
        ? `text-shadow: 0 0 ${0.06 + glow * 0.08}em var(--ct-on), 0 0 ${glow * 0.3}em var(--ct-on),
             0 0 ${glow * 0.8}em color-mix(in srgb, var(--ct-on) 55%, transparent);`
        : `text-shadow: 0 0 ${glow}em var(--ct-on);`;

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
          overflow: hidden;
          ${wall ? "" : "background: var(--ct-bg);"}
          ${c.rounded ? "" : "border-radius: 0;"}
        }
        .wrap {
          padding: ${wall ? "8%" : "0"};
        }
        .face {
          position: relative;
          aspect-ratio: 1 / 1;
          width: 100%;
          container-type: inline-size;
          box-sizing: border-box;
          background-color: var(--ct-bg);
          ${FINISHES[finish] || ""}
          ${
            wall
              ? `border-radius: 0.4cqi;
                 box-shadow: 0 0.6cqi 1.2cqi rgba(0, 0, 0, 0.35), 0 3cqi 6cqi rgba(0, 0, 0, 0.35);`
              : ""
          }
        }
        ${
          realistic
            ? `
        /* Kanten-Licht und Lichtreflex auf der Frontplatte */
        .face::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 2;
          box-shadow: inset 0 0.25cqi 0 rgba(255, 255, 255, 0.14), inset 0 -0.35cqi 0.6cqi rgba(0, 0, 0, 0.3),
            inset 0 0 8cqi rgba(0, 0, 0, 0.18);
          background: ${SHEENS[finish] || "none"};
        }`
            : ""
        }
        .grid {
          position: absolute;
          inset: ${padding};
          z-index: 1;
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
          position: relative;
          flex: 1 1 0;
          text-align: center;
          color: var(--ct-off);
          transition: color 1s ease, text-shadow 1s ease;
          ${realistic ? "text-shadow: 0 0.03em 0 rgba(255, 255, 255, 0.07), 0 -0.03em 0 rgba(0, 0, 0, 0.25);" : ""}
        }
        .l.on {
          color: ${realistic ? "color-mix(in srgb, var(--ct-on) 85%, white)" : "var(--ct-on)"};
          ${letterGlow}
        }
        ${
          realistic && glow
            ? `
        /* Licht, das hinter dem Buchstaben auf die Platte strahlt */
        .l::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 2.2em;
          height: 2.2em;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(closest-side, color-mix(in srgb, var(--ct-on) 45%, transparent), transparent);
          opacity: 0;
          z-index: -1;
          transition: opacity 1s ease;
          pointer-events: none;
        }
        .l.on::before {
          opacity: ${Math.min(1, glow * 0.9)};
        }`
            : ""
        }
        .dot {
          position: absolute;
          z-index: 1;
          width: 1.4cqi;
          height: 1.4cqi;
          border-radius: 50%;
          background: var(--ct-off);
          transition: background 1s ease, box-shadow 1s ease;
          ${realistic ? "box-shadow: inset 0 0.2cqi 0.3cqi rgba(0, 0, 0, 0.5), 0 0.1cqi 0 rgba(255, 255, 255, 0.1);" : ""}
        }
        .dot.on {
          background: ${realistic ? "color-mix(in srgb, var(--ct-on) 85%, white)" : "var(--ct-on)"};
          ${glow ? `box-shadow: 0 0 ${glow * 1.5}cqi var(--ct-on), 0 0 ${glow * 4}cqi var(--ct-on);` : ""}
        }
        .d1 { top: 3.3cqi; left: 3.3cqi; }
        .d2 { top: 3.3cqi; right: 3.3cqi; }
        .d3 { bottom: 3.3cqi; right: 3.3cqi; }
        .d4 { bottom: 3.3cqi; left: 3.3cqi; }
      </style>
      <ha-card>
        <div class="wrap">
          <div class="face" role="img">
            ${dots}
            <div class="grid">${letters}</div>
          </div>
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
        const config = { ...ev.detail.value };
        const prevTheme = (this._config && this._config.theme) || DEFAULTS.theme;
        const theme = THEMES[config.theme];
        if (config.theme !== prevTheme && theme) {
          // Neue Vorlage gewählt: deren Farben übernehmen
          Object.assign(config, theme.values);
        } else if (theme && THEME_KEYS.some((k) => !sameValue(config[k], theme.values[k]))) {
          // Farbe von Hand geändert: Vorlage auf "Eigene Farben" stellen
          config.theme = "eigene";
        }
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config },
            bubbles: true,
            composed: true,
          })
        );
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = SCHEMA;
    const data = withTheme(this._config);
    for (const key of ["color_on", "color_off", "background"]) data[key] = toRgb(data[key]);
    if (typeof data.padding === "string") data.padding = parseFloat(data.padding) || DEFAULTS.padding;
    this._form.data = data;
  }
}

function sameValue(a, b) {
  return JSON.stringify(toRgb(a)) === JSON.stringify(toRgb(b));
}

const LABELS = {
  theme: "Farb-Vorlage",
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
  realistic: "Realistische Darstellung",
  finish: "Oberfläche",
  wall_mount: "An der Wand (mit Schatten)",
  dialect: "Viertel-Schreibweise",
  zwanzig: "20 / 40 Minuten",
};

const slider = (min, max, step = 1) => ({
  number: { min, max, step, mode: "slider", unit_of_measurement: "%" },
});

const SCHEMA = [
  {
    name: "theme",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          ...Object.entries(THEMES).map(([value, t]) => ({ value, label: t.label })),
          { value: "eigene", label: "🎨 Eigene Farben" },
        ],
      },
    },
  },
  {
    type: "expandable",
    name: "look",
    flatten: true,
    title: "Material & Look",
    icon: "mdi:texture-box",
    expanded: true,
    schema: [
      { name: "realistic", selector: { boolean: {} } },
      {
        name: "finish",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "auto", label: "Automatisch (passend zur Farb-Vorlage)" },
              { value: "glanz", label: "Hochglanz (Acryl)" },
              { value: "gebuerstet", label: "Gebürstetes Metall" },
              { value: "matt", label: "Matt" },
              { value: "holz", label: "Holz" },
              { value: "rost", label: "Rost-Patina" },
              { value: "flach", label: "Flach (ohne Struktur)" },
            ],
          },
        },
      },
      { name: "wall_mount", selector: { boolean: {} } },
    ],
  },
  {
    type: "expandable",
    name: "schrift",
    flatten: true,
    title: "Schrift",
    icon: "mdi:format-font",
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

if (typeof module !== "undefined") module.exports = { computeWords, wordsToText, toCss, toRgb, resolveFont, withTheme, THEMES };
