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