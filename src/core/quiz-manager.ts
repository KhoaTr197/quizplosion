import { QUESTIONS, QuizQuestion } from './questions.js';

/**
 * Quản lý danh sách câu hỏi của trò chơi
 * 
 * Singleton pattern – chỉ có 1 instance duy nhất.
 *
 * - Lưu trữ kho câu hỏi gốc.
 * - Theo dõi lịch sử các câu hỏi đã trả lời.
 */
class QuizManager {
  private static _instance: QuizManager;
  /** Danh sách câu hỏi còn lại */
  private available: QuizQuestion[] = [];

  /** Private constructor → không cho new trực tiếp */
  constructor() {
    this.reset();
  }
  /**
   * Lấy instance duy nhất của QuizManager (Singleton)
   * @returns QuizManager instance
   */
  public static get instance(): QuizManager {
    if (!QuizManager._instance) {
      QuizManager._instance = new QuizManager();
    }
    return QuizManager._instance;
  }
  /**
    * Reset toàn bộ bộ câu hỏi – dùng khi bắt đầu game mới
    * Sẽ copy lại từ dữ liệu gốc và đảo ngẫu nhiên
  */
  public reset() {
    this.available = [...QUESTIONS];
    this.shuffle(this.available);
  }
  /** Trộn ngẫu nhiên mảng */
  private shuffle(array: QuizQuestion[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Chọn câu hỏi theo vị trí trong mảng available
   * @param index Vị trí (0-based)
   * @returns Câu hỏi hoặc null nếu index không hợp lệ
   */
  public pickByIndex(index: number): QuizQuestion | null {
    if (index < 0 || index >= this.available.length) {
      console.warn(`QuizManager: Index ${index} không hợp lệ (còn ${this.available.length} câu)`);
      return null;
    }

    const question = this.available[index]!;
    console.log(`[QuizManager]: Đã chọn câu hỏi tại index ${index}: `, question);
    return question;
  }

  /**
   * Chọn câu hỏi theo ID (rất hữu ích cho chọn câu hỏi từ grid)
   * @param id ID của câu hỏi (trong QUESTIONS)
   * @returns Câu hỏi hoặc null nếu không tìm thấy
   */
  public pickById(id: QuizQuestion['id']): QuizQuestion | null {
    const index = this.available.findIndex(q => q.id === id);
    if (index === -1) {
      console.warn(`QuizManager: Không tìm thấy câu hỏi với ID "${id}"`);
      return null;
    }

    const question = this.available[index]!;
    console.log(`[QuizManager]: Đã chọn câu hỏi ID "${id}": `, question);
    return question;
  }

  /**
   * Đánh dấu trả lời câu hỏi theo vị trí trong mảng available
   * @param index Vị trí (0-based)
   * @returns Câu hỏi hoặc null nếu index không hợp lệ
   */
  public answerByIndex(index: number): QuizQuestion | null {
    if (index < 0 || index >= this.available.length) {
      console.warn(`QuizManager: Index ${index} không hợp lệ (còn ${this.available.length} câu)`);
      return null;
    }

    const question = this.available[index]!;
    question.isAnswered = true;
    console.log(`[QuizManager]: Đã trả lời câu hỏi tại index ${index}: `, question);
    return question;
  }

  /**
   * Đánh dấu trả lời câu hỏi theo ID
   * @param id ID của câu hỏi (trong QUESTIONS)
   * @returns Câu hỏi hoặc null nếu không tìm thấy
   */
  public answerById(id: QuizQuestion['id']): QuizQuestion | null {
    const index = this.available.findIndex(q => q.id === id);
    if (index === -1) {
      console.warn(`QuizManager: Không tìm thấy câu hỏi với ID "${id}"`);
      return null;
    }

    const question = this.available[index]!;
    question.isAnswered = true;
    console.log(`[QuizManager]: Đã trả lời câu hỏi có ID "${id}": `, question);
    return question;
  }

  /**
   * Danh sách tất cả các câu hỏi hiện còn lại trong bộ (chưa được chọn).
   * Trả về bản sao readonly để đảm bảo không ai sửa trực tiếp.
   * 
   * @returns Mảng các câu hỏi còn lại (readonly)
   */
  public get questions(): Readonly<QuizQuestion[]> {
    return structuredClone(this.available);
  }

  /**
   * Số lượng câu hỏi còn lại chưa được trả lời.
   * @returns Số câu hỏi còn lại
   */
  public get remaining(): number {
    return this.available.length;
  }

  /**
   * Số lượng câu hỏi đã được rút ra (đã trả lời hoặc đang hiển thị).
   * @returns Số câu hỏi đã trả lời
   */
  public get totalAnswered(): number {
    return this.available.filter(q => q.isAnswered).length;
  }

  /**
   * Tổng số câu hỏi có trong game.
   * @returns Tổng số câu hỏi ban đầu
   */
  public get totalQuestions(): number {
    return QUESTIONS.length;
  }

  /**
   * Kiểm tra xem đã hết câu hỏi để rút chưa.
   * @returns true nếu không còn câu hỏi nào
   */
  public get isEmpty(): boolean {
    return this.available.length === 0;
  }

  /**
   * Danh sách các câu hỏi đã được trả lời trong ván hiện tại.
   * @returns Mảng readonly các câu hỏi đã trả lời
   */
  public get answeredQuestions(): Readonly<QuizQuestion[]> {
    return structuredClone(this.available.filter(q => q.isAnswered));
  }
}

export default QuizManager;