import { QUESTIONS, QuizQuestion } from './questions.js';

class QuizManager {
  private available: QuizQuestion[] = [];
  private used: QuizQuestion[] = [];

  constructor() {
    this.reset();

  }

  public reset() {
    this.available = [...QUESTIONS];
    this.used = [];
    this.shuffle(this.available);
  }

  public draw(): QuizQuestion | null {
    if (this.available.length === 0) {
      console.log("Ran out the questions");
      return null;
    }
    const question = this.available.shift()!;
    this.used.push(question);
    return question;
  }

  private shuffle(array: QuizQuestion[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j]!, array[i]!];
    }
  }

  public get questions(): QuizQuestion[] {
    return this.available;
  }

  public peek(): QuizQuestion | null {
    return this.available[0] || null;
  }

  public get remaining() {
    return this.available.length;
  }

  public get totalUsed() {
    return this.used.length;
  }
}

export default QuizManager;