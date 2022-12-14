"use strict";

// ///////////////////////////////////////////
// ///////////// SELECTORS ///////////////////
// ///////////////////////////////////////////
//  --buttons
const startBtn = document.querySelector(".play-btn");
const startOverBtn = document.querySelector(".start-over-mine");
//  --inputs
const difficultySelect = document.querySelector("#difficulty");
//  --elements
const startSection = document.querySelector(".start-section-mine");
const gameSection = document.querySelector(".game-section-mine");
const startMessage = document.querySelector(".message-mine");
const gameBoard = document.querySelector(".game-board-mine");
const gameContainerEl = document.querySelector(".game-container-game-mine");
const mineCountEl = document.querySelector(".mine-count");
const timerEl = document.querySelector(".timer-mine");

// ///////////////////////////////////////////
// ///////////////VARIABLES///////////////////
// ///////////////////////////////////////////
let numRows, numMines, playing, openCells, minesRemaining, timer;
let arr = [];
let cellTops = [];
let cellBottoms = [];

// ///////////////////////////////////////////
// ///////////////FUNCTIONS///////////////////
// ///////////////////////////////////////////

// //////////////// SET-UP ///////////////////
const startGame = function () {
  toggleScreens();
  resetValues();
  getGameValues();
  createCoorArray();
  createBoard();
  setCellValues();
  displayCellValues();
  style();
};

const toggleScreens = function () {
  startSection.classList.toggle("hidden");
  gameSection.classList.toggle("hidden");
};

const resetValues = function () {
  gameBoard.innerHTML = "";
  gameBoard.classList.remove("grid-col-9", "grid-col-16");
  gameContainerEl.classList.remove("winner-mine", "loser-mine");
  arr = [];
  cellTops = [];
  cellBottoms = [];
  playing = true;
  openCells = 0;
  timerEl.textContent = "00:00";
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
};

const getGameValues = function () {
  numRows = Number(difficultySelect.value);
  if (numRows === 9) {
    numMines = 10;
  } else {
    numMines = 40;
  }
  mineCountEl.textContent = minesRemaining = numMines;
};

const createCoorArray = function () {
  for (let i = 1; i <= numRows; i++) {
    for (let j = 1; j <= numRows; j++) {
      arr.push({ coor: [j, i] });
    }
  }
  arr.forEach((obj) => {
    obj.mine = false;
    obj.numOfMines = 0;
    obj.open = false;
  });
};

const createBoard = function () {
  gameBoard.classList.add(`grid-col-${numRows}`);
  let htmlStr = "";
  arr.forEach(
    (el, i) =>
      (htmlStr += `<div class="cell-container">
  <div class="square-bottom flex" data-num="${i}"></div>
  <div class="square-top no-flag flex" data-num="${i}">????</div>
</div>`)
  );
  gameBoard.insertAdjacentHTML("afterbegin", htmlStr);

  cellTops = [...document.querySelectorAll(".square-top")];
  cellBottoms = [...document.querySelectorAll(".square-bottom")];
};

const setCellValues = function () {
  setMines();
  arr.forEach((obj, i) => {
    obj.surroundingElements = getSurroundingElements(...obj.coor);
    obj.numOfMines = surroundingMines(obj.surroundingElements);
    obj.elementTop = cellTops.find((el) => Number(el.dataset.num) === i);
    obj.elementBottom = cellBottoms.find((el) => Number(el.dataset.num) === i);
  });
};

const setMines = function () {
  let randomNumbers = [];
  for (let i = 1; i <= numMines; i++) {
    let num;
    do {
      num = getRandomNum(0, numRows ** 2 - 1);
    } while (randomNumbers.includes(num));
    arr[num].mine = true;
    randomNumbers.push(num);
  }
};

