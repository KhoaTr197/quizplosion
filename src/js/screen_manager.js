//khởi tạo dữ liệu câu hỏi demo
const QUESTIONS = [
  { id: 1, content: "HTML là viết tắt của từ gì?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Make Link", "Home Tool Markup Language"], correct: 0 },
  { id: 2, content: "Đơn vị 'rem' trong CSS dựa trên yếu tố nào?", answers: ["Thẻ cha (parent)", "Thẻ body", "Thẻ html (root)", "Kích thước màn hình"], correct: 2 },
  { id: 3, content: "TypeScript là gì?", answers: ["Một thư viện JS", "Một Superset của JS", "Một Database", "Một Framework CSS"], correct: 1 },
  { id: 4, content: "LocalStorage lưu dữ liệu ở đâu?", answers: ["Server", "Cookie", "Trình duyệt người dùng", "Session"], correct: 2 },
  { id: 5, content: "Thẻ nào dùng để xuống dòng trong HTML?", answers: ["<break>", "<lb>", "<br>", "<newline>"], correct: 2 },
  { id: 6, content: "HTML là viết tắt của từ gì?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Make Link", "Home Tool Markup Language"], correct: 0 },
  { id: 7, content: "Đơn vị 'rem' trong CSS dựa trên yếu tố nào?", answers: ["Thẻ cha (parent)", "Thẻ body", "Thẻ html (root)", "Kích thước màn hình"], correct: 2 },
  { id: 8, content: "TypeScript là gì?", answers: ["Một thư viện JS", "Một Superset của JS", "Một Database", "Một Framework CSS"], correct: 1 },
  { id: 9, content: "LocalStorage lưu dữ liệu ở đâu?", answers: ["Server", "Cookie", "Trình duyệt người dùng", "Session"], correct: 2 },
  { id: 10, content: "Thẻ nào dùng để xuống dòng trong HTML?", answers: ["<break>", "<lb>", "<br>", "<newline>"], correct: 2 },
  { id: 11, content: "HTML là viết tắt của từ gì?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Make Link", "Home Tool Markup Language"], correct: 0 },
  { id: 12, content: "Đơn vị 'rem' trong CSS dựa trên yếu tố nào?", answers: ["Thẻ cha (parent)", "Thẻ body", "Thẻ html (root)", "Kích thước màn hình"], correct: 2 },
  { id: 13, content: "TypeScript là gì?", answers: ["Một thư viện JS", "Một Superset của JS", "Một Database", "Một Framework CSS"], correct: 1 },
  { id: 14, content: "LocalStorage lưu dữ liệu ở đâu?", answers: ["Server", "Cookie", "Trình duyệt người dùng", "Session"], correct: 2 },
  { id: 15, content: "Thẻ nào dùng để xuống dòng trong HTML?", answers: ["<break>", "<lb>", "<br>", "<newline>"], correct: 2 },
];

