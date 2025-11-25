export interface Team {
  /** ID duy nhất của đội (tăng tự động từ 1) */
  id: number;
  /** Tên đội do người chơi nhập */
  name: string;
  /** Điểm số hiện tại của đội */
  score: number;
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

  /** Thứ tự lượt chơi chính (được random lúc bắt đầu) – chứa các team ID */
  private turnOrder: Team["id"][] = [];

  /** Chỉ số hiện tại trong mảng turnOrder (đội đang hoặc sắp đến lượt) */
  private currentTurnIndex: number = 0;

  /** Hàng đợi các đội có thể cướp lượt (FIFO), theo thứ tự top-down, bỏ qua đội chính */
  private stealQueue: number[] = [];

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
    this.teams = [];
    this.turnOrder = [];
    this.teamMap.clear();
    this.currentTurnIndex = 0;
    this.stealQueue = [];
  }

  /**
   * Thiết lập danh sách đội chơi và khởi tạo thứ tự lượt
   * 
   * @param teams - Mảng thông tin đội (chỉ cần name)
   * @example
   * setupTeams([{ name: "T1" }, { name: "GENG" }])
   */
  public setUpTeams(teams: Omit<Team, "id" | "score">[]): void {
    this.reset()

    this.teams = teams.map((t, i) => {
      const team: Team = {
        id: i + 1,
        name: t.name.trim() || `Team ${i + 1}`,
        score: 0,
      };

      /** Thêm vào Map ngay lập tức */
      this.teamMap.set(team.id, team);
      return team;
    });

    this.turnOrder = this.teams.map(team => team.id);
    this.currentTurnIndex = 0;
    this.prepareStealQueue();
  }

  /**
   *  Random thứ tự team bằng thuật toán Fisher-Yates
   */
  public shuffleOrders(): void {
    for (let i = this.turnOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.turnOrder[i], this.turnOrder[j]] = [this.turnOrder[j], this.turnOrder[i]];
    }
  }

  /**
   * Chuẩn bị hàng đợi cướp lượt (theo thứ tự top-down, bỏ qua đội chính)
   */
  public prepareStealQueue(): void {
    this.stealQueue = [];
    const len = this.turnOrder.length;
    if (len <= 1) return;

    for (let i = 1; i < len; i++) {
      const idx = (this.currentTurnIndex + i) % len;
      this.stealQueue.push(this.turnOrder[idx]);
    }
  }

  /**
   * Cập nhật các thuộc tính cho vòng trả lời câu hỏi mới
   */
  public newRound(): void {
    this.stealQueue = this.turnOrder.filter((_, idx) => idx !== this.currentTurnIndex);
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
   * Danh sách tất cả các team.
   * Trả về bản sao readonly để đảm bảo không ai sửa trực tiếp.
   * 
   * @returns Mảng các team (readonly)
   */
  public getTeams(): Readonly<Team[]> {
    return structuredClone(this.teams);
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
    return structuredClone(this.turnOrder);
  }

  /**
   * Lấy thông tin đội đang đến lượt
   */
  public getCurrentTeam(): Team | undefined {
    return this.getTeamById(this.turnOrder[this.currentTurnIndex]);
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
   * Chuyển sang lượt chính thức tiếp theo
   * Dùng khi kết thúc hoàn toàn một câu hỏi (sau khi đã xử lý xong việc cướp lượt nếu có)
   */
  public nextTurn(): void {
    if (this.turnOrder.length === 0) return;

    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
    this.prepareStealQueue();
  }

  /**
   * Chuyển lượt (dành cho lượt cướp)
   */
  public nextStealTurn(): boolean {
    if (this.stealQueue.length === 0) return false; // Hết người cướp

    const nextTeamId = this.stealQueue.shift()!;
    // Tìm index của team vừa cướp để set currentTurnIndex
    const idx = this.turnOrder.indexOf(nextTeamId);
    if (idx !== -1) this.currentTurnIndex = idx;

    return true;
  }
}

export default TeamManager;