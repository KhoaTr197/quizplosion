export interface Team {
  /** ID duy nhất của đội (tăng tự động từ 1) */
  id: number;
  /** Tên đội do người chơi nhập */
  name: string;
  /** Điểm số hiện tại của đội */
  score: number;
  /** Đã nổ chưa */
  isBombed: boolean;
}

/**
 * TeamManager – Quản lý đội chơi và luồng lượt trong game
 * 
 * @example
 * ```ts
 * TeamManager.instance.setupTeams([{ name: "T1" }, { name: "GENG" }]);
 * TeamManager.instance.shuffleOrders(); // Random lượt
 * const current = TeamManager.instance.getCurrentTeam();
 * ```
 */
class TeamManager {
  private static _instance: TeamManager;

  /** Danh sách tất cả các đội tham gia */
  private teams: Team[] = [];

  /** Danh sách tất cả các đội tham gia (Map) */
  private teamMap = new Map<Team["id"], Team>();

  /** chỉ số lượt hiện tại trong teamsOrder */ 
  private currentTurnIndex: number = 0; 

  /** Thứ tự lượt chơi chính (được random lúc bắt đầu) – chứa các team ID */
  private turnOrders: Team["id"][] = [];

  /** mảng chứa id đội chơi có thể cướp lượt */
  private stealQueue: Team["id"][] = []; 

  /** id của đội đang trả lời */
  private activeTeamId: Team["id"] = 0;

  constructor() {
    this.reset();
  }
  public test(): void {
    this.teams.forEach((t, idx)=>{
      t.score += idx * 2;
    });
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
    this.currentTurnIndex = 0;
    this.activeTeamId = this.turnOrders[0];
    this.teams.forEach(t=>t.isBombed = false);
    this.setup();
    
    if (this.turnOrders.length > 0) {
       this.ensureValidActiveTeam();
    }
  }
  public setup(): void {
    this.stealQueue = [];
    this.activeTeamId = this.turnOrders[this.currentTurnIndex];
  }
  /**
   * Tìm đội hợp lệ đầu tiên bắt đầu từ currentTurnIndex
   * Dùng sau khi random hoặc reset để tránh trúng ngay đội bị bomb
   */
  private ensureValidActiveTeam(): void {
    let checked = 0;
    // Lặp để tìm đội chưa bị bomb
    while (this.isTeamBombed(this.turnOrders[this.currentTurnIndex]) && checked < this.turnOrders.length) {
       this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrders.length;
       checked++;
    }
    this.activeTeamId = this.turnOrders[this.currentTurnIndex];
  }
  public getTurnOrders(): Team["id"][] {
    return structuredClone(this.turnOrders);
  }
  /**
   * Thiết lập danh sách đội chơi và khởi tạo thứ tự lượt
   * 
   * @param teams - Mảng thông tin đội (chỉ cần name)
   * @example
   * setupTeams([{ name: "T1" }, { name: "GENG" }])
   */
  public setUpTeams(teams: Omit<Team, "id" | "score">[]): void {
    this.reset();
    console.log("active id sau khi gọi reset trong setupteams: ", this.activeTeamId);

    this.teams = teams.map((t, i) => {
      const team: Team = {
        id: i,
        name: t.name.trim() || `Team ${i + 1}`,
        score: 0,
        isBombed: false
      };

      /** Thêm vào Map ngay lập tức */
      this.teamMap.set(team.id, team);
      return team;
    });

    this.turnOrders = this.teams.map(team => team.id);
    this.currentTurnIndex = 0;
    //
    this.shuffleOrders();
    this.prepareStealQueue();
    this.activeTeamId = this.turnOrders[0];

  }

