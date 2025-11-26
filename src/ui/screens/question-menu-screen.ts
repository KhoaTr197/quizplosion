import QuizManager from "../../core/quiz-manager.js";
import StateManager from "../../core/game-state-manager.js";
import GameDispatcher from "../../game-dispatcher.js";
import TeamManager from "../../core/team-manager.js";

/**
 * Màn hình danh sách câu hỏi (grid Q1, Q2, Q3...)
 */
class QuestionMenuScreen {
  // DOM Elements
  private container = document.querySelector('.question-grid') as HTMLElement;
  private currentTeamName = document.querySelector('#current-team-name') as HTMLElement;

  /**
   * Render toàn bộ grid câu hỏi
   */
  public render(): void {
    this.container.innerHTML = '';
    this.currentTeamName.innerHTML = '';

    const currentTeam = TeamManager.instance.getCurrentTeam();
    this.currentTeamName.innerHTML = currentTeam ? currentTeam.name : "Team name";

    QuizManager.instance.questions.forEach((q, idx) => {
      const btn = document.createElement('div');
      btn.className = 'question-grid__item';
      btn.textContent = `Q ${idx + 1}`;

      const state = StateManager.instance.getState();

      if (state.answeredQuestionIds.includes(q.id)) {
        btn.classList.add(
          state.lastAnsweredQuestionId === q.id
            ? 'question-grid__item--last-completed'
            : 'question-grid__item--completed'
        );
      } else {
        btn.onclick = () => {
          GameDispatcher.instance.dispatch({
            type: "SELECT_QUESTION",
            payload: { id: q.id }
          });
        };
      }

      this.container.appendChild(btn);
    });
  }
}
export default QuestionMenuScreen;