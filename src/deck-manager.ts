import {
  BaseCard,
  CommonPointCardType,
  CommonSpecialCardType,
  COMMON_POINT_CARD_INFO,
  COMMON_SPECIAL_CARD_INFO,
} from "cards";
import{
  randomRareCard
}from "random"

/**
 * Interface của một thẻ bài trong bộ bài
 */
export interface DeckCard extends BaseCard {}

export type DeckType = "Common" | "Rare";
/**
 * Quản lý bộ bài (deck) trong trò chơi
 * - Tạo bộ bài ngẫu nhiên mỗi ván
 * - Rút bài, xào bài
 */
class DeckManager {
  private deckType: DeckType = "Common";
  /** Bộ bài đang chờ rút */
  private deck: DeckCard[] = [];
  /** Chỗ chứa các thẻ bài đã bỏ */
  private discardPile: DeckCard[] = [];

  constructor() {
    this.reset();
  }
  /**
   * Khởi tạo lại bộ bài mới
   * Gọi khi trả lời câu hỏi đúng
   */
  public reset(): void {
    this.initializeDeck();
    this.shuffle();
  }
  /**
   * Tạo bộ bài mới với số lượng ngẫu nhiên từ 5 đến 8 lá
   * Mỗi lá được chọn ngẫu nhiên từ tất cả các loại thẻ
   */
  private initializeDeck(): void {
    // Reset deck
    this.deck = [];
    this.discardPile = [];
    // TODO: Thêm thuật toán random loại deck
    
    this.deckType = "Common";

    // Generate bộ bài theo loại
    if (this.deckType == "Common") {
    const deckSize = Math.floor(Math.random() * 1) + 8; // 1 to 9
    const pointTypes: CommonPointCardType[] = Object.keys(COMMON_POINT_CARD_INFO) as CommonPointCardType[];
    const specialTypes: CommonSpecialCardType[] = Object.keys(COMMON_SPECIAL_CARD_INFO) as CommonSpecialCardType[];

    // Random thẻ điểm
    for (let i = 0; i < deckSize; i++) {
      const cardType = pointTypes[Math.floor(Math.random() * pointTypes.length)]!;
      const cardInfo = COMMON_POINT_CARD_INFO[cardType];
      this.deck.push({
        id: `${cardType}_${Date.now()}_${i}`,
        type: cardType,
        name: cardInfo.name,
        isBomb: cardInfo.isBomb,
      });
    }
    // Chèn thẻ bomb vào cuối
    const bombType = specialTypes[Math.floor(Math.random() * specialTypes.length)]!;
    const bombInfo = COMMON_SPECIAL_CARD_INFO[bombType];
    this.deck.push({
      id: `${bombType}_${Date.now()}_${deckSize}`,
     type: bombType,
      name: bombInfo.name,
      isBomb: bombInfo.isBomb,
    })
    }
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
   * Bỏ 1 lá bài vào discard pile (hiện tại chưa dùng trong demo đơn giản)
   * @param card Lá bài cần bỏ
   */
  private discard(card: DeckCard): void {
    this.discardPile.push(card);
  }
  /**
   * Xào bộ bài hiện tại (sử dụng thuật toán Fisher-Yates)
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
  /**
   * Xem trước lá bài trên cùng mà không rút
   * @returns Lá bài trên cùng hoặc null
   */
  public peek(): DeckCard | null {
    return this.deck[0] || null;
  }
}

export default DeckManager;