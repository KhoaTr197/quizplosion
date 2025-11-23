import { BACK_CARD_INFO } from "../../core/cards.js";
import DeckManager from "../../core/deck-manager.js";

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

    DeckManager.instance.getDeck().forEach(card => {
      const img = document.createElement('img');

      img.src = card.metadata.img.src;
      img.alt = card.metadata.img.alt;
      img.classList.add('card__image');

      if (!card.isBomb)
        img.addEventListener('click', function () {
          console.log('[CardDrawingScreen]: ', this);
          this.classList.add('card__image--slided');
        });

      cardContainer.appendChild(img);
    })

    // Thêm hình mặt sau thẻ bài để ẩn bộ bài
    const BackCardImg = document.createElement('img');

    BackCardImg.src = BACK_CARD_INFO.metadata.img.src;
    BackCardImg.alt = BACK_CARD_INFO.metadata.img.alt;
    BackCardImg.classList.add('card__image', 'card__image--back');
    BackCardImg.addEventListener('click', function () {
      console.log('[CardDrawingScreen]: ', this);
      this.classList.add('card__image--slided');
    });

    cardContainer.appendChild(BackCardImg);

    this.listSlideCards.innerHTML = '';
    this.listSlideCards.appendChild(cardContainer);
  }
}
export default CardDrawingScreen;