/**
 * Clock in Letters – Wortuhr-Karte für Home Assistant (Lovelace)
 *
 * Zeigt die Uhrzeit als leuchtende Wörter in einem 11x10 Buchstabenraster,
 * plus vier Eck-Punkte für die Minuten zwischen den 5-Minuten-Schritten.
 */

const CARD_VERSION = "1.9.0";

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
  language: "de", // de oder en
  font_family: "Barlow",
  font_size: 85, // in % der Standardgröße
  font_weight: "400",
  rounded: true,
  padding: 16, // Innenabstand in %
  realistic: true, // Oberfläche, Lichtreflex und LED-Leuchten wie bei einer echten Wortuhr
  finish: "auto", // Oberfläche: auto (passend zur Vorlage), glanz, gebuerstet, matt, holz, rost, flach
  wall_mount: false, // Uhr schwebt mit Schatten auf der Karte wie an der Wand
  view_3d: false, // schräge Ansicht mit sichtbarer Plattenkante
  stencil: true, // Stege in O, Ö, Q, D wie bei ausgefrästen Buchstaben
  fit_screen: true, // Uhr nie höher als der Bildschirm (wichtig bei Panel-Ansicht / großen Monitoren)
  tap_action: "fullscreen", // fullscreen: Vollbild ein/aus – info: Datum & Werte zeigen – none: nichts
  double_tap_action: "info", // dasselbe für Doppeltippen
  info_entities: [], // Werte, die bei "info" angezeigt werden (z. B. Temperatur)
  info_duration: 8, // Sekunden, bis wieder die Uhr erscheint
  // Größe & Position
  custom_size: false, // false: quadratisch und automatisch – true: Breite/Höhe frei
  width: 100,
  width_unit: "%", // % (der Kartenbreite) oder px
  height: 100,
  height_unit: "vh", // vh (% der Bildschirmhöhe) oder px
  offset_x: 0, // Verschiebung nach rechts in px (negativ = links)
  offset_y: 0, // Verschiebung nach unten in px (negativ = oben)
  fullscreen_background: [0, 0, 0], // Hintergrund im Vollbild
  keep_awake: true, // Bildschirm im Vollbild nicht ausschalten (wenn der Browser es unterstützt)
  // Uhrzeit
  time_zone: "auto", // auto: wie im HA-Benutzerprofil – server: Zeitzone von HA – local: Zeitzone des Geräts
  sync_server_time: true, // falsch gehende Geräte-Uhr mit der Uhr des HA-Servers abgleichen
  // Nachtmodus
  night_mode: "off", // off, sun (nach Sonnenuntergang), time (Zeitfenster), entity (Entität ist "on")
  night_start: "22:00",
  night_end: "06:30",
  night_entity: "",
  night_brightness: 35, // Helligkeit nachts in %
  night_hide_unlit: false, // nachts nur die leuchtenden Buchstaben zeigen
  presence_entity: "", // z. B. Bewegungsmelder: ist er aus, wird gedimmt wie nachts
  // Darstellung beim Minutenwechsel
  transition: "cascade", // cascade: Buchstabe für Buchstabe – fade: alle gleichzeitig – none: sofort
  burn_in_protection: false, // Uhr jede Minute minimal verschieben (Dauerbetrieb, OLED)
  // Farbe aus Home Assistant
  color_entity: "", // Licht-Entität: leuchtende Buchstaben übernehmen deren Farbe
  alert_entities: [], // ist eine davon aktiv (an/offen/ausgelöst), leuchtet die Uhr in alert_color
  alert_color: [255, 45, 45],
  alert_pulse: true,
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
  oliv: {
    finish: "matt",
    label: "🫒 Oliv",
    values: { background: [76, 75, 45], color_on: [255, 255, 255], color_off: [232, 230, 218], off_opacity: 45, glow: true, glow_strength: 18 },
  },
  anthrazit: {
    finish: "matt",
    label: "⬛ Anthrazit",
    values: { background: [52, 54, 56], color_on: [255, 255, 255], color_off: [230, 230, 230], off_opacity: 38, glow: true, glow_strength: 18 },
  },
  messing: {
    finish: "gebuerstet",
    label: "🟡 Messing",
    values: { background: [158, 126, 60], color_on: [255, 255, 255], color_off: [250, 246, 235], off_opacity: 60, glow: true, glow_strength: 25 },
  },
  gold: {
    finish: "glanz",
    label: "✨ Gold auf Schwarz",
    values: { background: [20, 18, 14], color_on: [240, 196, 90], color_off: [240, 196, 90], off_opacity: 12, glow: true, glow_strength: 45 },
  },
  kupfer: {
    finish: "gebuerstet",
    label: "🟠 Kupfer",
    values: { background: [140, 76, 44], color_on: [255, 255, 255], color_off: [250, 240, 230], off_opacity: 50, glow: true, glow_strength: 25 },
  },
  edelstahl: {
    finish: "gebuerstet",
    label: "🔘 Edelstahl",
    values: { background: [150, 154, 158], color_on: [255, 255, 255], color_off: [250, 250, 250], off_opacity: 60, glow: true, glow_strength: 25 },
  },
  walnuss: {
    finish: "holz",
    label: "🟤 Walnuss",
    values: { background: [86, 58, 38], color_on: [255, 236, 200], color_off: [245, 235, 220], off_opacity: 45, glow: true, glow_strength: 30 },
  },
  rot: {
    finish: "glanz",
    label: "🔴 Rot",
    values: { background: [150, 24, 32], color_on: [255, 255, 255], color_off: [250, 230, 230], off_opacity: 35, glow: true, glow_strength: 25 },
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
    values: { background: [122, 62, 30], color_on: [255, 244, 230], color_off: [245, 232, 220], off_opacity: 50, glow: true, glow_strength: 30 },
  },
  pink: {
    finish: "glanz",
    label: "🩷 Pink",
    values: { background: [214, 84, 140], color_on: [255, 255, 255], color_off: [255, 240, 246], off_opacity: 40, glow: true, glow_strength: 25 },
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
  matt: `background-image: ${noise("1.2", 2, 0.55, 200)}, ${noise("0.01", 3, 0.35, 500)};
    background-size: calc(60 * var(--u, 1cqi)) calc(60 * var(--u, 1cqi)), calc(150 * var(--u, 1cqi)) calc(150 * var(--u, 1cqi));
    background-blend-mode: soft-light, soft-light;`,
  gebuerstet: `
    background-image: linear-gradient(100deg, rgba(255,255,255,0.18), rgba(0,0,0,0.12) 35%, rgba(255,255,255,0.14) 60%, rgba(0,0,0,0.18)),
      ${noise("0.0015 0.9", 3, 0.6)};
    background-size: 100% 100%, calc(120 * var(--u, 1cqi)) calc(120 * var(--u, 1cqi));
    background-blend-mode: soft-light, overlay;`,
  holz: `
    background-image: ${noise("0.004 0.09", 4, 1, 500)}, ${noise("0.02 0.5", 2, 0.6, 300)};
    background-size: calc(150 * var(--u, 1cqi)) calc(150 * var(--u, 1cqi)), calc(90 * var(--u, 1cqi)) calc(90 * var(--u, 1cqi));
    background-blend-mode: overlay, soft-light;`,
  rost: `
    background-image: ${noise("0.012", 5, 1, 500)}, ${noise("0.09", 4, 0.8, 300)},
      radial-gradient(circle at 30% 25%, rgba(200, 110, 40, 0.5), transparent 60%);
    background-size: calc(150 * var(--u, 1cqi)) calc(150 * var(--u, 1cqi)), calc(90 * var(--u, 1cqi)) calc(90 * var(--u, 1cqi)), 100% 100%;
    background-blend-mode: overlay, soft-light, normal;`,
};

