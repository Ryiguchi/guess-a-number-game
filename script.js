"use strict";

const textGuess = document.querySelector(".guess-label");
const textMessage = document.querySelector(".message");
const textSecNum = document.querySelector(".secret-number");

const list = document.querySelector("ul");

const input = document.querySelector("input");

const btnPlay = document.querySelector(".play-btn");
const btnGuess = document.querySelector(".guess-btn");
const btnReset = document.querySelector(".reset-btn");

const body = document.querySelector("body");
const h1 = document.querySelector("h1");
const pressPlayBox = document.querySelector(".press-play-wrapper");
const secretNumBox = document.querySelector(".secret-number-wrapper");
const gameSection = document.querySelector(".game-section");

let secretNum, turnNum;
const numMin = 0;
const numMax = 100;
const maxTurns = 5;

// Functions //////////////////////////////

///////// Initializes game
const init = function () {
  pressPlayBox.classList.add("hidden");
  secretNumBox.classList.remove("hidden");
  gameSection.classList.remove("hidden");

  secretNum = getRandomNum(numMin, numMax);
  console.log(secretNum);
  turnNum = 1;
  input.value = "";
  h1.textContent = "Number Guessing Game";
  textMessage.textContent = "";
  list.innerHTML = "";
  textSecNum.textContent = "?";
  // Styling
  body.style.backgroundColor = "#6853ab";
  h1.style.color = "#e0c95e";
};

///////// Returns a random number between 'min' and 'max'
const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

////////// Displays message and lists the guess
const displayGuess = function (guess, secretNum) {
  input.value = "";
  input.blur();
  const highLow = guess < secretNum ? "low" : "high";

  const text = `<li>Guess ${turnNum}:   ${guess} (too ${highLow})</li>`;
  list.insertAdjacentHTML("beforeend", text);

  textMessage.textContent = `You need to guess ${
    highLow === "low" ? "higher" : "lower"
  } than ${guess}, try again ...`;
};

/////// Displsays win or lose
const gameEnd = function (guess, result) {
  // Styling
  body.style.backgroundColor = "#e0c95e";
  h1.style.color = "#1e0a5d";
  input.value = "";
  input.blur();

  if (result === "winner") {
    h1.textContent = "🎉 You got it!!";
    // Message
    textMessage.textContent = `Congratulations!!! ${guess} was the right number!!`;
  }
  if (result === "loser") {
    h1.textContent = "😢 You lose!!";
    textMessage.textContent = `Sorry!! You're out of guesses!!`;
  }
  textSecNum.textContent = secretNum;
};

// Main functionality
const playGame = function () {
  // Get the players guess
  const curGuess = Math.floor(input.value);

  // Check if number
  if (isNaN(curGuess) || curGuess < 0 || curGuess > 100) {
    textMessage.textContent = `You entered an invalid number, try again ...`;
    return;
  }

  // check for winner or no more turns
  if (curGuess === secretNum) {
    gameEnd(curGuess, "winner");
    return;
  } else if (turnNum === maxTurns) {
    gameEnd(curGuess, "loser");
    return;
  }

  displayGuess(curGuess, secretNum);
  // Change Turn
  turnNum++;
};

// Event Listeners //////////////////////////

btnPlay.addEventListener("click", init);

btnReset.addEventListener("click", init);

btnGuess.addEventListener("click", playGame);

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") playGame();
});
