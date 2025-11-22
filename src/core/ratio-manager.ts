// import { randomRareCard } from "./random";
class RatioManager {
  public position: number[] = [];
  public statePoint: any[] = [
    {
      point1: 0.33,
      point2: 0.4,
      point3: 0.25,
      point4: 0.02,
      point5: 0.0,
    },
    // Level 6
    {
      point1: 0.25,
      point2: 0.35,
      point3: 0.3,
      point4: 0.1,
      point5: 0.0,
    },
    // Level 7
    {
      point1: 0.19,
      point2: 0.3,
      point3: 0.33,
      point4: 0.15,
      point5: 0.03,
    },
    // Level 8
    {
      point1: 0.15,
      point2: 0.25,
      point3: 0.3,
      point4: 0.25,
      point5: 0.05,
    },
    // Level 9
    {
      point1: 0.1,
      point2: 0.15,
      point3: 0.25,
      point4: 0.3,
      point5: 0.2,
    },
  ];

  constructor() {
    // this.position = randomRareCard(50);
  }

  randomPoint = () => {
    const cardList: any[] = []; // gan theo kieu cardCommon
    const level = 4; // gan cung tam thoi
    const numberCard = 9; // gan tam tong so la bai
    const ratios = this.statePoint[level];
    const pointOrder: (keyof typeof ratios)[] = [
      "point1",
      "point2",
      "point3",
      "point4",
      "point5",
    ];

    console.log(pointOrder)
    console.log(ratios)
    for (let i = 0; i < numberCard; i++) {
      let checkPoint = false;
      const randPoint = Math.random(); //gia tri lua chon
      let accumulated = 0; // gia tri tich luy

      for (const point of pointOrder) {
        accumulated += ratios[point];// cong gia tri xac xuat hien tai
        if (randPoint < accumulated) { // neu lon hon gia tri lua chon thi them gia tri hien tai vao ds card
          cardList.push(point);
          checkPoint = true;
          break;
        }
      }
      if (!checkPoint) {
        cardList.push(pointOrder[pointOrder.length - 1]); // chon phan tu cuoi cung truong hop hiem !
      }
    }
    console.log(cardList);
  };
}
const gameTest = new RatioManager();
gameTest.randomPoint();
