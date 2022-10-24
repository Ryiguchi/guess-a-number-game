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
const startMessageEl = document.querySelector(".start-message-memory");
const startMessageTextEl = document.querySelector(".start-message-memory-text");
const gameScreen = document.querySelector(".main-memory");
const gameBoard = document.querySelector(".cards-section");
const gameMessage = document.querySelector(".game-message-memory");
const player1ScoreEl = document.querySelector(".player-1-score");
const player2ScoreEl = document.querySelector(".player-2-score");
const player1ContainerEl = document.querySelector(".player-1-container");
const player2ContainerEl = document.querySelector(".player-2-container");
const playerContainersAllEl = document.querySelectorAll(".player-container");
const clock = document.querySelector(".clock-memory");
const chevronElAll = document.querySelectorAll(".chevron-memory");

// ///////////////////////////////////////////
// ///////////////VARIABLES///////////////////
// ///////////////////////////////////////////

let matchedCards = [],
  numCards,
  turnCardNum,
  selectedCard,
  firstCard,
  secondCard,
  turn,
  player1Score,
  player2Score,
  playing,
  timer;

// ///////////////////////////////////////////
// ///////////////FUNCTIONS///////////////////
// ///////////////////////////////////////////

// //////////////// SET-UP ///////////////////

// CHECKS IF USER SELECTED MINUTES AND DIFFICULTY ///////
const checkForValidSettings = function () {
  if (
    selectDifficulty.value === "Difficulty" ||
    (selectMinutes.value === "Minutes" && radioTimed.checked)
  ) {
    startMessageEl.classList.remove("hidden");
    startMessageTextEl.textContent =
      "Please make sure you have selected all necessary options!";
    return false;
  }
  return true;
};

// INITIALIZES THE GAME ////////////////////
const initGame = function () {
  // --if user chooses timed game, start timer
  checkForTimedGame();
  // --change to the game screen
  changeScreen();
  // --build the deck and shuffle it
  const shuffledDeck = buildDeck();
  // --build the HTML and display cards
  dealCards(shuffledDeck);
  // --reset game values
  resetGame();
};

const resetGame = function () {
  player1Score = 0;
  player2Score = 0;
  matchedCards = [];
  turn = 2;
  player1ScoreEl.textContent = 0;
  player2ScoreEl.textContent = 0;
  playerContainersAllEl.forEach((el) => el.classList.remove("winner-memory"));
  gameMessage.classList.remove("winner-memory");
  // --set player 1
  changeActivePlayer();
};

// IF USER CHOOSES TIMED GAME, THEN START TIMER ///////
const checkForTimedGame = function () {
  // --return if not a timed game
  if (!radioTimed.checked) return;

  let time = Number(selectMinutes.value);
  // --display time every second
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    clock.textContent = `${min}:${sec}`;
    // --check for time up
    if (time === 0) {
      clearInterval(timer);
      // --decide and display winner
      gameEnd();
    }

    time--;
  };
  // --display initial time
  tick();
  // --timer
  timer = setInterval(tick, 1000);
};

// TOGGLES BETWEEN START AND GAME SCREEN ////////////
const changeScreen = function () {
  startScreen.classList.toggle("hidden");
  gameScreen.classList.toggle("hidden");
};

// BUILDS A DECK BASED ON THE NUMBER OF CARDS (DIFFICULTY) /////
const buildDeck = function () {
  numCards = Number(selectDifficulty.value);
  const unshuffledDeck = [];
  // --assigns 2 of each number (pairs)
  for (let i = 1; i <= numCards / 2; i++) {
    unshuffledDeck.push(i);
    unshuffledDeck.push(i);
  }
  // --shuffles deck
  const shuffledDeck = shuffleCards(unshuffledDeck);
  return shuffledDeck;
};

