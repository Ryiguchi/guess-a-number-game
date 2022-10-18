"use strict";

const textGuess = document.querySelector(".guess-label");
const textMessage = document.querySelector(".message");

const list = document.querySelector("ul");

const input = document.querySelector("input");

const btnGuess = document.querySelector(".guess-btn");
const btnReset = document.querySelector(".reset-btn");

const body = document.querySelector("body");
const h1 = document.querySelector("h1");

let turnNum = 1;
let secretNum;

// Functions //////////////////////////////

// Returns a random number between 'min' and 'max'
const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Gets number from input field
const getGuess = function () {
  return Math.floor(input.value);
};

// displays message and lists the guess
const displayGuess = function (guess, secretNum) {
  input.value = "";
  const highLow = guess < secretNum ? "low" : "high";

  const text = `<li>Guess ${turnNum}:   ${guess} (too ${highLow})</li>`;
  list.insertAdjacentHTML("beforeend", text);

  textMessage.textContent = `You need to guess ${
    highLow === "low" ? "higher" : "lower"
  } than ${guess}, try again ...`;
};

// Notifys that an invalid number was entered
const displayNaN = function (guess) {
  const text = `<li>Guess ${turnNum}:   invalid</li>`;
  list.insertAdjacentHTML("beforeend", text);

  textMessage.textContent = `You entered an invalid number, try again ...`;
};

const gameEnd = function (guess, result) {
  // Styling
  body.style.backgroundColor = "#e0c95e";
  h1.style.color = "#1e0a5d";

  if (result === "winner") {
    h1.textContent = "🎉 You got it!!";
    // Message
    textMessage.textContent = `Congratulations!!! ${guess} was the right number!!`;
  }
  if (result === "loser") {
    h1.textContent = "😢 You lose!!";
    textMessage.textContent = `Sorry!! You're out of guesses!!`;
  }
};

// Main functionality
const playGame = function () {
  // Get a random number if it's the first turn

  if (turnNum === 1) {
    secretNum = getRandomNum(0, 100);
  }

  // Get the players guess
  const curGuess = getGuess();

  // Check if number
  if (isNaN(curGuess) || curGuess < 0 || curGuess > 100) {
    displayNaN(curGuess);
    return;
  }

  // check for winner or no more turns
  if (curGuess === secretNum) {
    gameEnd(curGuess, "winner");
    return;
  } else if (turnNum === 5) {
    gameEnd(curGuess, "loser");
    return;
  }

  displayGuess(curGuess, secretNum);
  // Change Turn
  turnNum++;
};

// Event Handlers //////////////////////////

btnGuess.addEventListener("click", playGame);

input.addEventListener("keydown", function (e) {
  console.log(e);
  if (e.key === "Enter") playGame();
});

btnReset.addEventListener("click", function () {
  turnNum = 1;
  input.value = "";

  location.reload();
});
