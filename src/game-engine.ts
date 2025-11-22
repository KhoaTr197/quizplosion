import DeckManager from "./deck-manager.js";
import GameStateManager, { GamePhase } from "./game-state-manager.js";
import { QuizQuestion } from "./questions.js";
import QuizManager from "./quiz-manager.js";

class GameEngine {
  private stateManager: GameStateManager;
  private quizManager: QuizManager;
  private deckManager: DeckManager;

  // lấy tham chiếu đến các màn hình
  private startMenuScreen = document.getElementById('start-menu-screen') as HTMLElement;
  private questionMenuScreen = document.getElementById('question-menu-screen') as HTMLElement;
  private questionScreen = document.getElementById('question-screen') as HTMLElement;
  private rareCardScreen = document.getElementById('rare-card-screen') as HTMLElement;
  private slideCardScreen = document.getElementById('slide-card-screen') as HTMLElement;

  // lấy tham chiếu đến danh sách câu hỏi
  private questionContainer = document.querySelector('.question-container') as HTMLElement;

  // lấy tham chiếu đến khu vực hiển thị câu hỏi và câu trả lời
  private questionContent = document.getElementById('question-content') as HTMLElement;
  private listAnswers = document.getElementById('list-answers') as HTMLElement;
  private trueAnswer = document.getElementById('true-answer') as HTMLElement;

  //lấy tham chiếu đến các nút
  private startBtn = document.getElementById('start-btn') as HTMLElement;
  private guideBtn = document.getElementById('guide-btn') as HTMLElement;

  private closeQuestionBtn = document.getElementById('close-question-btn') as HTMLElement;
  private nextQuestionBtn = document.getElementById('next-question-btn') as HTMLElement;
  private questionMenuBtn = document.getElementById('question-menu-btn') as HTMLElement;
  private resetBtn = document.getElementById('reset-btn') as HTMLElement;

  constructor() {
    this.quizManager = new QuizManager();
    this.deckManager = new DeckManager();
    this.stateManager = new GameStateManager();
    console.log(this.nextQuestionBtn);
    this.bindingEventListener();
  }
  public start(): void {
    this.hideAllScreens();

    switch (this.stateManager.getState().phase) {
      case GamePhase.START_MENU: {
        this.hideAllScreens();
        this.startMenuScreen.classList.add('active');
        break;
      }
      case GamePhase.QUESTION_PICK: {
        this.renderQuestionMenu();
        break;
      }
      case GamePhase.ANSWERING: {
        this.renderQuestion(this.stateManager.getState().currentQuestionId!);
        break;
      }
      case GamePhase.RARE_CARD_REVEAL: {

        break;
      }
      case GamePhase.DRAWING_CARDS: {
        this.renderSlideCard();
        break;
      }
      default: {
        this.hideAllScreens();
        this.startMenuScreen.classList.add('active');
        break;
      }
    }
  }
  private hideAllScreens(): void {
    this.startMenuScreen.classList.remove('active');
    this.questionMenuScreen.classList.remove('active');
    this.questionScreen.classList.remove('active');
    this.rareCardScreen.classList.remove('active');
    this.slideCardScreen.classList.remove('active');
  }
  private renderQuestionMenu(): void {
    this.hideAllScreens();
    this.questionContainer.innerHTML = '';

    this.quizManager.questions.forEach((q, idx) => {
      const btn = document.createElement('div');
      btn.className = 'question-item';
      btn.innerText = `Q ${idx + 1}`;
      btn.addEventListener('click', () => {
        console.log('Question selected:', q.id);
        this.selectQuestion(q.id);
      });
      if (this.stateManager.getState().answeredQuestionIds.includes(q.id)) {
        this.stateManager.getState().lastAnsweredQuestionId === q.id
          ? btn.classList.add('question-item--last-completed')
          : btn.classList.add('question-item--completed');
      }
      this.questionContainer.appendChild(btn);
    });
    this.questionMenuScreen.classList.add('active');
  }
  private renderQuestion(questionId: QuizQuestion["id"]) {
    this.hideAllScreens();
    this.trueAnswer.classList.remove('active');
    const question = this.quizManager.questions.find(q => q.id === questionId);
    if (!question) {
      console.error('Question not found:', questionId);
      return;
    }
    // hiển thị câu hỏi
    this.questionContent.innerText = question.content;
    // hiển thị các câu trả lời
    this.listAnswers.innerHTML = '';
    question.answers.forEach((answer, idx) => {
      const answerBtn = document.createElement('div');
      answerBtn.className = 'answer-item';
      answerBtn.innerText = `${idx + 1}. ${answer}`;
      this.listAnswers.appendChild(answerBtn);
    });
    // hiển thị đáp án đúng
    // CHƯA LÀM: hiển thị nhiều đáp án đúng
    this.trueAnswer.innerText = `Correct: ${question.answers[question.correct]}`;
    this.questionScreen.classList.add('active');
  }
  // xử lý khi người dùng chọn 1 câu ở Question Menu
  private selectQuestion(questionId: QuizQuestion["id"]) {
    this.stateManager.updateState({
      currentQuestionId: questionId,
      phase: GamePhase.ANSWERING
    })
    this.start();
  }
  // hàm render màn hình lật thẻ bài
  private renderSlideCard() {
    this.hideAllScreens();
    this.slideCardScreen.classList.add('active');
  }
  private bindingEventListener() {
    this.startBtn.addEventListener('click', () => {
      console.log('Start Game button clicked');
      this.stateManager.updateState({
        phase: GamePhase.QUESTION_PICK
      });
      this.start();
    });
    // CHƯA LÀM xử lý sự kiện khi nhấn nút Hướng dẫn chơi
    this.guideBtn.addEventListener('click', () => {
      console.log('Guide button clicked');
    });
    this.closeQuestionBtn.addEventListener('click', () => this.goToQuestionMenu());
    this.nextQuestionBtn.addEventListener('click', () => this.nextQuestionBtnHandler());
    this.questionMenuBtn.addEventListener('click', () => this.goToQuestionMenu());
    document.addEventListener('keydown', (event) => {
      // phím space để hiển thị/ẩn đáp án đúng
      if (event.code === 'Space' && this.stateManager.getState().phase === GamePhase.ANSWERING) {
        this.trueAnswer.classList.toggle('active');
      }
    });
    this.resetBtn.addEventListener('click', function () {
      GameStateManager.clearSave();
      location.reload();
    });
  }
  private completeQuestion() {
    // lưu ID câu hỏi vừa hoàn thành
    this.stateManager.updateState({
      lastAnsweredQuestionId: this.stateManager.getState().currentQuestionId
    });
    if (!this.stateManager.getState().answeredQuestionIds.includes(this.stateManager.getState().currentQuestionId!)) {
      this.stateManager.updateState({
        answeredQuestionIds: [...this.stateManager.getState().answeredQuestionIds, this.stateManager.getState().currentQuestionId!]
      });
    }
    this.stateManager.updateState({
      phase: GamePhase.QUESTION_PICK,
      currentQuestionId: 0 // null
    })
  }
  private goToQuestionMenu() {
    this.completeQuestion();
    this.start();
  }
  // hàm xử lý khi nhấn nút Next Question
  private nextQuestionBtnHandler() {
    console.log("Next btn clicked!!")
    this.stateManager.updateState({
      phase: GamePhase.DRAWING_CARDS
    });
    this.start();
  }
}
export default GameEngine;