const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getSurroundingElements = function (x, y) {
  const surroundingCoords = [
    [x - 1, y - 1], // NW
    [x, y - 1], // N
    [x + 1, y - 1], // NE
    [x + 1, y], // E
    [x + 1, y + 1], // SE
    [x, y + 1], // S
    [x - 1, y + 1], // SW
    [x - 1, y], // W
  ];
  return surroundingCoords
    .filter(
      (el) => el[0] > 0 && el[0] <= numRows && el[1] > 0 && el[1] <= numRows
    )
    .map(
      (coord) =>
        arr[
          arr.findIndex(
            (obj) => obj.coor[0] === coord[0] && obj.coor[1] === coord[1]
          )
        ]
    );
};

const surroundingMines = function (array) {
  let mines = 0;
  array.forEach((obj) => {
    if (obj.mine) mines++;
  });
  return mines;
};

const displayCellValues = function () {
  arr.forEach((el, i) => {
    if (el.numOfMines !== 0) el.elementBottom.textContent = el.numOfMines;
    if (el.mine === true) el.elementBottom.textContent = "????";
  });
};

const style = function () {
  arr
    .reduce(
      (acc, cur, i) =>
        (i + 1) % numRows === 0 ? (acc = [...acc, cur.elementBottom]) : acc,
      []
    )
    .forEach((el) => (el.style.borderRight = 0));
  arr
    .reduce(
      (acc, cur, i, arr) =>
        i >= numRows * (numRows - 1)
          ? (acc = [...acc, cur.elementBottom])
          : acc,
      []
    )
    .forEach((el) => (el.style.borderBottom = 0));
};

// ////////////// GAME ACTION ////////////////

const cellClick = function (cell) {
  const obj = arr[cell.dataset.num];
  if (arr[cell.dataset.num].mine) gameEnd("lose");
  cell.classList.add("hidden");
  obj.open = true;
  openSurroundingElements(obj);
  openCells++;
  if (openCells === numRows ** 2 - numMines) gameEnd("win");
  playing = true;
};

const openSurroundingElements = function (obj) {
  let again = true;
  while (again) {
    again = false;
    arr.forEach((obj) => {
      if (obj.open && obj.numOfMines == 0) {
        obj.surroundingElements.forEach((el) => {
          if (!el.open) {
            el.elementTop.classList.add("hidden");
            openCells++;
            el.open = true;
            again = true;
          }
        });
      }
    });
  }
};

const startTimer = function () {
  let time = 0;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    timerEl.textContent = `${min}:${sec}`;
    time++;
  };
  tick();
  timer = setInterval(tick, 1000);
};

const gameEnd = function (result) {
  cellTops.forEach((el) => el.classList.add("hidden"));
  clearInterval(timer);
  if (result === "lose") {
    arr
      .reduce(
        (acc, cur) => (cur.mine ? (acc = [...acc, cur.elementBottom]) : acc),
        []
      )
      .forEach((el) => (el.textContent = "????"));
    gameContainerEl.classList.add("loser-mine");
  } else {
    gameContainerEl.classList.add("winner-mine");
  }
};

// ///////////////////////////////////////////
// ////////// EVENT LISTENERS ////////////////
// ///////////////////////////////////////////
startBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (difficultySelect.value === "0") {
    startMessage.classList.remove("hidden");
    return;
  }

  startGame();
});

startOverBtn.addEventListener("click", function (e) {
  e.preventDefault();
  toggleScreens();
  startMessage.classList.add("hidden");
});

gameBoard.addEventListener("click", function (e) {
  e.preventDefault;

  if (
    e.target.classList.contains("game-board-mine") ||
    e.target.classList.contains("square-bottom") ||
    !playing
  )
    return;
  playing = false;
  if (!timer) startTimer();
  cellClick(e.target);
});

window.oncontextmenu = (e) => {
  e.preventDefault();
  if (!playing || !e.target.classList.contains("square-top")) return;
  e.target.classList.contains("no-flag") ? minesRemaining-- : minesRemaining++;
  e.target.classList.toggle("no-flag");
  mineCountEl.textContent = minesRemaining;
};
