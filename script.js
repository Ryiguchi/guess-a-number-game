"use strict";

const textGuess = document.querySelector(".guess-label");
const textMessage = document.querySelector(".message");
const textSecNum = document.querySelector(".secret-number");
const list = document.querySelector("ul");

const inputGuess = document.querySelector("#guess");
const inputMin = document.querySelector(".input-min");
const inputMax = document.querySelector(".input-max");
const inputTurns = document.querySelector(".input-guesses");

const btnPlay = document.querySelector(".play-btn");
const btnGuess = document.querySelector(".guess-btn");
const btnReset = document.querySelector(".reset-btn");

const body = document.querySelector("body");
const h1 = document.querySelector("h1");
const h3 = document.querySelector("h3");
const pressPlayBox = document.querySelector(".press-play-wrapper");
const secretNumBox = document.querySelector(".secret-number-wrapper");
const gameSection = document.querySelector(".game-section");
const previousSection = document.querySelector(".previous-guesses-section");
const setupSection = document.querySelector(".input-wrapper");

let secretNum, turnNum, numMin, numMax, maxTurns;

// Functions //////////////////////////////

///////// Initial state
const initState = function () {
  // Hiding start screen / Showing playing screen
  setupSection.classList.remove("hidden");
  secretNumBox.classList.add("hidden");
  gameSection.classList.add("hidden");
  previousSection.classList.add("hidden");
  textMessage.classList.add("hidden");

  //Reseting inputs to initial
  inputMin.value = 0;
  inputMax.value = 100;
  inputTurns.value = 5;

  // clearing
  inputGuess.value = "";
  h1.textContent = "Number Guessing Game";
  textMessage.textContent = "";
  list.innerHTML = "";
  textSecNum.textContent = "?";

  // Styling
  body.style.backgroundColor = "#6853ab";
  h1.style.color = "#e0c95e";
};

/////////// Initializes game
const init = function () {
  // Set values to predetermined values
  numMin = Number(inputMin.value);
  if (isNaN(numMin)) {
    displayInvalidMessage();
    return;
  }

  numMax = Number(inputMax.value);
  if (isNaN(numMax) || numMax < numMin) {
    displayInvalidMessage();
    return;
  }

  maxTurns = Number(inputTurns.value);
  if (isNaN(maxTurns) || maxTurns < 1) {
    displayInvalidMessage();
    return;
  }

  // Showing start screen / hiding playing screen
  setupSection.classList.add("hidden");
  secretNumBox.classList.remove("hidden");
  gameSection.classList.remove("hidden");
  previousSection.classList.remove("hidden");
  textMessage.classList.remove("hidden");

  // Set text
  textMessage.textContent = "";
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
const displayInvalidMessage = function () {
  textMessage.classList.remove("hidden");
  textMessage.textContent = `You entered an invalid number! Try again ...`;
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
  inputGuess.value = "";

  // determine if guess is too high or too low
  const tooHigh = guess > secretNum ? true : false;

  // Build message text
  textMessage.textContent = `You need to guess ${
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
  h1.style.color = "#1e0a5d";
  inputGuess.value = "";

  // Display win messages
  if (result === "win") {
    h1.textContent = "🎉 You got it!! 🎉";
    // Message
    textMessage.textContent = `Congratulations!!! ${guess} was the right number!!`;
  }

  // Display lose messages
  if (result === "lose") {
    h1.textContent = "😢 You lost!! 😢";
    textMessage.textContent = `Too bad!! You're out of guesses!!`;
  }

  // Show the secret number
  textSecNum.textContent = secretNum;
};

//////////// Main functionality
const playGame = function () {
  // Get the players guess
  const curGuess = Math.floor(inputGuess.value);
  inputGuess.blur();

  // Check if number
  if (isNaN(curGuess) || curGuess < numMin || curGuess > numMax) {
    displayInvalidMessage();
    inputGuess.value = "";
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

inputGuess.addEventListener("keydown", function (e) {
  if (e.key === "Enter") playGame();
});

// Reset button
btnReset.addEventListener("click", initState);
