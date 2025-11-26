import GameDispatcher, { GameAction } from "../game-dispatcher.js";
import { CommonSpecialCardType, RareCardType } from "./cards.js";

type SFXKey =
  "answer_reveal"
  | "card_draw"
  | "bomb_explode"
  | "nuclear_explode"
  | "point_change"
  | "lose_all_points"
  | "rare_card_reveal";

class AudioManager {
  private static _instance: AudioManager;
  private sfx: Map<SFXKey, HTMLAudioElement> = new Map();
  private basePath = "../../assets/sfx/";
  private volume = 0.8;
  private muted = false;

  private constructor() {
    this.preloadSounds();
    this.subscribeToDispatcher();
  }

  /**
   * Lấy instance duy nhất của AudioManager (Singleton)
   * @returns AudioManager instance
   */
  public static get instance(): AudioManager {
    if (!AudioManager._instance) {
      AudioManager._instance = new AudioManager();
    }
    return AudioManager._instance;
  }

  private preloadSounds(): void {
    const sounds: Record<SFXKey, string> = {
      answer_reveal: "answer.wav",
      card_draw: "card_slide.wav",
      bomb_explode: "exploding_kittens.wav",
      nuclear_explode: "nuclear.wav",
      point_change: "change.wav",
      lose_all_points: "lose_all.wav",
      rare_card_reveal: "rare_card.wav"
    };

    Object.entries(sounds).forEach(([key, file]) => {
      const audio = this.createAudio(`${this.basePath}${file}`);
      this.sfx.set(key as SFXKey, audio);
    });

    console.log("%cAudioManager: Đã preload tất cả SFX!", "color: #8b5cf6");
  }

  private subscribeToDispatcher(): void {
    GameDispatcher.instance.subscribe((action: GameAction) => {
      if (this.muted) return;

      switch (action.type) {
        case "DRAW_NEXT_CARD": {
          const card = action.payload.card;
          console.log(card);
          if (card.isBomb && card.type === CommonSpecialCardType.NUCLEAR) {
            this.play("nuclear_explode");
            return;
          }
          else if (card.isBomb && card.type === CommonSpecialCardType.BOMB) {
            this.play("bomb_explode");
            return;
          } else {
            this.play("card_draw");
          }
          break;
        }
        case "REVEAL_RARE_CARD": {
          const card = action.payload.card;
          console.log(card);
          if (card.type === RareCardType.LOSE_ALL) {
            this.play("lose_all_points");
            return;
          } else if (card.type === RareCardType.CHANGE) {
            this.play("point_change");
            return;
          }
        }
      }
    })
  }

  private createAudio(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = this.volume;
    return audio;
  }

  public play(key: SFXKey, volume?: number): void {
    const sound = this.sfx.get(key);
    if (!sound) {
      console.warn(`SFX "${key}" không tồn tại!`);
      return;
    }

    // Reset để có thể play lại ngay (tránh delay)
    sound.currentTime = 0;
    sound.volume = this.muted ? 0 : (volume ?? this.volume);
    sound.play().catch((e) => {
      console.warn("Không thể phát âm thanh (có thể do user chưa interact):", e);
    });
  }

  public toggleMute(): void {
    this.muted = !this.muted;
    this.updateAllVolumes();
    console.log("[AudioManager]: ", this.muted ? "🔇 Âm thanh đã tắt" : "🔊 Âm thanh đã bật");
  }

  private updateAllVolumes(): void {
    const volume = this.muted ? 0 : this.volume;
    this.sfx.forEach((audio) => (audio.volume = volume));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  public get isMuted(): boolean {
    return this.muted;
  }
}

export default AudioManager;