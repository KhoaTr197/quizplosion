import GameStateManager, { GamePhase } from "../../core/game-state-manager.js";
import { QuizQuestion } from "../../core/questions.js";
import QuizManager from "../../core/quiz-manager.js";
import GameDispatcher from "../../game-dispatcher.js";
import TeamManager from "../../core/team-manager.js";
import DeckManager from "../../core/deck-manager.js";

/**
 * Màn hình câu hỏi
 */
class NewQuestionScreen {
  private questionId: QuizQuestion["id"];

  // DOM Elements
  private turnOrderBarEl = document.getElementById('turn-order-bar') as HTMLElement;
  private currentTurnEl = document.getElementById('current-turn') as HTMLElement;
  private teamBarLeftEl = document.getElementById('new-question-screen-left-sidebar') as HTMLElement;
  private teamBarRightEl = document.getElementById('new-question-screen-right-sidebar') as HTMLElement;

  private questionEl = document.getElementById('new-question-content') as HTMLElement;
  private answersEl = document.getElementById('new-question-list-answers') as HTMLElement;
  private correctAnswerEl = document.getElementById('new-question-correct-answer') as HTMLElement;

  private closeQuestionBtn = document.querySelector('#new-question-action-bar .action-btn--close') as HTMLElement;
  private nextQuestionBtn = document.querySelector('#new-question-action-bar .action-btn--next') as HTMLElement;
  private skipTurnBtn = document.querySelector('#new-question-action-bar .action-btn--skip-turn') as HTMLElement;

  constructor(questionId: QuizQuestion["id"]) {
    console.log('[QuestionScreen] Question ID - ', questionId);
    this.questionId = questionId;
    this.bindEvents();
  }

  /**
   * Hiển thị màn hình
   */
  public render(): void {
    this.clearContent();
    this.renderTurnBar();
    this.renderQuestion();
    this.renderTeamBars();
  }

  /**
   * Xóa nội dung cũ trước khi render lại
   */
  private clearContent(): void {
    this.turnOrderBarEl.innerHTML = '';
    this.teamBarLeftEl.innerHTML = '';
    this.teamBarRightEl.innerHTML = '';
    this.answersEl.innerHTML = '';
    this.correctAnswerEl.textContent = '';
    this.correctAnswerEl.classList.remove('active');
    this.currentTurnEl.textContent = '';
  }

  /**
   * Render thanh theo dõi lượt
   */
  private renderTurnBar(): void {
    const turnOrders = TeamManager.instance.getTurnOrders();
    //const teams = TeamManager.instance.getTeams();
    turnOrders.forEach((turnOrder) => {
      const turnOrderSlot = document.createElement('div');
      turnOrderSlot.classList.add("turn-order__slot");
      const team = TeamManager.instance.getTeamById(turnOrder);
      if(team && team.isBombed){
        turnOrderSlot.classList.add("turn-order__slot--bombed");
      }

      if (turnOrder == TeamManager.instance.getActiveTeamId()) {
        turnOrderSlot.classList.add("turn-order__slot--active");
        this.currentTurnEl.textContent = team ? team.name : 'null';
      }

      turnOrderSlot.textContent = (turnOrder + 1).toString();

      this.turnOrderBarEl.appendChild(turnOrderSlot);
    })
  }

  /**
   * Render thông tin teams ở 2 sidebar
   */
  private renderTeamBars(): void {
    const teams = TeamManager.instance.getTeams();
    const middleIdx = Math.ceil((teams.length / 2) - 1);
    const activeTeamId = TeamManager.instance.getActiveTeamId();

    teams.forEach((team, idx) => {
      const teamStatus = document.createElement("div");
      const teamNameEl = document.createElement("div");
      const teamScoreEl = document.createElement("div");

      teamStatus.classList.add("team");
      teamNameEl.classList.add("team__name");
      teamScoreEl.classList.add("team__score");

      if (team.id === activeTeamId) {
        teamStatus.classList.add("team--active");
      }
      if (team.isBombed) {
        teamStatus.classList.add("team--bombed");
      }

      teamNameEl.textContent = `${team.id + 1}. ${team.name}`;
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
    const question = QuizManager.instance.pickById(this.questionId);
    if (!question) return;

    this.questionEl.textContent = question.content;
    this.answersEl.innerHTML = '';

    question.answers.forEach((answer, i) => {
      const div = document.createElement('div');
      div.className = 'answer-item';
      div.textContent = `${i + 1}. ${answer}`;
      this.answersEl.appendChild(div);
    });

    this.correctAnswerEl.textContent = `Đáp án đúng: ${question.answers[question.correct]}`;
    this.correctAnswerEl.classList.remove('active');
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
        this.correctAnswerEl.classList.add('active');

        console.log(this.questionId);

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
        //hiện lại nút bỏ lượt
        this.skipTurnBtn.style.display = 'initial';
      }
    }

    // Nút Hiện Câu Trả Lời, click thêm lần nữa sẽ chuyển trang rút bài
    this.nextQuestionBtn.onclick = () => {
      const phase = GameStateManager.instance.getState().phase;

      // Hiện đáp án
      if (phase === GamePhase.SHOWING_QUESTION || phase == GamePhase.STEAL_QUESTION) {
        this.correctAnswerEl.classList.add('active');

        console.log(this.questionId);

        GameDispatcher.instance.dispatch({
          type: 'REVEAL_CORRECT_ANSWER',
          payload: { id: this.questionId }
        });
      }
      else if (phase === GamePhase.REVEALING_ANSWER) {
        if(DeckManager.instance.type == 'Rare'){
            GameDispatcher.instance.dispatch({
            type: 'SHOW_RARE_CARD_SCREEN',
          })
        } else {
          GameDispatcher.instance.dispatch({
            type: 'BEGIN_COMMON_CARD_DRAWING',
          })
        }
        // GameDispatcher.instance.dispatch({
        //   type: 'SHOW_RARE_CARD_SCREEN',
        // })
      }
    };
    // Nút Bỏ Qua Lượt
    this.skipTurnBtn.onclick = () => {
      if(TeamManager.instance.getStealOrders().length == 1){
        this.skipTurnBtn.style.display = 'none';
      }
      GameDispatcher.instance.dispatch({
        type: 'SKIP_TURN',
      });
      this.turnOrderBarEl.innerHTML = '';
      this.renderTurnBar();
      this.teamBarLeftEl.innerHTML = '';
      this.teamBarRightEl.innerHTML = '';
      this.renderTeamBars();
    };
  }
}
export default NewQuestionScreen;