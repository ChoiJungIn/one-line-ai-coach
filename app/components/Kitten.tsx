// 직접 그린 아기 고양이 그림(SVG). AI 이미지가 아니라서 요금이 들지 않고, 파일을 따로 내려받지도 않는다.
// 털 색(coat)과 표정(face)을 바꿔 여러 마리를 만든다.
import type { CSSProperties } from "react";
import type { KittenCoat, KittenFace } from "@/lib/coach";

type Palette = {
  base: string; // 털 색
  shade: string; // 줄무늬 색
  muzzle: string; // 입 주변
  outline: string; // 테두리와 수염
  eye: string; // 눈 색
  inner: string; // 귀 안쪽
};

const PALETTE: Record<KittenCoat, Palette> = {
  orange: { base: "#f7b267", shade: "#e48a3b", muzzle: "#fff0dc", outline: "#7a4a2a", eye: "#2d1f16", inner: "#ffb3c1" },
  gray: { base: "#bcc5d3", shade: "#8f9aab", muzzle: "#f4f6fa", outline: "#4f5a6c", eye: "#242a35", inner: "#ffc2cf" },
  white: { base: "#fffaf2", shade: "#eadfce", muzzle: "#ffffff", outline: "#9a8672", eye: "#2d2420", inner: "#ffc2cf" },
  black: { base: "#4b4b5a", shade: "#303040", muzzle: "#7a7a8c", outline: "#1d1d27", eye: "#ffd45e", inner: "#e58a9f" },
};

type Props = {
  coat: KittenCoat;
  face: KittenFace;
  /** 가로·세로 크기(px) */
  size?: number;
  /** 몸통과 꼬리까지 그릴지 (false면 머리만) */
  body?: boolean;
  className?: string;
  style?: CSSProperties;
  /** 화면 읽기 도구가 읽어 줄 설명. 장식이면 비워 둔다. */
  label?: string;
};

