document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#memorama1');
    const message = document.querySelector('#message');
    const puntos = document.querySelector('.puntos span');

    const images = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
        'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    
    let selectedImages = [];
    while (selectedImages.length < 5) {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        if (!selectedImages.includes(randomImage)) {
            selectedImages.push(randomImage);
        }
    }

    let cards = [];
    selectedImages.forEach(image => {
        cards.push({ img: `css/img/${image}-.png`, index: image });
        cards.push({ img: `css/img/${image}.jpg`, index: image });
    });

    cards = cards.sort(() => 0.5 - Math.random());

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('cell');
        cardElement.innerHTML = `
            <div class="front" data-index="${card.index}"><img src="${card.img}" alt=""></div>
            <div class="back"></div>
        `;
        container.appendChild(cardElement);
    });

    const allCards = document.querySelectorAll('.cell');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.querySelector('.front').dataset.index === secondCard.querySelector('.front').dataset.index;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        firstCard.querySelector('.front').classList.add('match');
        secondCard.querySelector('.front').classList.add('match');

        puntos.innerText = parseInt(puntos.innerText) + 1;

        if (document.querySelectorAll('.match').length === 10) {
            setTimeout(() => {
                message.classList.remove('hidden');
                startFireworks();
            }, 500);
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    allCards.forEach(card => card.addEventListener('click', flipCard));

    // Reveal cards for 3 seconds
    function revealCards() {
        allCards.forEach(card => card.classList.add('flip'));

        setTimeout(() => {
            allCards.forEach(card => card.classList.remove('flip'));
        }, 3000);
    }

    revealCards();

    // Start fireworks
    function startFireworks() {
        const container = document.querySelector('body');
        const fireworks = new Fireworks(container, {
            maxRockets: 5,            // max # of rockets to spawn
            rocketSpawnInterval: 150, // millisends to check if new rockets should spawn
            numParticles: 100,        // number of particles to spawn when rocket explodes (+0-10)
            explosionMinHeight: 0.2,  // percentage. min height at which rockets can explode
            explosionMaxHeight: 0.9,  // percentage. max height before a particle is exploded
            explosionChance: 0.08     // chance in each tick the rocket will explode
        });

        fireworks.start();

        setTimeout(() => {
            fireworks.stop();
        }, 5000);
    }
});
