import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình bắt đầu game (Start Menu)
 */
class StartMenuScreen {
  // DOM Elements
  private startBtn = document.getElementById('start-btn') as HTMLButtonElement;
  private guideBtn = document.getElementById('guide-btn') as HTMLButtonElement;

  constructor() {
    this.bindEvents();
  }

  /**
   * Hiển thị màn hình
   */
  public render(): void {
    console.log('%cStartMenuScreen: Đã hiển thị!', 'color: #4caf50');

    this.startBtn.disabled = false;
    this.guideBtn.disabled = false;

    this.startBtn.focus();
  }

  /**
   * Gắn sự kiện cho các nút
   */
  private bindEvents(): void {
    // Nút Bắt đầu
    this.startBtn.addEventListener('click', () => {
      console.log('START GAME clicked!');
      this.startBtn.disabled = true;

      GameDispatcher.instance.dispatch({
        type: 'START_GAME'
      });

      this.startBtn.classList.add('clicked');
    });

    // Nút Hướng dẫn
    this.guideBtn.addEventListener('click', () => {
      console.log('Hướng dẫn clicked!');
      GameDispatcher.instance.dispatch({
        type: 'SHOW_GUIDE'
      });
    });
  }
}

export default StartMenuScreen;