let time;
let score = 0;
let guessedWords = new Set();
let validWords = new Set();
let timerInterval;

const timerElement = document.getElementById("time");
const scoreElement = document.getElementById("score-count");
const inputElement = document.getElementById("word-input");
const messageElement = document.getElementById("message");
const gameContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const finalScoreElement = document.getElementById("final-score");
const guessedWordsList = document.getElementById("guessed-words-list");
const restartButton = document.getElementById("restart-button");

fetch("words.txt")
    .then((response) => response.text())
    .then((data) => {
        validWords = new Set(
            data.split("\n").map((word) => word.trim().toLowerCase())
        );
    })
    .catch((error) => console.error("Error loading word list:", error));

function updateTimer() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerElement.textContent = `${minutes}:${
        seconds < 10 ? "0" : ""
    }${seconds}`;
    if (time > 0) {
        time--;
    } else {
        clearInterval(timerInterval);
        endGame();
    }
}

function startGame(duration) {
    time = duration * 60;
    score = 0;
    guessedWords.clear();
    scoreElement.textContent = score;
    messageElement.textContent = "";
    inputElement.value = "";

    startScreen.style.display = "none";
    endScreen.style.display = "none";
    gameContainer.style.display = "block";

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    inputElement.addEventListener("keydown", handleKeyDown);
}

function handleWordSubmission() {
    const word = inputElement.value.trim().toLowerCase();
    if (!word) {
        messageElement.textContent = "Invalid input. Please enter a word.";
    } else if (!validWords.has(word)) {
        messageElement.textContent = "Word does not exist.";
    } else if (guessedWords.has(word)) {
        messageElement.textContent = "Word already counted towards score.";
    } else {
        guessedWords.add(word);
        score++;
        scoreElement.textContent = score;
        messageElement.textContent = "";
    }
    inputElement.value = "";
}

function endGame() {
    clearInterval(timerInterval);
    inputElement.removeEventListener("keydown", handleKeyDown);
    gameContainer.style.display = "none";
    finalScoreElement.textContent = score;
    endScreen.style.display = "block";
}

document.querySelectorAll(".timer-option").forEach((button) => {
    button.addEventListener("click", () => {
        const duration = parseInt(button.getAttribute("data-time"), 10);
        startGame(duration);
    });
});

function handleKeyDown(event) {
    if (event.key === "Enter") {
        handleWordSubmission();
    }
}

restartButton.addEventListener("click", () => {
    gameContainer.style.display = "none";
    endScreen.style.display = "none";
    startScreen.style.display = "block";
});