  /**
   *  Random thứ tự team bằng thuật toán Fisher-Yates
   */
  public shuffleOrders(): void {
    for (let i = this.turnOrders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.turnOrders[i], this.turnOrders[j]] = [this.turnOrders[j], this.turnOrders[i]];
    }
    this.prepareStealQueue();
  }

  /**
   * Chuẩn bị hàng đợi cướp lượt (theo thứ tự top-down, bỏ qua đội chính)
   * @private
   */
  private prepareStealQueue(): void {
    this.stealQueue = [];
    const len = this.turnOrders.length;
    if (len <= 1) return;

    for (let i = 1; i < len; i++) {
      const idx = (this.currentTurnIndex + i) % len;

      const teamId = this.turnOrders[idx];

      // CHỈ THÊM VÀO HÀNG ĐỢI NẾU KHÔNG BỊ BOMB
      if (!this.isTeamBombed(teamId)) {
        this.stealQueue.push(teamId);
      }
    }
  }

  /** 
   * Cập nhật điểm số của đội chơi
   * @param teamId ID của đội
   * @param type Loại cập nhật: 'add' (cộng), 'set' (gán), 'multiply' (nhân), 'divide' (chia)
   * @param value Giá trị để cập nhật
   */
  public updateScore(teamId: number, type: string, value: number): void {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return;

    // Nếu đội đã bị bomb thì điểm luôn là 0, không cho update
    if (team.isBombed) {
      team.score = 0;
      return;
    }

    switch (true) {
      case type.startsWith('plus'):
        team.score += value;
        break;
      case type == 'set':
        team.score = value; // Dùng cho thẻ Lose All hoặc Swap
        break;
      case type.startsWith('multiple'):
        team.score *= value == 0 ? 2 : value;
        break;
      case type.startsWith('divide'):
        team.score = Math.floor(team.score / (value == 0 ? 2 : value));
        break;
    }
    // Đảm bảo điểm không âm
    if (team.score < 0) team.score = 0;
    console.log("ĐIỂM SAU UPDATE: ", team.score);
  }
  public swapScores(currentTeamId: Team["id"], targetTeamId: Team["id"]): void {
    const tempScore = structuredClone(this.teamMap.get(currentTeamId)?.score);
    this.updateScore(currentTeamId, 'set', this.teamMap.get(targetTeamId)?.score!);
    this.updateScore(targetTeamId, 'set', tempScore!);
  }

  public triggerBomb(teamId: number): void {
    const team = this.getTeamById(teamId);
    if (!team) return;

    team.isBombed = true;
    team.score = 0;
    console.log(`💥 ${team.name} NỔ! 💥`);

    // Nếu team hiện tại bị bom thì chuyển sang lượt hợp lệ kế tiếp
    if (this.getCurrentTeam()?.id === teamId) {
      this.advanceToNextValidTurn();
    }
    this.prepareStealQueue();
  }

  public triggerNuclear(): void {
    this.teams.forEach(team => (team.score = 0));
    console.log("☢️ NUCLEAR! Tất cả điểm RESET! ☢️");
  }

  /**
   * Danh sách tất cả các team.
   * Trả về bản sao readonly để đảm bảo không ai sửa trực tiếp.
   * 
   * @returns Mảng các team (readonly)
   */
  public getTeams(): Team[] {
    return structuredClone(this.teams);
  }
