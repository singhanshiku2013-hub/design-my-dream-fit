import { useId } from "react";
import { PatternDef } from "./PatternDef";
import {
  FABRICS,
  SIZE_SCALE,
  bodyShapesFor,
  type DesignState,
} from "@/lib/design/options";

const W = 400;
const H = 700;
const CX = W / 2;
const SHOULDER_Y = 122;
const BUST_Y = 175;
const HIP_Y = 342;
const FLOOR_Y = 676;

const WAIST_OFFSET: Record<string, number> = {
  Natural: 0,
  Empire: -46,
  Raised: -24,
  Imperial: -32,
  Dropped: 30,
  Basque: 20,
  Asymmetric: 8,
  Corset: -6,
};

const HEM_FACTOR: Record<string, number> = {
  Mini: 0.34,
  Midi: 0.62,
  Maxi: 0.86,
  "Floor-length": 1,
  "Tea-length": 0.74,
  Asymmetric: 0.8,
  "High-low": 0.84,
  Handkerchief: 0.78,
};

const SKIRT_WIDTH: Record<string, number> = {
  "A-line": 1.9,
  Ballgown: 2.7,
  Mermaid: 2.2,
  Pencil: 1.05,
  Sheath: 1.02,
  "Fit-and-flare": 2.1,
  Pleated: 1.85,
  Tiered: 2.2,
  Tulip: 1.35,
  Wrap: 1.7,
  Peplum: 1.6,
};

const SLEEVE_LEN: Record<string, number> = {
  Cap: 0.1,
  Short: 0.22,
  "Three-quarter": 0.42,
  Long: 0.58,
  Bell: 0.55,
  Puff: 0.24,
  Bishop: 0.56,
  Raglan: 0.5,
  Kimono: 0.3,
  Butterfly: 0.34,
  Juliet: 0.56,
  Lantern: 0.4,
};

const SLEEVE_FLARE: Record<string, number> = {
  Cap: 1,
  Short: 0.95,
  "Three-quarter": 0.8,
  Long: 0.7,
  Bell: 1.9,
  Puff: 1.5,
  Bishop: 1.6,
  Raglan: 0.85,
  Kimono: 1.35,
  Butterfly: 2.2,
  Juliet: 0.75,
  Lantern: 1.45,
};

type PieceProps = {
  d: string;
  color: string;
  patternId?: string | undefined;
  sheen: number;
  stroke?: string | undefined;
};

function Piece({ d, color, patternId, sheen, stroke }: PieceProps) {
  return (
    <g>
      <path d={d} fill={color} stroke={stroke ?? "rgba(0,0,0,0.12)"} strokeWidth="1" />
      {patternId ? <path d={d} fill={`url(#${patternId})`} opacity={0.82} /> : null}
      <path d={d} fill="url(#dmd-sheen)" opacity={sheen} />
      <path d={d} fill="url(#dmd-shade)" opacity={0.22} />
    </g>
  );
}

function hemEdge(hemline: string, hw: number, y: number): string {
  const left = CX - hw;
  const right = CX + hw;
  switch (hemline) {
    case "Asymmetric":
      return `L ${right} ${y - 60} L ${left} ${y}`;
    case "High-low":
      return `L ${right} ${y} Q ${CX} ${y - 90} ${left} ${y}`;
    case "Handkerchief": {
      const step = (right - left) / 4;
      return `L ${right} ${y - 46} L ${right - step} ${y} L ${right - 2 * step} ${y - 46} L ${right - 3 * step} ${y} L ${left} ${y - 46}`;
    }
    default:
      return `L ${right} ${y} L ${left} ${y}`;
  }
}

