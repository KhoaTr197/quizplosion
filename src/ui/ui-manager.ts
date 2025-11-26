/**
 * Các màn hình chính trong game (tương ứng với các div có id trong HTML)
 */
export enum ScreenId {
  START_MENU = 'start-menu-screen',
  SETUP = 'setup-screen',
  QUESTION_MENU = 'question-menu-screen',
  QUESTION = 'question-screen',
  RARE_CARD = 'rare-card-screen',
  COMMON_CARD_DRAWING = 'common-card-drawing-screen',
}

/**
 * Quản lý việc hiển thị/ẩn các màn hình trong Game.
 * 
 * Singleton pattern – chỉ có 1 instance duy nhất.
 * 
 * @example
 * UI.show(ScreenId.QUESTION_MENU);
 */
class UIManager {
  private static _instance: UIManager;

  private readonly screens: Readonly<Record<ScreenId, HTMLElement>>;

  private constructor() {
    // Lấy tất cả element ngay khi khởi tạo
    const getEl = (id: string) => {
      const el = document.getElementById(id);
      if (!el) throw new Error(`Không tìm thấy element với id="${id}". Kiểm tra HTML!`);
      return el as HTMLElement;
    };

    this.screens = {
      [ScreenId.START_MENU]: getEl(ScreenId.START_MENU),
      [ScreenId.SETUP]: getEl(ScreenId.SETUP),
      [ScreenId.QUESTION_MENU]: getEl(ScreenId.QUESTION_MENU),
      [ScreenId.QUESTION]: getEl(ScreenId.QUESTION),
      [ScreenId.RARE_CARD]: getEl(ScreenId.RARE_CARD),
      [ScreenId.COMMON_CARD_DRAWING]: getEl(ScreenId.COMMON_CARD_DRAWING),
    };
  }

  /**
   * Lấy instance duy nhất (Singleton)
   * @returns {GameDispatcher} instance
   */
  public static get instance(): UIManager {
    if (!UIManager._instance) UIManager._instance = new UIManager();
    return UIManager._instance;
  }

  /**
   * Hiển thị một màn hình và ẩn tất cả các màn hình khác
   * @param screen Màn hình cần hiển thị
   */
  public show(screenName: keyof typeof this.screens): void {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    this.screens[screenName].classList.add('active');
  }

  /**
   * Ẩn tất cả các màn hình (dùng khi transition hoặc reset)
   */
  public hideAll(): void {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
  }
}

/** Xuất dưới tên `UI` cho dễ truy cập */
export const UI = UIManager.instance;