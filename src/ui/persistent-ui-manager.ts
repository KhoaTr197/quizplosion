import GameDispatcher from "../game-dispatcher.js";
import { ScreenId } from "./ui-manager.js";

class PersistentUIManager {
  private static _instance: PersistentUIManager;

  private resetBtn = document.getElementById("reset-btn") as HTMLElement;
  constructor() {
    this.bindEvents();
  }

  /**
   * Lấy instance duy nhất của PersistentUIManager (Singleton)
   * @returns PersistentUIManager instance
   */
  public static get instance(): PersistentUIManager {
    if (!PersistentUIManager._instance) {
      PersistentUIManager._instance = new PersistentUIManager();
    }
    return PersistentUIManager._instance;
  }

  public updateVisibility(currentScreen: ScreenId): void {
    this.hideAll();

    switch (currentScreen) {
      default:
        this.resetBtn.style.display = "block";
        break;
    }
  }

  private hideAll(): void {
    [this.resetBtn].forEach(
      (btn) => (btn.style.display = "none")
    );
  }

  private bindEvents(): void {
    // Reset game
    this.resetBtn.onclick = () => {
      if (confirm("Bạn có chắc muốn bắt đầu lại game?")) {
        GameDispatcher.instance.dispatch({ type: "RESET_GAME" });
      }
    };
  }
}

const PersistentUI = PersistentUIManager.instance;

export default PersistentUI;