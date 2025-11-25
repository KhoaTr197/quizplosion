import { PlaceholderCardType } from "../../core/cards.js";
import DeckManager from "../../core/deck-manager.js";
import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình rút bài Rare
 */
class RareCardScreen {
  private rareCardContainer = document.querySelector('.card-container.card-container--rare') as HTMLElement;
  private questionMenuBtn = document.querySelector('#questionmenu-btn') as HTMLElement;

  constructor() {
    this.bindEvents();
  }

  /**
   * Render toàn bộ lá bài
   */
  public render(): void {
    const deck = DeckManager.instance;
    this.rareCardContainer.innerHTML = '';
    deck.getDeck().forEach((card) => {
      const img = document.createElement('img');

      img.src = card.metadata.img.src;
      img.alt = card.metadata.img.alt;
      if (card.type === PlaceholderCardType.PLACEHOLDER){
        img.classList.add('card__image');
        img.classList.add('card__image--back');
        img.onclick = () => {
          img.classList.add('card__image--hide');
          //deck.draw();
        }
      }
      else {
        img.classList.add('card__image');
        img.classList.add('card__image--rare');
      }
          
      this.rareCardContainer.appendChild(img);
    })
  }

  public bindEvents(): void {
    this.questionMenuBtn.onclick = () => {
      GameDispatcher.instance.dispatch({
        type: "RETURN_TO_QUESTION_MENU",
      })
    }
  }
}
export default RareCardScreen;