// SHUFFLES DECK /////////////////////////////
const shuffleCards = function (deck) {
  let cardsLeft = deck.length,
    temp,
    randomCard;

  while (cardsLeft) {
    // --choose random card from the remaining cards
    randomCard = Math.floor(Math.random() * cardsLeft--);
    // --switch random card with last card
    temp = deck[cardsLeft];
    deck[cardsLeft] = deck[randomCard];
    deck[randomCard] = temp;
  }

  return deck;
};

// DISPLAYS CARDS /////////////////////////////////
const dealCards = function (deck) {
  // --removes previous game values
  gameBoard.classList.remove("grid-col-3", "grid-col-4", "grid-col-5");
  gameBoard.innerHTML = "";

  let columns;
  // chooses class based on number of cards (difficulty)
  if (deck.length === 12) {
    columns = "grid-col-3";
  } else if (deck.length === 20) {
    columns = "grid-col-4";
  } else columns = "grid-col-5";

  gameBoard.classList.add(columns);

  // --builds HTML
  let htmlStr = "";
  deck.forEach((card, i) => {
    htmlStr += `<div class="card-container">
    <div class="card-inner-container" data-num="${card}" data-card="${i}">
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

///////////// PLAYING //////////////////

// FLIPS THE CHOSEN CARD /////////////
const chooseCard = function (e) {
  flipCard(e);
  if (turnCardNum === 1) {
    firstCard = selectedCard;
    turnCardNum++;
    playing = true;
    return;
  }
  firstCard.dataset.num === selectedCard.dataset.num ? match() : noMatch();
};

const flipCard = function (e) {
  // --select correct element to flip
  selectedCard = e.classList.contains("card-img")
    ? e.parentElement.parentElement
    : e.parentElement;

  selectedCard.style.transform = "rotateY(180deg)";
};

const match = function () {
  gameMessage.textContent = "You found a match!!";
  if (turn === 1) {
    player1Score++;
    player1ScoreEl.textContent = player1Score;
  } else {
    player2Score++;
    player2ScoreEl.textContent = player2Score;
  }
  matchedCards.push(firstCard.dataset.num);
  if (player1Score + player2Score === numCards / 2) gameEnd();
  turnCardNum = 1;
  playing = true;
};

const noMatch = function () {
  gameMessage.textContent = "They don't match!!";
  setTimeout(() => {
    selectedCard.style.transform = "none";
    firstCard.style.transform = "none";
    setTimeout(() => {
      resetTurn();
    }, 500);
  }, 1500);
};

const resetTurn = function () {
  changeActivePlayer();
};

const changeActivePlayer = function () {
  turnCardNum = 1;
  playing = true;
  playerContainersAllEl.forEach((el) =>
    el.classList.toggle("active-player-memory")
  );

  turn === 1
    ? (gameMessage.textContent = "Player 2's turn...")
    : (gameMessage.textContent = "Player 1's turn...");

  turn = ((turn + 2) % 2) + 1;
};

const gameEnd = function () {
  playing = false;
  gameMessage.classList.add("winner-memory");
  if (player1Score > player2Score) {
    gameMessage.textContent = "Player 1 wins!!!";
    player1ContainerEl.classList.add("winner");
  } else if (player2Score > player1Score) {
    gameMessage.textContent = "Player 2 wins!!!";
    player2ContainerEl.classList.add("winner-memory");
  } else gameMessage.textContent = "Its a tie!!!";
};
// ///////////////////////////////////////////
// ///////////EVENT LISTENERS/////////////////
// ///////////////////////////////////////////
btnPlay.addEventListener("click", function () {
  if (!checkForValidSettings()) return;
  initGame();
});

btnStartOver.addEventListener("click", function () {
  if (timer) clearInterval(timer);
  changeScreen();
});

gameBoard.addEventListener("click", function (e) {
  console.log(e.target);
  if (
    matchedCards.includes(e.target.dataset.num) ||
    !playing ||
    e.target.classList.contains("cards-section") ||
    (firstCard && e.target.dataset.card === firstCard.dataset.card)
  )
    return;
  playing = false;
  chooseCard(e.target);
});
