import DeckManager from './deck-manager.js';
// const game =new GameManager();
const deck = new DeckManager();

console.log(`Bộ bài mới được tạo có ${deck.size} thẻ bài!`);

// Giả lập rút thẻ
while (!deck.isEmpty) {
  const card = deck.draw();

  if (!card) {
    console.log("Không còn lá nào để rút");
    break;
  }

  if (deck.type == "Common" && card.isBomb) {
    console.log(`BOOM!!! ${card.name} — Bạn bị nổ banh chành!`);
    break;
  } else {
    console.log(`An toàn! Bạn rút: ${card.name}`);
  }
}