const SHEENS = {
  glanz:
    "linear-gradient(125deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0) 38.5%, rgba(255,255,255,0) 100%)",
  gebuerstet: "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 45%, rgba(0,0,0,0.12))",
  matt: "radial-gradient(ellipse at 85% 12%, rgba(255,255,255,0.14), rgba(255,255,255,0) 55%), radial-gradient(circle at 20% 90%, rgba(0,0,0,0.15), rgba(0,0,0,0) 60%)",
  holz: "linear-gradient(160deg, rgba(255,255,255,0.07), rgba(0,0,0,0.15))",
  rost: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05), rgba(0,0,0,0.25) 95%)",
};

function resolveFinish(config) {
  if (config.finish && config.finish !== "auto") return config.finish;
  const theme = THEMES[config.theme];
  return (theme && theme.finish) || "glanz";
}

// Buchstaben mit geschlossenem Innenraum bekommen Stege
function realisticOn(c) {
  return c.realistic !== false;
}

const STENCIL_CHARS = ["O", "Ö", "Q", "D"];

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
  "Barlow",
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
    return `'${name}', ${FONT_STACKS["Helvetica Neue"]}`;
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

/** Stunden/Minuten/Sekunden einer Zeit in einer bestimmten Zeitzone (null = Gerät). */
const _tzFormats = {};
function wallClock(date, timeZone) {
  if (!timeZone) return { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds() };
  try {
    const fmt =
      _tzFormats[timeZone] ||
      (_tzFormats[timeZone] = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hourCycle: "h23",
      }));
    const parts = {};
    for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;
    return { h: Number(parts.hour) % 24, m: Number(parts.minute), s: Number(parts.second) };
  } catch (e) {
    return { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds() }; // unbekannte Zeitzone
  }
}

/** "22:00" / "22:00:00" -> Minuten seit Mitternacht */
function parseTime(value, fallback) {
  const m = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  return m ? (Number(m[1]) % 24) * 60 + Number(m[2]) : fallback;
}

/** Liegt die Minute des Tages im Nachtfenster? (Fenster darf über Mitternacht gehen) */
function inTimeWindow(minuteOfDay, start, end) {
  if (start === end) return false;
  return start < end ? minuteOfDay >= start && minuteOfDay < end : minuteOfDay >= start || minuteOfDay < end;
}

// Zustände, die als "aktiv" gelten (Alarm-Entitäten, Bewegungsmelder)
const ACTIVE_STATES = ["on", "open", "opening", "triggered", "pending", "arming", "unlocked", "detected", "home", "problem", "true"];
const isActive = (state) => ACTIVE_STATES.includes(String(state).toLowerCase());

// Kleine Verschiebungen gegen Einbrennen (in % der Uhrbreite), eine pro Minute
const BURN_IN_SHIFTS = [
  [0, 0], [0.6, 0.2], [0.3, 0.7], [-0.4, 0.5], [-0.7, -0.1], [-0.3, -0.6], [0.4, -0.5], [0.7, 0.1],
  [0.2, 0.4], [-0.2, 0.2], [-0.5, -0.4], [0.1, -0.3],
];

/* Farben in JS mischen statt mit CSS color-mix() – das können ältere Browser
   (z. B. Kiosk-Browser auf Wandmonitoren, Chrome < 111) nicht. */
const rgb = (c) => `rgb(${c.map(Math.round).join(", ")})`;
const rgba = (c, a) => `rgba(${c.map(Math.round).join(", ")}, ${a})`;
const mixRgb = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

/** Farbton/Sättigung (wie von HA-Lampen) -> [r, g, b] bei voller Helligkeit */
function hsToRgb(h, s) {
  s = Math.max(0, Math.min(100, s)) / 100;
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return 255 * (1 - s * Math.max(0, Math.min(k, 4 - k, 1)));
  };
  return [f(5), f(3), f(1)].map(Math.round);
}

function clamp(n, min, max, fallback) {
  const x = Number(n);
  return Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : fallback;
}

const GRID_EN = [
  "ITLISASAMPM",
  "ACQUARTERDC",
  "TWENTYFIVEX",
  "HALFSTENFTO",
  "PASTERUNINE",
  "ONESIXTHREE",
  "FOURFIVETWO",
  "EIGHTELEVEN",
  "SEVENTWELVE",
  "TENSEOCLOCK",
];

const WORDS_EN = {
  IT: [0, 0, 2],
  IS: [0, 3, 2],
  A: [1, 0, 1],
  QUARTER: [1, 2, 7],
  TWENTY: [2, 0, 6],
  M_FIVE: [2, 6, 4],
  HALF: [3, 0, 4],
  M_TEN: [3, 5, 3],
  TO: [3, 9, 2],
  PAST: [4, 0, 4],
  OCLOCK: [9, 5, 6],
};

const HOURS_EN = [
  [8, 5, 6], // 0/12 TWELVE
  [5, 0, 3], // 1 ONE
  [6, 8, 3], // 2 TWO
  [5, 6, 5], // 3 THREE
  [6, 0, 4], // 4 FOUR
  [6, 4, 4], // 5 FIVE
  [5, 3, 3], // 6 SIX
  [8, 0, 5], // 7 SEVEN
  [7, 0, 5], // 8 EIGHT
  [4, 7, 4], // 9 NINE
  [9, 0, 3], // 10 TEN
  [7, 5, 6], // 11 ELEVEN
];

function computeWordsEn(date, cfg) {
  const minute = date.getMinutes();
  const step = Math.floor(minute / 5);
  let hour = date.getHours() % 12;
  const w = WORDS_EN;
  const words = [];
  if (cfg.show_es_ist) words.push(w.IT, w.IS);
  const minuteWords = [
    [],
    [w.M_FIVE, w.PAST],
    [w.M_TEN, w.PAST],
    [w.A, w.QUARTER, w.PAST],
    [w.TWENTY, w.PAST],
    [w.TWENTY, w.M_FIVE, w.PAST],
    [w.HALF, w.PAST],
    [w.TWENTY, w.M_FIVE, w.TO],
    [w.TWENTY, w.TO],
    [w.A, w.QUARTER, w.TO],
    [w.M_TEN, w.TO],
    [w.M_FIVE, w.TO],
  ][step];
  words.push(...minuteWords);
  if (step > 6) hour = (hour + 1) % 12;
  words.push(HOURS_EN[hour]);
  if (step === 0) words.push(w.OCLOCK);
  return { words, dots: minute % 5 };
}

// ---------- Niederländisch ----------
const GRID_NL = [
  "HETKISAVIJF",
  "TIENZKWARTA",
  "VOOROVERZTP",
  "HALFEENTWEE",
  "DRIEVIERZES",
  "VIJFRZEVENT",
  "ACHTNEGENLA",
  "TIENSELFMOR",
  "TWAALFBXUUR",
  "GOEDEMORGEN",
];
const W_NL = {
  HET: [0, 0, 3], IS: [0, 4, 2], VIJF: [0, 7, 4], TIEN: [1, 0, 4], KWART: [1, 5, 5],
  VOOR: [2, 0, 4], OVER: [2, 4, 4], HALF: [3, 0, 4], UUR: [8, 8, 3],
};
const HOURS_NL = [
  [8, 0, 6], [3, 4, 3], [3, 7, 4], [4, 0, 4], [4, 4, 4], [5, 0, 4],
  [4, 8, 3], [5, 5, 5], [6, 0, 4], [6, 4, 5], [7, 0, 4], [7, 5, 3],
]; // TWAALF EEN TWEE DRIE VIER VIJF ZES ZEVEN ACHT NEGEN TIEN ELF

