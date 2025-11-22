import { BaseCard } from "./cards.js";

export enum GamePhase {
  START_MENU = 'START_MENU',             // Game Menu
  QUESTION_PICK = 'QUESTION_PICK',       // Chọn câu hỏi
  ANSWERING = 'ANSWERING',               // Đội đang trả lời
  DRAWING_CARDS = 'DRAWING_CARDS',       // Đội đúng đang bốc bài liên tục
  RARE_CARD_REVEAL = 'RARE_CARD_REVEAL',           // Lật bài hiếm
  GAME_OVER = 'GAME_OVER',               // Kết thúc
}

export interface GameState {
  version: number;
  phase: GamePhase;
  // screen: GameScreen;
  currentQuestionId?: number;       // câu hỏi hiện tại
  answeredQuestionIds: number[];        // câu hỏi đã trả lời
  lastAnsweredQuestionId?: number;  // câu hỏi cuối trả lời
  drawnCardsThisTurn: BaseCard[];       // lá bài đã bốc trong lượt này (hiển thị animation)
  lastDrawnCard?: BaseCard;             // lá vừa bốc (cho hiệu ứng)
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'quizplosion_savedata';
const CURRENT_VERSION = 1;

class GameStateManager {
  private state: GameState;

  constructor() {
    this.state = this.loadFromStorage() || this.createNewGame();
  }

  private createNewGame(): GameState {
    return {
      version: CURRENT_VERSION,
      phase: GamePhase.START_MENU,
      answeredQuestionIds: [],
      drawnCardsThisTurn: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }
  private loadFromStorage(): GameState | null {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return null;

    try {
      const saved = JSON.parse(rawData) as GameState;

      if (saved.version !== CURRENT_VERSION) {
        console.warn('File save phiên bản cũ, resetting...');
        return null;
      }

      return saved;
    } catch (err) {
      console.error('Savedata bị lỗi', err);
      return null;
    }
  }
  private saveToStorage() {
    this.state.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }
  getState(): Readonly<GameState> {
    return this.state;
  }
  updateState(partial: Partial<GameState>) {
    this.state = { ...this.state, ...partial };
    this.saveToStorage();
  }
  setPhase(phase: GamePhase) {
    this.updateState({ phase });
  }
  static clearSave() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export default GameStateManager;