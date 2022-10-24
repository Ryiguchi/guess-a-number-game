"use strict";
/////////////////////////////////////////////
/////////////////// SELECTORS ///////////////
/////////////////////////////////////////////
const startSection = document.querySelector(".start-section-rps");
const gameSection = document.querySelector(".game-section-rps");
const actionSection = document.querySelector(".action-section");
const choiceSection = document.querySelector(".choice-section");
const inputNumWins = document.querySelector(".input-rps");
const moveChoices = document.querySelector(".all-choice-img-container");
const allChoiceImgs = document.querySelectorAll(".choice-img-container");
const body = document.querySelector(".body-rps");

const btnPlay = document.querySelector(".play-btn");
const btnStartOver = document.querySelector(".btn-start-over");

const startMessage = document.querySelector(".start-message");
const scoreTitle = document.querySelector(".score-section-title");
const choiceSectionTitle = document.querySelector(".choice-title");
const actionTitle = document.querySelector(".action-title");
const tableBody = document.querySelector("tbody");
const playerTotalField = document.querySelector(".player-total");
const computerTotalField = document.querySelector(".computer-total");
const mainTitle = document.querySelector(".h1-rps");

const playerChoiceImg = document.querySelector(".player-action-img");
const computerChoiceImg = document.querySelector(".computer-action-img");

/////////////////////////////////////////////
/////////////////// VARIABLES ///////////////
/////////////////////////////////////////////

let numWins,
  playing,
  playerChoice,
  computerChoice,
  playerWin,
  round,
  playerTotal,
  computerTotal,
  choiceDisabled = false;

/////////////////////////////////////////////
/////////////////// FUNCTIONS ///////////////
/////////////////////////////////////////////

// SETUP/////////////////////////////////////

// INITIALIZES GAME //
const initGameState = function () {
  // --check if its a valid number
  if (numWins < 1 || numWins > 10) {
    startMessage.classList.remove("hidden");
    startMessage.textContent = "You entered an invalid number! Try again!";
    return;
  }

  //-- set number of wins to win game
  numWins = Number(inputNumWins.value);

  tableBody.innerHTML = "";
  choiceSectionTitle.textContent = "Choose your move...";
  playerChoiceImg.src = `img/1.png`;
  computerChoiceImg.src = `img/1.png`;
  gameSection.classList.remove("end-game");
  round = 1;
  playerTotal = 0;
  computerTotal = 0;
  playing = true;
  // --displays Game screen and number of wins
  scoreTitle.textContent = `First to ${numWins} wins!`;
  toggleScreen();
};

const toggleScreen = function () {
  startSection.classList.toggle("hidden");
  gameSection.classList.toggle("hidden");
};

// GENERATES A RANDOM NUMBER //
const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// GAMEPLAY /////////////////////////////

// GAME ANIMATIONS //
const play = function () {
  let time = 300;
  let op = 0;
  while (time <= 1500) {
    toggleActionSection(time, op);
    time += 300;
    op = (op + 1) % 2;
  }
  roundResult();
};

const toggleActionSection = function (timeout, op) {
  setTimeout(() => {
    actionSection.style.opacity = op;
  }, timeout);
};

// SHOWS CHOICES AND RESULT OF ROUND //
const roundResult = function () {
  setTimeout(() => {
    // --Set choice imgs
    playerChoiceImg.src = `img/${playerChoice}.png`;
    computerChoiceImg.src = `img/${computerChoice}.png`;
    actionSection.style.opacity = 1;

    // --remove green background
    allChoiceImgs.forEach(
      (el) => (el.style.backgroundColor = "var(--rps-secondary-shade-2)")
    );

    // Return if tie
    if (playerChoice === computerChoice) {
      choiceSectionTitle.textContent = "Its a tie!";
      playing = true;
      return;
    }
    console.log(numWins);
    calcWinner();
    displayTable();
    if (endGame()) return;

    playing = true;
  }, 1800);
};

// CHECK WINNER OF EACH ROUND //
const calcWinner = function () {
  if (
    (playerChoice === 1 && computerChoice === 3) ||
    (playerChoice === 2 && computerChoice === 1) ||
    (playerChoice === 3 && computerChoice === 2)
  ) {
    playerWin = true;
    choiceSectionTitle.textContent = "You Won!";
    playerTotal++;
  } else {
    playerWin = false;
    choiceSectionTitle.textContent = "You Lost!";
    computerTotal++;
  }
};

// DISPLAYS ROUND RESULTS ON TABLE
const displayTable = function () {
  // --builds html string
  const tableStr = `
<tr>
<td>${round}</td>
<td>${playerWin ? "Win" : "Lose"}</td>
<td>${playerWin ? "Lose" : "Win"}</td>
</tr>`;

  tableBody.insertAdjacentHTML("beforeend", tableStr);

  // --adds to total
  playerTotalField.textContent = playerTotal;
  computerTotalField.textContent = computerTotal;
  round++;
};

// END OF GAME FUNCTION //
const endGame = function () {
  if (playerTotal === numWins) {
    choiceSectionTitle.textContent = `Game over: You won!`;
    gameSection.classList.add("end-game");
    return true;
  } else if (computerTotal === numWins) {
    choiceSectionTitle.textContent = `Game over: You lost!`;
    gameSection.classList.add("end-game");
    return true;
  }
};

/////////////////////////////////////////////
/////////////// EVENT LISTENERS /////////////
/////////////////////////////////////////////

// STARTS A NEW GAME //
btnPlay.addEventListener("click", initGameState);

// GOES BACK TO THE START MENU //
btnStartOver.addEventListener("click", toggleScreen);

// MAKES A CHOICE AND EXECUTES 1 ROUND //
moveChoices.addEventListener("click", function (e) {
  // --return if currently playing
  if (!playing) return;
  playing = false;

  // --set both players img to 'rock'
  playerChoiceImg.src = `img/1.png`;
  computerChoiceImg.src = `img/1.png`;

  // --returns if click on parent element
  if (e.target.classList.contains("all-choice-img-container")) return;

  // --turns img background green
  if (e.target.classList.contains("choice-img"))
    e.target.parentElement.style.backgroundColor = "var(--rps-primary-tint-1)";
  else e.target.style.backgroundColor = "var(--rps-primary-tint-1)";

  // --set player's choice and get computer's choice
  playerChoice = Number(e.target.id);
  computerChoice = getRandomNum(1, 3);

  // --display message
  choiceSectionTitle.textContent = "Here we go ...";

  // --main function
  play();
});
