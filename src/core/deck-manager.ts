import {
  Card,
  CommonPointCardType,
  CommonSpecialCardType,
  COMMON_POINT_CARD_INFO,
  COMMON_SPECIAL_CARD_INFO,
} from "./cards.js";

/**
 * Interface của một thẻ bài trong bộ bài
 */
export interface DeckCard extends Card { }

export type DeckType = "Common" | "Rare";
/**
 * Quản lý bộ bài (deck) trong trò chơi
 * 
 * Singleton pattern – chỉ có 1 instance duy nhất.
 * 
 * - Tạo bộ bài ngẫu nhiên mỗi ván
 * - Rút bài, xào bài
 */
class DeckManager {
  /** Instance Singleton */
  private static _instance: DeckManager;
  private deckType: DeckType = "Common";
  /** Bộ bài đang chờ rút */
  private deck: DeckCard[] = [];

  constructor() {
    this.reset();
  }
  /**
   * Lấy instance duy nhất (Singleton)
   * @returns {DeckManager} instance
   */
  public static get instance(): DeckManager {
    if (!DeckManager._instance) {
      DeckManager._instance = new DeckManager();
    }
    return DeckManager._instance;
  }
  /**
   * Khởi tạo lại bộ bài mới
   * Gọi khi trả lời câu hỏi đúng
   */
  public reset(): void {
    this.initializeDeck();
  }
  /**
   * Tạo bộ bài mới với số lượng ngẫu nhiên từ 5 đến 8 lá
   * Mỗi lá được chọn ngẫu nhiên từ tất cả các loại thẻ
   */
  private initializeDeck(): void {
    // Reset deck
    this.deck = [];

    // TODO: Thêm thuật toán random loại deck
    this.deckType = "Common";

    // Generate bộ bài theo loại
    if (this.deckType == "Common") {
      // Kích thước bộ bài: 1 → 8 lá điểm + 1 lá đặc biệt + 1 bomb/nuclear → tổng 3 → 10 lá
      const deckSize = Math.floor(Math.random() * 8) + 2;

      // Thêm các lá điểm theo trọng số
      for (let i = 0; i < deckSize - 1; i++) {
        const pointType = this.randomPointCard();
        const info = COMMON_POINT_CARD_INFO[pointType];
        this.deck.push({
          id: `${pointType}_${Date.now()}_${i}`,
          type: pointType,
          name: info.name,
          isBomb: false,
        });
      }

      // Xào tạm các lá điểm trước khi chèn lá đặc biệt
      this.shuffle();

      // Chèn ngẫu nhiên 1 lá chức năng ×2 hoặc ÷2
      const specialType: CommonSpecialCardType =
        Math.random() > 0.5 ?
          CommonSpecialCardType.MULTIPLE :
          CommonSpecialCardType.DIVIDE;
      const specialInfo = COMMON_SPECIAL_CARD_INFO[specialType];
      const insertPos = Math.floor(Math.random() * (this.deck.length)) + 1;
      this.deck.splice(insertPos, 0, {
        id: `${specialType}_${Date.now()}_special`,
        type: specialType,
        name: specialInfo.name,
        isBomb: false,
      });

      // Thêm lá bomb/nuclear vào cuối cùng
      const bombType: CommonSpecialCardType =
        Math.random() > 0.25 ?
          CommonSpecialCardType.BOMB :
          CommonSpecialCardType.NUCLEAR;
      const bombInfo = COMMON_SPECIAL_CARD_INFO[bombType];
      this.deck.push({
        id: `${bombType}_${Date.now()}_bomb`,
        type: bombType,
        name: bombInfo.name,
        isBomb: true,
      });
    }
  }
  /**
   * Chọn ngẫu nhiên một lá điểm theo tỷ lệ trọng số
   * - +1: 30%   | +2: 35%   | +3: 22%   | +4: 12%   | +5: 6%
   * @returns {CommonPointCardType} Loại thẻ bài
   * @private
   */
  private randomPointCard(): CommonPointCardType {
    const weights = [30, 35, 22, 12, 6];
    const types: CommonPointCardType[] = [
      CommonPointCardType.PLUS_1,
      CommonPointCardType.PLUS_2,
      CommonPointCardType.PLUS_3,
      CommonPointCardType.PLUS_4,
      CommonPointCardType.PLUS_5,
    ];
    const total = weights.reduce((s, w) => s + w, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      if (rand < weights[i]) return types[i];
      rand -= weights[i];
    }
    return CommonPointCardType.PLUS_1;
  }
  /**
   * Rút 1 lá bài từ trên cùng
   * @returns Lá bài rút được hoặc null nếu thực sự hết bài
   */
  public draw(): DeckCard | null {
    if (this.deck.length === 0)
      return null;
    return this.deck.shift()!;
  }
  /**
   * Xào bộ bài hiện tại (trừ lá cuối là bomb) (sử dụng thuật toán Fisher-Yates)
   */
  private shuffle(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i]!, this.deck[j]!] = [this.deck[j]!, this.deck[i]!];
    }
  }
  public get type(): DeckType {
    return this.deckType;
  }
  /** Số lá bài còn lại trong deck */
  public get size(): number {
    return this.deck.length;
  }
  /** Kiểm tra xem deck có rỗng không */
  public get isEmpty(): boolean {
    return this.deck.length === 0;
  }
  /** Debug: In ra bộ bài vừa tạo */
  public logCurrentDeck(): void {
    console.log(`%c Bộ bài mới (${this.deck.length} lá):`, "font-weight: bold");
    console.log(this.deck);
    this.deck.forEach((card, i) => {
      const color = card.isBomb ? "#ff0000" : "#00ff00";
      console.log(`%c ${i + 1}. ${card.name} ${card.isBomb ? "BOOM" : ""}`, `color: ${color}`);
    });
  }
}

export default DeckManager;