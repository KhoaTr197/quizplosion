document.addEventListener('DOMContentLoaded', function() {

     const cardsData = [
            { 
                src: "./assets/card_back.png", 
                alt: "Card Back", 
                isBack: true
            },
            { src: "./assets/card_bomb.png", alt: "Card Change", isSpecial: true },
            { src: "./assets/card_plus_1.png", alt: "Card Change" },
            { src: "./assets/card_plus_2.png", alt: "Card Change" },
            { src: "./assets/card_plus_3.png", alt: "Card Change" },
            { src: "./assets/card_plus_4.png", alt: "Card Change" },
            { src: "./assets/card_plus_5.png", alt: "Card Change" }
        ];
    
    function renderCards() {
        const slideContainer = document.querySelector('.card-slide-container');
        if (!slideContainer) return;
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
                });
            }

            cardContainer.appendChild(img);
        });
        slideContainer.innerHTML = ''; 
        slideContainer.appendChild(cardContainer);
    }
    renderCards();
});