// SVG <pattern> definitions used by the layered 2D preview.
// Every pattern is driven by a primary + secondary color.

type Props = { id: string; name: string; primary: string; secondary: string };

export function PatternDef({ id, name, primary, secondary }: Props) {
  const p = primary;
  const s = secondary;
  const bg = <rect width="100%" height="100%" fill={s} />;

  const wrap = (size: number, children: React.ReactNode) => (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      {bg}
      {children}
    </pattern>
  );

  switch (name) {
    case "Stripes":
      return wrap(20, <rect width="10" height="20" fill={p} />);
    case "Pinstripe":
      return wrap(12, <rect width="1.5" height="12" fill={p} />);
    case "Chalkstripe":
      return wrap(16, <rect width="3" height="16" fill={p} opacity="0.75" />);
    case "Awning":
      return wrap(28, <rect width="14" height="28" fill={p} />);
    case "Barcode":
      return wrap(24, (
        <g fill={p}>
          <rect width="2" height="24" />
          <rect x="5" width="1" height="24" />
          <rect x="9" width="3" height="24" />
          <rect x="16" width="1.5" height="24" />
          <rect x="20" width="2.5" height="24" />
        </g>
      ));
    case "Polka Dot":
      return wrap(22, (
        <g fill={p}>
          <circle cx="6" cy="6" r="3.2" />
          <circle cx="17" cy="17" r="3.2" />
        </g>
      ));
    case "Birdseye":
      return wrap(10, (
        <g fill={p}>
          <circle cx="2.5" cy="2.5" r="1.1" />
          <circle cx="7.5" cy="7.5" r="1.1" />
        </g>
      ));
    case "Chevron":
      return wrap(24, (
        <path d="M0 18 L12 6 L24 18 L24 24 L12 12 L0 24 Z" fill={p} />
      ));
    case "Herringbone":
      return wrap(16, (
        <g stroke={p} strokeWidth="2.4" fill="none">
          <path d="M0 0 L8 8 L16 0" />
          <path d="M0 8 L8 16 L16 8" />
        </g>
      ));
    case "Houndstooth":
      return wrap(20, (
        <g fill={p}>
          <path d="M0 0 H10 V10 H0 Z" />
          <path d="M10 10 L20 10 L20 20 L10 20 Z" opacity="0.85" />
          <path d="M10 0 L20 10 L10 10 Z" />
          <path d="M0 10 L10 20 L0 20 Z" />
        </g>
      ));
    case "Gingham":
      return wrap(20, (
        <g fill={p}>
          <rect width="10" height="20" opacity="0.45" />
          <rect width="20" height="10" opacity="0.45" />
        </g>
      ));
    case "Buffalo Check":
      return wrap(36, (
        <g fill={p}>
          <rect width="18" height="36" opacity="0.5" />
          <rect width="36" height="18" opacity="0.5" />
        </g>
      ));
    case "Plaid (Tartan)":
      return wrap(40, (
        <g>
          <rect width="40" height="14" fill={p} opacity="0.55" />
          <rect width="14" height="40" fill={p} opacity="0.55" />
          <rect x="24" width="4" height="40" fill={p} />
          <rect y="24" width="40" height="4" fill={p} />
        </g>
      ));
    case "Glen Plaid":
      return wrap(28, (
        <g stroke={p} strokeWidth="1.4" fill="none" opacity="0.8">
          <path d="M0 7 H28 M0 21 H28 M7 0 V28 M21 0 V28" />
          <path d="M0 0 L28 28 M28 0 L0 28" strokeWidth="0.6" />
        </g>
      ));
    case "Madras":
      return wrap(32, (
        <g>
          <rect width="32" height="8" fill={p} opacity="0.5" />
          <rect y="16" width="32" height="4" fill={p} opacity="0.8" />
          <rect width="8" height="32" fill={p} opacity="0.4" />
          <rect x="20" width="3" height="32" fill={p} opacity="0.7" />
        </g>
      ));
    case "Windowpane":
      return wrap(34, (
        <g stroke={p} strokeWidth="1.6" fill="none">
          <path d="M0 0 H34 M0 0 V34" />
        </g>
      ));
    case "Argyle":
      return wrap(32, (
        <g>
          <path d="M16 0 L32 16 L16 32 L0 16 Z" fill={p} opacity="0.65" />
          <path d="M16 0 L32 16 L16 32 L0 16 Z" fill="none" stroke={p} strokeWidth="1" />
          <path d="M0 0 L32 32 M32 0 L0 32" stroke={p} strokeWidth="0.8" opacity="0.6" />
        </g>
      ));
    case "Floral":
      return wrap(34, (
        <g>
          <g fill={p}>
            <circle cx="10" cy="8" r="3" />
            <circle cx="16" cy="8" r="3" />
            <circle cx="13" cy="4" r="3" />
            <circle cx="13" cy="12" r="3" />
          </g>
          <circle cx="13" cy="8" r="2" fill={s} />
          <path d="M24 20 q6 4 2 10" stroke={p} strokeWidth="1.4" fill="none" />
          <circle cx="26" cy="24" r="4" fill={p} opacity="0.7" />
        </g>
      ));
    case "Paisley":
      return wrap(36, (
        <g fill="none" stroke={p} strokeWidth="1.8">
          <path d="M10 28 C4 20 10 8 20 10 C28 12 26 24 16 24 C12 24 12 18 17 17" />
          <circle cx="19" cy="16" r="2" fill={p} stroke="none" />
        </g>
      ));
    case "Animal Print":
      return wrap(30, (
        <g fill={p}>
          <ellipse cx="8" cy="9" rx="4.5" ry="3" transform="rotate(-20 8 9)" />
          <ellipse cx="22" cy="20" rx="5" ry="3.2" transform="rotate(15 22 20)" />
          <ellipse cx="24" cy="6" rx="2.6" ry="1.8" />
        </g>
      ));
    case "Camo":
      return wrap(44, (
        <g fill={p}>
          <path d="M2 6 q10 -6 18 2 t14 4 q-6 8 -16 6 T2 6 Z" />
          <path d="M6 30 q10 -4 14 6 t-12 6 q-8 -4 -2 -12 Z" opacity="0.75" />
          <path d="M30 26 q10 2 8 12 -10 2 -12 -6 Z" opacity="0.6" />
        </g>
      ));
    case "Tie-Dye":
      return (
        <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
          {bg}
          <g>
            <circle cx="30" cy="30" r="26" fill={p} opacity="0.25" />
            <circle cx="30" cy="30" r="18" fill={p} opacity="0.35" />
            <circle cx="30" cy="30" r="9" fill={p} opacity="0.6" />
          </g>
        </pattern>
      );
    case "Toile de Jouy":
      return wrap(40, (
        <g stroke={p} strokeWidth="1.2" fill="none">
          <path d="M6 30 q6 -12 14 -4 t12 -8" />
          <circle cx="12" cy="14" r="4" />
          <path d="M24 30 l4 -8 l4 8 Z" />
        </g>
      ));
    case "Damask":
      return wrap(40, (
        <g fill={p} opacity="0.75">
          <path d="M20 4 q10 8 0 16 q-10 -8 0 -16 Z" />
          <path d="M20 20 q12 10 0 18 q-12 -8 0 -18 Z" opacity="0.7" />
          <circle cx="20" cy="20" r="2.4" />
        </g>
      ));
    case "Ikat":
      return wrap(30, (
        <g fill={p}>
          <path d="M4 4 l6 6 l-6 6 l-4 -6 Z" opacity="0.8" />
          <path d="M20 14 l6 7 l-6 7 l-5 -7 Z" opacity="0.65" />
          <path d="M22 0 l4 5 l-4 5 l-4 -5 Z" opacity="0.5" />
        </g>
      ));
    case "Abstract":
      return wrap(40, (
        <g stroke={p} strokeWidth="2" fill="none">
          <path d="M0 30 q12 -22 24 -4 t16 -8" />
          <circle cx="10" cy="10" r="4" fill={p} stroke="none" opacity="0.7" />
        </g>
      ));
    default:
      return (
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          {bg}
        </pattern>
      );
  }
}