function computeWordsNl(date, cfg) {
  const minute = date.getMinutes();
  const step = Math.floor(minute / 5);
  const w = W_NL;
  const words = cfg.show_es_ist ? [w.HET, w.IS] : [];
  words.push(
    ...[
      [],
      [w.VIJF, w.OVER],
      [w.TIEN, w.OVER],
      [w.KWART, w.OVER],
      [w.TIEN, w.VOOR, w.HALF],
      [w.VIJF, w.VOOR, w.HALF],
      [w.HALF],
      [w.VIJF, w.OVER, w.HALF],
      [w.TIEN, w.OVER, w.HALF],
      [w.KWART, w.VOOR],
      [w.TIEN, w.VOOR],
      [w.VIJF, w.VOOR],
    ][step]
  );
  const hour = (date.getHours() + (step >= 4 ? 1 : 0)) % 12;
  words.push(HOURS_NL[hour]);
  if (step === 0) words.push(w.UUR);
  return { words, dots: minute % 5 };
}

// ---------- Französisch ----------
const GRID_FR = [
  "ILNESTODEUX",
  "QUATRETROIS",
  "NEUFUNESEPT",
  "HUITSIXCINQ",
  "MIDIXMINUIT",
  "ONZERHEURES",
  "MOINSOLEDIX",
  "ETRQUARTPMD",
  "VINGT-CINQU",
  "ETSDEMIEPAM",
];
const W_FR = {
  IL: [0, 0, 2], EST: [0, 3, 3], MIDI: [4, 0, 4], MINUIT: [4, 5, 6], HEURE: [5, 5, 5], HEURES: [5, 5, 6],
  MOINS: [6, 0, 5], LE: [6, 6, 2], DIX: [6, 8, 3], ET_QUART: [7, 0, 2], QUART: [7, 3, 5],
  VINGT: [8, 0, 5], VINGT_CINQ: [8, 0, 10], CINQ: [8, 6, 4], ET_DEMIE: [9, 0, 2], DEMIE: [9, 3, 5], DEMI: [9, 3, 4],
};
const HOURS_FR = [
  null, [2, 4, 3], [0, 7, 4], [1, 6, 5], [1, 0, 6], [3, 7, 4],
  [3, 4, 3], [2, 7, 4], [3, 0, 4], [2, 0, 4], [4, 2, 3], [5, 0, 4],
]; // – UNE DEUX TROIS QUATRE CINQ SIX SEPT HUIT NEUF DIX ONZE

function computeWordsFr(date, cfg) {
  const minute = date.getMinutes();
  const step = Math.floor(minute / 5);
  const w = W_FR;
  const words = cfg.show_es_ist ? [w.IL, w.EST] : [];
  const hour24 = (date.getHours() + (step > 6 ? 1 : 0)) % 24;
  const noonOrMidnight = hour24 % 12 === 0;
  if (hour24 === 0) words.push(w.MINUIT);
  else if (hour24 === 12) words.push(w.MIDI);
  else {
    const h = hour24 % 12;
    words.push(HOURS_FR[h], h === 1 ? w.HEURE : w.HEURES);
  }
  words.push(
    ...[
      [],
      [w.CINQ],
      [w.DIX],
      [w.ET_QUART, w.QUART],
      [w.VINGT],
      [w.VINGT_CINQ],
      [w.ET_DEMIE, noonOrMidnight ? w.DEMI : w.DEMIE], // midi et demi, une heure et demie
      [w.MOINS, w.VINGT_CINQ],
      [w.MOINS, w.VINGT],
      [w.MOINS, w.LE, w.QUART],
      [w.MOINS, w.DIX],
      [w.MOINS, w.CINQ],
    ][step]
  );
  return { words, dots: minute % 5 };
}

// ---------- Spanisch ----------
const GRID_ES = [
  "ESONELASUNA",
  "DOSITRESAMB",
  "CUATROCINCO",
  "SEISASIETEN",
  "OCHONUEVEPM",
  "DIEZONCERDA",
  "DOCELYMENOS",
  "VEINTICINCO",
  "VEINTEDIEZA",
  "CUARTOMEDIA",
];
const W_ES = {
  ES: [0, 0, 2], SON: [0, 1, 3], LA: [0, 5, 2], LAS: [0, 5, 3], Y: [6, 5, 1], MENOS: [6, 6, 5],
  VEINTICINCO: [7, 0, 11], CINCO: [7, 6, 5], VEINTE: [8, 0, 6], DIEZ: [8, 6, 4], CUARTO: [9, 0, 6], MEDIA: [9, 6, 5],
};
const HOURS_ES = [
  [6, 0, 4], [0, 8, 3], [1, 0, 3], [1, 4, 4], [2, 0, 6], [2, 6, 5],
  [3, 0, 4], [3, 5, 5], [4, 0, 4], [4, 4, 5], [5, 0, 4], [5, 4, 4],
]; // DOCE UNA DOS TRES CUATRO CINCO SEIS SIETE OCHO NUEVE DIEZ ONCE

function computeWordsEs(date, cfg) {
  const minute = date.getMinutes();
  const step = Math.floor(minute / 5);
  const w = W_ES;
  const hour = (date.getHours() + (step > 6 ? 1 : 0)) % 12;
  const words = [];
  if (cfg.show_es_ist) words.push(...(hour === 1 ? [w.ES, w.LA] : [w.SON, w.LAS]));
  words.push(HOURS_ES[hour]);
  words.push(
    ...[
      [],
      [w.Y, w.CINCO],
      [w.Y, w.DIEZ],
      [w.Y, w.CUARTO],
      [w.Y, w.VEINTE],
      [w.Y, w.VEINTICINCO],
      [w.Y, w.MEDIA],
      [w.MENOS, w.VEINTICINCO],
      [w.MENOS, w.VEINTE],
      [w.MENOS, w.CUARTO],
      [w.MENOS, w.DIEZ],
      [w.MENOS, w.CINCO],
    ][step]
  );
  return { words, dots: minute % 5 };
}

const LAYOUTS = {
  de: { grid: GRID, compute: computeWordsDe, locale: "de-DE" },
  en: { grid: GRID_EN, compute: computeWordsEn, locale: "en-GB" },
  nl: { grid: GRID_NL, compute: computeWordsNl, locale: "nl-NL" },
  fr: { grid: GRID_FR, compute: computeWordsFr, locale: "fr-FR" },
  es: { grid: GRID_ES, compute: computeWordsEs, locale: "es-ES" },
};

function layoutOf(cfg) {
  return LAYOUTS[cfg && cfg.language] || LAYOUTS.de;
}

/** Liefert die zu leuchtenden Wörter und die Anzahl der Eck-Punkte. */
function computeWords(date, cfg) {
  return layoutOf(cfg).compute(date, cfg);
}

