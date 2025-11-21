document.addEventListener('DOMContentLoaded', function() {
    const backCard = document.querySelector('.card__image--back');

    backCard.addEventListener('click', function() {
        console.log('Back card clicked');
        this.classList.add('card__image--hide');
    });

    // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // function unlockAudio() {
    //     if (audioContext.state === 'suspended') {
    //         audioContext.resume().then(() => {
    //         console.log("Audio Engine Unlocked!");
    //         });
    //     }
    //     document.removeEventListener('click', unlockAudio);
    //     document.removeEventListener('keydown', unlockAudio);
    // }
    // document.removeEventListener('click', unlockAudio);
    // document.removeEventListener('keydown', unlockAudio);

    // const sound = new Audio('./assets/sfx/rare_card.wav');

    // function playSound() {
    //     // Reset time to 0 allows you to re-play it before it finishes
    //     sound.currentTime = 0; 
    //     sound.play().catch(e => console.log("Interaction required first:", e));
    // }
    // playSound();
});