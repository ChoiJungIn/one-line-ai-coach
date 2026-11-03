// 직접 그린 아기 고양이 그림(SVG). AI 이미지가 아니라서 요금이 들지 않고, 파일을 따로 내려받지도 않는다.
// 한 마리의 생김새는 lib/kittens.ts의 KittenSpec(털 색, 무늬, 귀, 눈, 자세, 꼬리, 액세서리, 표정)으로 정해진다.
import { useId, type CSSProperties, type ReactNode } from "react";
import type { KittenEyes, KittenFur, KittenSpec } from "@/lib/kittens";

type Fur = {
  base: string; // 털 색
  shade: string; // 줄무늬와 점 색
  muzzle: string; // 입 주변과 발
  line: string; // 테두리와 수염
  inner: string; // 귀 안쪽
};

const FUR: Record<KittenFur, Fur> = {
  orange: { base: "#f7b267", shade: "#e48a3b", muzzle: "#fff0dc", line: "#7a4a2a", inner: "#ffb3c1" },
  cream: { base: "#f8e3bf", shade: "#dcb87e", muzzle: "#fffaf0", line: "#8a6a42", inner: "#ffc2cf" },
  gray: { base: "#bcc5d3", shade: "#8f9aab", muzzle: "#f4f6fa", line: "#4f5a6c", inner: "#ffc2cf" },
  black: { base: "#4b4b5a", shade: "#303040", muzzle: "#7a7a8c", line: "#1d1d27", inner: "#e58a9f" },
  white: { base: "#fffaf2", shade: "#eadfce", muzzle: "#ffffff", line: "#9a8672", inner: "#ffc2cf" },
  brown: { base: "#b98a63", shade: "#8a5f3c", muzzle: "#e8cfb4", line: "#4d3220", inner: "#e8a0a8" },
};

/** 샴 무늬(pointed)에서 얼굴, 귀, 발, 꼬리 끝에 칠하는 진한 색 */
const POINT: Record<KittenFur, string> = {
  orange: "#b5651d",
  cream: "#9a6f4a",
  gray: "#5c6678",
  black: "#1d1d27",
  white: "#7f8ba0",
  brown: "#5a3a24",
};

/** 삼색, 거북이 무늬에 쓰는 얼룩 색 */
const PATCH = { orange: "#f0a35a", dark: "#4b4b5a", brown: "#8a5f3c" };

const IRIS: Record<KittenEyes, string> = {
  brown: "#3a2a1f",
  blue: "#5aa9e6",
  green: "#5fbf7a",
  amber: "#f0b429",
};

type Props = {
  spec: KittenSpec;
  /** 가로·세로 크기(px) */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** 화면 읽기 도구가 읽어 줄 설명. 장식이면 비워 둔다. */
  label?: string;
};

