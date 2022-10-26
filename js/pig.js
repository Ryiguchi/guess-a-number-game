"use strict";

// ///////////////////////////////////////////
// ///////////// SELECTORS ///////////////////
// ///////////////////////////////////////////

//  --buttons
const playBtn = document.querySelector(".play-btn");
const startOverBtn = document.querySelector(".start-over-btn-pig");
const rollBtn = document.querySelector(".roll-btn");
const holdBtn = document.querySelector(".hold-btn");

// --inputs
const pointsInput = document.querySelector("#points-pig");
const sixesCheckbox = document.querySelector("#sixes-pig");

//  --elements
const startSectionEl = document.querySelector(".start-section-pig");
const gameSectionEl = document.querySelector(".main-pig");
const startMessageEl = document.querySelector(".start-message-pig");
const player1ScoreEl = document.querySelector(".player-1-score-pig");
const player1ContainerEl = document.querySelector(".player-1-container-pig");
const player2ContainerEl = document.querySelector(".player-2-container-pig");
const player2ScoreEl = document.querySelector(".player-2-score-pig");
const playerContainersAllEl = document.querySelectorAll(
  ".player-container-pig"
);
const currentScoreEl = document.querySelectorAll(".current-score");
const imgDice = document.querySelector(".dice-img");
// ///////////////////////////////////////////
// ///////////////VARIABLES///////////////////
// ///////////////////////////////////////////
let gameMode,
  pointsToWin,
  playing,
  lastRoll,
  currentScore,
  currentPlayer,
  player1Score,
  player2Score;

// ///////////////////////////////////////////
// ///////////////FUNCTIONS///////////////////
// ///////////////////////////////////////////

// //////////////// SET-UP ///////////////////

const startGame = function () {
  initGame();
  changeScreen();
  getSettings();
};

const initGame = function () {
  player1ScoreEl.textContent = player2ScoreEl.textContent = 0;
  player1Score = player2Score = 0;
  currentScoreEl.forEach((el) => (el.textContent = 0));
  playerContainersAllEl.forEach((el) => el.classList.remove("winner-pig"));
  currentScore = 0;
  imgDice.src = "img/pig/dice-1.png";
  lastRoll = 0;
  currentPlayer = 1;
  playing = true;
};

const changeScreen = function () {
  startSectionEl.classList.toggle("hidden");
  gameSectionEl.classList.toggle("hidden");
};

const getSettings = function () {
  gameMode = sixesCheckbox.checked ? "sixes" : "normal";
  pointsToWin = pointsInput.value;
};

const invalidNum = function () {
  return pointsInput.value < 50 || pointsInput.value > 1000 ? true : false;
};

// ////////////// GAME ACTION ////////////////
const rollDice = function () {
  const currentRoll = getRandomNum(1, 6);
  imgDice.src = `img/pig/dice-${currentRoll}.png`;
  console.log(lastRoll);
  if (currentRoll === 6 && currentRoll === lastRoll && gameMode === "sixes") {
    doubleSixes();
    changePlayers();
    return;
  }

  if (currentRoll === 1) {
    changePlayers();
    return;
  }

  currentScore += currentRoll;
  currentScoreEl.forEach((el) => (el.textContent = currentScore));
  lastRoll = currentRoll;
  playing = true;
};

const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const doubleSixes = function () {
  currentPlayer === 1
    ? (player1ScoreEl.textContent = player1Score = 0)
    : (player2ScoreEl.textContent = player2Score = 0);
};

const hold = function () {
  if (currentPlayer === 1) {
    player1Score += currentScore;
    player1ScoreEl.textContent = player1Score;
    if (player1Score >= pointsToWin) {
      winner(1);
      return;
    }
  } else {
    player2Score += currentScore;
    player2ScoreEl.textContent = player2Score;
    if (player2Score >= pointsToWin) {
      winner(2);
      return;
    }
  }

  changePlayers();
};

const changePlayers = function () {
  player1ContainerEl.classList.toggle("active-player-pig");
  player2ContainerEl.classList.toggle("active-player-pig");
  currentPlayer = ((currentPlayer + 2) % 2) + 1;
  currentScore = lastRoll = 0;
  currentScoreEl.forEach((el) => (el.textContent = 0));
  lastRoll = 0;
  playing = true;
};

const winner = function (player) {
  player === 1
    ? player1ContainerEl.classList.add("winner-pig")
    : player2ContainerEl.classList.add("winner-pig");
  currentScoreEl.forEach((el) => (el.textContent = "WINNER!"));
};
// ///////////////////////////////////////////
// ////////// EVENT LISTENERS ////////////////
// ///////////////////////////////////////////

playBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (invalidNum()) {
    startMessageEl.classList.remove("hidden");
    return;
  }

  startGame();
});

startOverBtn.addEventListener("click", function (e) {
  e.preventDefault();

  changeScreen();
});

rollBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (!playing) return;
  playing = false;
  rollDice();
});

holdBtn.addEventListener("click", function (e) {
  if (!playing) return;
  playing = false;
  hold();
});
