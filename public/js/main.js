//Available levels
const levels = {
  easy: 5,
  medium: 3,
  hard: 2,
};

let currentLevel = levels["easy"];
let time;
let score = 0;
let isPlaying;
let words;

const wordInput = document.querySelector("#word-input");
const currentWord = document.querySelector("#current-word");
const scoreDisplay = document.querySelector("#score");
const timeDisplay = document.querySelector("#time");
const message = document.querySelector("#message");
const seconds = document.querySelector("#seconds");
const difficultyButtons = document.querySelectorAll(".dropdown-item");
const difficultyDropdown = document.querySelector("#dropdownMenuButton");
const startBtn = document.querySelector("#start-button");

difficultyButtons.forEach((difficulty) => {
  difficulty.addEventListener("click", () => {
    let diff = difficulty.value;
    currentLevel = levels[diff];
    time = currentLevel;
    difficultyDropdown.innerHTML = difficulty.innerHTML;
  });
});
window.addEventListener("load", init());

//Initialize game
function init() {
  //get words from api
  getWords();
  //Wait for start button
  startBtn.addEventListener("click", start);
}

function getWords() {
  fetch("https://random-word-api.herokuapp.com/word?number=200")
    .then((res) => res.json())
    .then((data) => (words = data))
    .catch(words = [
      "there was an issue fetching words. Check https://random-word-api.herokuapp.com"
    ]);
}

function start() {
  //hide selectors
  startBtn.classList.add("d-none");
  difficultyDropdown.classList.add("d-none");
  //show input
  wordInput.classList.remove("d-none");
  wordInput.focus();

  currentWord.classList.remove("d-none");
  //show difficulty in seconds
  seconds.innerHTML = currentLevel;
  //call function to load word from array
  showWord(words);

  //start matching on word input
  wordInput.addEventListener("input", startMatch);

  //call countdown
  setInterval(countdown, 1000);

  //check game status
  setInterval(checkStatus, 50);
}

//Pick random word to show
function showWord(words) {
  let randIndex = Math.floor(Math.random() * words.length);
  currentWord.innerHTML = words[randIndex];
}

function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    time = currentLevel + 1;
    showWord(words);
    wordInput.value = "";
    score++;
  }
  scoreDisplay.innerHTML = score;
}

function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = "correct!";
    return true;
  } else {
    return false;
  }
}

//decrement timer
function countdown() {
  if (time > 0) {
    time--;
  } else if (time === 0) {
    //Game is over
    isPlaying = false;
  }

  timeDisplay.innerHTML = time;
}

function checkStatus() {
  if (!isPlaying && time === 0) {
    message.innerHTML = `Game Over!`;
    //handle high score local storage logic

    score = 0;
  }
}
