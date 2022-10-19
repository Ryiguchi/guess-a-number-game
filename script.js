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
const pressPlayBox = document.querySelector(".press-play-wrapper");
const secretNumBox = document.querySelector(".secret-number-wrapper");
const gameSection = document.querySelector(".game-section");
const setupSection = document.querySelector(".input-wrapper");

let secretNum, turnNum, numMin, numMax, maxTurns;

// Functions //////////////////////////////

///////// Initializes game

const initState = function () {
  setupSection.classList.remove("hidden");
  secretNumBox.classList.add("hidden");
  gameSection.classList.add("hidden");

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

const init = function () {
  setupSection.classList.add("hidden");
  secretNumBox.classList.remove("hidden");
  gameSection.classList.remove("hidden");

  numMin = Number(inputMin.value);
  numMax = Number(inputMax.value);
  maxTurns = Number(inputTurns.value);

  turnNum = 1;

  secretNum = getRandomNum(numMin, numMax);
  console.log(secretNum);
  console.log(maxTurns);
};

const isValid = function (curGuess) {
  return isNaN(curGuess) || curGuess < 0 || curGuess > 100 ? false : true;
};

///////// Returns a random number between 'min' and 'max'
const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

////////// Displays message and lists the guess
const displayGuess = function (guess, secretNum) {
  inputGuess.value = "";
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
  inputGuess.value = "";

  if (result === "winner") {
    h1.textContent = "🎉 You got it!! 🎉";
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
  console.log(turnNum);
  console.log(maxTurns);
  // Get the players guess
  const curGuess = Math.floor(inputGuess.value);
  inputGuess.blur();

  // Check if number
  if (!isValid(curGuess)) {
    textMessage.textContent = `You entered an invalid number, try again ...`;
    inputGuess.value = "";
    return;
  }

  // check for winner or no more turns
  if (curGuess === secretNum) {
    gameEnd(curGuess, "winner");
    return;
  }

  if (turnNum === maxTurns) {
    console.log("lose");
    gameEnd(curGuess, "loser");
    return;
  }

  displayGuess(curGuess, secretNum);
  // Change Turn
  turnNum++;
};

// Event Listeners //////////////////////////

btnPlay.addEventListener("click", init);

btnReset.addEventListener("click", initState);

btnGuess.addEventListener("click", playGame);

inputGuess.addEventListener("keydown", function (e) {
  if (e.key === "Enter") playGame();
});
