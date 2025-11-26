import { PlaceholderCardType } from "../../core/cards.js";
import DeckManager from "../../core/deck-manager.js";
import TeamManager from "../../core/team-manager.js";
import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình rút bài (bài common)
 */
class CardDrawingScreen {
  private listSlideCards = document.querySelector('#list-slide-cards') as HTMLElement;
  private questionMenuBtn = document.querySelector('#question-menu-btn') as HTMLElement;

  constructor() {
    this.bindEvents();
  }

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
        img.onclick = () => {
          console.log('[CardDrawingScreen]: ', img);
          img.classList.add('card__image--slided');

          deck.draw();

          GameDispatcher.instance.dispatch({
            type: "DRAW_NEXT_CARD",
            payload: {
              card: deck.peek()!
            }
          })

          this.renderTeamInfo();
        };

      cardContainer.appendChild(img);
    })

    this.listSlideCards.innerHTML = '';
    this.listSlideCards.appendChild(cardContainer);

    this.renderTeamInfo();
  }

  public renderTeamInfo(): void {
    const cardContainer = document.querySelector('#list-slide-cards .card-container');
    if (cardContainer) {
      while (cardContainer.nextSibling) {
        cardContainer.parentNode?.removeChild(cardContainer.nextSibling);
      }
    }
    const infoContainer = document.createElement('div');
    const activeTeam = TeamManager.instance.getCurrentTeam();
    const teamNameEl = document.createElement('div');
    teamNameEl.className = 'text--white text--glow text-xl text--center team__name';

    const teamScoreEl = document.createElement('div');
    teamScoreEl.className = 'text--white text--glow text-xl text--center team__score';

    if (activeTeam) {
      teamNameEl.innerHTML = `${activeTeam.name}`;
      teamScoreEl.innerHTML = `Your Points: ${activeTeam.score}`;
    }

    infoContainer.appendChild(teamNameEl);
    infoContainer.appendChild(teamScoreEl);

    this.listSlideCards.appendChild(infoContainer);
  }

  public bindEvents(): void {
    this.questionMenuBtn.onclick = () => {
      GameDispatcher.instance.dispatch({
        type: "RETURN_TO_QUESTION_MENU",
      })
    }
  }
}
export default CardDrawingScreen;