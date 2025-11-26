import { PlaceholderCardType } from "../../core/cards.js";
import DeckManager from "../../core/deck-manager.js";
import TeamManager, { Team } from "../../core/team-manager.js";
import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình rút bài Rare
 */
class RareCardScreen {
  private teamInfoContainer = document.querySelector('#rare-card-screen .team-info') as HTMLElement;
  private rareCardContainer = document.querySelector('.card-container.card-container--rare') as HTMLElement;
  private questionMenuBtn = document.querySelector('#questionmenu-btn') as HTMLElement;
  private screenContainer = document.querySelector('#rare-card-screen') as HTMLElement;

  constructor() {
    this.resetUI();
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
          img.style.pointerEvents = 'none';
          img.classList.add('card__image--hide');
          const card = deck.draw();
          console.log(card);
          GameDispatcher.instance.dispatch({
            type: "REVEAL_RARE_CARD",
            payload: {
              card: card!,
            }
          })
          if(card?.type == 'change'){
            // Đợi 1 giây rồi hiện modal chọn đội
            setTimeout(() => {
              this.showSwapModal();
            }, 2000);
          
          }
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
      const rareCardHideEl = document.querySelector('.card__image.card__image--hide');
      if(!rareCardHideEl) {
        const activeTeamId = TeamManager.instance.getActiveTeamId();
        TeamManager.instance.updateScore(activeTeamId, 'plus', 5);
      }
      GameDispatcher.instance.dispatch({
        type: "RETURN_TO_QUESTION_MENU",
      })
    }
  }
  /**
   * Hiển thị Modal chọn đội
   */
  private showSwapModal(): void {
    // 1. Ẩn thông tin cũ (Reveal it or get 5)
    if (this.teamInfoContainer) {
      this.teamInfoContainer.style.display = 'none';
    }

    // 2. Xóa modal cũ nếu có
    const existingModal = document.querySelector('.swap-modal');
    if (existingModal) existingModal.remove();

    // 3. Lấy dữ liệu teams
    const activeTeamId = TeamManager.instance.getActiveTeamId();
    // Giả định TeamManager có hàm getTeams() trả về mảng [{id, name, score}, ...]
    // Nếu chưa có, bạn cần thêm getter này vào TeamManager
    const allTeams = TeamManager.instance.getTeams(); 
    const targetTeams = allTeams.filter(t => t.id !== activeTeamId);

    // 4. Tạo HTML Modal
    const modal = document.createElement('div');
    modal.className = 'swap-modal';
    
    const title = document.createElement('h3');
    title.className = 'swap-modal__title text--gradient text--glow';
    title.innerText = 'SWAP SCORE WITH?';

    const list = document.createElement('div');
    list.className = 'swap-modal__list';

    targetTeams.forEach(team => {
      const item = document.createElement('div');
      item.className = 'swap-modal__item';
      item.innerHTML = `
        <span class="swap-modal__team-name">${team!.name.length > 10 ? team!.name.substring(0, 10) + "..." : team!.name}</span>
        <span class="swap-modal__team-score">${team.score} pts</span>
      `;
      
      item.onclick = () => {
        this.handleSwapSelection(activeTeamId, team.id);
      };

      list.appendChild(item);
    });

    modal.appendChild(title);
    modal.appendChild(list);
    this.screenContainer.appendChild(modal);

    // Trigger reflow để animation chạy
    requestAnimationFrame(() => {
      modal.classList.add('swap-modal--active');
    });
  }
  /**
   * Xử lý khi chọn đội để đổi điểm
   */
  private handleSwapSelection(currentTeamId: Team["id"], targetTeamId: Team["id"]): void {
     console.log(`Swapping score between ${currentTeamId} and ${targetTeamId}`);
     
     TeamManager.instance.swapScores(currentTeamId, targetTeamId); 

     // Sau khi chọn xong, quay về menu
     GameDispatcher.instance.dispatch({
        type: "RETURN_TO_QUESTION_MENU",
     });
  }

  /**
   * Khôi phục UI về trạng thái ban đầu (cho lần chơi sau)
   */
  private resetUI(): void {
    if (this.teamInfoContainer) {
      this.teamInfoContainer.style.display = 'block';
    }
    const existingModal = document.querySelector('.swap-modal');
    if (existingModal) existingModal.remove();
  }
}
export default RareCardScreen;