document.addEventListener('DOMContentLoaded', function() {
  // lấy tham chiếu đến các màn hình
  const startMenuScreen = document.getElementById('start-menu-screen');
  const questionMenuScreen = document.getElementById('question-menu-screen');
  const questionScreen = document.getElementById('question-screen');
  const rareCardScreen = document.getElementById('rare-card-screen');
  const slideCardScreen = document.getElementById('slide-card-screen');

  // lấy tham chiếu đến danh sách câu hỏi
  const questionContainer = document.querySelector('.question-container');

  // lấy tham chiếu đến khu vực hiển thị câu hỏi và câu trả lời
  const questionContent = document.getElementById('question-content');
  const listAnswers = document.getElementById('list-answers');
  const trueAnswer = document.getElementById('true-answer');

  //lấy tham chiếu đến các nút
  const startBtn = document.getElementById('start-btn');
  const guideBtn = document.getElementById('guide-btn');

  const STATE_KEY = 'exploding_kittens_app_state';

  // khởi tạo trạng thái trò chơi
  let gameState = {
      currentScreen: 'START_MENU', // screen hiện tại
      activeQuestionId: null, // ID câu hỏi đang xem
      completedQuestionIds: [], // Danh sách ID câu hỏi đã hoàn thành (gồm cả Next và Close)
      lastCompletedQuestionId: null, // ID câu hỏi vừa hoàn thành gần nhất
  };
  // hàm lưu State khi có thay đổi
  function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(gameState));
  }

  // hàm tải State khi mở web
  function loadState() {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
      const parsedState = JSON.parse(saved);
      gameState = {
        ...gameState, // Giữ các giá trị mặc định (để đảm bảo có đủ mảng rỗng)
        ...parsedState // Ghi đè dữ liệu đã lưu lên trên
      };
    }
  }
  // hàm ẩn tất cả màn hình
  function hideAllScreens() {
    startMenuScreen.classList.remove('active');
    questionMenuScreen.classList.remove('active');
    questionScreen.classList.remove('active');
    rareCardScreen.classList.remove('active');
    slideCardScreen.classList.remove('active');
  }

  // hàm hiển thị màn hình khi vừa vào game
  function renderApp() {
    hideAllScreens();
    // if (gameState.currentScreen === 'START_MENU') {
    //   startMenuScreen.classList.add('active');
    // } else if (gameState.currentScreen === 'GAME') {
    //   renderGame(gameState.activeQuestionId);
    //   gameScreen.classList.add('active');
    // }
    switch (gameState.currentScreen) {
      case "START_MENU":{
        hideAllScreens();
        startMenuScreen.classList.add('active');
        break;
      }
      case "QUESTION_MENU": {
        renderQuestionMenu();
        break;
      }
      case "QUESTION": {
        renderQuestion(gameState.activeQuestionId);
        break;
      }
      case "RARE_CARD": {
        
        break;
      }
      case "SLIDE_CARD": {
        renderSlideCard();
        break;
      }
      default: {
        hideAllScreens();
        startMenuScreen.classList.add('active');
        break;
      }
    }
  }
  // hàm render màn hình danh sách câu hỏi
  function renderQuestionMenu() {
    hideAllScreens();
    questionContainer.innerHTML = '';
        
    QUESTIONS.forEach((q, idx) => {
      const btn = document.createElement('div');
      btn.className = 'question-item';
      btn.innerText = `Q ${idx + 1}`;
      btn.addEventListener('click', function() {
        console.log('Question selected:', q.id);
        selectQuestion(q.id);
      });
      if(gameState.completedQuestionIds.includes(q.id)) {
        gameState.lastCompletedQuestionId === q.id 
        ? btn.classList.add('question-item--last-completed') 
        : btn.classList.add('question-item--completed');
      }
      questionContainer.appendChild(btn);
    });
    questionMenuScreen.classList.add('active');
  }
  // hàm render màn hình câu hỏi
  function renderQuestion(questionId) {
    hideAllScreens();
    trueAnswer.classList.remove('active');
    const question = QUESTIONS.find(q => q.id === questionId); 
    if (!question) {
      console.error('Question not found:', questionId);
      return;
    }
    // hiển thị câu hỏi
    questionContent.innerText = question.content;
    // hiển thị các câu trả lời
    listAnswers.innerHTML = '';
    question.answers.forEach((answer, idx) => {
      const answerBtn = document.createElement('div');
      answerBtn.className = 'answer-item';
      answerBtn.innerText = `${idx + 1}. ${answer}`;
      listAnswers.appendChild(answerBtn);
    });
    // hiển thị đáp án đúng
    // CHƯA LÀM: hiển thị nhiều đáp án đúng
    trueAnswer.innerText = `Correct: ${question.answers[question.correct]}`;
    questionScreen.classList.add('active');
  }

  // xử lý khi người dùng chọn 1 câu ở Question Menu
  function selectQuestion(id) {
    gameState.currentScreen = 'QUESTION';
    gameState.activeQuestionId = id;
    saveState(); 
    renderApp();
  }

  // hàm render màn hình lật thẻ bài
  function renderSlideCard() {
    hideAllScreens();
    slideCardScreen.classList.add('active');
  }

  /** START MENU */
  // xử lý sự kiện khi nhấn nút Bắt đầu trò chơi
  startBtn.addEventListener('click', function() {
      console.log('Start Game button clicked');
      gameState.currentScreen = 'QUESTION_MENU';
      saveState();
      renderApp();
  });
  // CHƯA LÀM xử lý sự kiện khi nhấn nút Hướng dẫn chơi
  guideBtn.addEventListener('click', function() {
      console.log('Guide button clicked');
  });
  /** END START MENU */

  /** QUESTION */
  // hàm lưu điểm và chuyển screen
  function completeQuestion() {
    // lưu ID câu hỏi vừa hoàn thành
    gameState.lastCompletedQuestionId = gameState.activeQuestionId;
    // đánh dấu câu hỏi hiện tại là đã hoàn thành
    if (gameState.activeQuestionId && !gameState.completedQuestionIds.includes(gameState.activeQuestionId)) {
      gameState.completedQuestionIds.push(gameState.activeQuestionId);
    }
    gameState.currentScreen = 'QUESTION_MENU';
    gameState.activeQuestionId = null;
    saveState();
  }
  // hàm xử lý quay lại Question Menu
  function goToQuestionMenu() {
    completeQuestion();
    renderApp();
  }
  // hàm xử lý khi nhấn nút Next Question
  function nextQuestionBtnHandler() {
    gameState.currentScreen = 'SLIDE_CARD';
    saveState();
    renderApp();
  }

  // xử lý sự kiện khi nhấn nút close question
  const closeQuestionBtn = document.getElementById('close-question-btn');
  closeQuestionBtn.addEventListener('click', goToQuestionMenu);

  // xử lý sự kiện khi nhấn nút next question
  const nextQuestionBtn = document.getElementById('next-question-btn');
  nextQuestionBtn.addEventListener('click', nextQuestionBtnHandler);
  /** END QUESTION */

  /** SLIDE CARD */
  // xử lý sự kiện khi nhấn nút về danh sách câu hỏi từ Slide Card
  const questionMenuBtn = document.getElementById('question-menu-btn');
  questionMenuBtn.addEventListener('click', goToQuestionMenu);
  /** END SLIDE CARD */

  // xử lý sự kiện khi nhấn phím
  document.addEventListener('keydown', function(event) {
    // phím space để hiển thị/ẩn đáp án đúng
    if (event.code === 'Space' && gameState.currentScreen === 'QUESTION') {
      trueAnswer.classList.toggle('active');
    }
  });
  // xử lý sự kiện khi nhấn nút reset
  const resetBtn = document.getElementById('reset-btn');
  resetBtn.addEventListener('click', function() {
    localStorage.removeItem(STATE_KEY);
    location.reload();
  });

  // khởi chạy game

  loadState();
  renderApp();
});