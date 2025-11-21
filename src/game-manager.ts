import { randomRareCard } from "./random";
class GameManager  {
    public position:number[]=[];
 public statePoint: any[] = [
    {
        point1: 0.33,
        point2: 0.40,
        point3: 0.25,
        point4: 0.02,
        point5: 0.00
    },
    // Level 6
    {
        point1: 0.25,
        point2: 0.35,
        point3: 0.30,
        point4: 0.10,
        point5: 0.00
    },
    // Level 7
    {
        point1: 0.19,
        point2: 0.30,
        point3: 0.33,
        point4: 0.15,
        point5: 0.03
    },
    // Level 8
    {
        point1: 0.15,
        point2: 0.25,
        point3: 0.30,
        point4: 0.25,
        point5: 0.05
    },
    // Level 9
    {
        point1: 0.10,
        point2: 0.15,
        point3: 0.25,
        point4: 0.30,
        point5: 0.20
    }
];


    constructor() {
    this.position=randomRareCard(50);
    
    }
    const randomPoint=()=>{
        const level=6;
        const numberCards=9;
        const bang_ty_le = Object.entries(this.statePoint[0]);
        for(let i =0;i<9;i++){
            console(Math.random()<)
        }
    }
}
