export const QUESTIONS: QuizQuestion[] = [
  { id: 1, content: "HTML là viết tắt của từ gì?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Make Link", "Home Tool Markup Language"], correct: 0, isAnswered: false },
  { id: 2, content: "Đơn vị 'rem' trong CSS dựa trên yếu tố nào?", answers: ["Thẻ cha (parent)", "Thẻ body", "Thẻ html (root)", "Kích thước màn hình"], correct: 2, isAnswered: false },
  { id: 3, content: "TypeScript là gì?", answers: ["Một thư viện JS", "Một Superset của JS", "Một Database", "Một Framework CSS"], correct: 1, isAnswered: false },
  { id: 4, content: "LocalStorage lưu dữ liệu ở đâu?", answers: ["Server", "Cookie", "Trình duyệt người dùng", "Session"], correct: 2, isAnswered: false },
  { id: 5, content: "Thẻ nào dùng để xuống dòng trong HTML?", answers: ["<break>", "<lb>", "<br>", "<newline>"], correct: 2, isAnswered: false },
  { id: 6, content: "HTML là viết tắt của từ gì?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Make Link", "Home Tool Markup Language"], correct: 0, isAnswered: false },
  { id: 7, content: "Đơn vị 'rem' trong CSS dựa trên yếu tố nào?", answers: ["Thẻ cha (parent)", "Thẻ body", "Thẻ html (root)", "Kích thước màn hình"], correct: 2, isAnswered: false },
  { id: 8, content: "TypeScript là gì?", answers: ["Một thư viện JS", "Một Superset của JS", "Một Database", "Một Framework CSS"], correct: 1, isAnswered: false },
  { id: 9, content: "LocalStorage lưu dữ liệu ở đâu?", answers: ["Server", "Cookie", "Trình duyệt người dùng", "Session"], correct: 2, isAnswered: false },
  { id: 10, content: "Thẻ nào dùng để xuống dòng trong HTML?", answers: ["<break>", "<lb>", "<br>", "<newline>"], correct: 2, isAnswered: false },
  { id: 11, content: "HTML là viết tắt của từ gì?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Make Link", "Home Tool Markup Language"], correct: 0, isAnswered: false },
  { id: 12, content: "Đơn vị 'rem' trong CSS dựa trên yếu tố nào?", answers: ["Thẻ cha (parent)", "Thẻ body", "Thẻ html (root)", "Kích thước màn hình"], correct: 2, isAnswered: false },
  { id: 13, content: "TypeScript là gì?", answers: ["Một thư viện JS", "Một Superset của JS", "Một Database", "Một Framework CSS"], correct: 1, isAnswered: false },
  { id: 14, content: "LocalStorage lưu dữ liệu ở đâu?", answers: ["Server", "Cookie", "Trình duyệt người dùng", "Session"], correct: 2, isAnswered: false },
  { id: 15, content: "Thẻ nào dùng để xuống dòng trong HTML?", answers: ["<break>", "<lb>", "<br>", "<newline>"], correct: 2, isAnswered: false },
];

export interface QuizQuestion {
  /**
   * ID của câu hỏi.
   */
  id: number;
  /**
   * Nội dung của câu hỏi.
   */
  content: string;
  /**
   * Mảng chứa các lựa chọn trả lời.
   */
  answers: string[];
  /**
   * index của đáp án đúng trong mảng 'answers' (bắt đầu từ 0).
   */
  correct: number;
  /**
   * Trạng thái cho biết câu hỏi đã được trả lời chưa
   */
  isAnswered: boolean;
}