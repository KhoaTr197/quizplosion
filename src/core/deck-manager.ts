import {
  Card,
  CommonPointCardType,
  CommonSpecialCardType,
  COMMON_POINT_CARD_INFO,
  COMMON_SPECIAL_CARD_INFO,
  RARE_CARD_INFO,
  RareCardType,
  BACK_CARD_INFO,
  PlaceholderCardType,
} from "./cards.js";
import {
  randomRareCard_Percentage
} from './random.js'
import
  GameStateManager
from "./game-state-manager.js"
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
    const state = GameStateManager.instance.getState();
    
    // Reset deck
    this.deck = [];

    // TODO: Thêm thuật toán random loại deck

    this.deckType = randomRareCard_Percentage(state.answeredQuestionIds.length);

    //Generate bộ bài theo loại
    this.generateDeckByType(this.deckType);

    // //test rare
    // this.deckType = 'Rare';
    // this.generateDeckByType(this.deckType);
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
    return this.deck.pop()!;
  }
  /**
   * Xem trước lá bài tiếp theo (lá bài cuối cùng trong mảng)
   * mà KHÔNG rút nó ra khỏi bộ bài.
   * @returns Lá bài tiếp theo trong bộ bài hoặc null nếu bộ bài trống
   */
  public peek(): DeckCard | null {
    if (this.deck.length === 0) {
      return null;
    }
    const lastIndex = this.deck.length - 1;
    return this.deck[lastIndex];
  }
  /**
   * Xào bộ bài hiện tại (trừ lá cuối là bomb) (sử dụng thuật toán Fisher-Yates)
   */
  private shuffle(array: Card[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i]!, array[j]!] = [array[j]!, array[i]!];
    }
  }
  /**
   * Lấy bản sao readonly của bộ bài
   * @returns Card[] (không thể sửa trực tiếp)
   */
  public getDeck(): Card[] {
    return structuredClone(this.deck);
  }
  /**
   * Lấy loại bộ bài
   */
  public get type(): DeckType {
    return this.deckType;
  }
  /**
   * Số lá bài còn lại trong deck
   */
  public get size(): number {
    return this.deck.length;
  }
  /**
   * Kiểm tra xem deck có rỗng không
   */
  public get isEmpty(): boolean {
    return this.deck.length === 0;
  }
  /**
   * Debug: In ra bộ bài vừa tạo
   */
  public logCurrentDeck(): void {
    console.log(`%c Bộ bài mới (${this.deck.length} lá):`, "font-weight: bold");
    console.log(this.deck);
    this.deck.forEach((card, i) => {
      const color = card.isBomb ? "#ff0000" : "#00ff00";
      console.log(`%c ${i + 1}. ${card.name} ${card.isBomb ? "BOOM" : ""}`, `color: ${color}`);
    });
  }
  public generateDeckByType(deckType: DeckType) {
    if(deckType === "Rare"){
      const backCard = {
        id: `${BACK_CARD_INFO.name}_${Date.now()}_back`,
        ...BACK_CARD_INFO, 
        type: PlaceholderCardType.PLACEHOLDER,
        isBomb: false,
      }
      this.deck.push(backCard);
      const percentRareCard=Math.random();
      let RareCard:RareCardType=percentRareCard>=0.6?RareCardType.CHANGE:RareCardType.LOSE_ALL;
      const info=RARE_CARD_INFO[RareCard];
      this.deck.push({
         id: `${RareCard}_${Date.now()}_${1}`,
          ...info,
          type: RareCard,
          isBomb: true,
      })
    }
    else if  (deckType == "Common") {
      // Kích thước bộ bài: 1 → 8 lá điểm + 1 lá đặc biệt + 1 bomb/nuclear → tổng 3 → 10 lá
      const deckSize = Math.floor(Math.random() * 8) + 2;

      // Thêm các lá điểm theo trọng số
      const pointCards: Card[] = [];
      for (let i = 0; i < deckSize - 1; i++) {
        const pointType = this.randomPointCard();
        const info = COMMON_POINT_CARD_INFO[pointType];
        pointCards.push({
          id: `${pointType}_${Date.now()}_${i}`,
          ...info,
          type: pointType,
          isBomb: false,
        });
      }

      // Xào tạm các lá điểm trước khi chèn lá đặc biệt
      this.shuffle(pointCards);

      // Chèn ngẫu nhiên 1 lá chức năng ×2 hoặc ÷2
      const specialType: CommonSpecialCardType =
        Math.random() > 0.5 ?
          CommonSpecialCardType.MULTIPLE :
          CommonSpecialCardType.DIVIDE;
      const specialInfo = COMMON_SPECIAL_CARD_INFO[specialType];
      const insertPos = Math.floor(Math.random() * (pointCards.length)) + 1;
      pointCards.splice(insertPos, 0, {
        id: `${specialType}_${Date.now()}_special`,
        ...specialInfo,
        type: specialType,
        isBomb: false,
      });

      // Thêm lá bomb/nuclear vào cuối cùng
      const bombType: CommonSpecialCardType =
        Math.random() > 0.25 ?
          CommonSpecialCardType.BOMB :
          CommonSpecialCardType.NUCLEAR;
      const bombInfo = COMMON_SPECIAL_CARD_INFO[bombType];
      const bombCard = {
        id: `${bombType}_${Date.now()}_bomb`,
        ...bombInfo,
        type: bombType,
        isBomb: true,
      };

      const backCard = {
        id: `${BACK_CARD_INFO.name}_${Date.now()}_back`,
        ...BACK_CARD_INFO,
        type: PlaceholderCardType.PLACEHOLDER,
        isBomb: false,
      }

      this.deck = [bombCard, ...pointCards, backCard];
    }
  }
}

export default DeckManager;