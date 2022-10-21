"use strict";
/////////////////////////////////////////////
/////////////////// SELECTORS ///////////////
/////////////////////////////////////////////
const startSection = document.querySelector(".start-section-rps");
const gameSection = document.querySelector(".game-section");
const actionSection = document.querySelector(".action-section");
const choiceSection = document.querySelector(".choice-section");
const inputNumWins = document.querySelector(".input-rps");
const moveChoices = document.querySelector(".all-choice-img-container");
const allChoiceImgs = document.querySelectorAll(".choice-img-container");
const body = document.querySelector(".body__rps");

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

// SHOWS THE START MENU //
const initStartState = function () {
  startSection.classList.remove("hidden");
  gameSection.classList.add("hidden");
  choiceSection.classList.remove("hidden");

  body.style.backgroundColor = "var(--rps-secondary-color)";
  mainTitle.style.color = "var(--rps-primary-shade-2)";
  tableBody.innerHTML = "";
};

// INITIALIZES GAME //
const initGameState = function () {
  round = 1;
  playerTotal = 0;
  computerTotal = 0;

  //-- set number of wins to win game
  numWins = Number(inputNumWins.value);

  // --check if its a valid number
  console.log(numWins);
  if (isNaN(numWins) || numWins < 1 || numWins > 10) {
    startMessage.classList.remove("hidden");
    startMessage.textContent = "You entered an invalid number! Try again!";
    return;
  }

  // --displays Game screen and number of wins
  scoreTitle.textContent = `First to ${numWins} wins!`;
  startSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
};

// GENERATES A RANDOM NUMBER //
const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// GAMEPLAY /////////////////////////////

// GAME ANIMATIONS //
const play = function () {
  removeActionSection(300);
  showActionSection(600, "Rock...");
  removeActionSection(900);
  showActionSection(1200, "Papper...");
  removeActionSection(1500);
  roundResult();
};

const removeActionSection = function (timeout) {
  setTimeout(() => {
    actionSection.style.opacity = 0;
  }, timeout);
};

const showActionSection = function (timeout, str) {
  setTimeout(() => {
    actionSection.style.opacity = 1;
    actionTitle.textContent = str;
  }, timeout);
};

// SHOWS CHOICES AND RESULT OF ROUND //
const roundResult = function () {
  setTimeout(() => {
    // --Set choice imgs
    playerChoiceImg.src = `img/${playerChoice}.png`;
    computerChoiceImg.src = `img/${computerChoice}.png`;
    actionSection.style.opacity = 1;
    actionTitle.textContent = "Scissors!";

    // --remove green background
    allChoiceImgs.forEach(
      (el) => (el.style.backgroundColor = "var(--rps-secondary-shade-2)")
    );

    // Return if tie
    if (playerChoice === computerChoice) {
      choiceSectionTitle.textContent = "🫤Its a tie!!🫤";
      choiceDisabled = false;
      return;
    }

    calcWinner();
    displayTable();

    choiceDisabled = false;
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
    choiceSectionTitle.textContent = "😀You Won!!😀";
    playerTotal++;
  } else {
    playerWin = false;
    choiceSectionTitle.textContent = "😢You Lost!!😢";
    computerTotal++;
  }
  // --check if number of wins has been reached
  if (playerTotal === numWins || computerTotal === numWins) endGame();
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
  // --styling
  body.style.backgroundColor = "var(--rps-primary-tint-1)";
  mainTitle.style.color = "var(--rps-primary-shade-2)";
  choiceSection.classList.add("hidden");
  // --display winner
  playerTotal === numWins
    ? (mainTitle.textContent = "🎉You won the game!!🎉")
    : (mainTitle.textContent = "😢You lost the game!!😢");
};

/////////////////////////////////////////////
/////////////// EVENT LISTENERS /////////////
/////////////////////////////////////////////

// STARTS A NEW GAME //
btnPlay.addEventListener("click", initGameState);

// GOES BACK TO THE START MENU //
btnStartOver.addEventListener("click", initStartState);

// MAKES A CHOICE AND EXECUTES 1 ROUND //
moveChoices.addEventListener("click", function (e) {
  // --return if currently playing
  if (choiceDisabled) return;
  choiceDisabled = true;

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
