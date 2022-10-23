"use strict";

// ///////////////////////////////////////////
// ///////////////SELECTORS///////////////////
// ///////////////////////////////////////////
// --buttons
const btnPlay = document.querySelector(".play-btn");
const btnStartOver = document.querySelector(".btn-start-over");
// --inputs
const radioTimed = document.querySelector("#timed");
const selectMinutes = document.querySelector("#minutes-select");
const selectDifficulty = document.querySelector("#difficulty-select");
// --elements
const startScreen = document.querySelector(".start-section-memory");
const gameScreen = document.querySelector(".main-memory");
const gameBoard = document.querySelector(".cards-section");
const gameMessage = document.querySelector(".game-message-memory");
const player1ScoreEl = document.querySelector(".player-1-score");
const player2ScoreEl = document.querySelector(".player-2-score");
const player1ContainerEl = document.querySelector(".player-1-container");
const player2ContainerEl = document.querySelector(".player-2-container");

// ///////////////////////////////////////////
// ///////////////VARIABLES///////////////////
// ///////////////////////////////////////////

let gameMode,
  totalTime,
  totalNumCards,
  totalPairs,
  deck,
  columns,
  cardInner,
  turnCardNum,
  firstCard,
  secondCard,
  turn,
  player1Score,
  player2Score;

const fullDeck = [
  "1",
  "1",
  "2",
  "2",
  "3",
  "3",
  "4",
  "4",
  "5",
  "5",
  "6",
  "6",
  "7",
  "7",
  "8",
  "8",
  "9",
  "9",
  "10",
  "10",
  "11",
  "11",
  "12",
  "12",
  "13",
  "13",
  "14",
  "14",
  "15",
  "15",
];

// ///////////////////////////////////////////
// ///////////////FUNCTIONS///////////////////
// ///////////////////////////////////////////

const initGame = function () {
  gameBoard.classList.remove("grid-col-3", "grid-col-4", "grid-col-5");
  getSettings();
  changeScreen();
  deck = shuffleCards();
  createCards();

  turnCardNum = 1;
  turn = 1;
  player1Score = 0;
  player2Score = 0;

  player1ContainerEl.style.filter = "none";
  player2ContainerEl.style.filter = "grayscale(.8)";

  gameMessage.textContent = "Player 1's turn";
};

const getSettings = function () {
  // --get game settings
  if (radioTimed.checked) {
    gameMode = "timed";
    totalTime = Number(selectMinutes.value);
  } else gameMode = "matches";
  totalNumCards = Number(selectDifficulty.value);
  totalPairs = totalNumCards / 2;
};

const changeScreen = function () {
  startScreen.classList.toggle("hidden");
  gameScreen.classList.toggle("hidden");
};

const shuffleCards = function () {
  const playDeck = fullDeck.slice(0, totalNumCards);
  let cardsLeft = totalNumCards,
    temp,
    randomCard;

  while (cardsLeft) {
    randomCard = Math.floor(Math.random() * cardsLeft--);
    temp = playDeck[cardsLeft];
    playDeck[cardsLeft] = playDeck[randomCard];
    playDeck[randomCard] = temp;
  }

  return playDeck;
};

const createCards = function () {
  gameBoard.innerHTML = "";
  if (totalNumCards === 12) {
    columns = "grid-col-3";
  } else if (totalNumCards === 20) {
    columns = "grid-col-4";
  } else columns = "grid-col-5";

  gameBoard.classList.add(columns);

  let htmlStr = "";
  deck.forEach((card) => {
    htmlStr += `<div class="card-container">
  <div class="card-inner-container" data-num="${card}">
  <div class="card-front flex">
    <img src="img/memory/back.svg" alt="Chas Academy Logo"  class="card-img" />
  </div>
    <div class="card-back flex">
      <img src="img/memory/${card}.png" alt="Logo"  />
    </div>
  </div>
</div>`;
  });
  gameBoard.insertAdjacentHTML("afterbegin", htmlStr);
};

const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const flipCard = function (e) {
  if (e.classList.contains("card-img"))
    cardInner = e.parentElement.parentElement;
  else cardInner = e.parentElement;
  cardInner.style.transform = "rotateY(180deg)";
  if (turnCardNum === 1) {
    firstCard = cardInner;
    turnCardNum++;
    return;
  }
  checkMatch();
};

const checkMatch = function () {
  if (firstCard.dataset.num === cardInner.dataset.num) {
    gameMessage.textContent = "You found a match!!";
    if (turn === 1) {
      player1Score++;
      player1ScoreEl.textContent = player1Score;
    } else {
      player2Score++;
      player2ScoreEl.textContent = player2Score;
    }
    if (gameMode === "matches" && player1Score + player2Score === totalPairs)
      gameEnd();
    turnCardNum = 1;
    console.log(player1Score, player2Score);
  } else {
    gameMessage.textContent = "They don't match!!";
    setTimeout(() => {
      cardInner.style.transform = "none";
      firstCard.style.transform = "none";
      resetTurn();
    }, 1500);
  }
};

const resetTurn = function () {
  console.log(turn);
  turnCardNum = 1;
  changeActivePlayer();
  turn = ((turn + 2) % 2) + 1;
};

const changeActivePlayer = function () {
  if (turn === 1) {
    player1ContainerEl.style.filter = "grayscale(.8)";
    player2ContainerEl.style.filter = "none";
    gameMessage.textContent = "Player 2's turn...";
  } else {
    player2ContainerEl.style.filter = "grayscale(.8)";
    player1ContainerEl.style.filter = "none";
    gameMessage.textContent = "Player 1's turn...";
  }
};

const gameEnd = function () {
  if (player1Score > player2Score) {
    gameMessage.textContent = "Player 1 wins!!!";
  } else if (player2Score > player1Score) {
    gameMessage.textContent = "Player 2 wins!!!";
  } else gameMessage.textContent = "Its a tie!!!";
};
// ///////////////////////////////////////////
// ///////////EVENT LISTENERS/////////////////
// ///////////////////////////////////////////
btnPlay.addEventListener("click", function (e) {
  e.preventDefault();
  initGame();
});

btnStartOver.addEventListener("click", function () {
  changeScreen();
});

gameBoard.addEventListener("click", function (e) {
  if (e.target.classList.contains("cards-section")) return;
  flipCard(e.target);
});
