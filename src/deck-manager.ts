/**
 * Các loại thẻ bài trong trò chơi
 * Lấy cảm hứng từ Exploding Kittens – có thẻ cộng điểm và thẻ nổ
 */
export enum CardType {
  PLUS_1 = "plus_1",
  PLUS_2 = "plus_2",
  PLUS_3 = "plus_3",
  PLUS_4 = "plus_4",
  PLUS_5 = "plus_5",
  MULTIPLE = "multiple",
  DIVIDE = "divide",
  CHANGE = "change",
  LOSE_ALL = "lose_all",
  BOMB = "bomb",
  NUCLEAR = "nuclear",
}

/**
 * Interface của một thẻ bài
 */
export interface Card {
  /** ID duy nhất của thẻ bài */
  id: string;
  /** Loại bài – quyết định hiệu ứng/chức năng */
  type: CardType;
  /** Tên hiển thị trên lá bài (ví dụ: "+3", "Bomb", "×2") */
  name: string;
  /** Có phải là thẻ bài gây nổ không? */
  isBomb: boolean;
}

/**
 * Thông tin của từng loại thẻ – dùng để tạo bài mới
 * Chỉ chứa name và isBomb
 */
const CARD_INFO: Record<CardType, Pick<Card, "name" | "isBomb">> = {
  plus_1: { name: "+1", isBomb: false },
  plus_2: { name: "+2", isBomb: false },
  plus_3: { name: "+3", isBomb: false },
  plus_4: { name: "+4", isBomb: false },
  plus_5: { name: "+5", isBomb: false },
  multiple: { name: "×2", isBomb: false },
  divide: { name: "÷2", isBomb: false },
  change: { name: "Swap", isBomb: false },
  lose_all: { name: "Lose All", isBomb: true },
  bomb: { name: "Bomb", isBomb: true },
  nuclear: { name: "NUCLEAR", isBomb: true },
};

/**
 * Quản lý bộ bài (deck) trong trò chơi
 * - Tạo bộ bài ngẫu nhiên mỗi ván
 * - Rút bài, xào bài
 */
class DeckManager {
  /** Bộ bài đang chờ rút */
  private deck: Card[] = [];
  /** Chỗ chứa các thẻ bài đã bỏ */
  private discardPile: Card[] = [];

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
    this.deck = [];
    this.discardPile = [];

    const size = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const types: CardType[] = Object.keys(CARD_INFO) as CardType[];

    for (let i = 0; i < size; i++) {
      const type = types[Math.floor(Math.random() * types.length)]!;
      const info = CARD_INFO[type];
      this.deck.push({
        id: `${type}_${Date.now()}_${i}`,
        type,
        name: info.name,
        isBomb: info.isBomb,
      });
    }
  }
  /**
   * Rút 1 lá bài từ trên cùng
   * @returns Lá bài rút được hoặc null nếu thực sự hết bài
   */
  public draw(): Card | null {
    if (this.deck.length === 0)
      return null;
    return this.deck.shift()!;
  }
  /**
   * Bỏ 1 lá bài vào discard pile (hiện tại chưa dùng trong demo đơn giản)
   * @param card Lá bài cần bỏ
   */
  private discard(card: Card): void {
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
  public peek(): Card | null {
    return this.deck[0] || null;
  }
}

export default DeckManager;