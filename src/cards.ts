/**
 * Các loại thẻ bài trong trò chơi
 * Lấy cảm hứng từ Exploding Kittens – có thẻ cộng điểm và thẻ nổ
 */
/**
 * Các loại bài thông thường (dùng để rút)
 */
export enum CommonPointCardType {
  PLUS_1 = "plus_1",
  PLUS_2 = "plus_2",
  PLUS_3 = "plus_3",
  PLUS_4 = "plus_4",
  PLUS_5 = "plus_5",
}
export enum CommonSpecialCardType {
  MULTIPLE = "multiple",
  DIVIDE = "divide",
  BOMB = "bomb",
  NUCLEAR = "nuclear",
}
export type CommonCardType = CommonPointCardType | CommonSpecialCardType;
/**
 * Các loại bài hiếm (dùng để lật & lấy 5 điểm)
 */
export enum RareCardType {
  CHANGE = "change",
  LOSE_ALL = "lose_all",
}
export type CardType = CommonCardType | RareCardType;

export interface BaseCard {
  /** ID duy nhất của thẻ bài */
  id: string;
  /** Tên hiển thị trên lá bài (ví dụ: "+3", "Bomb", "×2") */
  name: string;
  /** Loại bài – quyết định hiệu ứng/chức năng */
  type: CardType;
  /** Có phải là thẻ bài gây nổ không? */
  isBomb: boolean;
}

export const COMMON_POINT_CARD_INFO: Record<CommonPointCardType, Pick<BaseCard, "name" | "isBomb">> = {
  plus_1: { name: "+1", isBomb: false },
  plus_2: { name: "+2", isBomb: false },
  plus_3: { name: "+3", isBomb: false },
  plus_4: { name: "+4", isBomb: false },
  plus_5: { name: "+5", isBomb: false },
};

export const COMMON_SPECIAL_CARD_INFO: Record<CommonSpecialCardType, Pick<BaseCard, "name" | "isBomb">> = {
  multiple: { name: "×2", isBomb: false },
  divide: { name: "÷2", isBomb: false },
  bomb: { name: "Bomb", isBomb: true },
  nuclear: { name: "NUCLEAR", isBomb: true },
};

export const RARE_CARD_INFO: Record<RareCardType, Pick<BaseCard, "name">> = {
  change: { name: "Change" },
  lose_all: { name: "Lose All" },
}