export default function Kitten({
  coat,
  face,
  size = 96,
  body = true,
  className,
  style,
  label,
}: Props) {
  const p = PALETTE[coat];
  const line = { stroke: p.outline, strokeWidth: 2.4, strokeLinejoin: "round" as const };
  // 호기심 표정은 고개를 살짝 갸웃한다
  const tilt = face === "curious" ? -6 : 0;
  const tabby = coat === "orange" || coat === "gray";

  // 동그란 눈 (눈동자와 반짝임). 검은 고양이는 노란 눈에 세로 눈동자를 그린다.
  const roundEye = (cx: number, rx: number, ry: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={60} rx={rx} ry={ry} fill={p.eye} />
      {coat === "black" && <ellipse cx={cx} cy={60} rx={2.2} ry={ry - 1.5} fill="#1d1d27" />}
      <circle cx={cx + 1.6} cy={57} r={2.2} fill="#fff" />
      <circle cx={cx - 1.8} cy={63.5} r={1.1} fill="#fff" />
    </g>
  );

  const arcEye = (d: string) => (
    <path d={d} fill="none" stroke={p.outline} strokeWidth={2.6} strokeLinecap="round" />
  );

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
      {body && (
        <g>
          {/* 꼬리 */}
          <path d="M86,104 C106,104 112,88 104,78" fill="none" stroke={p.outline} strokeWidth={11} strokeLinecap="round" />
          <path d="M86,104 C106,104 112,88 104,78" fill="none" stroke={p.base} strokeWidth={7} strokeLinecap="round" />
          {/* 몸통과 앞발 */}
          <ellipse cx={60} cy={100} rx={28} ry={19} fill={p.base} {...line} />
          <ellipse cx={47} cy={113} rx={9} ry={5.5} fill={p.muzzle} {...line} />
          <ellipse cx={73} cy={113} rx={9} ry={5.5} fill={p.muzzle} {...line} />
        </g>
      )}

      <g transform={`rotate(${tilt} 60 60)`}>
        {/* 귀 */}
        <polygon points="27,46 28,12 56,28" fill={p.base} {...line} />
        <polygon points="93,46 92,12 64,28" fill={p.base} {...line} />
        <polygon points="34,38 34,21 48,29" fill={p.inner} />
        <polygon points="86,38 86,21 72,29" fill={p.inner} />

        {/* 머리 */}
        <ellipse cx={60} cy={60} rx={38} ry={33} fill={p.base} {...line} />

        {/* 이마 줄무늬 */}
        {tabby && (
          <g fill="none" stroke={p.shade} strokeWidth={3} strokeLinecap="round">
            <path d="M60,28 L60,37" />
            <path d="M51,30 L53,37" />
            <path d="M69,30 L67,37" />
          </g>
        )}

        {/* 입 주변과 볼 */}
        <ellipse cx={60} cy={71} rx={15} ry={10} fill={p.muzzle} />
        <ellipse cx={37} cy={71} rx={6.5} ry={4} fill="#ff9fb4" opacity={face === "love" ? 0.75 : 0.5} />
        <ellipse cx={83} cy={71} rx={6.5} ry={4} fill="#ff9fb4" opacity={face === "love" ? 0.75 : 0.5} />

        {/* 눈: 표정마다 다르게 */}
        {face === "happy" && (
          <>
            {roundEye(46, 5.5, 7)}
            {roundEye(74, 5.5, 7)}
          </>
        )}
        {face === "curious" && (
          <>
            {roundEye(46, 6.5, 8.5)}
            {roundEye(74, 6.5, 8.5)}
          </>
        )}
        {face === "sleepy" && (
          <>
            {arcEye("M40,60 Q46,66 52,60")}
            {arcEye("M68,60 Q74,66 80,60")}
          </>
        )}
        {face === "love" && (
          <>
            {arcEye("M40,63 Q46,55 52,63")}
            {arcEye("M68,63 Q74,55 80,63")}
          </>
        )}

        {/* 코 */}
        <polygon points="56.5,67 63.5,67 60,71.5" fill="#f27a98" stroke={p.outline} strokeWidth={1.2} strokeLinejoin="round" />

        {/* 입 */}
        {face === "happy" ? (
          <path d="M52,74 Q60,86 68,74 Z" fill="#e8657f" stroke={p.outline} strokeWidth={1.6} strokeLinejoin="round" />
        ) : face === "curious" ? (
          <ellipse cx={60} cy={77} rx={2.2} ry={2.8} fill="#e8657f" stroke={p.outline} strokeWidth={1.2} />
        ) : (
          <path
            d="M60,71.5 L60,74.5 M60,74.5 Q55,79 50.5,75 M60,74.5 Q65,79 69.5,75"
            fill="none"
            stroke={p.outline}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        )}

        {/* 수염 */}
        <g stroke={p.outline} strokeWidth={1.4} strokeLinecap="round" opacity={0.6}>
          <path d="M30,68 L13,64" />
          <path d="M30,72 L13,74" />
          <path d="M90,68 L107,64" />
          <path d="M90,72 L107,74" />
        </g>

        {/* 표정에 곁들이는 작은 그림 */}
        {face === "happy" && (
          <path d="M20,20 L22,25 L27,27 L22,29 L20,34 L18,29 L13,27 L18,25 Z" fill="#ffd45e" />
        )}
        {face === "sleepy" && (
          <g fill="none" stroke={p.outline} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M92,16 L101,16 L92,26 L101,26" />
            <path d="M103,6 L109,6 L103,13 L109,13" />
          </g>
        )}
        {face === "love" && (
          <path
            transform="translate(86 6)"
            d="M0,6 C0,0 9,0 9,6 C9,0 18,0 18,6 C18,12 9,17 9,19 C9,17 0,12 0,6 Z"
            fill="#ff5f85"
          />
        )}
        {face === "curious" && (
          <g fill="none" stroke={p.outline} strokeWidth={2.4} strokeLinecap="round">
            <path d="M94,22 Q94,13 102,13 Q110,13 110,20 Q110,25 104,27 L104,30" />
            <circle cx={104} cy={36} r={1.4} fill={p.outline} stroke="none" />
          </g>
        )}
      </g>
    </svg>
  );
}
