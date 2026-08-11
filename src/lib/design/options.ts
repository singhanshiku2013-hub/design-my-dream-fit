// Central catalogue of every customization option in Chic Canvas.
// Pure data + types: safe to import anywhere (client or server).

export type Gender = "female" | "male";
export type ViewSide = "front" | "back";
export type Category = "dress" | "separates" | "suit";

export const SIZES = [
  "XXXS",
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
] as const;
export type Size = (typeof SIZES)[number];

export const SIZE_SCALE: Record<Size, number> = {
  XXXS: 0.82,
  XXS: 0.87,
  XS: 0.92,
  S: 0.96,
  M: 1,
  L: 1.05,
  XL: 1.1,
  XXL: 1.15,
  XXXL: 1.2,
};

export type BodyShape = {
  id: string;
  label: string;
  description: string;
  shoulder: number;
  waist: number;
  hip: number;
};

export const FEMALE_BODY_SHAPES: BodyShape[] = [
  {
    id: "hourglass",
    label: "Hourglass",
    description: "Bust and hips are even with a narrow waist.",
    shoulder: 0.74,
    waist: 0.5,
    hip: 0.76,
  },
  {
    id: "pear",
    label: "Pear (Triangle)",
    description: "Hips wider than shoulders.",
    shoulder: 0.66,
    waist: 0.56,
    hip: 0.9,
  },
  {
    id: "apple",
    label: "Apple (Round)",
    description: "Weight centered around the waist.",
    shoulder: 0.76,
    waist: 0.8,
    hip: 0.76,
  },
  {
    id: "rectangle",
    label: "Rectangle",
    description: "Bust, waist and hips nearly equal.",
    shoulder: 0.72,
    waist: 0.68,
    hip: 0.72,
  },
  {
    id: "inverted-triangle",
    label: "Inverted Triangle",
    description: "Broad shoulders with narrow hips.",
    shoulder: 0.92,
    waist: 0.64,
    hip: 0.64,
  },
];

export const MALE_BODY_SHAPES: BodyShape[] = [
  {
    id: "trapezoid",
    label: "Trapezoid",
    description: "Broad shoulders with a narrowing waist.",
    shoulder: 0.96,
    waist: 0.74,
    hip: 0.78,
  },
  {
    id: "rectangle",
    label: "Rectangle",
    description: "Uniform width from shoulder to hip.",
    shoulder: 0.86,
    waist: 0.82,
    hip: 0.84,
  },
  {
    id: "triangle",
    label: "Triangle",
    description: "Wider hips than shoulders.",
    shoulder: 0.78,
    waist: 0.86,
    hip: 0.96,
  },
  {
    id: "inverted-triangle",
    label: "Inverted Triangle",
    description: "Very broad shoulders.",
    shoulder: 1.04,
    waist: 0.72,
    hip: 0.74,
  },
  {
    id: "oval",
    label: "Oval",
    description: "Rounded midsection.",
    shoulder: 0.88,
    waist: 1,
    hip: 0.88,
  },
];

export const bodyShapesFor = (gender: Gender) =>
  gender === "female" ? FEMALE_BODY_SHAPES : MALE_BODY_SHAPES;

const list = (...items: string[]) => items;

export const NECKLINES = list(
  "V-neck",
  "Scoop",
  "Boatneck",
  "Sweetheart",
  "Jewel",
  "Halter",
  "Square",
  "Off-the-shoulder",
  "Asymmetric",
  "Crew",
);

export const SLEEVES = list(
  "Cap",
  "Short",
  "Three-quarter",
  "Long",
  "Bell",
  "Puff",
  "Bishop",
  "Raglan",
  "Kimono",
  "Butterfly",
  "Juliet",
  "Lantern",
);

export const DRESS_COLLARS = list(
  "Peter Pan",
  "Mandarin",
  "Sailor",
  "Shirt",
  "Turtle",
  "Jabot",
  "Chelsea",
  "Shawl",
  "Cowl",
);

export const WAISTLINES = list(
  "Natural",
  "Empire",
  "Dropped",
  "Basque",
  "Asymmetric",
  "Imperial",
  "Raised",
  "Corset",
);

export const SKIRTS = list(
  "A-line",
  "Ballgown",
  "Mermaid",
  "Pencil",
  "Sheath",
  "Fit-and-flare",
  "Pleated",
  "Tiered",
  "Tulip",
  "Wrap",
  "Peplum",
);

