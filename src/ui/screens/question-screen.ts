import GameStateManager, { GamePhase } from "../../core/game-state-manager.js";
import { QuizQuestion, QUESTIONS } from "../../core/questions.js";
import QuizManager from "../../core/quiz-manager.js";
import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình câu hỏi
 */
class QuestionScreen {
  private questionId: QuizQuestion["id"];

  /**
   * Flag để bật/tắt chế độ mock - lấy trực tiếp từ QUESTIONS thay vì QuizManager
   * Set thành true để sử dụng dữ liệu trực tiếp từ questions.ts
   */
  public static useMockData: boolean = false;

  // DOM Elements
  private questionEl = document.getElementById(
    "question-content"
  ) as HTMLElement;
  private answersEl = document.getElementById("list-answers") as HTMLElement;
  private correctAnswerEl = document.getElementById(
    "correct-answer"
  ) as HTMLElement;

  private closeQuestionBtn = document.getElementById(
    "close-question-btn"
  ) as HTMLElement;
  private nextQuestionBtn = document.getElementById(
    "next-question-btn"
  ) as HTMLElement;

  constructor(questionId: QuizQuestion["id"]) {
    console.log("[QuestionScreen] Question ID - ", questionId);
    this.questionId = questionId;
    this.bindEvents();
  }

  /**
   * Lấy câu hỏi từ QUESTIONS hoặc QuizManager
   * @returns Câu hỏi hoặc null nếu không tìm thấy
   */
  private getQuestion(): QuizQuestion | null {
    if (QuestionScreen.useMockData) {
      // Mock: Lấy trực tiếp từ QUESTIONS trong questions.ts
      const question = QUESTIONS.find((q) => q.id === this.questionId);
      if (!question) {
        console.warn(
          `[QuestionScreen] Mock: Không tìm thấy câu hỏi với ID "${this.questionId}" trong QUESTIONS`
        );
        return null;
      }

      console.log(
        `[QuestionScreen] Mock: Đã lấy câu hỏi ID "${this.questionId}" trực tiếp từ QUESTIONS`,
        question
      );
      return { ...question }; // Trả về bản copy để tránh mutate
    } else {
      // Sử dụng QuizManager (dữ liệu thật qua manager)
      return QuizManager.instance.pickById(this.questionId);
    }
  }

  /**
   * Hiển thị màn hình
   */
  public render(): void {
    const question = this.getQuestion();
    if (!question) return;

    this.questionEl.textContent = question.content;
    this.answersEl.innerHTML = "";

    question.answers.forEach((answer, i) => {
      const div = document.createElement("div");
      div.className = "answer-item";
      div.textContent = `${i + 1}. ${answer}`;
      this.answersEl.appendChild(div);
    });

    this.correctAnswerEl.textContent = `Đáp án đúng: ${
      question.answers[question.correct]
    }`;
    this.correctAnswerEl.classList.remove("active");
  }
  /**
   * Đánh dấu câu hỏi đã được trả lời (mock hoặc thật)
   */
  private markAsAnswered(): void {
    if (QuestionScreen.useMockData) {
      // Mock: Cập nhật trực tiếp trong QUESTIONS
      const question = QUESTIONS.find((q) => q.id === this.questionId);
      if (question) {
        question.isAnswered = true;
        console.log(
          `[QuestionScreen] Mock: Đánh dấu câu hỏi ID "${this.questionId}" đã trả lời trong QUESTIONS`
        );
      }
    } else {
      // Sử dụng QuizManager (dữ liệu thật)
      QuizManager.instance.answerById(this.questionId);
    }
  }

  /**
   * Gắn sự kiện cho các nút
   */
  private bindEvents(): void {
    // Nút Đóng
    this.closeQuestionBtn.onclick = () => {
      GameDispatcher.instance.dispatch({
        type: "SHOW_QUESTION_MENU",
      });

      this.markAsAnswered();
    };

    // Nút Hiện Câu Trả Lời, click thêm lần nữa sẽ chuyển trang rút bài
    this.nextQuestionBtn.onclick = () => {
      const phase = GameStateManager.instance.getState().phase;

      // Hiện đáp án
      if (phase === GamePhase.SHOWING_QUESTION) {
        this.correctAnswerEl.classList.add("active");

        console.log(this.questionId);

        GameDispatcher.instance.dispatch({
          type: "REVEAL_CORRECT_ANSWER",
          payload: { id: this.questionId },
        });
      } else if (phase === GamePhase.REVEALING_ANSWER) {
        GameDispatcher.instance.dispatch({
          type: "BEGIN_COMMON_CARD_DRAWING",
        });
      }
    };
  }
}
export default QuestionScreen;
