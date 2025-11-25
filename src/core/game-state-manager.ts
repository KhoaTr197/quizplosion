import { Card } from "./cards.js";
import { Team } from "./team-manager.js";

/**
 * Các giai đoạn (phase) chính của trò chơi
 */
export enum GamePhase {
  START_MENU = 'START_MENU',             // Game Menu
  TEAM_SETUP = 'TEAM_SETUP',             // Thiết lập đội chơi
  QUESTION_MENU = 'QUESTION_MENU',       // Chọn câu hỏi
  SHOWING_QUESTION = 'SHOWING_QUESTION', // Đội đang trả lời
  STEAL_QUESTION = 'STEAL_QUESTION',     // Đội khác cướp câu hỏi
  REVEALING_ANSWER = 'REVEALING_ANSWER', // Show đáp án đúng
  COMMON_CARD_DRAWING = 'COMMON_CARD_DRAWING',         // Đội đúng gặp bài thường - rút hoặc dừng
  CARD_REVEALED = 'CARD_REVEALED',       // Mới rút bài
  BOMB_EXPLODED = 'BOMB_EXPLODED',       // Rút ra bomb/nuclear
  RARE_CARD_DECISION = 'RARE_CARD_DECISION', // Đội đúng gặp bài hiếm - lật hoặc không
  GAME_OVER = 'GAME_OVER',               // Kết thúc
}

/**
 * Toàn bộ trạng thái game được lưu trữ
 */
export interface GameState {
  version: number;
  phase: GamePhase;
  currentQuestionId: number | null;       // câu hỏi hiện tại
  answeredQuestionIds: number[];        // câu hỏi đã trả lời
  lastAnsweredQuestionId: number | null;  // câu hỏi cuối trả lời
  drawnCardsThisTurn: Card[];       // lá bài đã bốc trong lượt này (hiển thị animation)
  lastDrawnCard?: Card;             // lá vừa bốc (cho hiệu ứng)
  teams: Team[] | null; // danh sách đội chơi
  turnOrder: number[] | null; // thứ tự lượt chơi (mảng chỉ số đội)
  currentTurnIndex: number | null, // chỉ số lượt hiện tại trong turnOrder
  stealQueue: number[] | null; // mảng chỉ số đội chơi trong hàng đợi cướp câu hỏi
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'quizplosion_savedata';
const CURRENT_VERSION = 1;

/**
 * Quản lý toàn bộ trạng thái game (Singleton)
 * Tự động lưu vào localStorage mỗi khi có thay đổi
 * 
 * Singleton pattern – chỉ có 1 instance duy nhất.
 */
class GameStateManager {
  private static _instance: GameStateManager;

  private state: GameState;

  constructor() {
    this.state = this.loadFromStorage() || this.createNewGame();
  }
  /**
   * Lấy instance duy nhất của GameStateManager (Singleton)
   * @returns GameStateManager instance
   */
  public static get instance(): GameStateManager {
    if (!GameStateManager._instance) {
      GameStateManager._instance = new GameStateManager();
    }
    return GameStateManager._instance;
  }

  /** Tạo trạng thái game mới */
  private createNewGame(): GameState {
    return {
      version: CURRENT_VERSION,
      phase: GamePhase.START_MENU,
      answeredQuestionIds: [],
      currentQuestionId: null,
      lastAnsweredQuestionId: null,
      drawnCardsThisTurn: [],
      teams: null,
      turnOrder: null,
      currentTurnIndex: null,
      stealQueue: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),

    };
  }

  /** Đọc dữ liệu từ localStorage */
  private loadFromStorage(): GameState | null {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return null;

    try {
      const saved = JSON.parse(rawData) as GameState;

      // Phiên bản cũ → reset
      if (saved.version !== CURRENT_VERSION) {
        console.warn('Phiên bản save cũ → reset game');
        return null;
      }

      return saved;
    } catch (err) {
      console.error("Lỗi parse savedata:", err);
      return null;
    }
  }

  /** Lưu trạng thái hiện tại vào localStorage */
  private saveToStorage(): void {
    this.state.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  /**
   * Lấy bản sao readonly của trạng thái hiện tại
   * @returns GameState (không thể sửa trực tiếp)
   */
  public getState(): Readonly<GameState> {
    return structuredClone(this.state);
  }

  /**
   * Cập nhật một phần trạng thái
   * @param partial Các thuộc tính cần thay đổi
   */
  public setState(partial: Partial<GameState>): void {
    this.state = { ...this.state, ...partial };
    this.saveToStorage();
  }

  /**
   * Chuyển sang phase mới (rút gọn)
   * @param phase Giai đoạn mới
   */
  public setPhase(phase: GamePhase): void {
    this.setState({ phase });
  }

  /**
   * Xóa toàn bộ dữ liệu lưu trữ
   */
  public static clearSave() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

export default GameStateManager;