export const HEMLINES = list(
  "Mini",
  "Midi",
  "Maxi",
  "Floor-length",
  "Tea-length",
  "Asymmetric",
  "High-low",
  "Handkerchief",
);

export const SHIRT_COLLARS = list(
  "Straight",
  "Button-down",
  "Mandarin",
  "Spread",
  "Cutaway",
  "Wingtip",
  "Club",
  "Camp",
  "Tab",
  "Pin",
  "Sailor",
);

export const CUFFS = list(
  "Barrel",
  "French",
  "Convertible",
  "Cocktail",
  "Mitred",
  "Rounded",
  "Square",
  "Two-button",
  "Neapolitan",
  "Gauntlet",
);

export const PLACKETS = list(
  "Conventional",
  "French",
  "Tuxedo",
  "Popover",
  "Hidden",
  "Zipper",
  "Asymmetrical",
  "Military",
);

export const YOKES = list(
  "One-piece",
  "Split",
  "Western",
  "Bi-swing",
  "Scalloped",
  "Pointed",
  "Ventilated",
);

export const WAISTBANDS = list(
  "Standard",
  "Extended",
  "Elastic",
  "Hollywood",
  "Drawstring",
  "Side-tab",
  "Gurkha",
  "Tunnel",
  "High-rise",
);

export const FLIES = list("Zipper", "Button");

export const PANT_HEMS = list(
  "Straight",
  "Turned-up",
  "Step-hem",
  "Elastic-jogger",
  "Raw-edge",
  "Split-hem",
  "Stirrup",
);

export const SHIRT_SLEEVES = list(
  "Sleeveless",
  "Cap",
  "Short",
  "Three-quarter",
  "Long",
);

export type DisabilityOption = {
  id: string;
  label: string;
  description: string;
  limb: "none" | "leg" | "arm";
  /** how much of the limb is missing */
  level: "none" | "above-knee" | "below-knee" | "full-arm" | "below-elbow";
  sides: 0 | 1 | 2;
};

export const DISABILITIES: DisabilityOption[] = [
  {
    id: "none",
    label: "None",
    description: "No adaptive tailoring required.",
    limb: "none",
    level: "none",
    sides: 0,
  },
  {
    id: "unilateral-above-knee",
    label: "Unilateral amputation — above knee",
    description: "Loss of one leg above the knee joint.",
    limb: "leg",
    level: "above-knee",
    sides: 1,
  },
  {
    id: "unilateral-below-knee",
    label: "Unilateral amputation — below knee",
    description: "One foot and lower leg removed, knee preserved.",
    limb: "leg",
    level: "below-knee",
    sides: 1,
  },
  {
    id: "bilateral-above-knee",
    label: "Bilateral amputation — above knee",
    description: "Loss of both legs above the knee; affects balance and trunk stability.",
    limb: "leg",
    level: "above-knee",
    sides: 2,
  },
  {
    id: "bilateral-below-knee",
    label: "Bilateral amputation — below knee",
    description: "Both feet and lower legs removed, both knees preserved.",
    limb: "leg",
    level: "below-knee",
    sides: 2,
  },
  {
    id: "unilateral-arm",
    label: "Unilateral arm loss",
    description: "Loss of one arm; restricts two-handed coordination.",
    limb: "arm",
    level: "full-arm",
    sides: 1,
  },
  {
    id: "bilateral-arm",
    label: "Bilateral arm loss",
    description: "Loss of both arms; needs alternative fastenings.",
    limb: "arm",
    level: "full-arm",
    sides: 2,
  },
  {
    id: "unilateral-below-elbow",
    label: "Below-elbow amputation — one side",
    description: "One hand and forearm removed below the elbow.",
    limb: "arm",
    level: "below-elbow",
    sides: 1,
  },
  {
    id: "bilateral-below-elbow",
    label: "Below-elbow amputation — both sides",
    description: "Both hands and forearms removed below the elbow.",
    limb: "arm",
    level: "below-elbow",
    sides: 2,
  },
];

export const disabilityFor = (id: string): DisabilityOption =>
  DISABILITIES.find((d) => d.id === id) ?? DISABILITIES[0]!;

export const LAPELS = list(

  "Notch",
  "Peak",
  "Shawl",
  "Cloverleaf",
  "Tieless",
  "Cran",
  "Nehru",
  "Mao",
  "Standing",
);

