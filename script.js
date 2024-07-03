let cardsArray = [];
for (let i = 65; i <= 90; i++) { // Lettres A-Z
    cardsArray.push({ name: String.fromCharCode(i), id: `${String.fromCharCode(i)}1` });
    cardsArray.push({ name: String.fromCharCode(i), id: `${String.fromCharCode(i)}2` });
}
for (let i = 0; i <= 9; i++) { // Chiffres 0-9
    cardsArray.push({ name: i.toString(), id: `${i}1` });
    cardsArray.push({ name: i.toString(), id: `${i}2` });
}

const gameBoard = document.getElementById('gameBoard');
const timerElement = document.getElementById('time');
const scoreElement = document.getElementById('points');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let points = 0;
let timeRemaining = 120;
let timer;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function createBoard() {
    gameBoard.innerHTML = '';
    shuffle(cardsArray);
    cardsArray.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;
        cardElement.dataset.id = card.id;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.name;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : markCardsIncorrect();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    points += 5;
    scoreElement.textContent = points;
    resetBoard();

    if (document.querySelectorAll('.card.matched').length === cardsArray.length) {
        clearInterval(timer);
        setTimeout(() => {
            scoreElement.textContent = `Score final : ${points}`;
            showStartButton();
        }, 500);
    }
}

function markCardsIncorrect() {
    firstCard.classList.add('incorrect');
    secondCard.classList.add('incorrect');
    setTimeout(() => {
        firstCard.classList.remove('flipped', 'incorrect');
        secondCard.classList.remove('flipped', 'incorrect');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startGame() {
    points = 0;
    scoreElement.textContent = points;
    timeRemaining = 120;
    timerElement.textContent = timeRemaining;
    createBoard();
    clearInterval(timer);
    lockBoard = false; // Assure que le tableau n'est pas verrouillé au départ
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        if (timeRemaining === 0) {
            clearInterval(timer);
            scoreElement.textContent = `Temps écoulé ! Score final : ${points}`;
            lockBoard = true; // Verrouille le tableau lorsque le temps est écoulé
            showStartButton();
        }
    }, 1000);
    hideStartButton();
}

function showStartButton() {
    startButton.style.display = 'block';
    restartButton.style.display = 'none';
}

function hideStartButton() {
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
}

showStartButton();