function computeWordsDe(date, cfg) {
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
function wordsToText(words, grid = GRID) {
  return words.map(([r, c, l]) => grid[r].substr(c, l)).join(" ");
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
    // HA-Theme gewechselt (z. B. hell/dunkel): Farben neu auflösen
    const key = hass && hass.themes ? `${hass.themes.theme}|${hass.themes.darkMode}` : "";
    if (key !== this._themeKey) {
      const changed = this._themeKey !== undefined;
      this._themeKey = key;
      if (changed && this.isConnected) this._render();
    }
    // Zeitzone geändert (z. B. HA-Daten kommen erst nach dem Anzeigen): sofort neu zeichnen
    const tz = this._timeZone();
    if (tz !== this._lastTz) {
      this._lastTz = tz;
      if (this._built) this._update();
    }
    // Nachtmodus nach Sonne/Entität sofort nachführen
    // Farbe aus HA (Lampe / Alarm) geändert -> neu zeichnen
    const dyn = JSON.stringify(this._dynamicColor());
    if (dyn !== this._dynKey) {
      const changed = this._dynKey !== undefined;
      this._dynKey = dyn;
      if (changed && this.isConnected) this._render();
    }
    if (this._built) this._applyNight();
    if (!this._synced && hass) {
      this._synced = true;
      this._syncServerTime();
    }
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
    if (!this._listening) {
      this._listening = true;
      this._onClick = () => {
        // Im Dashboard-Editor nichts auslösen
        if (this.preview || this.editMode || !this._config) return;
        const tap = this._config.tap_action || "none";
        const dbl = this._config.double_tap_action || "none";
        if (dbl === "none") return this._runAction(tap);
        // Doppeltippen erkennen: einfaches Tippen wartet kurz
        if (this._tapTimer) {
          clearTimeout(this._tapTimer);
          this._tapTimer = null;
          this._runAction(dbl);
        } else {
          this._tapTimer = setTimeout(() => {
            this._tapTimer = null;
            this._runAction(tap);
          }, 280);
        }
      };
      this._onKey = (ev) => {
        if (ev.key === "Escape" && this._fs) this._exitFullscreen();
      };
      this._onFsChange = () => {
        const el = document.fullscreenElement || document.webkitFullscreenElement;
        if (!el && this._fs && this._nativeFs) this._exitFullscreen();
      };
      // Nach Standby / Tab-Wechsel sofort die richtige Zeit zeigen
      this._onVisible = () => {
        if (document.visibilityState === "visible") {
          this._update();
          this._schedule();
          this._syncServerTime();
          if (this._fs) this._requestWakeLock();
        }
      };
      this.addEventListener("click", this._onClick);
      document.addEventListener("keydown", this._onKey);
      document.addEventListener("fullscreenchange", this._onFsChange);
      document.addEventListener("webkitfullscreenchange", this._onFsChange);
      document.addEventListener("visibilitychange", this._onVisible);
    }
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
    this._timer = null;
    if (this._ro) {
      this._ro.disconnect();
      this._ro = null;
    }
    clearTimeout(this._syncTimer);
    this._synced = false;
    if (this._listening) {
      this._listening = false;
      this.removeEventListener("click", this._onClick);
      document.removeEventListener("keydown", this._onKey);
      document.removeEventListener("fullscreenchange", this._onFsChange);
      document.removeEventListener("webkitfullscreenchange", this._onFsChange);
      document.removeEventListener("visibilitychange", this._onVisible);
    }
    if (this._fs) this._exitFullscreen();
  }

  _runAction(action) {
    if (action === "fullscreen") this._toggleFullscreen();
    else if (action === "info") this._toggleInfo();
  }

  /** Datum und ausgewählte Werte für ein paar Sekunden statt der Uhr zeigen */
  _toggleInfo(show = !this._infoShown) {
    clearTimeout(this._infoTimer);
    this._infoShown = show;
    if (!this._face) return;
    if (show) {
      this._fillInfo();
      const seconds = clamp(this._config.info_duration, 2, 120, DEFAULTS.info_duration);
      this._infoTimer = setTimeout(() => this._toggleInfo(false), seconds * 1000);
    }
    this._face.classList.toggle("show-info", show);
  }

  _fillInfo() {
    const box = this.shadowRoot && this.shadowRoot.querySelector(".info");
    if (!box) return;
    const c = this._config;
    const locale = layoutOf(c).locale;
    const tz = this._timeZone();
    const date = new Date(this._nowMs());
    const fmt = (opts) => {
      try {
        return new Intl.DateTimeFormat(locale, tz ? { ...opts, timeZone: tz } : opts).format(date);
      } catch (e) {
        return new Intl.DateTimeFormat(locale, opts).format(date);
      }
    };
    const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
    const lines = [
      `<div class="i-main">${esc(fmt({ weekday: "long" }))}</div>`,
      `<div class="i-sub">${esc(fmt({ day: "numeric", month: "long" }))}</div>`,
    ];
    const states = (this._hass && this._hass.states) || {};
    const ids = Array.isArray(c.info_entities) ? c.info_entities : c.info_entities ? [c.info_entities] : [];
    for (const id of ids) {
      const st = states[id];
      if (!st) continue;
      const name = (st.attributes && st.attributes.friendly_name) || id;
      let value;
      if (this._hass && typeof this._hass.formatEntityState === "function") {
        value = this._hass.formatEntityState(st);
      } else {
        const unit = (st.attributes && st.attributes.unit_of_measurement) || "";
        const num = Number(st.state);
        value = (Number.isFinite(num) && st.state !== "" ? num.toLocaleString(locale, { maximumFractionDigits: 1 }) : st.state) + (unit ? ` ${unit}` : "");
      }
      lines.push(`<div class="i-name">${esc(name)}</div><div class="i-value">${esc(value)}</div>`);
    }
    box.innerHTML = lines.join("");
  }

  _toggleFullscreen() {
    if (this._fs) this._exitFullscreen();
    else this._enterFullscreen();
  }

  _enterFullscreen() {
    this._fs = true;
    // Immer: Karte füllt das Fenster (funktioniert auch in der Companion-App und auf dem iPhone)
    this.classList.add("fs");
    // Zusätzlich echtes Vollbild, damit Browserleisten verschwinden
    const req = this.requestFullscreen || this.webkitRequestFullscreen;
    this._nativeFs = false;
    if (req) {
      try {
        const res = req.call(this, { navigationUI: "hide" });
        this._nativeFs = true;
        if (res && res.catch) res.catch(() => (this._nativeFs = false));
      } catch (e) {
        this._nativeFs = false;
      }
    }
    this._requestWakeLock();
  }

  _exitFullscreen() {
    this._fs = false;
    this.classList.remove("fs");
    const el = document.fullscreenElement || document.webkitFullscreenElement;
    if (el === this) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) Promise.resolve(exit.call(document)).catch(() => {});
    }
    this._nativeFs = false;
    if (this._wakeLock) {
      this._wakeLock.release().catch(() => {});
      this._wakeLock = null;
    }
  }

  async _requestWakeLock() {
    if (!this._config || !this._config.keep_awake || !navigator.wakeLock) return;
    try {
      this._wakeLock = await navigator.wakeLock.request("screen");
    } catch (e) {
      // z. B. ohne HTTPS nicht erlaubt – dann eben ohne
    }
  }

  /** Aktuelle Zeit: Geräte-Uhr + Abgleich mit dem Server */
  _nowMs() {
    return Date.now() + (this._offset || 0);
  }

  /** Zeitzone, in der die Uhr anzeigen soll (null = Gerät) */
  _timeZone() {
    const c = this._config || {};
    const hass = this._hass;
    const serverTz = hass && hass.config && hass.config.time_zone;
    if (c.time_zone === "server") return serverTz || null;
    if (c.time_zone === "local") return null;
    // auto: Einstellung im HA-Benutzerprofil (Zeitzone: Server oder lokal)
    return hass && hass.locale && hass.locale.time_zone === "server" ? serverTz || null : null;
  }

  /** Wanduhrzeit als Date (nur Stunde/Minute zählen) */
  _now() {
    const { h, m, s } = wallClock(new Date(this._nowMs()), this._timeZone());
    return new Date(2000, 0, 1, h, m, s);
  }

  /**
   * Abweichung der Geräte-Uhr bestimmen: Der HA-Server schickt bei jeder Antwort
   * seine Uhrzeit im HTTP-Header "Date" mit. Wird stündlich wiederholt.
   */
  async _syncServerTime() {
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this._syncServerTime(), 60 * 60 * 1000);
    if (!this._config || this._config.sync_server_time === false || !window.fetch) {
      this._offset = 0;
      return;
    }
    try {
      const t0 = Date.now();
      const res = await fetch("/manifest.json", { method: "HEAD", cache: "no-store" });
      const t1 = Date.now();
      const header = res.headers.get("date");
      if (!header) return;
      // Header hat nur Sekunden-Genauigkeit -> im Mittel +500 ms
      const offset = Date.parse(header) + 500 - (t0 + t1) / 2;
      if (!Number.isFinite(offset)) return;
      const previous = this._offset || 0;
      // Kleine Abweichungen ignorieren (Messungenauigkeit)
      this._offset = Math.abs(offset) > 3000 ? Math.round(offset) : 0;
      if (this._offset !== previous) {
        this._update();
        this._schedule();
      }
    } catch (e) {
      // z. B. Vorschau ohne Home Assistant – dann Geräte-Uhr
    }
  }

  _isNight() {
    const c = this._config || {};
    const hass = this._hass;
    switch (c.night_mode) {
      case "sun": {
        const sun = hass && hass.states && hass.states["sun.sun"];
        return !!sun && sun.state === "below_horizon";
      }
      case "time": {
        const now = this._now();
        const minute = now.getHours() * 60 + now.getMinutes();
        return inTimeWindow(minute, parseTime(c.night_start, 22 * 60), parseTime(c.night_end, 6 * 60 + 30));
      }
      case "entity": {
        const st = c.night_entity && hass && hass.states && hass.states[c.night_entity];
        return !!st && ["on", "true", "below_horizon", "night"].includes(String(st.state).toLowerCase());
      }
      default:
        return false;
    }
  }

  /** Anwesenheit: Bewegungsmelder o. Ä. aus -> dimmen */
  _isAbsent() {
    const c = this._config || {};
    const st = c.presence_entity && this._hass && this._hass.states && this._hass.states[c.presence_entity];
    return !!st && !isActive(st.state);
  }

  /** Farbe aus Home Assistant: Alarm > Lichtfarbe > null (eingestellte Farbe) */
  _dynamicColor() {
    const c = this._config || {};
    const states = (this._hass && this._hass.states) || {};
    const alerts = Array.isArray(c.alert_entities) ? c.alert_entities : c.alert_entities ? [c.alert_entities] : [];
    if (alerts.some((id) => states[id] && isActive(states[id].state))) {
      return { color: toRgb(c.alert_color) || DEFAULTS.alert_color, alert: true };
    }
    const light = c.color_entity && states[c.color_entity];
    if (light && light.state === "on") {
      const a = light.attributes || {};
      if (Array.isArray(a.rgb_color)) return { color: a.rgb_color, alert: false };
      if (Array.isArray(a.hs_color)) return { color: hsToRgb(a.hs_color[0], a.hs_color[1]), alert: false };
    }
    return null;
  }

  _applyNight() {
    if (!this._face) return;
    const night = this._isNight() || this._isAbsent();
    if (night !== this._night) {
      this._night = night;
      this._face.classList.toggle("night", night);
    }
  }

  _schedule() {
    clearTimeout(this._timer);
    const ms = 60000 - (this._nowMs() % 60000) + 50;
    this._timer = setTimeout(() => {
      this._update();
      this._schedule();
    }, ms);
  }

  _render() {
    if (!this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const c = this._config;
    const dynamic = this._dynamicColor();
    this._dynKey = JSON.stringify(dynamic);
    const on = dynamic ? toCss(dynamic.color) : toCss(c.color_on, DEFAULTS.color_on);
    const offBase = toCss(c.color_off, DEFAULTS.color_off);
    const offOpacity = clamp(c.off_opacity, 0, 100, DEFAULTS.off_opacity);
    const bg = toCss(c.background, DEFAULTS.background);
    // In echte RGB-Werte auflösen (auch var(--primary-color) & Co.)
    const onRgb = this._resolveRgb(on);
    const offRgb = this._resolveRgb(offBase);
    const bgRgb = this._resolveRgb(bg);
    const WHITE = [255, 255, 255];
    const BLACK = [0, 0, 0];
    const off = offRgb ? rgba(offRgb, offOpacity / 100) : `color-mix(in srgb, ${offBase} ${offOpacity}%, transparent)`;
    const onLit = realisticOn(c) && onRgb ? rgb(mixRgb(onRgb, WHITE, 0.15)) : "var(--ct-on)";
    const onSoft = (a) => (onRgb ? rgba(onRgb, a) : "var(--ct-on)");
    const edge = (t, a) => (bgRgb ? rgb(mixRgb(bgRgb, BLACK, t)) : `rgba(0, 0, 0, ${a})`);
    const fontSize = (6 * clamp(c.font_size, 30, 150, 100)) / 100;
    const glow = c.glow ? clamp(c.glow_strength, 0, 100, DEFAULTS.glow_strength) / 100 : 0;
    const padding = typeof c.padding === "string" ? c.padding : `${clamp(c.padding, 0, 25, 8)}%`;
    const realistic = c.realistic !== false;
    const finish = realistic ? resolveFinish(c) : "flach";
    const wall = realistic && c.wall_mount;
    const view3d = realistic && c.view_3d;
    const stencil = realistic && c.stencil !== false;
    const layout = layoutOf(c);
    const fit = c.fit_screen !== false;
    const framed = wall || view3d;
    const fsBg = toCss(c.fullscreen_background, DEFAULTS.fullscreen_background);
    // Freie Größe: Breite (X) und Höhe (Y) in % / px bzw. % Bildschirmhöhe / px
    const custom = !!c.custom_size;
    const sizeW = custom
      ? c.width_unit === "px"
        ? `${clamp(c.width, 50, 8000, 400)}px`
        : `${clamp(c.width, 5, 100, 100)}%`
      : "";
    const sizeH = custom
      ? c.height_unit === "px"
        ? `${clamp(c.height, 50, 8000, 400)}px`
        : `${clamp(c.height, 5, 100, 100)}vh`
      : "";
    const offX = clamp(c.offset_x, -4000, 4000, 0);
    const offY = clamp(c.offset_y, -4000, 4000, 0);

    const letters = layout.grid
      .map(
        (row, r) =>
          `<div class="row">${[...row]
            .map((ch, i) => {
              // O'CLOCK: Apostroph über dem O wie auf der echten Frontplatte
              const shown = layout === LAYOUTS.en && r === 9 && i === 5 ? "Ó" : ch;
              const inner = stencil && STENCIL_CHARS.includes(ch) ? `<i class="st">${shown}</i>` : shown;
              return `<span class="l">${inner}</span>`;
            })
            .join("")}</div>`
      )
      .join("");

    const dots = c.show_dots
      ? [1, 2, 3, 4].map((n) => `<span class="dot d${n}"></span>`).join("")
      : "";

    // Leuchten: im realistischen Modus mehrlagig wie eine hinterleuchtete LED
    const letterGlow = !glow
      ? ""
      : realistic
        ? `text-shadow: 0 0 ${0.06 + glow * 0.08}em var(--ct-on), 0 0 ${glow * 0.3}em var(--ct-on),
             0 0 ${glow * 0.8}em ${onSoft(0.55)};`
        : `text-shadow: 0 0 ${glow}em var(--ct-on);`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          ${(c.tap_action && c.tap_action !== "none") || (c.double_tap_action && c.double_tap_action !== "none") ? "cursor: pointer; -webkit-tap-highlight-color: transparent;" : ""}
          --ct-on: ${on};
          --ct-off: ${off};
          --ct-bg: ${bg};
        }
        ha-card {
          display: block;
          overflow: hidden;
          ${framed ? "" : "background: var(--ct-bg);"}
          ${c.rounded ? "" : "border-radius: 0;"}
        }
        .wrap {
          box-sizing: border-box;
          position: relative;
          padding: ${framed ? "8%" : "0"};
          margin: 0 auto;
          ${view3d ? "perspective: 1400px;" : ""}
          ${offX || offY ? `left: ${offX}px; top: ${offY}px;` : ""}
          ${custom ? `width: ${sizeW}; max-width: 100%;` : ""}
          /* Nie höher als der sichtbare Bildschirm (Kopfzeile von HA abgezogen) */
          ${
            fit && !custom
              ? `max-width: calc(100vh - var(--header-height, 56px) - 24px);
                 max-width: calc(100dvh - var(--header-height, 56px) - 24px);`
              : ""
          }
        }
        ${
          custom
            ? `
        /* Freie Höhe: Uhr ist nicht mehr quadratisch, die Buchstaben verteilen sich */
        .face {
          aspect-ratio: auto;
          height: ${c.height_unit === "px" ? sizeH : `calc(${sizeH} - (var(--header-height, 56px) + 16px) * ${clamp(c.height, 5, 100, 100) / 100})`};
        }`
            : ""
        }
        ${offX || offY ? "ha-card { overflow: visible; }" : ""}
        ${
          fit && !framed
            ? `
        /* Die Platte trägt ihre Farbe selbst – ist die Uhr schmaler als die Karte
           (Panel-Ansicht, breite Monitore), bleibt sie quadratisch und zentriert */
        ha-card {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .face {
          border-radius: ${c.rounded ? "var(--ha-card-border-radius, 12px)" : "0"};
          overflow: hidden;
        }`
            : ""
        }
        /* Info-Anzeige (Datum, Werte) statt der Uhr */
        .info {
          position: absolute;
          inset: ${padding};
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: ${resolveFont(c.font_family)};
          font-weight: ${c.font_weight || DEFAULTS.font_weight};
          text-transform: uppercase;
          color: ${onLit};
          ${glow ? `text-shadow: 0 0 ${glow * 0.3}em var(--ct-on);` : ""}
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s ease;
        }
        .info .i-main { font-size: calc(${fontSize * 1.2} * var(--u, 1cqi)); letter-spacing: 0.35em; margin-bottom: 0.4em; }
        .info .i-sub { font-size: calc(${fontSize} * var(--u, 1cqi)); letter-spacing: 0.3em; margin-bottom: 1.6em; }
        .info .i-name { font-size: calc(${fontSize * 0.5} * var(--u, 1cqi)); letter-spacing: 0.25em; color: var(--ct-off); text-shadow: none; margin-top: 1.2em; }
        .info .i-value { font-size: calc(${fontSize * 1.1} * var(--u, 1cqi)); letter-spacing: 0.15em; text-transform: none; }
        .face.show-info .grid { opacity: 0; }
        .face.show-info .info { opacity: 1; }
        /* Alarm: leuchtende Buchstaben pulsieren */
        ${
          dynamic && dynamic.alert && c.alert_pulse !== false
            ? `@keyframes ct-pulse { 50% { opacity: 0.35; } }
        .l.on, .dot.on { animation: ct-pulse 1.4s ease-in-out infinite; }`
            : ""
        }
        /* Schutz vor Einbrennen: Inhalt jede Minute minimal verschieben */
        .grid, .dot {
          transform: translate(calc(var(--shift-x, 0) * var(--u, 1cqi)), calc(var(--shift-y, 0) * var(--u, 1cqi)));
        }
        /* Nachtmodus: Uhr gedimmt, auf Wunsch nur die leuchtenden Buchstaben */
        .face {
          transition: filter 3s ease;
        }
        .face.night {
          filter: brightness(${clamp(c.night_brightness, 5, 100, DEFAULTS.night_brightness) / 100});
        }
        ${
          c.night_hide_unlit
            ? `.face.night .l:not(.on),
        .face.night .dot:not(.on) {
          color: transparent;
          text-shadow: none;
          background: transparent;
          box-shadow: none;
        }`
            : ""
        }
        /* Vollbild: Uhr zentriert, so groß wie möglich, auf jedem Bildschirm quadratisch */
        :host(.fs) {
          position: fixed;
          inset: 0;
          z-index: 10000;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: ${fsBg};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: none;
        }
        :host(.fs) ha-card {
          background: transparent;
          border: none;
          box-shadow: none;
          border-radius: 0;
          overflow: visible;
        }
        :host(.fs) .wrap {
          width: ${custom ? "94vw" : "min(94vw, 94vh)"};
          ${custom ? "" : "width: min(94vw, 94dvh);"}
          max-width: none;
          left: 0;
          top: 0;
          padding: ${framed ? "4%" : "0"};
        }
        ${custom ? ":host(.fs) .face { height: 94vh; height: 94dvh; }" : ""}
        :host(.fs) .face {
          border-radius: calc(0.4 * var(--u, 1cqi));
          ${framed ? "" : "box-shadow: 0 0 calc(6 * var(--u, 1cqi)) rgba(0, 0, 0, 0.5);"}
        }
        .face {
          position: relative;
          aspect-ratio: ${custom ? "auto" : "1 / 1"};
          width: 100%;
          container-type: inline-size;
          box-sizing: border-box;
          background-color: var(--ct-bg);
          ${FINISHES[finish] || ""}
          ${
            view3d
              ? `transform: rotateY(-16deg) rotateX(3deg) scale(0.94);
                 transform-origin: 60% 50%;
                 border-radius: calc(0.3 * var(--u, 1cqi));
                 box-shadow: calc(-0.4 * var(--u, 1cqi)) 0 0 ${edge(0.55, 0.55)},
                   calc(-0.8 * var(--u, 1cqi)) calc(0.1 * var(--u, 1cqi)) 0 ${edge(0.65, 0.65)},
                   calc(-1.2 * var(--u, 1cqi)) calc(0.2 * var(--u, 1cqi)) 0 ${edge(0.75, 0.75)},
                   calc(-3 * var(--u, 1cqi)) calc(3 * var(--u, 1cqi)) calc(6 * var(--u, 1cqi)) rgba(0, 0, 0, 0.45);`
              : wall
                ? `border-radius: calc(0.4 * var(--u, 1cqi));
                 box-shadow: 0 calc(0.6 * var(--u, 1cqi)) calc(1.2 * var(--u, 1cqi)) rgba(0, 0, 0, 0.35), 0 calc(3 * var(--u, 1cqi)) calc(6 * var(--u, 1cqi)) rgba(0, 0, 0, 0.35);`
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
          box-shadow: inset 0 calc(0.25 * var(--u, 1cqi)) 0 rgba(255, 255, 255, 0.14), inset 0 calc(-0.35 * var(--u, 1cqi)) calc(0.6 * var(--u, 1cqi)) rgba(0, 0, 0, 0.3),
            inset 0 0 calc(8 * var(--u, 1cqi)) rgba(0, 0, 0, 0.18);
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
          font-size: calc(${fontSize} * var(--u, 1cqi));
          line-height: 1;
          user-select: none;
          transition: transform 2s ease, opacity 0.6s ease;
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
          transition: ${c.transition === "none" ? "none" : "color 0.9s ease, text-shadow 0.9s ease"};
          ${realistic ? "text-shadow: -0.03em -0.03em 0 rgba(0, 0, 0, 0.3), 0.02em 0.02em 0 rgba(255, 255, 255, 0.06);" : ""}
        }
        .l.on {
          color: ${onLit};
          ${realistic ? "-webkit-text-stroke: 0.035em currentColor;" : ""}
          ${letterGlow}
        }
        ${
          stencil
            ? `
        /* Stege wie bei ausgefrästen Buchstaben: oben und unten im O ausgeschnitten.
           Das Innen-Element ist rundum 0.5em größer, damit der Leuchtschein nicht abgeschnitten wird. */
        .l i.st {
          display: inline-block;
          font-style: normal;
          padding: 0.5em;
          margin: -0.5em;
          --st-mask: linear-gradient(90deg, #000 calc(50% - 0.028em), transparent 0 calc(50% + 0.028em), #000 0),
            linear-gradient(#000 0 30%, transparent 30% 37%, #000 37% 63%, transparent 63% 70%, #000 70%);
          -webkit-mask-image: var(--st-mask);
          mask-image: var(--st-mask);
        }}`
            : ""
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
          background: radial-gradient(closest-side, ${onSoft(0.45)}, ${onSoft(0)});
          opacity: 0;
          z-index: -1;
          transition: opacity 1s ease;
          transition-delay: inherit; /* Leuchtschein folgt dem Buchstaben */
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
          width: calc(1.4 * var(--u, 1cqi));
          height: calc(1.4 * var(--u, 1cqi));
          border-radius: 50%;
          background: var(--ct-off);
          transition: ${c.transition === "none" ? "none" : "background 0.9s ease, box-shadow 0.9s ease, transform 2s ease"};
          ${realistic ? "box-shadow: inset 0 calc(0.2 * var(--u, 1cqi)) calc(0.3 * var(--u, 1cqi)) rgba(0, 0, 0, 0.5), 0 calc(0.1 * var(--u, 1cqi)) 0 rgba(255, 255, 255, 0.1);" : ""}
        }
        .dot.on {
          background: ${onLit};
          ${glow ? `box-shadow: 0 0 calc(${glow * 1.5} * var(--u, 1cqi)) var(--ct-on), 0 0 calc(${glow * 4} * var(--u, 1cqi)) var(--ct-on);` : ""}
        }
        .d1 { top: calc(3.3 * var(--u, 1cqi)); left: calc(3.3 * var(--u, 1cqi)); }
        .d2 { top: calc(3.3 * var(--u, 1cqi)); right: calc(3.3 * var(--u, 1cqi)); }
        .d3 { bottom: calc(3.3 * var(--u, 1cqi)); right: calc(3.3 * var(--u, 1cqi)); }
        .d4 { bottom: calc(3.3 * var(--u, 1cqi)); left: calc(3.3 * var(--u, 1cqi)); }
      </style>
      <ha-card>
        <div class="wrap">
          <div class="face" role="img">
            ${dots}
            <div class="grid">${letters}</div>
            <div class="info" aria-live="polite"></div>
          </div>
        </div>
      </ha-card>
    `;
    this._cells = [...this.shadowRoot.querySelectorAll(".l")];
    this._layout = layout;
    this._dots = [...this.shadowRoot.querySelectorAll(".dot")];
    this._face = this.shadowRoot.querySelector(".face");
    this._observeSize();
    if (this._infoShown) {
      this._fillInfo();
      this._face.classList.add("show-info");
    }
    this._night = undefined;
    this._prevLit = undefined;
    this._built = true;
    this._update();
  }

  /** --u = 1 % der Uhrbreite in px; alle Größen hängen daran (ohne Container-Queries). */
  _observeSize() {
    const face = this._face;
    // Bei freier Größe zählt die kürzere Seite, damit die Schrift immer passt
    const apply = (w, h) => {
      const side = h > 0 ? Math.min(w, h) : w;
      if (side > 0) face.style.setProperty("--u", `${side / 100}px`);
    };
    apply(face.offsetWidth, face.offsetHeight);
    if (this._ro) this._ro.disconnect();
    if (window.ResizeObserver) {
      this._ro = new ResizeObserver((entries) => apply(entries[0].contentRect.width, entries[0].contentRect.height));
      this._ro.observe(face);
    }
  }

  /** Beliebige CSS-Farbe (auch var(--…)) in [r, g, b] auflösen, sonst null. */
  _resolveRgb(value) {
    const direct = toRgb(value);
    if (Array.isArray(direct)) return direct;
    if (!this.shadowRoot) return null;
    const probe = document.createElement("span");
    probe.style.color = "rgb(1, 2, 3)";
    probe.style.color = value;
    this.shadowRoot.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();
    const parsed = toRgb(computed);
    return Array.isArray(parsed) ? parsed : null;
  }

  _update() {
    if (!this._built) return;
    const { words, dots } = computeWords(this._now(), this._config);
    const lit = new Set();
    for (const [r, c, l] of words) {
      for (let i = c; i < c + l; i++) lit.add(r * 11 + i);
    }
    // Buchstabe für Buchstabe: erst verlöschen die alten, dann leuchten die neuen auf
    const cascade = this._config.transition === "cascade" && this._prevLit;
    let off = 0;
    let on = 0;
    const turningOff = this._cells.filter((el, idx) => el.classList.contains("on") && !lit.has(idx)).length;
    this._cells.forEach((el, idx) => {
      const was = el.classList.contains("on");
      const now = lit.has(idx);
      if (cascade && was !== now) {
        el.style.transitionDelay = now ? `${turningOff * 45 + 350 + on++ * 70}ms` : `${off++ * 45}ms`;
      } else {
        el.style.transitionDelay = "";
      }
      el.classList.toggle("on", now);
    });
    this._prevLit = lit;
    this._dots.forEach((el, idx) => el.classList.toggle("on", idx < dots));
    // Schutz vor Einbrennen
    const [sx, sy] = this._config.burn_in_protection
      ? BURN_IN_SHIFTS[Math.floor(this._nowMs() / 60000) % BURN_IN_SHIFTS.length]
      : [0, 0];
    this._face.style.setProperty("--shift-x", sx);
    this._face.style.setProperty("--shift-y", sy);
    this._face.setAttribute("aria-label", wordsToText(words, layoutOf(this._config).grid));
    this._applyNight();
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
        // Einheit gewechselt: sinnvollen Startwert setzen (100 % ≠ 100 px)
        const prev = withTheme(this._config);
        if (config.width_unit !== prev.width_unit) config.width = config.width_unit === "px" ? 600 : 100;
        if (config.height_unit !== prev.height_unit) config.height = config.height_unit === "px" ? 600 : 100;
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
    const data = withTheme(this._config);
    this._form.schema = buildSchema(data);
    for (const key of ["color_on", "color_off", "background", "fullscreen_background", "alert_color"]) data[key] = toRgb(data[key]);
    if (typeof data.padding === "string") data.padding = parseFloat(data.padding) || DEFAULTS.padding;
    this._form.data = data;
  }
}

function sameValue(a, b) {
  return JSON.stringify(toRgb(a)) === JSON.stringify(toRgb(b));
}

const LABELS = {
  custom_size: "Breite und Höhe frei einstellen",
  width: "Breite (X)",
  width_unit: "Einheit Breite",
  height: "Höhe (Y)",
  height_unit: "Einheit Höhe",
  offset_x: "Verschieben X (links/rechts)",
  offset_y: "Verschieben Y (oben/unten)",
  transition: "Übergang beim Minutenwechsel",
  burn_in_protection: "Schutz vor Einbrennen (Dauerbetrieb)",
  presence_entity: "Anwesenheit (aus = dimmen), z. B. Bewegungsmelder",
  color_entity: "Farbe von Lampe übernehmen",
  alert_entities: "Alarm-Entitäten (aktiv = Alarmfarbe)",
  alert_color: "Alarmfarbe",
  alert_pulse: "Bei Alarm pulsieren",
  time_zone: "Zeitzone",
  sync_server_time: "Uhr mit dem HA-Server abgleichen",
  night_mode: "Nachtmodus",
  night_start: "Nacht beginnt um",
  night_end: "Nacht endet um",
  night_entity: "Entität für Nacht (an = Nacht)",
  night_brightness: "Helligkeit nachts (%)",
  night_hide_unlit: "Nachts nur leuchtende Buchstaben",
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
  view_3d: "3D-Ansicht (schräg mit Plattenkante)",
  stencil: "Stege in O, Q, D (ausgefräst)",
  language: "Sprache",
  fit_screen: "An Bildschirmhöhe anpassen",
  tap_action: "Beim Antippen",
  double_tap_action: "Beim Doppeltippen",
  info_entities: "Werte in der Info-Anzeige (z. B. Temperatur)",
  info_duration: "Info-Anzeige wie lange",
  fullscreen_background: "Hintergrund im Vollbild",
  keep_awake: "Bildschirm im Vollbild wach halten",
  finish: "Oberfläche",
  wall_mount: "An der Wand (mit Schatten)",
  dialect: "Viertel-Schreibweise",
  zwanzig: "20 / 40 Minuten",
};

/** Größe & Position: Regler passen sich der gewählten Einheit an */
function sizeSection(data) {
  const num = (min, max, unit, mode) => ({ number: { min, max, step: 1, mode, unit_of_measurement: unit } });
  const unitSelect = (options) => ({ select: { mode: "dropdown", options } });
  const schema = [{ name: "custom_size", selector: { boolean: {} } }];
  if (data.custom_size) {
    schema.push(
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "width",
            selector: data.width_unit === "px" ? num(50, 4000, "px", "box") : num(5, 100, "%", "slider"),
          },
          {
            name: "width_unit",
            selector: unitSelect([
              { value: "%", label: "% der Kartenbreite (Regler)" },
              { value: "px", label: "Pixel" },
            ]),
          },
          {
            name: "height",
            selector: data.height_unit === "px" ? num(50, 4000, "px", "box") : num(5, 100, "%", "slider"),
          },
          {
            name: "height_unit",
            selector: unitSelect([
              { value: "vh", label: "% der Bildschirmhöhe (Regler)" },
              { value: "px", label: "Pixel" },
            ]),
          },
        ],
      }
    );
  }
  schema.push(
    { name: "offset_x", selector: num(-1000, 1000, "px", "slider") },
    { name: "offset_y", selector: num(-1000, 1000, "px", "slider") }
  );
  return {
    type: "expandable",
    name: "groesse",
    flatten: true,
    title: "Größe & Position",
    icon: "mdi:arrow-expand-all",
    schema,
  };
}

function buildSchema(data) {
  const i = SCHEMA.findIndex((s) => s.name === "bildschirm");
  return [...SCHEMA.slice(0, i), sizeSection(data), ...SCHEMA.slice(i)];
}

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
      {
        type: "grid",
        name: "",
        schema: [
          { name: "wall_mount", selector: { boolean: {} } },
          { name: "view_3d", selector: { boolean: {} } },
          { name: "stencil", selector: { boolean: {} } },
        ],
      },
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
      {
        name: "transition",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "cascade", label: "Buchstabe für Buchstabe" },
              { value: "fade", label: "Alle gleichzeitig überblenden" },
              { value: "none", label: "Sofort umschalten" },
            ],
          },
        },
      },
      { name: "burn_in_protection", selector: { boolean: {} } },
    ],
  },
  {
    type: "expandable",
    name: "homeassistant",
    flatten: true,
    title: "Home Assistant",
    icon: "mdi:home-assistant",
    schema: [
      { name: "color_entity", selector: { entity: { domain: "light" } } },
      { name: "alert_entities", selector: { entity: { multiple: true } } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "alert_color", selector: { color_rgb: {} } },
          { name: "alert_pulse", selector: { boolean: {} } },
        ],
      },
      { name: "presence_entity", selector: { entity: {} } },
    ],
  },
  {
    type: "expandable",
    name: "nacht",
    flatten: true,
    title: "Nachtmodus",
    icon: "mdi:weather-night",
    schema: [
      {
        name: "night_mode",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "off", label: "Aus" },
              { value: "sun", label: "Nach Sonnenuntergang (sun.sun)" },
              { value: "time", label: "Feste Uhrzeiten" },
              { value: "entity", label: "Nach Entität (z. B. input_boolean)" },
            ],
          },
        },
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "night_start", selector: { time: {} } },
          { name: "night_end", selector: { time: {} } },
        ],
      },
      { name: "night_entity", selector: { entity: {} } },
      { name: "night_brightness", selector: slider(5, 100) },
      { name: "night_hide_unlit", selector: { boolean: {} } },
    ],
  },
  {
    type: "expandable",
    name: "zeit",
    flatten: true,
    title: "Uhrzeit",
    icon: "mdi:clock-check-outline",
    schema: [
      {
        name: "time_zone",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "auto", label: "Wie im HA-Profil eingestellt" },
              { value: "server", label: "Zeitzone des HA-Servers" },
              { value: "local", label: "Zeitzone dieses Geräts" },
            ],
          },
        },
      },
      { name: "sync_server_time", selector: { boolean: {} } },
    ],
  },
  {
    type: "expandable",
    name: "bildschirm",
    flatten: true,
    title: "Bildschirm & Vollbild",
    icon: "mdi:monitor-screenshot",
    schema: [
      {
        name: "tap_action",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "fullscreen", label: "Vollbild ein/aus" },
              { value: "info", label: "Datum & Werte zeigen" },
              { value: "none", label: "Nichts" },
            ],
          },
        },
      },
      {
        name: "double_tap_action",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "info", label: "Datum & Werte zeigen" },
              { value: "fullscreen", label: "Vollbild ein/aus" },
              { value: "none", label: "Nichts" },
            ],
          },
        },
      },
      { name: "info_entities", selector: { entity: { multiple: true } } },
      { name: "info_duration", selector: { number: { min: 3, max: 60, step: 1, mode: "slider", unit_of_measurement: "s" } } },
      { name: "fullscreen_background", selector: { color_rgb: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "fit_screen", selector: { boolean: {} } },
          { name: "keep_awake", selector: { boolean: {} } },
        ],
      },
    ],
  },
  {
    type: "expandable",
    name: "sprache",
    flatten: true,
    title: "Sprache & Sprechweise",
    icon: "mdi:message-text-clock",
    schema: [
      {
        name: "language",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "de", label: "Deutsch" },
              { value: "en", label: "English" },
              { value: "nl", label: "Nederlands" },
              { value: "fr", label: "Français" },
              { value: "es", label: "Español" },
            ],
          },
        },
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

if (typeof module !== "undefined") module.exports = { LAYOUTS, hsToRgb, isActive, wallClock, parseTime, inTimeWindow, GRID_EN, computeWords, wordsToText, toCss, toRgb, resolveFont, withTheme, THEMES };
