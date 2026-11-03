// 화면 곳곳에 놓는 아기 고양이 장면들: 맨 위 무리, 로딩 중 고양이, 맨 아래 무리
// 같은 화면에 함께 나오는 고양이는 모두 다른 마리다. (생김새는 lib/kittens.ts)
import { KITTENS, type KittenSpec } from "@/lib/kittens";
import Kitten from "./Kitten";

type Spot = { kitten: KittenSpec; size: number };

/** 맨 위: 제목 위에 모여 있는 아기 고양이들. 가운데 주황이가 가장 크다. */
const HERO: Spot[] = [
  { kitten: KITTENS.ribbon, size: 66 },
  { kitten: KITTENS.napper, size: 78 },
  { kitten: KITTENS.bell, size: 104 },
  { kitten: KITTENS.calico, size: 80 },
  { kitten: KITTENS.siamese, size: 66 },
];

/** 맨 아래: 옹기종기 모여 있는 고양이 무리 */
const FOOTER: Spot[] = [
  { kitten: KITTENS.night, size: 66 },
  { kitten: KITTENS.muffler, size: 66 },
  { kitten: KITTENS.tortie, size: 66 },
  { kitten: KITTENS.honey, size: 66 },
  { kitten: KITTENS.frost, size: 66 },
  { kitten: KITTENS.mochi, size: 66 },
];

export function KittenHero() {
  return (
    <div className="flex items-end justify-center -space-x-3" aria-hidden="true">
      {HERO.map((k, i) => (
        <Kitten
          key={k.kitten.name}
          spec={k.kitten}
          size={k.size}
          className="kitten-bob"
          // 고양이마다 움직이는 타이밍을 달리해서 한꺼번에 튀지 않게 한다
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </div>
  );
}

/** 코칭을 기다리는 동안 보여 주는 장면: 아기 고양이가 털실 공을 쫓는다 */
export function LoadingKitten() {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-brand-100"
    >
      <Kitten spec={KITTENS.yarn} size={64} className="kitten-bob shrink-0" />
      <div className="relative h-8 w-14 shrink-0" aria-hidden="true">
        {/* 털실 공 */}
        <svg viewBox="0 0 32 32" width={28} height={28} className="yarn-roll absolute left-0 top-1">
          <circle cx={16} cy={16} r={13} fill="#ff9fb4" stroke="#c75d79" strokeWidth={2} />
          <path d="M6,12 Q16,20 26,10 M5,19 Q16,26 27,17 M10,5 Q18,16 12,27" fill="none" stroke="#c75d79" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm leading-6 text-brand-700">
        고양이가 털실을 굴리며
        <br />
        코칭을 열심히 생각하고 있어요…
      </p>
    </div>
  );
}

export function KittenFooter() {
  return (
    <footer className="flex flex-col items-center gap-3 pt-4" aria-label="아기 고양이들">
      <div className="flex items-end justify-center -space-x-3" aria-hidden="true">
        {FOOTER.map((k, i) => (
          <Kitten
            key={k.kitten.name}
            spec={k.kitten}
            size={k.size}
            className="kitten-bob"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-foreground/60">오늘도 수고 많았어요. 아기 고양이들이 응원해요.</p>
    </footer>
  );
}
