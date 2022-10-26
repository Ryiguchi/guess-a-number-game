"use strict";

const textGuess = document.querySelector(".guess-label");
const textStartMessage = document.querySelector(".start-message");
const textGameMessage = document.querySelector(".game-message");
const textSecNum = document.querySelector(".secret-number");
const list = document.querySelector("ul");

const inputUserGuess = document.querySelector("#guess");
const inputSetMin = document.querySelector(".input-min");
const inputSetMax = document.querySelector(".input-max");
const inputSetGuesses = document.querySelector(".input-guesses");

const btnPlay = document.querySelector(".play-btn");
const btnGuess = document.querySelector(".guess-btn");
const btnReset = document.querySelector(".reset-btn-guess-num");

const body = document.querySelector("body");
const numberGuessesEl = document.querySelector(".number-guesses");
const gameSection = document.querySelector(".game-section");
const startSection = document.querySelector(".start-section");

let secretNum, turnNum, numMin, numMax, maxTurns;

// Functions //////////////////////////////

///////// Initial state
const initState = function () {
  // Hiding start screen / Showing playing screen
  toggleScreens();
  textStartMessage.classList.add("hidden");
  gameSection.classList.remove("game-over-guess");

  // clearing
  textStartMessage.textContent = "";
  textGameMessage.textContent = "";
  list.innerHTML = "";
  textSecNum.textContent = "?";
};

/////////// Initializes game
const init = function () {
  // Set values to predetermined values
  numMin = Number(inputSetMin.value);
  numMax = Number(inputSetMax.value);
  maxTurns = Number(inputSetGuesses.value);

  if (
    isNaN(numMin) ||
    isNaN(numMax) ||
    numMax < numMin ||
    isNaN(maxTurns) ||
    maxTurns < 1
  ) {
    displayInvalidMessage("start");
    return;
  }
  initState();
  numberGuessesEl.textContent = `(out of ${maxTurns})`;
  // Create label for the guess input box
  textGuess.textContent = `Guess a number, ${numMin} - ${numMax}`;

  // Reset turn
  turnNum = 1;

  // Get the secret number
  secretNum = getRandomNum(numMin, numMax);
};

const toggleScreens = function () {
  startSection.classList.toggle("hidden");
  gameSection.classList.toggle("hidden");
};

// Tells the user that they have entered an invalid number
const displayInvalidMessage = function (el) {
  element === "start" ? textStartMessage : textGameMessage;
  element.classList.remove("hidden");
  element.textContent = `You entered an invalid number! Try again ...`;
};

///////// Returns a random number between 'min' and 'max'
const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

////////// Displays message and lists the guess
const displayGuess = function (guess, secretNum) {
  // determine if guess is too high or too low
  const tooHigh = guess > secretNum ? true : false;

  // Build message text
  textGameMessage.textContent = `You need to guess ${
    tooHigh ? "lower" : "higher"
  } than ${guess}, try again ...`;

  // Build previous guesses list text
  const text = `<li>Guess ${turnNum}:   ${guess} (too ${
    tooHigh ? "high" : "low"
  })</li>`;
  list.insertAdjacentHTML("beforeend", text);
};

/////// Displsays win or lose
const gameEnd = function (guess, result) {
  gameSection.classList.add("game-over-guess");

  // Display win messages
  textGameMessage.textContent =
    result === "win"
      ? `Congratulations!!! ${guess} was the right number!!`
      : `Too bad!! You're out of guesses!!`;
  // Show the secret number
  textSecNum.textContent = secretNum;
};

//////////// Main functionality
const playGame = function () {
  // Get the players guess
  const curGuess = Math.floor(inputUserGuess.value);
  inputUserGuess.blur();
  inputUserGuess.value = "";
  // Check if number
  if (isNaN(curGuess) || curGuess < numMin || curGuess > numMax) {
    displayInvalidMessage("game");
    return;
  }

  // check for winner or no more turns
  if (curGuess === secretNum) {
    gameEnd(curGuess, "win");
    return;
  }

  if (turnNum === maxTurns) {
    gameEnd(curGuess, "lose");
    return;
  }

  displayGuess(curGuess, secretNum);
  // Change Turn
  turnNum++;
};

// Event Listeners //////////////////////////

btnPlay.addEventListener("click", init);

// For the guess - either button or enter key
btnGuess.addEventListener("click", playGame);

inputUserGuess.addEventListener("keydown", function (e) {
  if (e.key === "Enter") playGame();
});

// Reset button
btnReset.addEventListener("click", initState);
