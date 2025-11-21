document.addEventListener('DOMContentLoaded', function() {

     const cardsData = [
            { 
                src: "./assets/card_back.png", 
                alt: "Card Back", 
                isBack: true
            },
            { src: "./assets/card_bomb.png", alt: "Card Change", isSpecial: true },
            { src: "./assets/card_plus_1.png", alt: "Card Plus 1" },
            { src: "./assets/card_plus_2.png", alt: "Card Plus 2" },
            { src: "./assets/card_plus_3.png", alt: "Card Plus 3" },
            { src: "./assets/card_plus_4.png", alt: "Card Plus 4" },
            { src: "./assets/card_plus_5.png", alt: "Card Plus 5" }
        ];
    const slideSound = new Audio('./assets/sfx/card_slide.wav');
    const bombSound = new Audio('./assets/sfx/exploding_kittens.wav');

    function playSound(sound) {
        // Reset time to 0 allows you to re-play it before it finishes
        sound.currentTime = 0; 
        sound.play().catch(e => console.log("Interaction required first:", e));
    }
    
    function renderCards() {
        const listSlideCards = document.querySelector('#list-slide-cards');
        if (!listSlideCards) return;
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardsData.forEach(card => {
            const img = document.createElement('img');
            
            img.src = card.src;
            img.alt = card.alt;
            img.classList.add('card__image');

            if (card.isBack) {
                img.classList.add('card__image--back');
            }
            if (!card.isSpecial){
                img.addEventListener('click', function() {
                    console.log('Question card clicked:', this);
                    this.classList.add('card__image--slided');
                    playSound(slideSound);
                });
            } else {
                img.addEventListener('click', function() {
                    console.log('Special card hovered:', this);
                    playSound(bombSound);
                });
            }

            cardContainer.appendChild(img);
        });
        listSlideCards.innerHTML = ''; 
        listSlideCards.appendChild(cardContainer);
    }
    renderCards();
});