public checkTeamLeft():number{
  return this.teams.filter((t)=>t.isBombed===false).length;
}



  /**
   * Lấy đội đang giữ lượt chính (đội được chọn câu hỏi)
   * 
   * @returns Team. Nếu không tìm thấy trả về undefined
   */
  public getTeamById(id: number): Team | undefined {
    return this.teamMap.get(id);
  }

  /**
   * Mảng lượt
   * Trả về bản sao readonly để đảm bảo không ai sửa trực tiếp.
   * 
   * @returns Mảng lượt (readonly)
   */
  public getTurnOrder(): Team["id"][] {
    return structuredClone(this.turnOrders);
  }

  /**
   * Lấy thông tin đội đang đến lượt
   */
  public getCurrentTeam(): Team | undefined {
    console.log("[TeamManager]", this.turnOrders, this.currentTurnIndex)

    return this.getTeamById(this.turnOrders[this.currentTurnIndex]);
  }

  /**
   * Thông tin đội đang trong lượt cướp
   * @returns đội chơi hoặc undefined nếu không có ai trong hàng đợi
   */
  public getCurrentStealTeam(): Team | undefined {
    return this.stealQueue.length > 0 ? this.getTeamById(this.stealQueue[0]) : undefined;
  }

  /**
   * Hàng chờ cướp.
   * Trả về bản sao readonly để đảm bảo không ai sửa trực tiếp.
   * 
   * @returns Hàng chờ cướp (readonly)
   */
  public getStealQueue(): number[] {
    return structuredClone(this.stealQueue);
  }

  /**
   * Index lượt hiện tại.
   * Trả về bản sao readonly để đảm bảo không ai sửa trực tiếp.
   * 
   * @returns Index lượt hiện tại (readonly)
   */
  public getCurrentTurnIndex(): number {
    return structuredClone(this.currentTurnIndex);
  }
  /**
   * Id team đang trả lời hiện tại.
   * Trả về bản sao readonly để đảm bảo không ai sửa trực tiếp.
   * 
   * @returns Index lượt hiện tại (readonly)
   */
  public getActiveTeamId(): Team["id"] {
    return structuredClone(this.activeTeamId);
  }
  public getActiveTeam(): Team | undefined {
    return this.teams.find(t => t.id == this.activeTeamId);
  }

  /**
   * Chuyển sang lượt chính thức tiếp theo
   * Dùng khi kết thúc hoàn toàn một câu hỏi (sau khi đã xử lý xong việc cướp lượt nếu có)
   */
  public nextTurn(): void {
    this.advanceToNextValidTurn();
  }

  private advanceToNextValidTurn(): void {
    if (this.turnOrders.length === 0) return;

    let attempts = 0;
    do {
      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrders.length;
      attempts++;
    } while (this.isTeamBombed(this.turnOrders[this.currentTurnIndex]) && attempts < this.turnOrders.length);
    
    this.setup();
    this.prepareStealQueue();
  }

  /**
   * Chuyển lượt (dành cho lượt cướp)
   */
  public nextStealTurn(): boolean {
    if (this.stealQueue.length === 0) {
      return false; // Hết người cướp
    }

    const nextStealTeamId = this.stealQueue.shift(); 
    
    if (nextStealTeamId !== undefined) {
      this.activeTeamId = nextStealTeamId;
      return true;
    }
    return false;
  }

  /**
   * Kiểm tra xem đội có bị loại (bombed) không
   */
  private isTeamBombed(teamId: number): boolean {
    const team = this.getTeamById(teamId);
    return team ? team.isBombed : false;
  }

  /**
   * Khôi phục state (GameState)
   */
  public restore(data: {
    teams: Team[],
    turnOrders: Team["id"][],
    currentTurnIndex: number,
    stealQueue: Team["id"][],
    activeTeamId: Team["id"]
  }): void {
    this.teams = data.teams;
    this.turnOrders = data.turnOrders;
    this.currentTurnIndex = data.currentTurnIndex;
    this.stealQueue = data.stealQueue;
    this.activeTeamId = data.activeTeamId;
    this.teamMap = new Map(this.teams.map(t => [t.id, t]));
  }

  /**
   * Debug: In ra bộ bài vừa tạo
   */
  public logCurrentTeamSession(): void {
    console.log('Main Order:', this.turnOrders.map(id => {
      const t = this.getTeamById(id);
      return t?.isBombed ? `[${t.name} - BOMB]` : t?.name;
    }).join(' -> '));
    console.log('Current Main Index:', this.currentTurnIndex);
    console.log('active team id:', this.getActiveTeamId());
    console.log('Active Team name:', this.getActiveTeam()?.name);
    console.log('Steal Queue:', this.stealQueue.map(id => this.getTeamById(id)?.name).join(' → '));
    console.log('Scores:', this.teams.map(t => `${t.name}: ${t.score} ${t.isBombed ? '(BOMB)' : ''}`).join(' | '));
  }
}

export default TeamManager;