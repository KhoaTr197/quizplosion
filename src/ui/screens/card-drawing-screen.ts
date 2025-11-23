import { PlaceholderCardType } from "../../core/cards.js";
import DeckManager from "../../core/deck-manager.js";
import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình rút bài (bài common)
 */
class CardDrawingScreen {
  private listSlideCards = document.querySelector('#list-slide-cards') as HTMLElement;

  /**
   * Render toàn bộ lá bài
   */
  public render(): void {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    const deck = DeckManager.instance;

    deck.getDeck().forEach((card, idx) => {
      const img = document.createElement('img');

      img.src = card.metadata.img.src;
      img.alt = card.metadata.img.alt;

      img.classList.add('card__image');

      if (card.type === PlaceholderCardType.PLACEHOLDER)
        img.classList.add('card__image--back');

      if (!card.isBomb)
        img.addEventListener('click', () => {
          console.log('[CardDrawingScreen]: ', img);
          img.classList.add('card__image--slided');

          deck.draw();

          GameDispatcher.instance.dispatch({
            type: "DRAW_NEXT_CARD",
            payload: {
              card: deck.peek()!
            }
          })
        });

      cardContainer.appendChild(img);
    })

    this.listSlideCards.innerHTML = '';
    this.listSlideCards.appendChild(cardContainer);
  }
}
export default CardDrawingScreen;