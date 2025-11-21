import DeckManager from './deck-manager.js';
// const game =new GameManager();
const deck = new DeckManager();
deck.logCurrentDeck();

console.log(`Bộ bài mới được tạo có ${deck.size} thẻ bài!`);