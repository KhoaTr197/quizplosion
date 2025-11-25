import GameStateManager, { GamePhase, GameState } from "./game-state-manager.js";
import { ScreenId, UI } from "../ui/ui-manager.js";
import QuestionMenuScreen from "../ui/screens/question-menu-screen.js";
import GameDispatcher, { GameAction } from "../game-dispatcher.js";
import StartMenuScreen from "../ui/screens/start-menu-screen.js";
import QuestionScreen from "../ui/screens/question-screen.js";
import PersistentUI from "../ui/persistent-ui-manager.js";
import CardDrawingScreen from "../ui/screens/card-drawing-screen.js";
import AudioManager from "./audio-manager.js";
import SetupScreen from "../ui/screens/setup-screen.js";
import TeamManager from "./team-manager.js";
import NewQuestionScreen from "../ui/screens/new-question-screen.js";
import DeckManager from "./deck-manager.js";
import RareCardScreen from "../ui/screens/rare-card-screen.js";


/**
 * Quản lý toàn bộ luồng chơi game (Game Flow Controller)
 * Là trung tâm điều phối giữa: Dispatcher và các hệ thống khác trong Core
 *
 * Singleton pattern – chỉ có 1 instance duy nhất.
 */
class GameManager {
  /** Instance duy nhất – giống Unity */
  private static _instance: GameManager;
  private lastGameScreen?: ScreenId;

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
    AudioManager.instance.setVolume(1);
    const state = GameStateManager.instance.getState();
    this.renderPhase(state.phase, state);
  }

  /**
   * Render giao diện tương ứng với phase hiện tại
   * @param phase Giai đoạn hiện tại
   * @param state Toàn bộ trạng thái game
   */
  private renderPhase(phase: GamePhase, state: GameState): void {
    console.log("[GameManager]: Phase -", phase);

    const targetScreenId = this.getCurrentScreenId(phase);

    // Nếu vẫn đang ở cùng một màn hình → KHÔNG render lại!
    if (this.lastGameScreen === targetScreenId && targetScreenId != 'question-screen') {
      console.log("[GameManager]: Screen không đổi → bỏ qua render");
      return;
    }

    console.log(`[GameManager]: Chuyển màn hình → ${this.lastGameScreen} → ${targetScreenId}`);

    // Cập nhật lastGameScreen TRƯỚC khi render (rất quan trọng!)
    this.lastGameScreen = targetScreenId;

    switch (phase) {
      case GamePhase.START_MENU: {
        UI.show(ScreenId.START_MENU);
        (new StartMenuScreen).render();

        break;
      }
      case GamePhase.TEAM_SETUP: {
        UI.show(ScreenId.SETUP);
        (new SetupScreen).render();
        break;
      }
      case GamePhase.QUESTION_MENU: {
        UI.show(ScreenId.QUESTION_MENU);
        (new QuestionMenuScreen).render();

        break;
      }
      case GamePhase.TEAM_SETUP: {
        UI.show(ScreenId.SETUP);
        (new SetupScreen).render();
        break;
      }
      case GamePhase.SHOWING_QUESTION: {

        console.log('[Game Manager] Turn Order:', TeamManager.instance.getTurnOrder());
        console.log('[Game Manager] Current Idx:', TeamManager.instance.getCurrentTurnIndex());

        UI.show(ScreenId.NEW_QUESTION);
        (new NewQuestionScreen(state.currentQuestionId!)).render();

        break;
      }
      case GamePhase.STEAL_QUESTION:
      case GamePhase.REVEALING_ANSWER:
        break;
      case GamePhase.RARE_CARD_DECISION: {
        UI.show(ScreenId.RARE_CARD);
        (new RareCardScreen).render();
        break;
      }
      case GamePhase.COMMON_CARD_DRAWING: {
        UI.show(ScreenId.COMMON_CARD_DRAWING);
        (new CardDrawingScreen).render();

        break;
      }
      default:
        console.warn(`Phase chưa được xử lý: ${phase}`);
        break;
    }

    PersistentUI.updateVisibility(this.getCurrentScreenId(phase));
  }

  /**
   * Lấy ID màn hình tương ứng với giai đoạn hiện tại của trò chơi.
   * * @param phase - Giai đoạn hiện tại của trò chơi (GamePhase).
   * @returns ID của màn hình cần hiển thị (ScreenId). Trả về START_MENU nếu giai đoạn không được định nghĩa cụ thể.
   */
  private getCurrentScreenId(phase: GamePhase): ScreenId {
    const map: Partial<Record<GamePhase, ScreenId>> = {
      [GamePhase.START_MENU]: ScreenId.START_MENU,
      [GamePhase.TEAM_SETUP]: ScreenId.SETUP,
      [GamePhase.QUESTION_MENU]: ScreenId.QUESTION_MENU,
      [GamePhase.SHOWING_QUESTION]: ScreenId.QUESTION,
      [GamePhase.STEAL_QUESTION]: ScreenId.QUESTION,
      [GamePhase.REVEALING_ANSWER]: ScreenId.QUESTION,
      [GamePhase.COMMON_CARD_DRAWING]: ScreenId.COMMON_CARD_DRAWING,
      [GamePhase.RARE_CARD_DECISION]: ScreenId.RARE_CARD,
    };
    return map[phase] || ScreenId.START_MENU;
  }

  /**
   * Đăng ký lắng nghe tất cả các action từ GameDispatcher
   */
  private subscribeToDispatcher(): void {
    GameDispatcher.instance.subscribe((action: GameAction) => {
      switch (action.type) {
        case 'START_GAME':
          GameStateManager.instance.setState({ phase: GamePhase.TEAM_SETUP });
          break;
        case 'FINISH_TEAM_SETUP': {
          const teams = action.payload.teams;

          TeamManager.instance.setUpTeams(teams);
          console.log('[GameManager] Phase - FINISH_TEAM_SETUP:');
          TeamManager.instance.logCurrentTeamSession();

          TeamManager.instance.shuffleOrders();

          GameStateManager.instance.setState({
            phase: GamePhase.QUESTION_MENU,
            teams: TeamManager.instance.getTeams(),
          });
          break;
        }
        case 'SELECT_QUESTION':
          GameStateManager.instance.setState({
            phase: GamePhase.SHOWING_QUESTION,
            currentQuestionId: action.payload.id,
            turnOrder: TeamManager.instance.getTurnOrder(),
            currentTurnIndex: TeamManager.instance.getCurrentTurnIndex(),
            stealQueue: TeamManager.instance.getStealQueue(),
          });
          break;
        case 'SKIP_TURN':
          const stealQueue = TeamManager.instance.getStealQueue();

          console.log("[GameManager] Phase - SKIP_TURN: ");

          if (stealQueue.length !== 0) {
            if (TeamManager.instance.nextStealTurn()) {
              GameStateManager.instance.setState({
                phase: GamePhase.STEAL_QUESTION,
                currentTurnIndex: TeamManager.instance.getCurrentTurnIndex(),
                stealQueue: stealQueue
              });
            }
          }
          break;
        case 'REVEAL_CORRECT_ANSWER':
          GameStateManager.instance.setState({
            phase: GamePhase.REVEALING_ANSWER,
            lastAnsweredQuestionId: action.payload.id,
            answeredQuestionIds: [
              ...GameStateManager.instance.getState().answeredQuestionIds,
              action.payload.id
            ]
          })
          break;
        case 'SHOW_QUESTION_MENU':
          GameStateManager.instance.setState({
            phase: GamePhase.QUESTION_MENU,
          })
          break;
        case 'RETURN_TO_QUESTION_MENU':
          TeamManager.instance.nextTurn();
          TeamManager.instance.logCurrentTeamSession();

          GameStateManager.instance.setState({
            phase: GamePhase.QUESTION_MENU,
            currentQuestionId: null,
            stealQueue: TeamManager.instance.getStealQueue(),
            currentTurnIndex: TeamManager.instance.getCurrentTurnIndex(),
          })
          DeckManager.instance.reset();
          break;
        case 'BEGIN_COMMON_CARD_DRAWING':
          GameStateManager.instance.setState({
            phase: GamePhase.COMMON_CARD_DRAWING,
          })
          break;
        case 'SHOW_RARE_CARD_SCREEN':
          GameStateManager.instance.setState({
            phase: GamePhase.RARE_CARD_DECISION,
          })
          break;
        case 'RESET_GAME':
          GameStateManager.clearSave();
          break;
        default:
          break;
      }

      const state = GameStateManager.instance.getState();
      this.renderPhase(state.phase, state);
    });
  }
}
export default GameManager;