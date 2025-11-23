import GameStateManager, { GamePhase } from "../../core/game-state-manager.js";
import { QuizQuestion } from "../../core/questions.js";
import QuizManager from "../../core/quiz-manager.js";
import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình câu hỏi
 */
class QuestionScreen {
  private questionId: QuizQuestion["id"];

  // DOM Elements
  private questionEl = document.getElementById('question-content') as HTMLElement;
  private answersEl = document.getElementById('list-answers') as HTMLElement;
  private correctAnswerEl = document.getElementById('correct-answer') as HTMLElement;

  private closeQuestionBtn = document.getElementById('close-question-btn') as HTMLElement;
  private nextQuestionBtn = document.getElementById('next-question-btn') as HTMLElement;

  constructor(questionId: QuizQuestion["id"]) {
    console.log('[QuestionScreen] Question ID - ', questionId);
    this.questionId = questionId;
    this.bindEvents();
  }

  /**
   * Hiển thị màn hình
   */
  public render(): void {
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
      GameDispatcher.instance.dispatch({
        type: 'SHOW_QUESTION_MENU',
      });

      QuizManager.instance.answerById(this.questionId);
    }

    // Nút Hiện Câu Trả Lời, click thêm lần nữa sẽ chuyển trang rút bài
    this.nextQuestionBtn.onclick = () => {
      const phase = GameStateManager.instance.getState().phase;

      // Hiện đáp án
      if (phase === GamePhase.SHOWING_QUESTION) {
        this.correctAnswerEl.classList.add('active');

        console.log(this.questionId);

        GameDispatcher.instance.dispatch({
          type: 'REVEAL_CORRECT_ANSWER',
          payload: { id: this.questionId }
        });
      }
      else if (phase === GamePhase.REVEALING_ANSWER) {
        GameDispatcher.instance.dispatch({
          type: 'BEGIN_COMMON_CARD_DRAWING',
        })
      }
    };
  }
}
export default QuestionScreen;