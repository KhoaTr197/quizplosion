import QuizManager from "../../core/quiz-manager.js";
import StateManager from "../../core/game-state-manager.js";
import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình danh sách câu hỏi (grid Q1, Q2, Q3...)
 */
class QuestionMenuScreen {
  // DOM Elements
  private container = document.querySelector('.question-container') as HTMLElement;

  /**
   * Render toàn bộ grid câu hỏi
   */
  public render(): void {
    this.container.innerHTML = '';

    QuizManager.instance.questions.forEach((q, idx) => {
      const btn = document.createElement('div');
      btn.className = 'question-item';
      btn.textContent = `Q ${idx + 1}`;

      const state = StateManager.instance.getState();

      if (state.answeredQuestionIds.includes(q.id)) {
        btn.classList.add(
          state.lastAnsweredQuestionId === q.id
            ? 'question-item--last-completed'
            : 'question-item--completed'
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