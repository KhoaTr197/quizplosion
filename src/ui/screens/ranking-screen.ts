import { Team } from "../../core/team-manager.js";
import TeamManager from "../../core/team-manager.js";
class RankingScreen{
    public tableBody=document.querySelector("#team-table-body") as HTMLElement;
     constructor() {

        
     }
      private teams=TeamManager.instance.getTeams().sort((a,b)=>a.score - b.score)
     public render(){
        const tableBody=document.querySelector("#team-table-body") as HTMLElement;
        tableBody.innerHTML="";
        TeamManager.instance.getTeams().forEach(team=>{
            const row=document.createElement('tr');
            row.innerHTML=`<td>${team.name}</td><td>${team.score}</td>`;
            tableBody.appendChild(row);
        });


     }
}export default RankingScreen;