export const VENTS = list(
  "Single",
  "Double",
  "No-vent",
  "Side-pleated",
  "Center-box",
  "Action-back",
);

export const BREAST_POCKETS = list(
  "Welt",
  "Patch",
  "Jetted",
  "Flap",
  "Pleated",
  "Hidden-zipper",
  "Ticket",
  "Slanted",
);

export const PATTERN_GROUPS: { group: string; patterns: string[] }[] = [
  {
    group: "Solid",
    patterns: ["None"],
  },
  {
    group: "Geometric & Linear",
    patterns: ["Stripes", "Polka Dot", "Chevron", "Houndstooth"],
  },
  {
    group: "Checked & Plaid",
    patterns: ["Gingham", "Plaid (Tartan)", "Windowpane"],
  },
  {
    group: "Organic & Nature",
    patterns: ["Floral", "Animal Print", "Paisley"],
  },
  {
    group: "Artistic",
    patterns: ["Toile de Jouy", "Abstract", "Damask", "Ikat"],
  },
  {
    group: "Additional",
    patterns: [
      "Pinstripe",
      "Chalkstripe",
      "Awning",
      "Barcode",
      "Glen Plaid",
      "Madras",
      "Buffalo Check",
      "Herringbone",
      "Argyle",
      "Birdseye",
      "Camo",
      "Tie-Dye",
    ],
  },
];

export const ALL_PATTERNS = PATTERN_GROUPS.flatMap((g) => g.patterns);

export const FABRICS = [
  { id: "Cotton", note: "Breathable, matte, everyday luxury.", sheen: 0.06, price: 0 },
  { id: "Silk", note: "Fluid drape with a soft liquid glow.", sheen: 0.3, price: 90 },
  { id: "Chiffon", note: "Airy, translucent, weightless movement.", sheen: 0.14, price: 60 },
  { id: "Satin", note: "High-shine finish for evening statements.", sheen: 0.42, price: 75 },
] as const;
export type Fabric = (typeof FABRICS)[number]["id"];

export const PASTEL_SWATCHES = [
  "#F4D7DA",
  "#DCE6D5",
  "#E3DAF0",
  "#F7E7CE",
  "#D6E4EC",
  "#F1E3E8",
];

export type DesignState = {
  gender: Gender;
  view: ViewSide;
  bodyShape: string;
  size: Size;
  category: Category;
  fabric: Fabric;
  /** Adaptive tailoring / limb difference selection. */
  disability: string;
  dress: {
    neckline: string;
    sleeve: string;
    collar: string;
    waistline: string;
    skirt: string;
    hemline: string;
    color: string;
  };
  shirt: {
    collar: string;
    sleeve: string;
    cuff: string;
    placket: string;
    yoke: string;
    color: string;
  };
  pants: {
    waistband: string;
    fly: string;
    hem: string;
    color: string;
  };
  jacket: {
    enabled: boolean;
    lapel: string;
    vent: string;
    pocket: string;
    color: string;
  };
  /** Pattern for the dress / shirt / jacket. */
  pattern: {
    name: string;
    primary: string;
    secondary: string;
  };
  /** Independent pattern for trousers / bottoms. */
  pantsPattern: {
    name: string;
    primary: string;
    secondary: string;
  };
};

export const defaultDesign = (gender: Gender): DesignState => ({
  gender,
  view: "front",
  bodyShape: gender === "female" ? "hourglass" : "trapezoid",
  size: "M",
  category: gender === "female" ? "dress" : "separates",
  fabric: "Cotton",
  disability: "none",
  dress: {
    neckline: "V-neck",
    sleeve: "Short",
    collar: "Peter Pan",
    waistline: "Natural",
    skirt: "A-line",
    hemline: "Midi",
    color: "#F4D7DA",
  },
  shirt: {
    collar: "Spread",
    sleeve: "Long",
    cuff: "Barrel",
    placket: "Conventional",
    yoke: "One-piece",
    color: "#E9EDF2",
  },
  pants: {
    waistband: "Standard",
    fly: "Zipper",
    hem: "Straight",
    color: "#4A5568",
  },
  jacket: {
    enabled: false,
    lapel: "Notch",
    vent: "Single",
    pocket: "Welt",
    color: "#3C4657",
  },
  pattern: {
    name: "None",
    primary: "#C9A227",
    secondary: "#FFFFFF",
  },
  pantsPattern: {
    name: "None",
    primary: "#C9A227",
    secondary: "#FFFFFF",
  },
});

