import GameStateManager, { GamePhase } from "../../core/game-state-manager.js";
import { QuizQuestion } from "../../core/questions.js";
import QuizManager from "../../core/quiz-manager.js";
import GameDispatcher from "../../game-dispatcher.js";
import TeamManager from "../../core/team-manager.js";
import DeckManager from "../../core/deck-manager.js";

/**
 * Màn hình câu hỏi
 */
class QuestionScreen {
  private questionId: QuizQuestion["id"];
  private questionInfo: QuizQuestion;

  // DOM Elements
  private turnOrderBarEl = document.getElementById('turn-order-bar') as HTMLElement;
  private currentTurnEl = document.getElementById('current-turn') as HTMLElement;
  private teamBarLeftEl = document.getElementById('question-screen-left-sidebar') as HTMLElement;
  private teamBarRightEl = document.getElementById('question-screen-right-sidebar') as HTMLElement;

  private questionEl = document.getElementById('question-content') as HTMLElement;
  private answersEl = document.getElementById('question-list-answers') as HTMLElement;

  private closeQuestionBtn = document.querySelector('#question-action-bar .action-btn--close') as HTMLElement;
  private nextQuestionBtn = document.querySelector('#question-action-bar .action-btn--next') as HTMLElement;
  private skipTurnBtn = document.querySelector('#question-action-bar .action-btn--skip-turn') as HTMLElement;

  constructor(questionId: QuizQuestion["id"]) {
    console.log('[QuestionScreen] Question ID - ', questionId);
    this.questionId = questionId;
    this.questionInfo = QuizManager.instance.pickById(this.questionId)!;
    this.bindEvents();
  }

  /**
   * Hiển thị màn hình
   */
  public render(): void {
    //hiện lại nút bỏ lượt
    this.skipTurnBtn.style.display = 'initial';

    this.renderTurnBar();
    this.renderQuestion();
    this.renderTeamBars();
  }

  /**
   * Render thanh theo dõi lượt
   */
  private renderTurnBar(): void {
    this.turnOrderBarEl.innerHTML = '';
    this.currentTurnEl.textContent = '';

    const state = GameStateManager.instance.getState();
    const { turnOrder, currentTurnIndex } = state;

    if (!turnOrder) {
      console.warn("[NewQuestionScreen] Không thể render turn bar vì dữ liệu cần dùng không tồn tại");
      return;
    }

    console.log("[NewQuestionScreen] State: ", state);

    turnOrder.forEach((turnId, idx) => {
      const turnOrderSlot = document.createElement('div');
      turnOrderSlot.classList.add("turn-order__slot");
      const teamInfo = TeamManager.instance.getTeamById(turnId);

      if (idx === currentTurnIndex) {
        turnOrderSlot.classList.add("turn-order__slot--active");
        this.currentTurnEl.textContent = teamInfo!.name;
      }

      turnOrderSlot.textContent = teamInfo!.name.substring(teamInfo!.name.lastIndexOf(' ') + 1);

      this.turnOrderBarEl.appendChild(turnOrderSlot);
    })
  }

  /**
   * Render thông tin teams ở 2 sidebar
   */
  private renderTeamBars(): void {
    this.teamBarLeftEl.innerHTML = '';
    this.teamBarRightEl.innerHTML = '';

    const { teams } = GameStateManager.instance.getState();

    if (!teams) {
      console.warn("[NewQuestionScreen] Không thể render team bars vì dữ liệu cần dùng không tồn tại");
      return;
    }

    const middleIdx = Math.ceil((teams.length / 2) - 1);

    teams.forEach((team, idx) => {
      const teamStatus = document.createElement("div");
      const teamNameEl = document.createElement("div");
      const teamScoreEl = document.createElement("div");

      teamStatus.classList.add("team");
      teamNameEl.classList.add("team__name");
      teamScoreEl.classList.add("team__score");

      //console.log("[NewQuestionScreen]", team.id, TeamManager.instance.getCurrentTeam()!.id, team.id === TeamManager.instance.getCurrentTeam()?.id)

      if (team.id === TeamManager.instance.getCurrentTeam()?.id)
        teamStatus.classList.add("team--active")

      teamNameEl.textContent = team.name;
      teamScoreEl.textContent = team.score.toString();

      teamStatus.appendChild(teamNameEl);
      teamStatus.appendChild(teamScoreEl);

      if (idx > middleIdx)
        this.teamBarRightEl.appendChild(teamStatus);
      else
        this.teamBarLeftEl.appendChild(teamStatus);
    });
  }

  /**
   * Render câu hỏi
   */
  private renderQuestion(): void {
    this.answersEl.innerHTML = '';

    if (!this.questionInfo) return;

    this.questionEl.textContent = this.questionInfo.content;
    this.answersEl.innerHTML = '';

    const questionNos = ["A", "B", "C", "D"];

    this.questionInfo.answers.forEach((answer, i) => {
      const div = document.createElement('div');
      div.id = `question-card__answer-${i}`;
      div.className = 'question-card__answer';
      div.textContent = `${questionNos[i]}. ${answer}`;
      this.answersEl.appendChild(div);
    });
  }

  private revealCorrectAnswers(): void {
    const answers = document.querySelectorAll('.question-card__answer');

    answers.forEach((answer) => {
      if (answer.id === `question-card__answer-${this.questionInfo.correct}`) {
        answer.classList.add("question-card__answer--correct")
      } else {
        answer.classList.add("question-card__answer--wrong")
      }
    })
  }

  /**
   * Gắn sự kiện cho các nút
   */
  private bindEvents(): void {
    // Nút Đóng
    this.closeQuestionBtn.onclick = () => {
      const phase = GameStateManager.instance.getState().phase;
      // Hiện đáp án
      if (phase === GamePhase.SHOWING_QUESTION || phase == GamePhase.STEAL_QUESTION) {
        this.revealCorrectAnswers();

        GameDispatcher.instance.dispatch({
          type: 'REVEAL_CORRECT_ANSWER',
          payload: { id: this.questionId }
        });
      } //ngược lại, về menu câu hỏi 
      else if (phase === GamePhase.REVEALING_ANSWER) {
        GameDispatcher.instance.dispatch({
          type: 'RETURN_TO_QUESTION_MENU',
        });
        QuizManager.instance.answerById(this.questionId);
      }
    }

    // Nút Hiện Câu Trả Lời, click thêm lần nữa sẽ chuyển trang rút bài
    this.nextQuestionBtn.onclick = () => {
      const phase = GameStateManager.instance.getState().phase;

      // Hiện đáp án
      if (phase === GamePhase.SHOWING_QUESTION || phase == GamePhase.STEAL_QUESTION) {
        this.revealCorrectAnswers();

        GameDispatcher.instance.dispatch({
          type: 'REVEAL_CORRECT_ANSWER',
          payload: { id: this.questionId }
        });
      }
      else if (phase === GamePhase.REVEALING_ANSWER) {
        if (DeckManager.instance.type == 'Rare') {
          GameDispatcher.instance.dispatch({
            type: 'SHOW_RARE_CARD_SCREEN',
          })
        } else {
          GameDispatcher.instance.dispatch({
            type: 'BEGIN_COMMON_CARD_DRAWING',
          })
        }
      }
    };

    // Nút Bỏ Qua Lượt
    this.skipTurnBtn.onclick = () => {
      if (TeamManager.instance.getStealQueue().length == 1) {
        this.skipTurnBtn.style.display = 'none';
      }

      GameDispatcher.instance.dispatch({
        type: 'SKIP_TURN',
      });

      this.renderTurnBar();
      this.renderTeamBars();
    };
  }
}
export default QuestionScreen;