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
export enum PlaceholderCardType {
  PLACEHOLDER = "placeholder"
}
export type CardType =
  PlaceholderCardType
  | CommonCardType
  | RareCardType;

export interface CardMetadata {
  /** Hình ảnh - object chứa đường dẫn và text thay thế */
  img: {
    src: string;
    alt: string;
  };
  /** SFX - đường dẫn tới audio của thẻ bài */
  sfx?: string;
}

export interface Card {
  /** ID duy nhất của thẻ bài */
  id: string;
  /** Tên hiển thị trên lá bài (ví dụ: "+3", "Bomb", "×2") */
  name: string;
  /** Loại bài – quyết định hiệu ứng/chức năng */
  type: CardType;
  /** Metadata - thông tin bổ sung của thẻ bài */
  metadata: CardMetadata;
  /** Có phải là thẻ bài gây nổ không? */
  isBomb: boolean;
}

export const COMMON_POINT_CARD_INFO: Record<CommonPointCardType, Omit<Card, "id" | "type">> = {
  plus_1: {
    name: "+1",
    isBomb: false,
    metadata: {
      img: {
        src: "./assets/card_plus_1.png",
        alt: "+1 Point Card"
      },
      sfx: ""
    }
  },
  plus_2: {
    name: "+2",
    isBomb: false,
    metadata: {
      img: {
        src: "./assets/card_plus_2.png",
        alt: "+2 Points Card"
      },
      sfx: ""
    }
  },
  plus_3: {
    name: "+3",
    isBomb: false,
    metadata: {
      img: {
        src: "./assets/card_plus_3.png",
        alt: "+3 Points Card"
      },
      sfx: ""
    }
  },
  plus_4: {
    name: "+4",
    isBomb: false,
    metadata: {
      img: {
        src: "./assets/card_plus_4.png",
        alt: "+4 Points Card"
      },
      sfx: ""
    }
  },
  plus_5: {
    name: "+5",
    isBomb: false,
    metadata: {
      img: {
        src: "./assets/card_plus_5.png",
        alt: "+5 Points Card"
      },
      sfx: ""
    }
  },
};

export const COMMON_SPECIAL_CARD_INFO: Record<CommonSpecialCardType, Omit<Card, "id" | "type">> = {
  multiple: {
    name: "×2",
    isBomb: false,
    metadata: {
      img: {
        src: "./assets/card_multiple_2.png",
        alt: "Multiply by 2 Card"
      },
      sfx: ""
    }
  },
  divide: {
    name: "÷2",
    isBomb: false,
    metadata: {
      img: {
        src: "./assets/card_divide_2.png",
        alt: "Divide by 2 Card"
      },
      sfx: ""
    }
  },
  bomb: {
    name: "Bomb",
    isBomb: true,
    metadata: {
      img: {
        src: "./assets/card_bomb.png",
        alt: "Bomb Card"
      },
      sfx: ""
    }
  },
  nuclear: {
    name: "NUCLEAR",
    isBomb: true,
    metadata: {
      img: {
        src: "./assets/card_nuclear.png",
        alt: "Nuclear Explosion Card"
      },
      sfx: ""
    }
  },
};

export const RARE_CARD_INFO: Record<RareCardType, Pick<Card, "name" | "metadata">> = {
  change: {
    name: "Change",
    metadata: {
      img: {
        src: "./assets/card_change.png",
        alt: "Change Card"
      },
      sfx: ""
    }
  },
  lose_all: {
    name: "Lose All",
    metadata: {
      img: {
        src: "./assets/card_lose_all.png",
        alt: "Lose All Points Card"
      },
      sfx: ""
    }
  },
}

export const BACK_CARD_INFO: Pick<Card, "name" | "metadata"> = {
  name: "Back Card",
  metadata: {
    img: {
      src: "./assets/card_back.png",
      alt: "Back Of The Card",
    },
    sfx: ""
  }
}