export type Preset = { id: string; name: string; blurb: string; patch: Partial<DesignState> };

export const FEMALE_PRESETS: Preset[] = [
  {
    id: "garden-soiree",
    name: "Garden Soirée",
    blurb: "Floral A-line with sweetheart neckline",
    patch: {
      category: "dress",
      fabric: "Chiffon",
      dress: {
        neckline: "Sweetheart",
        sleeve: "Butterfly",
        collar: "Peter Pan",
        waistline: "Empire",
        skirt: "Fit-and-flare",
        hemline: "Tea-length",
        color: "#F7E7CE",
      },
      pattern: { name: "Floral", primary: "#D98BA0", secondary: "#F9F3EA" },
    },
  },
  {
    id: "midnight-column",
    name: "Midnight Column",
    blurb: "Satin mermaid gown, floor length",
    patch: {
      category: "dress",
      fabric: "Satin",
      dress: {
        neckline: "Halter",
        sleeve: "Cap",
        collar: "Cowl",
        waistline: "Corset",
        skirt: "Mermaid",
        hemline: "Floor-length",
        color: "#2E3350",
      },
      pattern: { name: "None", primary: "#C9A227", secondary: "#FFFFFF" },
    },
  },
  {
    id: "atelier-office",
    name: "Atelier Office",
    blurb: "Crisp shirt with tailored trousers",
    patch: {
      category: "separates",
      fabric: "Cotton",
      shirt: {
        sleeve: "Long",
        collar: "Spread",
        cuff: "French",
        placket: "Hidden",
        yoke: "Split",
        color: "#F1E3E8",
      },
      pants: { waistband: "High-rise", fly: "Zipper", hem: "Turned-up", color: "#5B6472" },
      pattern: { name: "Pinstripe", primary: "#8A93A5", secondary: "#F5F5F5" },
    },
  },
  {
    id: "pastel-minimal",
    name: "Pastel Minimal",
    blurb: "Clean sheath silhouette, jewel neck",
    patch: {
      category: "dress",
      fabric: "Silk",
      dress: {
        neckline: "Jewel",
        sleeve: "Three-quarter",
        collar: "Mandarin",
        waistline: "Natural",
        skirt: "Sheath",
        hemline: "Midi",
        color: "#DCE6D5",
      },
      pattern: { name: "None", primary: "#C9A227", secondary: "#FFFFFF" },
    },
  },
];

export const MALE_PRESETS: Preset[] = [
  {
    id: "black-tie",
    name: "Black Tie",
    blurb: "Peak lapel suit with tuxedo placket",
    patch: {
      category: "suit",
      fabric: "Satin",
      shirt: { sleeve: "Long", collar: "Wingtip", cuff: "French", placket: "Tuxedo", yoke: "Split", color: "#FBF7F2" },
      pants: { waistband: "Side-tab", fly: "Button", hem: "Straight", color: "#20242F" },
      jacket: { enabled: true, lapel: "Peak", vent: "Double", pocket: "Jetted", color: "#20242F" },
      pattern: { name: "None", primary: "#C9A227", secondary: "#FFFFFF" },
    },
  },
  {
    id: "boardroom",
    name: "Boardroom",
    blurb: "Notch lapel, chalkstripe worsted",
    patch: {
      category: "suit",
      fabric: "Cotton",
      shirt: { sleeve: "Long", collar: "Spread", cuff: "Barrel", placket: "Conventional", yoke: "One-piece", color: "#DCE6F0" },
      pants: { waistband: "Extended", fly: "Zipper", hem: "Turned-up", color: "#39435A" },
      jacket: { enabled: true, lapel: "Notch", vent: "Single", pocket: "Welt", color: "#39435A" },
      pattern: { name: "Chalkstripe", primary: "#96A2BA", secondary: "#39435A" },
    },
  },
  {
    id: "linen-resort",
    name: "Linen Resort",
    blurb: "Camp collar shirt, relaxed trousers",
    patch: {
      category: "separates",
      fabric: "Cotton",
      shirt: { sleeve: "Long", collar: "Camp", cuff: "Rounded", placket: "Popover", yoke: "Ventilated", color: "#F4D7DA" },
      pants: { waistband: "Drawstring", fly: "Button", hem: "Raw-edge", color: "#E8DFC9" },
      jacket: { enabled: false, lapel: "Notch", vent: "No-vent", pocket: "Patch", color: "#E8DFC9" },
      pattern: { name: "Awning", primary: "#D98BA0", secondary: "#FBF7F2" },
    },
  },
  {
    id: "street-luxe",
    name: "Street Luxe",
    blurb: "Mandarin collar with jogger hem",
    patch: {
      category: "separates",
      fabric: "Silk",
      shirt: { sleeve: "Long", collar: "Mandarin", cuff: "Gauntlet", placket: "Zipper", yoke: "Bi-swing", color: "#2F3440" },
      pants: { waistband: "Elastic", fly: "Zipper", hem: "Elastic-jogger", color: "#3F4654" },
      jacket: { enabled: false, lapel: "Mao", vent: "Action-back", pocket: "Hidden-zipper", color: "#2F3440" },
      pattern: { name: "Camo", primary: "#5C6B4E", secondary: "#2F3440" },
    },
  },
];

