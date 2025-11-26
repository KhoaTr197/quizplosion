import { Team } from "../../core/team-manager.js";
import GameDispatcher from "../../game-dispatcher.js";

/**
 * Màn hình cài đặt trò chơi
 */
class SetupScreen {
  // DOM Elements
  private numTeamsInput = document.getElementById('input-team-count') as HTMLInputElement;
  private teamNamesArea = document.getElementById('team-name-inputs') as HTMLElement;
  private playBtn = document.getElementById('btn-play') as HTMLButtonElement;

  constructor() {
    this.bindEvents();
  }
  public render(): void {
    console.log('%cSetupScreen: Đã hiển thị!', 'color: #4caf50');
    this.renderTeamInputs();
  }

  /**
   * Gắn sự kiện cho các nút
   */
  private bindEvents(): void {
    let parent: Node | null;

    if (!this.numTeamsInput) {
      console.warn('numTeamsInput is null — cannot bind change');
      return;
    }

    parent = this.numTeamsInput.parentNode;
    if (!parent) {
      console.warn('numTeamsInput.parentNode is null — cannot bind change');
      return;
    }
    // Input số lượng đội chơi
    this.numTeamsInput.addEventListener('change', () => {
      this.renderTeamInputs();
    });
    // Đổi nút để tránh sự kiện bị gắn nhiều lần
    if (!this.playBtn) {
      console.warn('playBtn is null — cannot bind click');
      return;
    }

    parent = this.playBtn.parentNode;
    if (!parent) {
      console.warn('playBtn.parentNode is null — cannot replace node');
      return;
    }
    const newBtn = this.playBtn.cloneNode(true) as HTMLButtonElement;
    parent.replaceChild(newBtn, this.playBtn);
    this.playBtn = newBtn as HTMLButtonElement;
    // Nút Chơi
    this.playBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.team-name-input');
      const teams: Team[] = [];

      inputs.forEach((el, idx) => {
        const input = el as HTMLInputElement;
        teams.push({
          id: idx,
          name: input.value || `Đội ${idx + 1}`,
          score: 0,
          isBombed: false
        });
      });
      GameDispatcher.instance.dispatch({
        type: 'FINISH_TEAM_SETUP',
        payload: { teams }
      });
    })
  }
  /**
   * Hiển thị input tên đội chơi dựa trên số lượng đội
   */
  private renderTeamInputs(): void {
    const numTeams = parseInt(this.numTeamsInput.value, 10);
    this.teamNamesArea.innerHTML = '';
    for (let i = 1; i <= numTeams; i++) {
      const div = document.createElement('div');
      div.className = 'input-group';
      div.innerHTML = `
        <label>Team name ${i}:</label>
        <input type="text" class="team-name-input" id="team-name-${i}" placeholder="Team ${i}" value="Team ${String.fromCharCode(65 + i - 1)}">
      `;
      this.teamNamesArea.appendChild(div);
    }
  }

}
export default SetupScreen;
