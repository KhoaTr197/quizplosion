import{ QUESTIONS } from "./questions.js";
const TOTAL_QUESTIONS = QUESTIONS.length;
const getTotalRareCards = (total: number): number => {
  if (total >= 50) return 3;
  if (total >= 25) return 2;
  return 1;
};
const getSurprisePercent=(total: number)=>{
    if (total >= 50) return 0.9;
  return 0.8;
}
const getPercentIncrease =(totalCardRare:number)=>{
    if(totalCardRare==3) return 0.04;
    if(totalCardRare==2) return 0.08;
    return 0.1;
}
const randomBasePercent=()=>Math.random()*(0.4-0.2)+0.2;

//==================================================
const surprisePercent=getSurprisePercent(TOTAL_QUESTIONS); // yeu to bat ngo tang ti le xuat hien len nhieu lan co the xuat hien 2 lan gan nhay
const totalRareCards = getTotalRareCards(TOTAL_QUESTIONS);
const percentIncrease =getPercentIncrease(totalRareCards);
// =================================================
    //temp cua rare card
    let remainingRareCard=totalRareCards; // chua gia tri ban dau cua totalCardRare dung de so sanh sau nay
    //khung xac xuat mac dinh
    let basePercent=randomBasePercent();
    //index trong khoang cho phep xuat hien
    const StartIndex=Math.ceil(TOTAL_QUESTIONS * 0.3);
    let Streak=0;
//==================================================
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   export const randomRareCard_Percentage = (indexCurrent: number): 'Rare' | 'Common' => {
        if(indexCurrent<StartIndex) {Streak=0;return 'Common';} // nhỏ hơn vùng cho phép.reset streak neu chua vao vung
        if(remainingRareCard<=0) {Streak=0;return 'Common';} // het luot xuat hien
            if(indexCurrent>=TOTAL_QUESTIONS*0.9) {return 'Common';}
        let randomRare=basePercent+(Streak*percentIncrease); // ti le 
            randomRare = Math.min(randomRare, 0.8); // gioi han
            console.log(basePercent);
        if(Math.random()*(2-0.4)+0.4<randomRare){ // vong quay may man
            Streak=0;
            remainingRareCard--;
            basePercent=Math.random()>surprisePercent?0.7:randomBasePercent();
            return 'Rare';
        }else{
            Streak++;
            return 'Common';
        }
        
    }
    export const  resetDeck=()=>{ // reset deck
        remainingRareCard=totalRareCards;
        Streak=0;
    }
export const randomRareCard=(totalQuestion:number)=>{
        const position:number[] =[];
        const bombableStart=Math.ceil(totalQuestion * 0.30);
        const bombableRangeSize=Math.ceil(totalQuestion * 0.70);
        while(position.length<3){
         const pos = bombableStart + Math.floor(Math.random() * bombableRangeSize);
            if(!position.includes(pos)){
                position.push(pos);
            }
        }
    return position; 

}
