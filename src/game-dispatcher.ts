import { Card } from "./core/cards.js";
import { QuizQuestion } from "./core/questions.js";
import Team from "./core/team.js";

/**
 * Các hành động (action) mà hệ thống hỗ trợ.
 * Tất cả các tương tác từ UI đến Core đều phải đi qua một trong các action này.
 */
export type GameAction =
  /** Bắt đầu trò chơi */
  | { type: 'START_GAME' }
  /** Thêm đội vào trò chơi */
  | { type: 'ADD_TEAM'; payload: { name: string } }
  /** Hoàn thành setup, bắt đầu chơi */
  | { type: 'FINISH_TEAM_SETUP'; payload: { teams: Team[] } }
  /** Hiện menu câu hỏi */
  | { type: 'SHOW_QUESTION_MENU' }
  /** Chọn một câu hỏi từ menu câu hỏi */
  | { type: 'SELECT_QUESTION'; payload: { id: QuizQuestion["id"] } }
  /** Bỏ qua lượt trả lời, đến đội khác cướp quyền trả lời */
  | { type: 'SKIP_TURN'; }
  /** Hiện câu trả lời đúng */
  | { type: 'REVEAL_CORRECT_ANSWER'; payload: { id: QuizQuestion["id"] } }
  /** Quay lại menu câu hỏi */
  | { type: 'RETURN_TO_QUESTION_MENU' }
  // Rút bài thường
  | { type: 'BEGIN_COMMON_CARD_DRAWING' }
  | { type: 'DRAW_NEXT_CARD'; payload: { card: Card } }
  | { type: 'STOP_DRAWING' }
  | { type: 'STEAL_QUESTION'; }
  /** Bomb */
  | { type: 'BOMB_EXPLODED'; payload: { isNuclear: boolean } }
  /** Bài Rare */
  | { type: 'SHOW_RARE_CARD_SCREEN' }
  | { type: 'REVEAL_RARE_CARD'; payload: { card: Card } }
  | { type: 'DECLINE_RARE_CARD' }
  /** Bật/tắt âm lượng */
  | { type: 'TOGGLE_AUDIO' }
  /** Hiện trang hướng dẫn chơi */
  | { type: 'SHOW_GUIDE' }
  /** Reset lại game + xóa savedata */
  | { type: 'RESET_GAME' };

/**
  * Listener – nhận một action và xử lý nó.
*/
export type Listener = (action: GameAction) => void;

/**
 * Hệ thống Dispatcher của Game.
 * Đóng vai trò là "người đưa thư", chuyển phát các Action từ nơi gọi (UI) đến các nơi nhận (Core Logic, Audio Manager, etc).
 * 
 * Singleton pattern – chỉ có 1 instance duy nhất.
 * 
 * @example
 * // 1. Đăng ký lắng nghe (thường ở trong Core hoặc Component UI)
 * const unsubscribe = GameDispatcher.instance.subscribe((action) => {
 * switch (action.type) {
 * case 'START_GAME':
 * console.log('Trò chơi bắt đầu!');
 * break;
 * case 'ADD_TEAM':
 * // TypeScript sẽ tự gợi ý .payload.name ở đây
 * console.log(`Đội mới: ${action.payload.name}`);
 * break;
 * }
 * });
 * 
 * * // 2. Gửi action đi (thường từ nút bấm trên UI)
 * GameDispatcher.instance.dispatch({ type: 'START_GAME' });
 * GameDispatcher.instance.dispatch({ 
 * type: 'ADD_TEAM', 
 * payload: { name: 'Đội Rồng Đỏ' } 
 * });
 * 
 * * // 3. Hủy đăng ký khi không cần thiết (ví dụ khi unmount component)
 * unsubscribe();
 */
class GameDispatcher {
  private static _instance: GameDispatcher;

  /** Set chứa tất cả listener đang theo dõi */
  private listeners: Set<Listener> = new Set();
  /** Cờ bảo vệ tránh dispatch lồng nhau */
  private isDispatching = false;

  /**
   * Lấy instance duy nhất (Singleton)
   * @returns {GameDispatcher} instance
   */
  public static get instance(): GameDispatcher {
    if (!GameDispatcher._instance) {
      GameDispatcher._instance = new GameDispatcher();
    }
    return GameDispatcher._instance;
  }
  /**
   * Đăng ký một listener để nhận mọi action được dispatch.
   * @param listener Hàm sẽ được gọi mỗi khi có action mới
   * @returns Hàm hủy đăng ký (unsubscribe)
   */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /**
    * Gửi một hành động đến tất cả các listener (giống broadcast).
    * @param action Hành động cần gửi
    * @throws Error nếu gọi dispatch trong khi đang dispatch
    */
  dispatch(action: GameAction): void {
    if (this.isDispatching) {
      throw new Error('Cannot dispatch during dispatching (reentrancy)');
    }

    this.isDispatching = true;
    try {
      console.log('DISPATCH →', action.type, (action as any).payload ?? '');
      for (const listener of this.listeners) {
        listener(action);
      }
    } finally {
      this.isDispatching = false;
    }
  }
  /**
   * Debug: Trả về số lượng listener hiện đang đăng ký.
   * @returns Số lượng listener
   */
  getListenerCount(): number {
    return this.listeners.size;
  }
}

export default GameDispatcher;