export const presetsFor = (gender: Gender) =>
  gender === "female" ? FEMALE_PRESETS : MALE_PRESETS;

export const QUOTES = [
  "Style doesn't really have rules, nor does it change who you are. It just changes how brave you feel being seen...",
  "You were never meant to shrink to fit a size. The seam should move, not you.",
  "Elegance begins the moment a garment agrees with your body.",
  "Confidence is the finest fabric we work with.",
  "Wear what makes you recognise yourself.",
];

export function designPrice(d: DesignState): number {
  const base = d.category === "suit" ? 640 : d.category === "dress" ? 420 : 380;
  const fabric = FABRICS.find((f) => f.id === d.fabric)?.price ?? 0;
  const pattern = (d.pattern.name === "None" ? 0 : 45) +
    (d.category !== "dress" && d.pantsPattern.name !== "None" ? 35 : 0);
  const jacket = d.category === "suit" && d.jacket.enabled ? 0 : 0;
  return base + fabric + pattern + jacket;
}

export function designTitle(d: DesignState): string {
  if (d.category === "dress")
    return `${d.dress.skirt} ${d.dress.hemline} Dress · ${d.dress.neckline}`;
  if (d.category === "suit") return `${d.jacket.lapel} Lapel Suit · ${d.fabric}`;
  return `${d.shirt.collar} Collar Shirt & ${d.pants.waistband} Trousers`;
}

export function designSummary(d: DesignState): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [
    { label: "Gender fit", value: d.gender === "female" ? "Female" : "Male" },
    { label: "Body shape", value: bodyShapesFor(d.gender).find((b) => b.id === d.bodyShape)?.label ?? d.bodyShape },
    { label: "Size", value: d.size },
    { label: "Fabric", value: d.fabric },
    { label: "Pattern", value: d.pattern.name },
  ];
  if (d.disability !== "none") {
    rows.push({ label: "Adaptive fit", value: disabilityFor(d.disability).label });
  }
  if (d.pattern.name !== "None") {
    rows.push({ label: "Pattern colors", value: `${d.pattern.primary} / ${d.pattern.secondary}` });
  }
  if (d.category === "dress") {
    rows.push(
      { label: "Neckline", value: d.dress.neckline },
      { label: "Sleeves", value: d.dress.sleeve },
      { label: "Collar", value: d.dress.collar },
      { label: "Waistline", value: d.dress.waistline },
      { label: "Skirt", value: d.dress.skirt },
      { label: "Hemline", value: d.dress.hemline },
      { label: "Dress color", value: d.dress.color },
    );
  } else {
    rows.push(
      { label: "Shirt collar", value: d.shirt.collar },
      { label: "Sleeve length", value: d.shirt.sleeve },
      { label: "Cuffs", value: d.shirt.cuff },
      { label: "Placket", value: d.shirt.placket },
      { label: "Yoke", value: d.shirt.yoke },
      { label: "Shirt color", value: d.shirt.color },
      { label: "Waistband", value: d.pants.waistband },
      { label: "Fly", value: d.pants.fly },
      { label: "Bottom hem", value: d.pants.hem },
      { label: "Bottom color", value: d.pants.color },
      { label: "Bottoms pattern", value: d.pantsPattern.name },
    );
    if (d.category === "suit") {
      rows.push(
        { label: "Lapel", value: d.jacket.lapel },
        { label: "Vents", value: d.jacket.vent },
        { label: "Breast pocket", value: d.jacket.pocket },
        { label: "Jacket color", value: d.jacket.color },
      );
    }
  }
  return rows;
}
