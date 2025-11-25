class Team{
  id: number;
  name: string;
  score: number;
  isBombed: boolean = false;
  constructor(id: number, name: string, score: number, isBombed: boolean) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.isBombed = isBombed;
  }
}
export default Team;