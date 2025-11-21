document.addEventListener('DOMContentLoaded', function() {
    const questionCards = document.querySelectorAll('.question-card');

    questionCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Question card clicked:', this);
            this.classList.add('question-card--hidden');
        });
    });
});