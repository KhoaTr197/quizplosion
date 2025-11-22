import GameStateManager, { GamePhase, GameState } from "./state-manager.js";
import { ScreenId, UI } from "../ui/ui-manager.js";
import QuestionMenuScreen from "../ui/screens/question-menu-screen.js";
import GameDispatcher, { GameAction } from "../game-dispatcher.js";
import StartMenuScreen from "../ui/screens/start-menu-screen.js";
import QuestionScreen from "../ui/screens/question-screen.js";


/**
 * Quản lý toàn bộ luồng chơi game (Game Flow Controller)
 * Là trung tâm điều phối giữa: Dispatcher và các hệ thống khác trong Core
 *
 * Singleton pattern – chỉ có 1 instance duy nhất.
 */
class GameManager {
  /** Instance duy nhất – giống Unity */
  private static _instance: GameManager;

  private constructor() {
    this.subscribeToDispatcher();
  }
  /**
   * Lấy instance duy nhất của GameManager (Singleton)
   * @returns GameManager instance
   */
  public static get instance(): GameManager {
    if (!GameManager._instance) {
      GameManager._instance = new GameManager();
    }
    return GameManager._instance;
  }

  /**
   * Khởi động game.
   * Dựa vào state hiện tại để render màn hình phù hợp
   */
  public start(): void {
    const state = GameStateManager.instance.getState();
    this.renderPhase(state.phase, state);
  }

  /**
   * Render giao diện tương ứng với phase hiện tại
   * @param phase Giai đoạn hiện tại
   * @param state Toàn bộ trạng thái game
   */
  private renderPhase(phase: GamePhase, state: GameState): void {
    console.log("Phase: ", phase);
    switch (phase) {
      case GamePhase.START_MENU: {
        UI.show(ScreenId.START_MENU);
        (new StartMenuScreen).render();
        break;
      }
      case GamePhase.QUESTION_MENU: {
        UI.show(ScreenId.QUESTION_MENU);
        (new QuestionMenuScreen).render();
        break;
      }
      case GamePhase.SHOWING_QUESTION: {
        UI.show(ScreenId.QUESTION);
        (new QuestionScreen(state.currentQuestionId!)).render();
        break;
      }
      case GamePhase.RARE_CARD_DECISION: {
        break;
      }
      case GamePhase.RISK_DRAWING: {
        break;
      }
      default:
        console.warn(`Phase chưa được xử lý: ${phase}`);
        break;
    }
  }

  /**
   * Đăng ký lắng nghe tất cả các action từ GameDispatcher
   */
  private subscribeToDispatcher(): void {
    GameDispatcher.instance.subscribe((action: GameAction) => {
      const state = GameStateManager.instance.getState();

      switch (action.type) {
        case 'START_GAME':
          GameStateManager.instance.setState({ phase: GamePhase.QUESTION_MENU });
          break;
        case 'SELECT_QUESTION':
          GameStateManager.instance.setState({
            phase: GamePhase.SHOWING_QUESTION,
            currentQuestionId: action.payload.id
          });
          break;
        case 'REVEAL_CORRECT_ANSWER':
          GameStateManager.instance.setState({
            phase: GamePhase.RISK_DRAWING,
            lastAnsweredQuestionId: action.payload.id
          })
          break;
        case 'SHOW_QUESTION_MENU':
          GameStateManager.instance.setState({
            phase: GamePhase.QUESTION_MENU,
          })
        default:
          break;
      }

      this.renderPhase(GameStateManager.instance.getState().phase, GameStateManager.instance.getState());
    });
  }
}
export default GameManager;