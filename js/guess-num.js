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
const btnReset = document.querySelector(".reset-btn");

const body = document.querySelector("body");
const title = document.querySelector("h1");
const h3 = document.querySelector("h3");
const pressPlayContainer = document.querySelector(".press-play-container");
const secretNumContainer = document.querySelector(".secret-number-container");
const gameSection = document.querySelector(".game-section");
const startSection = document.querySelector(".start-section");

let secretNum, turnNum, numMin, numMax, maxTurns;

// Functions //////////////////////////////

///////// Initial state
const initState = function () {
  // Hiding start screen / Showing playing screen
  startSection.classList.remove("hidden");
  gameSection.classList.add("hidden");

  //Reseting inputs to initial
  inputSetMin.value = 0;
  inputSetMax.value = 100;
  inputSetGuesses.value = 5;

  // clearing
  inputUserGuess.value = "";
  title.textContent = "Number Guessing Game";
  textStartMessage.textContent = "";
  textGameMessage.textContent = "";
  list.innerHTML = "";
  textSecNum.textContent = "?";

  // Styling
  body.style.backgroundColor = "#6853ab";
  title.style.color = "#e0c95e";
};

/////////// Initializes game
const init = function () {
  // Set values to predetermined values
  numMin = Number(inputSetMin.value);
  if (isNaN(numMin)) {
    displayInvalidMessage("start");
    return;
  }

  numMax = Number(inputSetMax.value);
  if (isNaN(numMax) || numMax < numMin) {
    displayInvalidMessage("start");
    return;
  }

  maxTurns = Number(inputSetGuesses.value);
  if (isNaN(maxTurns) || maxTurns < 1) {
    displayInvalidMessage("start");
    return;
  }

  // Showing start screen / hiding playing screen
  startSection.classList.add("hidden");
  gameSection.classList.remove("hidden");

  // Set text
  textGameMessage.textContent = "";
  h3.textContent = `Your Previous Guesses (out of ${maxTurns})`;

  // Create label for the guess input box
  textGuess.textContent = `Guess a number, ${numMin} - ${numMax}`;

  // Reset turn
  turnNum = 1;

  // Get the secret number
  secretNum = getRandomNum(numMin, numMax);
};

const validNum = function (num) {
  return isNaN(num) ? false : true;
};

// Tells the user that they have entered an invalid number
const displayInvalidMessage = function (el) {
  if (el === "start") {
    textStartMessage.classList.remove("hidden");
    textStartMessage.textContent = `You entered an invalid number! Try again ...`;
  } else {
    textGameMessage.classList.remove("hidden");
    textGameMessage.textContent = `You entered an invalid number! Try again ...`;
  }
};

/////////// Check if a guess is valid
const isValid = function (num) {
  return isNaN(num) || num < numMin || num > numMax ? false : true;
};

///////// Returns a random number between 'min' and 'max'
const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

////////// Displays message and lists the guess
const displayGuess = function (guess, secretNum) {
  // clear guess value
  inputUserGuess.value = "";

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
  // Styling
  body.style.backgroundColor = "#e0c95e";
  title.style.color = "#1e0a5d";
  inputUserGuess.value = "";

  // Display win messages
  if (result === "win") {
    title.textContent = "🎉 You got it!! 🎉";
    // Message
    textGameMessage.textContent = `Congratulations!!! ${guess} was the right number!!`;
  }

  // Display lose messages
  if (result === "lose") {
    title.textContent = "😢 You lost!! 😢";
    textGameMessage.textContent = `Too bad!! You're out of guesses!!`;
  }

  // Show the secret number
  textSecNum.textContent = secretNum;
};

//////////// Main functionality
const playGame = function () {
  // Get the players guess
  const curGuess = Math.floor(inputUserGuess.value);
  inputUserGuess.blur();

  // Check if number
  if (isNaN(curGuess) || curGuess < numMin || curGuess > numMax) {
    displayInvalidMessage("game");
    inputUserGuess.value = "";
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
