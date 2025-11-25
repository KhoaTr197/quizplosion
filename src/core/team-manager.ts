import Team from './team';

class TeamManager {
  private static _instance: TeamManager;

  private teams: Team[] = []; //mảng danh sách đội chơi
  private turnOrders: number[] = []; //mảng chứa id đội chơi theo thứ tự được random (main turn)
  private currentTurnIndex: number = 0; // chỉ số lượt hiện tại trong teamsOrder
  private stealOrders: number[] = []; //mảng chứa id đội chơi có thể cướp lượt
  private activeTeamId: number = 0; //index của đội đang trả lời

  /** Private constructor → không cho new trực tiếp */
  constructor() {
    this.reset();
  }
  /**
   * Lấy instance duy nhất của TeamManager (Singleton)
   * @returns TeamManager instance
   */
  public static get instance(): TeamManager {
    if (!TeamManager._instance) {
      TeamManager._instance = new TeamManager();
    }
    return TeamManager._instance;
  }
  /**
    * Reset toàn bộ đội chơi – dùng khi bắt đầu game mới
  */
  public reset() {
    this.setup();
    this.activeTeamId = this.turnOrders[this.currentTurnIndex];
  }
  public randomTeamsOrder(): void {
    this.turnOrders = this.teams.map(team => team.id);
    // Fisher-Yates
    for (let i = this.turnOrders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.turnOrders[i], this.turnOrders[j]] = [this.turnOrders[j], this.turnOrders[i]];
    }
    // Reset lượt về đội đầu tiên trong danh sách mới
    this.currentTurnIndex = 0;
    this.activeTeamId = this.turnOrders[this.currentTurnIndex];
  }
  public setup(): void {
    this.stealOrders = this.turnOrders.filter((_, k)=> k !== this.currentTurnIndex);
  }
  public getTeams(): Team[] {
    return this.teams;
  }
  public getTeamById(teamId: number): Team | undefined {
    return this.teams.find(t => t.id === teamId);
  }
  public setTeams(teams: Team[]): void {
    this.teams = teams;
    this.turnOrders = teams.map(t=>t.id)
  }
  public getTurnOrders(): number[] {
    return this.turnOrders;
  }
  public getActiveTeamId(): number {
    return this.activeTeamId;
  }
  /** 
   * Cập nhật điểm số của đội chơi
   * @param teamId ID của đội
   * @param type Loại cập nhật: 'add' (cộng), 'set' (gán), 'multiply' (nhân), 'divide' (chia)
   * @param value Giá trị để cập nhật
   */
  public updateScore(teamId: number, type: 'add' | 'set' | 'multiple' | 'divide', value: number): void {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return;

    switch (type) {
      case 'add':
        team.score += value;
        break;
      case 'set':
        team.score = value; // Dùng cho thẻ Lose All (set về 0) hoặc Swap
        break;
      case 'multiple':
        team.score *= value;
        break;
      case 'divide':
        team.score = Math.floor(team.score / value);
        break;
    }
    // Đảm bảo điểm không âm
    if (team.score < 0) team.score = 0; 
  }
  /**
   * Lấy thông tin đội đang đến lượt
   */
  public getCurrentTeam(): Team | undefined {
    if (this.activeTeamId === null) return undefined;
    return this.teams.find(t => t.id === this.activeTeamId);
  }
  /**
   * Chuyển sang lượt chính thức tiếp theo
   * Dùng khi kết thúc hoàn toàn một câu hỏi (sau khi đã xử lý xong việc cướp lượt nếu có)
   */
  public nextTurn(): void {
    //if (this.turnOrders.length === 0) return;

    // Tăng index lượt chính
    // this.currentTurnIndex++;
    // if (this.currentTurnIndex >= this.turnOrders.length) {
    //   this.currentTurnIndex = 0;
    // }
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrders.length;

    // Cập nhật người đang chơi là người giữ lượt chính
    this.activeTeamId = this.turnOrders[this.currentTurnIndex];
    
    // Xóa hàng đợi cướp 
    this.stealOrders = [];
  }
  public getStealOrders(): number[]{
    return this.stealOrders;
  }
  public prepareStealQueue(): void {
    this.stealOrders = [];
    const total = this.turnOrders.length;
    
    // Bắt đầu từ người kế tiếp của lượt chính, lặp qua hết vòng
    for (let i = 1; i < total; i++) {
      const idx = (this.currentTurnIndex + i) % total;
      this.stealOrders.push(this.turnOrders[idx]);
    }
  }
  /**
   * thông tin đội đang trong lượt cướp
   * @returns đội chơi hoặc undefined nếu không có ai trong hàng đợi
   */
  public getCurrentStealTeam(): Team | undefined {
    if (this.stealOrders.length === 0) return undefined;
    const currentStealTeamId = this.stealOrders[0];
    return this.teams.find(t => t.id === currentStealTeamId);
  }
  /**
   * chuyển lượt (dành cho lượt cướp)
   */
  public nextStealTurn(): boolean {
    if (this.stealOrders.length === 0) {
      return false; // Hết người cướp
    }

    // Lấy ID người đầu hàng đợi và xóa khỏi hàng đợi
    const nextStealTeamId = this.stealOrders.shift(); 
    
    if (nextStealTeamId !== undefined) {
      this.activeTeamId = nextStealTeamId;
      return true;
    }
    return false;
  }
  /**
   * lấy chỉ số đội đang chơi
   */
  public getCurrentTurnIndex(): number {
    return this.currentTurnIndex;
  }
  public startNewQuestion(): void {
    this.activeTeamId = this.turnOrders[this.currentTurnIndex];
    this.prepareStealQueue();
  }
  // Debug
  public debug(): void {
    console.log('Main Order:', this.turnOrders.map(id => this.getTeamById(id)?.name).join(' → '));
    console.log('Current Main Index:', this.currentTurnIndex);
    console.log('Active Team:', this.getCurrentTeam()?.name);
    console.log('Steal Queue:', this.stealOrders.map(id => this.getTeamById(id)?.name).join(' → '));
    console.log('Scores:', this.teams.map(t => `${t.name}: ${t.score}`).join(' | '));
    console.log('---');
  }
}

export default TeamManager;