export function GarmentPreview({ design }: { design: DesignState }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const patternId = design.pattern.name === "None" ? undefined : `pat-${uid}`;
  const shapes = bodyShapesFor(design.gender);
  const shape = shapes.find((b) => b.id === design.bodyShape) ?? shapes[0]!;
  const s = SIZE_SCALE[design.size];
  const sheen = FABRICS.find((f) => f.id === design.fabric)?.sheen ?? 0.1;
  const back = design.view === "back";

  const SH = 94 * shape.shoulder * s;
  const WH = 74 * shape.waist * s;
  const HH = 88 * shape.hip * s;
  const waistY = HIP_Y - 74 + (WAIST_OFFSET[design.dress.waistline] ?? 0);

  // ---- body silhouette -------------------------------------------------
  const skin = "#E8C9AE";
  const skinShade = "#D9B295";
  const torso = `
    M ${CX - SH} ${SHOULDER_Y}
    C ${CX - SH - 6} ${BUST_Y} ${CX - WH - 6} ${HIP_Y - 110} ${CX - WH} ${HIP_Y - 66}
    C ${CX - HH} ${HIP_Y - 30} ${CX - HH} ${HIP_Y - 8} ${CX - HH * 0.94} ${HIP_Y + 10}
    L ${CX + HH * 0.94} ${HIP_Y + 10}
    C ${CX + HH} ${HIP_Y - 8} ${CX + HH} ${HIP_Y - 30} ${CX + WH} ${HIP_Y - 66}
    C ${CX + WH + 6} ${HIP_Y - 110} ${CX + SH + 6} ${BUST_Y} ${CX + SH} ${SHOULDER_Y}
    Z`;
  const legW = 22 * s;
  const leg = (dir: number) => `
    M ${CX + dir * (HH * 0.9)} ${HIP_Y + 4}
    C ${CX + dir * (HH * 0.85)} ${HIP_Y + 160} ${CX + dir * (legW + 20)} ${FLOOR_Y - 160} ${CX + dir * (legW + 12)} ${FLOOR_Y}
    L ${CX + dir * 8} ${FLOOR_Y}
    C ${CX + dir * 8} ${FLOOR_Y - 200} ${CX + dir * 10} ${HIP_Y + 90} ${CX + dir * 8} ${HIP_Y + 4}
    Z`;
  const arm = (dir: number) => `
    M ${CX + dir * SH} ${SHOULDER_Y + 4}
    C ${CX + dir * (SH + 20)} ${SHOULDER_Y + 90} ${CX + dir * (SH + 16)} ${HIP_Y + 20} ${CX + dir * (SH + 6)} ${HIP_Y + 74}
    L ${CX + dir * (SH - 12)} ${HIP_Y + 74}
    C ${CX + dir * (SH - 4)} ${HIP_Y} ${CX + dir * (SH - 6)} ${SHOULDER_Y + 70} ${CX + dir * (SH - 16)} ${SHOULDER_Y + 8}
    Z`;

  // ---- garment geometry ------------------------------------------------
  // Two-segment bodice: shoulder → waist → bottom, mirroring the torso path so
  // garments follow the body's waist indentation instead of a single sweep.
  const bodice = (
    bottomY: number,
    bottomHW: number,
    midY?: number,
    midHW?: number,
  ) => {
    if (midY === undefined || midHW === undefined) {
      return `
    M ${CX - SH - 3} ${SHOULDER_Y - 4}
    C ${CX - SH - 9} ${BUST_Y} ${CX - bottomHW - 8} ${bottomY - 60} ${CX - bottomHW} ${bottomY}
    L ${CX + bottomHW} ${bottomY}
    C ${CX + bottomHW + 8} ${bottomY - 60} ${CX + SH + 9} ${BUST_Y} ${CX + SH + 3} ${SHOULDER_Y - 4}
    Z`;
    }
    return `
    M ${CX - SH - 3} ${SHOULDER_Y - 4}
    C ${CX - SH - 9} ${BUST_Y} ${CX - midHW - 9} ${midY - 44} ${CX - midHW} ${midY}
    C ${CX - bottomHW - 4} ${midY + (bottomY - midY) * 0.45} ${CX - bottomHW} ${bottomY - (bottomY - midY) * 0.3} ${CX - bottomHW} ${bottomY}
    L ${CX + bottomHW} ${bottomY}
    C ${CX + bottomHW} ${bottomY - (bottomY - midY) * 0.3} ${CX + bottomHW + 4} ${midY + (bottomY - midY) * 0.45} ${CX + midHW} ${midY}
    C ${CX + midHW + 9} ${midY - 44} ${CX + SH + 9} ${BUST_Y} ${CX + SH + 3} ${SHOULDER_Y - 4}
    Z`;
  };

  const skirtHemY = waistY + (FLOOR_Y - waistY) * (HEM_FACTOR[design.dress.hemline] ?? 0.6);
  const skirtHW = WH * (SKIRT_WIDTH[design.dress.skirt] ?? 1.6) + 6;
  const kneeY = waistY + (skirtHemY - waistY) * 0.55;
  const mermaid = design.dress.skirt === "Mermaid";
  const flare = design.dress.skirt === "Fit-and-flare" || mermaid;
  const midHW = flare ? WH * 1.05 : (WH + skirtHW) / 2;

  const skirtPath = `
    M ${CX - WH} ${waistY}
    C ${CX - midHW} ${kneeY - 30} ${CX - midHW} ${kneeY} ${CX - (mermaid ? midHW : (WH + skirtHW) / 2)} ${kneeY}
    C ${CX - skirtHW} ${skirtHemY - 60} ${CX - skirtHW} ${skirtHemY - 20} ${CX - skirtHW} ${skirtHemY}
    ${hemEdge(design.dress.hemline, skirtHW, skirtHemY).replace(`L ${CX + skirtHW}`, `L ${CX + skirtHW}`)}
    C ${CX + skirtHW} ${skirtHemY - 20} ${CX + skirtHW} ${skirtHemY - 60} ${CX + (mermaid ? midHW : (WH + skirtHW) / 2)} ${kneeY}
    C ${CX + midHW} ${kneeY} ${CX + midHW} ${kneeY - 30} ${CX + WH} ${waistY}
    Z`;

  const sleeveLen = SLEEVE_LEN[design.dress.sleeve] ?? 0.25;
  const sleeveFlare = SLEEVE_FLARE[design.dress.sleeve] ?? 1;
  const sleevePath = (dir: number) => {
    const topX = CX + dir * (SH + 2);
    const endY = SHOULDER_Y + (FLOOR_Y - SHOULDER_Y) * sleeveLen * 0.62;
    const capOut = 26 * s * (design.dress.sleeve === "Puff" || design.dress.sleeve === "Juliet" ? 1.5 : 1);
    const endHW = 24 * s * sleeveFlare;
    return `
      M ${topX} ${SHOULDER_Y - 4}
      C ${topX + dir * capOut} ${SHOULDER_Y + 18} ${topX + dir * (endHW + 6)} ${endY - 40} ${topX + dir * endHW} ${endY}
      L ${topX - dir * 8} ${endY}
      C ${topX - dir * 12} ${endY - 50} ${topX - dir * 10} ${SHOULDER_Y + 40} ${topX - dir * 6} ${SHOULDER_Y + 6}
      Z`;
  };

  const garmentColor =
    design.category === "dress" ? design.dress.color : design.shirt.color;

  // ---- neckline (front detail) ----------------------------------------
  const nW = 34 * s;
  const nD = 44;
  const necklinePath = () => {
    const t = SHOULDER_Y - 6;
    switch (design.dress.neckline) {
      case "V-neck":
        return `M ${CX - nW} ${t} L ${CX} ${t + nD + 24} L ${CX + nW} ${t} Z`;
      case "Scoop":
        return `M ${CX - nW} ${t} Q ${CX} ${t + nD + 30} ${CX + nW} ${t} Z`;
      case "Boatneck":
        return `M ${CX - nW - 22} ${t} Q ${CX} ${t + 22} ${CX + nW + 22} ${t} Z`;
      case "Sweetheart":
        return `M ${CX - nW} ${t} Q ${CX - nW / 2} ${t + nD} ${CX} ${t + nD - 12} Q ${CX + nW / 2} ${t + nD} ${CX + nW} ${t} Z`;
      case "Halter":
        return `M ${CX - nW * 0.5} ${t} L ${CX} ${t + nD + 34} L ${CX + nW * 0.5} ${t} Z`;
      case "Square":
        return `M ${CX - nW} ${t} L ${CX - nW} ${t + nD} L ${CX + nW} ${t + nD} L ${CX + nW} ${t} Z`;
      case "Off-the-shoulder":
        return `M ${CX - SH - 2} ${t + 6} Q ${CX} ${t + 40} ${CX + SH + 2} ${t + 6} L ${CX + SH + 2} ${t - 6} L ${CX - SH - 2} ${t - 6} Z`;
      case "Asymmetric":
        return `M ${CX - nW - 14} ${t} L ${CX + nW} ${t + nD + 16} L ${CX + nW + 10} ${t} Z`;
      case "Crew":
        return `M ${CX - nW * 0.8} ${t} Q ${CX} ${t + 24} ${CX + nW * 0.8} ${t} Z`;
      default: // Jewel
        return `M ${CX - nW * 0.7} ${t} Q ${CX} ${t + 18} ${CX + nW * 0.7} ${t} Z`;
    }
  };

  const collarShape = () => {
    const y = SHOULDER_Y - 8;
    const name = design.category === "dress" ? design.dress.collar : design.shirt.collar;
    switch (name) {
      case "Turtle":
      case "Mandarin":
        return <rect x={CX - nW * 0.75} y={y - 26} width={nW * 1.5} height={30} rx={8} fill={garmentColor} stroke="rgba(0,0,0,.15)" />;
      case "Peter Pan":
      case "Chelsea":
      case "Rounded":
        return (
          <g fill={garmentColor} stroke="rgba(0,0,0,.15)">
            <path d={`M ${CX - nW} ${y} q 12 30 34 24 q -6 -22 -34 -24 Z`} />
            <path d={`M ${CX + nW} ${y} q -12 30 -34 24 q 6 -22 34 -24 Z`} />
          </g>
        );
      case "Sailor":
        return <path d={`M ${CX - nW - 14} ${y} L ${CX + nW + 14} ${y} L ${CX + nW - 6} ${y + 70} L ${CX - nW + 6} ${y + 70} Z`} fill={garmentColor} stroke="rgba(0,0,0,.15)" />;
      case "Cowl":
        return <path d={`M ${CX - nW} ${y} Q ${CX} ${y + 58} ${CX + nW} ${y} Q ${CX} ${y + 26} ${CX - nW} ${y} Z`} fill={garmentColor} opacity={0.9} />;
      case "Shawl":
        return (
          <path
            d={`M ${CX - nW} ${y} C ${CX - nW - 10} ${y + 70} ${CX - 8} ${y + 90} ${CX} ${y + 96} C ${CX + 8} ${y + 90} ${CX + nW + 10} ${y + 70} ${CX + nW} ${y} Z`}
            fill={garmentColor}
            opacity={0.95}
          />
        );
      case "Jabot":
        return <path d={`M ${CX - 16} ${y} L ${CX + 16} ${y} L ${CX + 10} ${y + 80} L ${CX} ${y + 92} L ${CX - 10} ${y + 80} Z`} fill="#FFFFFF" opacity={0.85} />;
      default: {
        // pointed shirt-style collars; spread/cutaway widen the points
        const spread =
          name === "Cutaway" ? 30 : name === "Spread" ? 20 : name === "Club" ? 6 : name === "Camp" ? 24 : 10;
        return (
          <g fill={garmentColor} stroke="rgba(0,0,0,.18)">
            <path d={`M ${CX - 4} ${y} L ${CX - nW - spread} ${y + 8} L ${CX - 12} ${y + 46} Z`} />
            <path d={`M ${CX + 4} ${y} L ${CX + nW + spread} ${y + 8} L ${CX + 12} ${y + 46} Z`} />
          </g>
        );
      }
    }
  };

  // ---- separates / suit geometry ---------------------------------------
  const shirtBottom = HIP_Y + 26;
  const shirtPath = bodice(shirtBottom, HH * 0.96, waistY, WH * 1.06);
  const pantsTopY = design.pants.waistband === "High-rise" ? waistY - 10 : HIP_Y - 40;
  const pantHemY =
    design.pants.hem === "Elastic-jogger"
      ? FLOOR_Y - 34
      : design.pants.hem === "Stirrup"
        ? FLOOR_Y - 6
        : FLOOR_Y - 12;
  const pantLeg = (dir: number) => {
    const outer = HH * 0.98;
    const innerTop = 6;
    const hemHW = design.pants.hem === "Elastic-jogger" ? 24 * s : 34 * s;
    return `
      M ${CX + dir * outer} ${pantsTopY}
      C ${CX + dir * (outer + 2)} ${HIP_Y + 140} ${CX + dir * (hemHW + 26)} ${pantHemY - 150} ${CX + dir * (hemHW + 14)} ${pantHemY}
      L ${CX + dir * innerTop} ${pantHemY}
      C ${CX + dir * innerTop} ${pantHemY - 180} ${CX + dir * (innerTop + 6)} ${HIP_Y + 80} ${CX + dir * innerTop} ${pantsTopY}
      Z`;
  };

  const jacketPanel = (dir: number) => {
    const hem = HIP_Y + (design.jacket.lapel === "Nehru" || design.jacket.lapel === "Mao" ? 70 : 52);
    return `
      M ${CX + dir * (SH + 6)} ${SHOULDER_Y - 6}
      C ${CX + dir * (SH + 12)} ${BUST_Y} ${CX + dir * (HH + 6)} ${HIP_Y - 40} ${CX + dir * (HH + 4)} ${hem}
      L ${CX + dir * 4} ${hem}
      L ${CX + dir * 4} ${SHOULDER_Y + 30}
      Z`;
  };

  const lapelPath = (dir: number) => {
    const y = SHOULDER_Y - 2;
    const depth = design.jacket.lapel === "Peak" ? 150 : design.jacket.lapel === "Shawl" ? 170 : 130;
    if (design.jacket.lapel === "Shawl" || design.jacket.lapel === "Cloverleaf") {
      return `M ${CX + dir * 6} ${y} C ${CX + dir * 58} ${y + 20} ${CX + dir * 44} ${y + depth - 40} ${CX + dir * 8} ${y + depth} Z`;
    }
    if (design.jacket.lapel === "Peak") {
      return `M ${CX + dir * 6} ${y} L ${CX + dir * 62} ${y + 30} L ${CX + dir * 34} ${y + 44} L ${CX + dir * 8} ${y + depth} Z`;
    }
    if (["Nehru", "Mao", "Standing", "Tieless"].includes(design.jacket.lapel)) {
      return `M ${CX + dir * 6} ${y} L ${CX + dir * 30} ${y + 6} L ${CX + dir * 10} ${y + 60} Z`;
    }
    return `M ${CX + dir * 6} ${y} L ${CX + dir * 54} ${y + 26} L ${CX + dir * 8} ${y + depth} Z`;
  };

  const plackets = () => {
    if (back) return null;
    const top = SHOULDER_Y + 20;
    const bottom = design.category === "dress" ? waistY : shirtBottom;
    switch (design.shirt.placket) {
      case "Hidden":
      case "Popover":
        return <path d={`M ${CX} ${top} L ${CX} ${bottom}`} stroke="rgba(0,0,0,.12)" strokeWidth="1" />;
      case "Zipper":
        return <path d={`M ${CX} ${top} L ${CX} ${bottom}`} stroke="#9AA0A6" strokeWidth="4" strokeDasharray="4 3" />;
      case "Asymmetrical":
        return <path d={`M ${CX + 16} ${top} L ${CX + 6} ${bottom}`} stroke="rgba(0,0,0,.2)" strokeWidth="2" />;
      case "Tuxedo":
        return (
          <g>
            <rect x={CX - 16} y={top} width={32} height={bottom - top} fill="rgba(255,255,255,.35)" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={CX} cy={top + 30 + i * 38} r={4} fill="#2B2B2B" />
            ))}
          </g>
        );
      default:
        return (
          <g>
            <path d={`M ${CX} ${top} L ${CX} ${bottom}`} stroke="rgba(0,0,0,.18)" strokeWidth="2" />
            {Array.from({ length: 5 }).map((_, i) => (
              <circle key={i} cx={CX} cy={top + 20 + i * 34} r={3.2} fill="rgba(0,0,0,.35)" />
            ))}
          </g>
        );
    }
  };

  const yokeOrVents = () => {
    if (!back) return null;
    const y = SHOULDER_Y + 42;
    const bottom = design.category === "dress" ? waistY : shirtBottom;
    return (
      <g stroke="rgba(0,0,0,.2)" strokeWidth="1.6" fill="none">
        {design.shirt.yoke === "Split" ? (
          <path d={`M ${CX - SH} ${y} L ${CX} ${y - 12} L ${CX + SH} ${y}`} />
        ) : design.shirt.yoke === "Western" || design.shirt.yoke === "Pointed" ? (
          <path d={`M ${CX - SH} ${y - 14} L ${CX} ${y + 18} L ${CX + SH} ${y - 14}`} />
        ) : design.shirt.yoke === "Scalloped" ? (
          <path d={`M ${CX - SH} ${y} q 24 20 48 0 q 24 20 48 0 q 24 20 48 0`} />
        ) : design.shirt.yoke === "Ventilated" || design.shirt.yoke === "Bi-swing" ? (
          <>
            <path d={`M ${CX - SH} ${y} L ${CX + SH} ${y}`} />
            <path d={`M ${CX - 40} ${y} L ${CX - 40} ${y + 60} M ${CX + 40} ${y} L ${CX + 40} ${y + 60}`} />
          </>
        ) : (
          <path d={`M ${CX - SH} ${y} L ${CX + SH} ${y}`} />
        )}
        {design.category === "dress" ? (
          <path d={`M ${CX} ${y} L ${CX} ${bottom + 40}`} strokeDasharray="5 4" />
        ) : null}
        {design.category === "suit" ? (
          design.jacket.vent === "Double" ? (
            <path d={`M ${CX - 40} ${HIP_Y - 10} L ${CX - 40} ${HIP_Y + 50} M ${CX + 40} ${HIP_Y - 10} L ${CX + 40} ${HIP_Y + 50}`} />
          ) : design.jacket.vent === "No-vent" ? null : (
            <path d={`M ${CX} ${HIP_Y - 10} L ${CX} ${HIP_Y + 50}`} />
          )
        ) : null}
      </g>
    );
  };

  const cuffs = (dir: number) => {
    if (design.category === "dress") return null;
    const y = HIP_Y + 56;
    const x = CX + dir * (SH + 6);
    const wide = ["French", "Gauntlet", "Cocktail"].includes(design.shirt.cuff);
    return (
      <rect
        x={x - dir * 16 - (dir > 0 ? 0 : 16)}
        y={y}
        width={wide ? 22 : 16}
        height={wide ? 24 : 16}
        rx={design.shirt.cuff === "Rounded" ? 8 : 2}
        fill={design.shirt.color}
        stroke="rgba(0,0,0,.2)"
      />
    );
  };

  const breastPocket = () => {
    if (back || design.category !== "suit") return null;
    const x = CX - 62;
    const y = SHOULDER_Y + 70;
    if (design.jacket.pocket === "Patch" || design.jacket.pocket === "Pleated") {
      return <rect x={x} y={y} width={34} height={30} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1.6" />;
    }
    if (design.jacket.pocket === "Slanted" || design.jacket.pocket === "Ticket") {
      return <path d={`M ${x} ${y + 10} L ${x + 34} ${y}`} stroke="rgba(0,0,0,.4)" strokeWidth="3" />;
    }
    return <path d={`M ${x} ${y} L ${x + 34} ${y}`} stroke="rgba(0,0,0,.4)" strokeWidth="3" />;
  };

  const skirtDetails = () => {
    if (design.category !== "dress") return null;
    const lines: React.ReactNode[] = [];
    if (design.dress.skirt === "Pleated") {
      for (let i = -3; i <= 3; i++) {
        const x = CX + i * (skirtHW / 3.6);
        lines.push(
          <path
            key={`p${i}`}
            d={`M ${CX + i * (WH / 3.6)} ${waistY} L ${x} ${skirtHemY - 8}`}
            stroke="rgba(0,0,0,.16)"
            strokeWidth="1.2"
            fill="none"
          />,
        );
      }
    }
    if (design.dress.skirt === "Tiered") {
      for (let i = 1; i <= 3; i++) {
        const y = waistY + ((skirtHemY - waistY) * i) / 4;
        const hw = WH + ((skirtHW - WH) * i) / 4;
        lines.push(
          <path key={`t${i}`} d={`M ${CX - hw} ${y} Q ${CX} ${y + 10} ${CX + hw} ${y}`} stroke="rgba(0,0,0,.18)" strokeWidth="1.4" fill="none" />,
        );
      }
    }
    if (design.dress.skirt === "Wrap" || design.dress.skirt === "Tulip") {
      lines.push(
        <path key="wrap" d={`M ${CX - WH} ${waistY + 6} L ${CX + skirtHW * 0.7} ${skirtHemY - 10}`} stroke="rgba(0,0,0,.18)" strokeWidth="1.6" fill="none" />,
      );
    }
    if (design.dress.skirt === "Peplum") {
      lines.push(
        <path
          key="peplum"
          d={`M ${CX - WH - 26} ${waistY + 46} Q ${CX} ${waistY + 74} ${CX + WH + 26} ${waistY + 46} Q ${CX} ${waistY - 4} ${CX - WH - 26} ${waistY + 46} Z`}
          fill={design.dress.color}
          opacity={0.95}
          stroke="rgba(0,0,0,.15)"
        />,
      );
    }
    return <g>{lines}</g>;
  };

  const waistDetail = () => {
    if (design.category !== "dress") return null;
    const strong = ["Corset", "Basque", "Empire", "Imperial", "Dropped"].includes(
      design.dress.waistline,
    );
    return (
      <g>
        <path
          d={`M ${CX - WH - 2} ${waistY} L ${CX + WH + 2} ${waistY}`}
          stroke="rgba(0,0,0,.22)"
          strokeWidth={strong ? 4 : 1.5}
        />
        {design.dress.waistline === "Corset" && !back
          ? Array.from({ length: 4 }).map((_, i) => (
              <path
                key={i}
                d={`M ${CX - 22} ${waistY - 60 + i * 16} L ${CX + 22} ${waistY - 52 + i * 16}`}
                stroke="rgba(0,0,0,.25)"
                strokeWidth="1.2"
              />
            ))
          : null}
        {design.dress.waistline === "Asymmetric" ? (
          <path d={`M ${CX - WH} ${waistY + 14} L ${CX + WH} ${waistY - 12}`} stroke="rgba(0,0,0,.25)" strokeWidth="3" />
        ) : null}
      </g>
    );
  };

  const waistbandDetail = () => {
    if (design.category === "dress") return null;
    const h =
      design.pants.waistband === "Hollywood" || design.pants.waistband === "High-rise"
        ? 20
        : design.pants.waistband === "Extended" || design.pants.waistband === "Gurkha"
          ? 16
          : 12;
    return (
      <g>
        <rect
          x={CX - HH * 0.98}
          y={pantsTopY - h}
          width={HH * 1.96}
          height={h}
          fill={design.pants.color}
          stroke="rgba(0,0,0,.25)"
        />
        {design.pants.waistband === "Elastic" || design.pants.waistband === "Tunnel" ? (
          <path
            d={`M ${CX - HH * 0.9} ${pantsTopY - h / 2} L ${CX + HH * 0.9} ${pantsTopY - h / 2}`}
            stroke="rgba(0,0,0,.2)"
            strokeDasharray="4 4"
          />
        ) : null}
        {design.pants.waistband === "Drawstring" && !back ? (
          <path d={`M ${CX - 18} ${pantsTopY} q 18 22 36 0`} stroke="rgba(0,0,0,.4)" strokeWidth="2" fill="none" />
        ) : null}
        {!back ? (
          design.pants.fly === "Zipper" ? (
            <path d={`M ${CX} ${pantsTopY} L ${CX} ${pantsTopY + 40}`} stroke="#9AA0A6" strokeWidth="3" strokeDasharray="3 3" />
          ) : (
            <g>
              {[0, 1].map((i) => (
                <circle key={i} cx={CX + 3} cy={pantsTopY + 12 + i * 18} r={3} fill="rgba(0,0,0,.4)" />
              ))}
            </g>
          )
        ) : null}
        {design.pants.hem === "Turned-up" ? (
          <g stroke="rgba(0,0,0,.25)" strokeWidth="2" fill="none">
            <path d={`M ${CX - HH * 0.6} ${pantHemY - 16} L ${CX - 12} ${pantHemY - 16}`} />
            <path d={`M ${CX + 12} ${pantHemY - 16} L ${CX + HH * 0.6} ${pantHemY - 16}`} />
          </g>
        ) : null}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full transition-all duration-500 ease-out"
      role="img"
      aria-label={`Live ${design.view} view preview of the customized ${design.category}`}
    >
      <defs>
        {patternId ? (
          <PatternDef
            id={patternId}
            name={design.pattern.name}
            primary={design.pattern.primary}
            secondary={design.pattern.secondary}
          />
        ) : null}
        <linearGradient id="dmd-sheen" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="dmd-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="25%" stopColor="#000000" stopOpacity="0" />
          <stop offset="75%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="dmd-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={CX} cy={FLOOR_Y + 12} rx={120} ry={16} fill="url(#dmd-floor)" />

      {/* body */}
      <g>
        <path d={leg(-1)} fill={skin} />
        <path d={leg(1)} fill={skinShade} />
        <path d={torso} fill={skin} />
        <path d={arm(-1)} fill={skin} />
        <path d={arm(1)} fill={skinShade} />
        <rect x={CX - 13 * s} y={94} width={26 * s} height={34} fill={skinShade} />
        <circle cx={CX} cy={64} r={30 * s} fill={skin} />
        {back ? (
          <path
            d={`M ${CX - 30 * s} 58 q 30 -40 60 0 q 6 60 -30 68 q -36 -8 -30 -68 Z`}
            fill="#3A2B25"
          />
        ) : (
          <g fill="#3A2B25">
            <path d={`M ${CX - 30 * s} 58 q 30 -44 60 0 q -14 -14 -30 -12 q -18 -2 -30 12 Z`} />
            <path d={`M ${CX - 30 * s} 56 q -4 44 6 60 q -16 -30 -6 -60 Z`} />
            <path d={`M ${CX + 30 * s} 56 q 4 44 -6 60 q 16 -30 6 -60 Z`} />
          </g>
        )}
      </g>

      {/* garment layers */}
      {design.category === "dress" ? (
        <g>
          <Piece d={skirtPath} color={design.dress.color} patternId={patternId} sheen={sheen} />
          {skirtDetails()}
          <Piece d={bodice(waistY + 2, WH)} color={design.dress.color} patternId={patternId} sheen={sheen} />
          <Piece d={sleevePath(-1)} color={design.dress.color} patternId={patternId} sheen={sheen} />
          <Piece d={sleevePath(1)} color={design.dress.color} patternId={patternId} sheen={sheen} />
          {waistDetail()}
          {!back ? <path d={necklinePath()} fill={skin} /> : null}
          {collarShape()}
          {yokeOrVents()}
        </g>
      ) : (
        <g>
          <Piece d={pantLeg(-1)} color={design.pants.color} patternId={patternId} sheen={sheen} />
          <Piece d={pantLeg(1)} color={design.pants.color} patternId={patternId} sheen={sheen} />
          {waistbandDetail()}
          <Piece
            d={shirtPath}
            color={design.shirt.color}
            patternId={design.category === "suit" ? undefined : patternId}
            sheen={sheen}
          />
          <Piece d={sleevePath(-1)} color={design.shirt.color} sheen={sheen} />
          <Piece d={sleevePath(1)} color={design.shirt.color} sheen={sheen} />
          {cuffs(-1)}
          {cuffs(1)}
          {plackets()}
          {design.category === "suit" && design.jacket.enabled ? (
            <g>
              <Piece d={jacketPanel(-1)} color={design.jacket.color} patternId={patternId} sheen={sheen} />
              <Piece d={jacketPanel(1)} color={design.jacket.color} patternId={patternId} sheen={sheen} />
              {!back ? (
                <g>
                  <path d={lapelPath(-1)} fill={design.jacket.color} stroke="rgba(0,0,0,.28)" />
                  <path d={lapelPath(1)} fill={design.jacket.color} stroke="rgba(0,0,0,.28)" />
                </g>
              ) : null}
              {breastPocket()}
            </g>
          ) : null}
          {!back ? <path d={necklinePath()} fill={skin} opacity={0.9} /> : null}
          {collarShape()}
          {yokeOrVents()}
        </g>
      )}
    </svg>
  );
}
