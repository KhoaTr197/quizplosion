import Team from './team';

class TeamManager {
  private static _instance: TeamManager;

  private teams: Team[] = []; //mảng danh sách đội chơi
  private teamsOrder: number[] = []; //mảng chứa id đội chơi theo thứ tự được random

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
    this.teams = [];
    this.teamsOrder = [];
  }
  public randomTeamsOrder(): void {
    this.teamsOrder = this.teams.map(team => team.id);
    // Fisher-Yates
    for (let i = this.teamsOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.teamsOrder[i], this.teamsOrder[j]] = [this.teamsOrder[j], this.teamsOrder[i]];
    }
  }
  public getTeams(): Team[] {
    return this.teams;
  }
  public setTeams(teams: Team[]): void {
    this.teams = teams;
  }
  public getTeamsOrder(): number[] {
    return this.teamsOrder;
  }
  public updateScore(teamId: number, type: string, points: number): void {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      switch (type) {
        case 'add':
          team.score += points;
          break;
        case 'subtract':
          team.score -= points;
          break;
        case 'multiple':
          team.score *= points;
          break;
        case 'divide':
          team.score = Math.floor(team.score / points);
          break;
        default:
          console.warn(`Unknown score update type: ${type}`);
      }
    }
  }
}

export default TeamManager;