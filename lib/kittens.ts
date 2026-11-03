// 아기 고양이 도감: 털 색, 무늬, 귀, 눈, 자세, 꼬리, 액세서리, 표정을 조합해 한 마리씩 정해 둔다.
// 화면에 함께 나오는 고양이가 서로 닮지 않도록 마리마다 조합을 다르게 했다. (그림은 app/components/Kitten.tsx)
// 이 파일은 데이터만 있어서 화면과 서버 어디서든 가져다 쓸 수 있다.

export type KittenFur = "orange" | "cream" | "gray" | "black" | "white" | "brown";
export type KittenPattern =
  | "plain" // 무늬 없음
  | "tabby" // 얼룩 줄무늬
  | "calico" // 삼색 (하양 바탕에 주황, 검정 얼룩)
  | "tuxedo" // 턱시도 (가슴과 발이 하얌)
  | "pointed" // 얼굴, 귀, 발, 꼬리 끝이 진한 색 (샴 고양이처럼)
  | "spotted" // 점박이
  | "cap" // 한쪽 눈과 귀에만 얼룩
  | "bicolor" // 아래쪽 얼굴과 배가 하얌
  | "tortie"; // 얼룩덜룩 거북이 무늬
export type KittenEyes = "brown" | "blue" | "green" | "amber";
export type KittenEars = "pointy" | "folded" | "round" | "tall";
export type KittenFace =
  | "happy"
  | "sleepy"
  | "love"
  | "curious"
  | "wink"
  | "sparkle"
  | "smug"
  | "surprised";
export type KittenPose = "sit" | "loaf" | "peek";
export type KittenTail = "curl" | "up" | "side";
export type KittenAccessory = "none" | "bow" | "bell" | "hat" | "flower" | "glasses" | "scarf";

export type KittenSpec = {
  /** 화면 읽기 도구가 읽어 주는 설명 */
  name: string;
  fur: KittenFur;
  pattern: KittenPattern;
  eyes: KittenEyes;
  ears: KittenEars;
  face: KittenFace;
  pose: KittenPose;
  tail: KittenTail;
  accessory: KittenAccessory;
};

export const KITTENS = {
  // ----- 맨 위에 모이는 5마리 -----
  ribbon: {
    name: "분홍 리본을 맨 하얀 아기 고양이",
    fur: "white", pattern: "plain", eyes: "blue", ears: "round",
    face: "curious", pose: "sit", tail: "up", accessory: "bow",
  },
  napper: {
    name: "낮잠 자는 회색 줄무늬 아기 고양이",
    fur: "gray", pattern: "tabby", eyes: "green", ears: "folded",
    face: "sleepy", pose: "loaf", tail: "curl", accessory: "none",
  },
  bell: {
    name: "방울 목걸이를 한 주황 줄무늬 아기 고양이",
    fur: "orange", pattern: "tabby", eyes: "brown", ears: "pointy",
    face: "happy", pose: "sit", tail: "curl", accessory: "bell",
  },
  calico: {
    name: "꽃을 꽂은 삼색 아기 고양이",
    fur: "white", pattern: "calico", eyes: "amber", ears: "pointy",
    face: "love", pose: "sit", tail: "side", accessory: "flower",
  },
  siamese: {
    name: "윙크하는 크림색 샴 아기 고양이",
    fur: "cream", pattern: "pointed", eyes: "blue", ears: "tall",
    face: "wink", pose: "peek", tail: "up", accessory: "none",
  },

  // ----- 분위기별 고양이 -----
  party: {
    name: "고깔모자를 쓴 신나는 주황 아기 고양이",
    fur: "orange", pattern: "bicolor", eyes: "green", ears: "pointy",
    face: "sparkle", pose: "sit", tail: "up", accessory: "hat",
  },
  cocoa: {
    name: "목도리를 두르고 꾸벅 조는 갈색 아기 고양이",
    fur: "brown", pattern: "plain", eyes: "brown", ears: "round",
    face: "sleepy", pose: "loaf", tail: "side", accessory: "scarf",
  },
  patch: {
    name: "한쪽 눈에 얼룩이 있는 하트 눈 아기 고양이",
    fur: "white", pattern: "cap", eyes: "green", ears: "folded",
    face: "love", pose: "sit", tail: "curl", accessory: "none",
  },
  scholar: {
    name: "안경을 쓴 검은 턱시도 아기 고양이",
    fur: "black", pattern: "tuxedo", eyes: "amber", ears: "tall",
    face: "curious", pose: "sit", tail: "up", accessory: "glasses",
  },

  // ----- 그 밖의 장면 -----
  dotty: {
    name: "점박이 크림색 아기 고양이",
    fur: "cream", pattern: "spotted", eyes: "brown", ears: "round",
    face: "curious", pose: "sit", tail: "curl", accessory: "none",
  },
  yarn: {
    name: "털실 공을 쫓는 점박이 회색 아기 고양이",
    fur: "gray", pattern: "spotted", eyes: "green", ears: "pointy",
    face: "surprised", pose: "sit", tail: "up", accessory: "none",
  },

  // ----- 맨 아래에 모이는 6마리 -----
  night: {
    name: "새침한 검은 아기 고양이",
    fur: "black", pattern: "plain", eyes: "green", ears: "round",
    face: "smug", pose: "loaf", tail: "curl", accessory: "none",
  },
  muffler: {
    name: "빨간 목도리를 한 회색 턱시도 아기 고양이",
    fur: "gray", pattern: "tuxedo", eyes: "amber", ears: "pointy",
    face: "happy", pose: "sit", tail: "up", accessory: "scarf",
  },
  tortie: {
    name: "고깔모자를 쓴 얼룩덜룩 아기 고양이",
    fur: "black", pattern: "tortie", eyes: "amber", ears: "folded",
    face: "surprised", pose: "sit", tail: "side", accessory: "hat",
  },
  honey: {
    name: "방울을 단 크림색 줄무늬 아기 고양이",
    fur: "cream", pattern: "tabby", eyes: "green", ears: "round",
    face: "sleepy", pose: "loaf", tail: "curl", accessory: "bell",
  },
  frost: {
    name: "안경을 쓴 하얀 샴 아기 고양이",
    fur: "white", pattern: "pointed", eyes: "blue", ears: "pointy",
    face: "sparkle", pose: "peek", tail: "up", accessory: "glasses",
  },
  mochi: {
    name: "윙크하는 점박이 주황 아기 고양이",
    fur: "orange", pattern: "spotted", eyes: "green", ears: "folded",
    face: "wink", pose: "sit", tail: "side", accessory: "bow",
  },
} as const satisfies Record<string, KittenSpec>;

export type KittenName = keyof typeof KITTENS;