export default function Kitten({ spec, size = 96, className, style, label }: Props) {
  const uid = useId().replace(/:/g, "");
  const headClip = `h${uid}`;
  const bodyClip = `b${uid}`;

  const f = FUR[spec.fur];
  const { pattern, face, pose, accessory } = spec;
  const pointed = pattern === "pointed";
  const tuxedo = pattern === "tuxedo";
  const point = POINT[spec.fur];
  const iris = IRIS[spec.eyes];
  const dark = iris === IRIS.brown;
  const line = { stroke: f.line, strokeWidth: 2.4, strokeLinejoin: "round" as const };

  // 발과 꼬리 색
  const pawColor = tuxedo ? "#ffffff" : pointed ? point : f.muzzle;
  const tailColor = pointed ? point : f.base;
  // 귀 색: 삼색은 양쪽이 다르고, 샴은 진하다
  const earL = pattern === "calico" ? PATCH.orange : pointed ? point : f.base;
  const earR = pattern === "calico" ? PATCH.dark : pattern === "cap" ? PATCH.orange : pointed ? point : f.base;
  const tilt = face === "curious" ? -6 : face === "wink" ? 5 : 0;

  // ---------- 몸통 ----------
  const bodyEllipse =
    pose === "loaf" ? { cx: 60, cy: 98, rx: 40, ry: 20 } : { cx: 60, cy: 100, rx: 28, ry: 19 };

  const tailPath =
    spec.tail === "up"
      ? "M88,102 C100,100 102,82 96,64"
      : spec.tail === "side"
        ? "M88,108 Q108,110 112,94"
        : "M86,104 C106,104 112,88 104,78";
  const tail = (
    <g>
      <path d={tailPath} fill="none" stroke={f.line} strokeWidth={11} strokeLinecap="round" />
      <path d={tailPath} fill="none" stroke={tailColor} strokeWidth={7} strokeLinecap="round" />
    </g>
  );

  const bodyPattern = (() => {
    switch (pattern) {
      case "tabby":
        return (
          <g fill="none" stroke={f.shade} strokeWidth={3} strokeLinecap="round">
            <path d="M42,88 q4,6 0,12" />
            <path d="M53,84 q4,7 0,15" />
            <path d="M67,84 q-4,7 0,15" />
            <path d="M78,88 q-4,6 0,12" />
          </g>
        );
      case "calico":
        return (
          <>
            <ellipse cx={44} cy={96} rx={12} ry={9} fill={PATCH.orange} />
            <ellipse cx={78} cy={104} rx={11} ry={8} fill={PATCH.dark} />
          </>
        );
      case "tuxedo":
        return <ellipse cx={60} cy={94} rx={11} ry={13} fill="#ffffff" />;
      case "spotted":
        return (
          <g fill={f.shade} opacity={0.85}>
            <circle cx={46} cy={94} r={3} />
            <circle cx={58} cy={106} r={3.2} />
            <circle cx={72} cy={92} r={2.8} />
            <circle cx={78} cy={106} r={3} />
          </g>
        );
      case "bicolor":
        return <ellipse cx={60} cy={108} rx={17} ry={13} fill="#ffffff" />;
      case "tortie":
        return (
          <>
            <ellipse cx={48} cy={92} rx={10} ry={8} fill={PATCH.orange} />
            <ellipse cx={74} cy={106} rx={10} ry={7} fill={PATCH.brown} />
            <ellipse cx={76} cy={92} rx={6} ry={5} fill={PATCH.orange} />
          </>
        );
      default:
        return null;
    }
  })();

  // ---------- 귀 ----------
  const ears = (() => {
    switch (spec.ears) {
      case "tall":
        return (
          <>
            <polygon points="25,46 22,4 54,26" fill={earL} {...line} />
            <polygon points="95,46 98,4 66,26" fill={earR} {...line} />
            <polygon points="31,38 28,16 46,28" fill={f.inner} />
            <polygon points="89,38 92,16 74,28" fill={f.inner} />
          </>
        );
      case "round":
        return (
          <>
            <ellipse cx={34} cy={27} rx={13} ry={14} transform="rotate(-18 34 27)" fill={earL} {...line} />
            <ellipse cx={86} cy={27} rx={13} ry={14} transform="rotate(18 86 27)" fill={earR} {...line} />
            <ellipse cx={34} cy={29} rx={7} ry={8} transform="rotate(-18 34 29)" fill={f.inner} />
            <ellipse cx={86} cy={29} rx={7} ry={8} transform="rotate(18 86 29)" fill={f.inner} />
          </>
        );
      case "folded":
        return (
          <>
            <polygon points="27,44 29,22 54,24" fill={earL} {...line} />
            <polygon points="93,44 91,22 66,24" fill={earR} {...line} />
            <path d="M31,30 L48,29" stroke={f.line} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
            <path d="M89,30 L72,29" stroke={f.line} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
          </>
        );
      default:
        return (
          <>
            <polygon points="27,46 28,12 56,28" fill={earL} {...line} />
            <polygon points="93,46 92,12 64,28" fill={earR} {...line} />
            <polygon points="34,38 34,21 48,29" fill={f.inner} />
            <polygon points="86,38 86,21 72,29" fill={f.inner} />
          </>
        );
    }
  })();

  // ---------- 머리 위 무늬 (머리 모양 안으로 잘라서 그린다) ----------
  const headPattern = (() => {
    switch (pattern) {
      case "tabby":
        return (
          <g fill="none" stroke={f.shade} strokeWidth={3} strokeLinecap="round">
            <path d="M60,28 L60,37" />
            <path d="M51,30 L53,37" />
            <path d="M69,30 L67,37" />
            <path d="M24,58 L33,60" />
            <path d="M24,65 L33,66" />
            <path d="M96,58 L87,60" />
            <path d="M96,65 L87,66" />
          </g>
        );
      case "calico":
        return (
          <>
            <ellipse cx={36} cy={38} rx={17} ry={15} fill={PATCH.orange} />
            <ellipse cx={84} cy={40} rx={16} ry={14} fill={PATCH.dark} />
          </>
        );
      case "tuxedo":
        return <polygon points="60,30 52,52 60,60 68,52" fill="#ffffff" />;
      case "pointed":
        return <ellipse cx={60} cy={66} rx={22} ry={18} fill={point} opacity={0.85} />;
      case "spotted":
        return (
          <g fill={f.shade} opacity={0.85}>
            <circle cx={48} cy={36} r={2.8} />
            <circle cx={60} cy={30} r={2.8} />
            <circle cx={72} cy={36} r={2.8} />
            <circle cx={38} cy={50} r={2.6} />
            <circle cx={82} cy={50} r={2.6} />
            <circle cx={60} cy={42} r={2.2} />
          </g>
        );
      case "cap":
        return <ellipse cx={82} cy={48} rx={18} ry={16} fill={PATCH.orange} />;
      case "bicolor":
        return (
          <>
            <ellipse cx={60} cy={84} rx={36} ry={24} fill="#ffffff" />
            <polygon points="60,32 53,60 67,60" fill="#ffffff" />
          </>
        );
      case "tortie":
        return (
          <>
            <ellipse cx={38} cy={40} rx={13} ry={12} fill={PATCH.orange} />
            <ellipse cx={84} cy={44} rx={13} ry={11} fill={PATCH.brown} />
            <ellipse cx={60} cy={36} rx={8} ry={6} fill={PATCH.orange} />
          </>
        );
      default:
        return null;
    }
  })();

  // ---------- 눈 ----------
  // 동그란 눈: 홍채, 세로 눈동자, 반짝임
  const roundEye = (cx: number, rx: number, ry: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={60} rx={rx} ry={ry} fill={iris} />
      {!dark && <ellipse cx={cx} cy={60} rx={rx * 0.42} ry={ry - 1.4} fill="#1d1d27" />}
      <circle cx={cx + 1.6} cy={57} r={2.2} fill="#fff" />
      <circle cx={cx - 1.8} cy={63.5} r={1.1} fill="#fff" />
    </g>
  );
  const arcEye = (d: string) => (
    <path key={d} d={d} fill="none" stroke={f.line} strokeWidth={2.6} strokeLinecap="round" />
  );
  // 별처럼 반짝이는 눈
  const starEye = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={60} rx={6} ry={8} fill={iris} />
      {!dark && <ellipse cx={cx} cy={60} rx={2.6} ry={6.4} fill="#1d1d27" />}
      <path
        d={`M${cx - 1},${54} l1.4,3.2 3.2,1.4 -3.2,1.4 -1.4,3.2 -1.4,-3.2 -3.2,-1.4 3.2,-1.4 z`}
        fill="#fff"
      />
      <circle cx={cx + 2.6} cy={64.5} r={1.2} fill="#fff" />
    </g>
  );

  const eyes = (() => {
    switch (face) {
      case "happy":
        return [roundEye(46, 5.5, 7), roundEye(74, 5.5, 7)];
      case "curious":
        return [roundEye(46, 6.5, 8.5), roundEye(74, 6.5, 8.5)];
      case "surprised":
        return [roundEye(46, 7.2, 9.5), roundEye(74, 7.2, 9.5)];
      case "sparkle":
        return [starEye(46), starEye(74)];
      case "sleepy":
        return [arcEye("M40,60 Q46,66 52,60"), arcEye("M68,60 Q74,66 80,60")];
      case "love":
        return [arcEye("M40,63 Q46,55 52,63"), arcEye("M68,63 Q74,55 80,63")];
      case "wink":
        return [roundEye(46, 5.5, 7), arcEye("M68,62 Q74,55 80,62")];
      case "smug":
        return [
          <g key="s1">
            <ellipse cx={46} cy={61} rx={5.5} ry={4.2} fill={iris} />
            {!dark && <ellipse cx={46} cy={61} rx={2.3} ry={3.4} fill="#1d1d27" />}
            <path d="M39,58 L53,58" stroke={f.line} strokeWidth={2.4} strokeLinecap="round" />
          </g>,
          <g key="s2">
            <ellipse cx={74} cy={61} rx={5.5} ry={4.2} fill={iris} />
            {!dark && <ellipse cx={74} cy={61} rx={2.3} ry={3.4} fill="#1d1d27" />}
            <path d="M67,58 L81,58" stroke={f.line} strokeWidth={2.4} strokeLinecap="round" />
          </g>,
        ];
    }
  })();

  // ---------- 입 ----------
  const mouth = (() => {
    switch (face) {
      case "happy":
      case "sparkle":
        return (
          <path d="M52,74 Q60,86 68,74 Z" fill="#e8657f" stroke={f.line} strokeWidth={1.6} strokeLinejoin="round" />
        );
      case "curious":
        return <ellipse cx={60} cy={77} rx={2.2} ry={2.8} fill="#e8657f" stroke={f.line} strokeWidth={1.2} />;
      case "surprised":
        return <ellipse cx={60} cy={78} rx={3.4} ry={4.2} fill="#e8657f" stroke={f.line} strokeWidth={1.2} />;
      case "smug":
        return (
          <path
            d="M60,71.5 L60,74 M60,74 Q56,77 52,74.5 M60,74 Q66,78 71,72.5"
            fill="none"
            stroke={f.line}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M60,71.5 L60,74.5 M60,74.5 Q55,79 50.5,75 M60,74.5 Q65,79 69.5,75"
            fill="none"
            stroke={f.line}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        );
    }
  })();

  // ---------- 표정에 곁들이는 작은 그림 ----------
  const extras: ReactNode = (() => {
    switch (face) {
      case "happy":
        return <path d="M20,20 L22,25 L27,27 L22,29 L20,34 L18,29 L13,27 L18,25 Z" fill="#ffd45e" />;
      case "sparkle":
        return (
          <g fill="#ffd45e">
            <path d="M16,22 L18,27 L23,29 L18,31 L16,36 L14,31 L9,29 L14,27 Z" />
            <path d="M104,16 L105.5,20 L109.5,21.5 L105.5,23 L104,27 L102.5,23 L98.5,21.5 L102.5,20 Z" />
          </g>
        );
      case "sleepy":
        return (
          <g fill="none" stroke={f.line} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M92,16 L101,16 L92,26 L101,26" />
            <path d="M103,6 L109,6 L103,13 L109,13" />
          </g>
        );
      case "love":
        return (
          <path
            transform="translate(86 6)"
            d="M0,6 C0,0 9,0 9,6 C9,0 18,0 18,6 C18,12 9,17 9,19 C9,17 0,12 0,6 Z"
            fill="#ff5f85"
          />
        );
      case "curious":
        return (
          <g fill="none" stroke={f.line} strokeWidth={2.4} strokeLinecap="round">
            <path d="M94,22 Q94,13 102,13 Q110,13 110,20 Q110,25 104,27 L104,30" />
            <circle cx={104} cy={36} r={1.4} fill={f.line} stroke="none" />
          </g>
        );
      case "wink":
        return <path d="M100,24 L102,29 L107,31 L102,33 L100,38 L98,33 L93,31 L98,29 Z" fill="#ffd45e" />;
      case "surprised":
        return (
          <g stroke={f.line} strokeWidth={2.6} strokeLinecap="round">
            <path d="M100,12 L100,24" />
            <circle cx={100} cy={31} r={1.5} fill={f.line} stroke="none" />
          </g>
        );
      default:
        return null;
    }
  })();

  // ---------- 액세서리 ----------
  const bow = (
    <g transform="translate(24 16)">
      <polygon points="0,4 12,-3 12,11" fill="#ff7aa8" stroke="#c2487a" strokeWidth={1.4} strokeLinejoin="round" />
      <polygon points="22,4 10,-3 10,11" fill="#ff7aa8" stroke="#c2487a" strokeWidth={1.4} strokeLinejoin="round" />
      <circle cx={11} cy={4} r={3.4} fill="#ff4f8b" stroke="#c2487a" strokeWidth={1.2} />
    </g>
  );
  const hat = (
    <g>
      <polygon points="48,28 60,2 72,28" fill="#7cc4ff" stroke="#3a78b5" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M52,21 L68,21 M55,14 L65,14" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={60} cy={3} r={3.6} fill="#ffd45e" stroke="#c99a1d" strokeWidth={1.2} />
    </g>
  );
  const flower = (
    <g transform="translate(88 22)">
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle
          key={deg}
          // 서버와 브라우저가 소수점 아래 끝자리까지 같게 계산하도록 반올림한다 (다르면 화면이 어긋났다고 경고가 뜬다)
          cx={Number((4.6 * Math.cos((deg * Math.PI) / 180)).toFixed(2))}
          cy={Number((4.6 * Math.sin((deg * Math.PI) / 180)).toFixed(2))}
          r={3.6}
          fill="#ff9fc4"
          stroke="#d4608f"
          strokeWidth={1}
        />
      ))}
      <circle r={2.8} fill="#ffd45e" />
    </g>
  );
  const glasses = (
    <g fill="rgba(255,255,255,0.28)" stroke="#3a3a4a" strokeWidth={2.2} strokeLinecap="round">
      <circle cx={46} cy={60} r={11} />
      <circle cx={74} cy={60} r={11} />
      <path d="M57,59 Q60,56 63,59" fill="none" />
      <path d="M35,58 L28,54 M85,58 L92,54" fill="none" />
    </g>
  );
  const bell = (
    <g>
      <path d="M36,88 Q60,104 84,88" fill="none" stroke="#e0556a" strokeWidth={6} strokeLinecap="round" />
      <circle cx={60} cy={98} r={5.2} fill="#ffd45e" stroke="#b88a14" strokeWidth={1.4} />
      <path d="M57,98 L63,98" stroke="#b88a14" strokeWidth={1.2} strokeLinecap="round" />
    </g>
  );
  const scarf = (
    <g>
      <path d="M34,88 Q60,106 86,88 L86,98 Q60,116 34,98 Z" fill="#e8574d" stroke="#9c2f28" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M62,102 L74,104 L72,118 L60,116 Z" fill="#e8574d" stroke="#9c2f28" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M44,94 L48,101 M54,98 L58,105" stroke="#ffd2cf" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );

  const showsNeckThing = pose !== "peek";

  // ---------- 조립 ----------
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <clipPath id={headClip}>
          <ellipse cx={60} cy={60} rx={38} ry={33} />
        </clipPath>
        <clipPath id={bodyClip}>
          <ellipse {...bodyEllipse} />
        </clipPath>
      </defs>

      <g transform={pose === "peek" ? "translate(0 8)" : undefined}>
        {pose !== "peek" && (
          <g>
            {tail}
            {/* 몸통과 무늬 */}
            <ellipse {...bodyEllipse} fill={f.base} {...line} />
            <g clipPath={`url(#${bodyClip})`}>{bodyPattern}</g>
            {/* 앞발 */}
            <ellipse cx={pose === "loaf" ? 44 : 47} cy={113} rx={9} ry={5.5} fill={pawColor} {...line} />
            <ellipse cx={pose === "loaf" ? 76 : 73} cy={113} rx={9} ry={5.5} fill={pawColor} {...line} />
          </g>
        )}

        <g transform={`rotate(${tilt} 60 60)`}>
          {ears}
          <ellipse cx={60} cy={60} rx={38} ry={33} fill={f.base} {...line} />
          <g clipPath={`url(#${headClip})`}>{headPattern}</g>

          {/* 입 주변과 볼 */}
          <ellipse cx={60} cy={71} rx={tuxedo ? 17 : 15} ry={tuxedo ? 12 : 10} fill={tuxedo ? "#ffffff" : f.muzzle} />
          <ellipse cx={37} cy={71} rx={6.5} ry={4} fill="#ff9fb4" opacity={face === "love" ? 0.75 : 0.5} />
          <ellipse cx={83} cy={71} rx={6.5} ry={4} fill="#ff9fb4" opacity={face === "love" ? 0.75 : 0.5} />

          {eyes}

          {/* 코 */}
          <polygon points="56.5,67 63.5,67 60,71.5" fill="#f27a98" stroke={f.line} strokeWidth={1.2} strokeLinejoin="round" />
          {mouth}

          {/* 수염 */}
          <g stroke={f.line} strokeWidth={1.4} strokeLinecap="round" opacity={0.6}>
            <path d="M30,68 L13,64" />
            <path d="M30,72 L13,74" />
            <path d="M90,68 L107,64" />
            <path d="M90,72 L107,74" />
          </g>

          {extras}
          {accessory === "bow" && bow}
          {accessory === "hat" && hat}
          {accessory === "flower" && flower}
          {accessory === "glasses" && glasses}
        </g>

        {/* 목에 두르는 것은 머리 아래에 그린다 */}
        {showsNeckThing && accessory === "bell" && bell}
        {showsNeckThing && accessory === "scarf" && scarf}

        {/* 턱을 괸 앞발 */}
        {pose === "peek" && (
          <g fill={pawColor} {...line}>
            <ellipse cx={42} cy={98} rx={11} ry={8} />
            <ellipse cx={78} cy={98} rx={11} ry={8} />
            <path d="M38,98 L38,102 M42,97 L42,102 M46,98 L46,102" fill="none" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
            <path d="M74,98 L74,102 M78,97 L78,102 M82,98 L82,102" fill="none" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
          </g>
        )}
      </g>
    </svg>
  );
}
