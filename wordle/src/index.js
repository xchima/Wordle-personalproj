import { testDictionary, realDictionary } from "./dictionary.js";

document.addEventListener("DOMContentLoaded", () => {
  // Use testDictionary while testing.
  // Gonna change this to realDictionary when everything finally works.
  const dictionary = realDictionary;

  let guessedWords = [[]];
  let availableSpace = 1;
  let word = "";
  let guessedWordCount = 0;
  let gameOver = false;

  createSquares();
  getNewWord();

  const keys = document.querySelectorAll(".keyboard-row button");

  function getNewWord() {
    const randomIndex = Math.floor(Math.random() * dictionary.length);
    word = dictionary[randomIndex].toLowerCase();

    // Remove this after testing(prolly not).
    console.log("Secret word:", word);
  }

  function getCurrentWordArr() {
    return guessedWords[guessedWords.length - 1];
  }

  function updateGuessedWords(letter) {
    if (gameOver) {
      return;
    }

    const currentWordArr = getCurrentWordArr();

    if (currentWordArr.length < 5) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(
        String(availableSpace)
      );

      if (availableSpaceEl) {
        availableSpaceEl.textContent = letter;
        availableSpace++;
      }
    }
  }

  function getTileColor(letter, index) {
    if (letter === word.charAt(index)) {
      return "rgb(83, 141, 78)";
    }

    if (word.includes(letter)) {
      return "rgb(181, 159, 59)";
    }

    return "rgb(58, 58, 60)";
  }

  function handleSubmitWord() {
    if (gameOver) {
      return;
    }

    const currentWordArr = getCurrentWordArr();

    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters.");
      return;
    }

    const currentWord = currentWordArr.join("").toLowerCase();

    console.log("Submitted word:", currentWord);

    if (!dictionary.includes(currentWord)) {
      window.alert("Word is not recognized!");
      return;
    }

    const firstLetterId = guessedWordCount * 5 + 1;
    const animationDelay = 200;

    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = getTileColor(letter, index);
        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(String(letterId));

        if (!letterEl) {
          return;
        }

        letterEl.classList.add("animate__flipInX");
        letterEl.style.backgroundColor = tileColor;
        letterEl.style.borderColor = tileColor;

        updateKeyboardColor(letter, tileColor);
      }, animationDelay * index);
    });

    guessedWordCount++;

    if (currentWord === word) {
      gameOver = true;

      setTimeout(() => {
        window.alert("Congratulations!");
      }, 1100);

      return;
    }

    if (guessedWordCount === 6) {
      gameOver = true;

      setTimeout(() => {
        window.alert(`Sorry! The word was "${word}".`);
      }, 1100);

      return;
    }

    guessedWords.push([]);
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");

    if (!gameBoard) {
      console.error('Element with id="board" was not found.');
      return;
    }

    gameBoard.innerHTML = "";

    for (let index = 0; index < 30; index++) {
      const square = document.createElement("div");

      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", String(index + 1));

      gameBoard.appendChild(square);
    }
  }

  function handleDeleteLetter() {
    if (gameOver) {
      return;
    }

    const currentWordArr = getCurrentWordArr();

    if (currentWordArr.length === 0) {
      return;
    }

    currentWordArr.pop();
    availableSpace--;

    const lastLetterEl = document.getElementById(
      String(availableSpace)
    );

    if (lastLetterEl) {
      lastLetterEl.textContent = "";
    }
  }

  function updateKeyboardColor(letter, tileColor) {
    const keyboardButton = document.querySelector(
      `button[data-key="${letter}"]`
    );

    if (!keyboardButton) {
      return;
    }

    const currentColor = keyboardButton.style.backgroundColor;
    const green = "rgb(83, 141, 78)";
    const yellow = "rgb(181, 159, 59)";

    // Do not replace green with yellow or gray.
    if (currentColor === green) {
      return;
    }

    // Do not replace yellow with gray.
    if (
      currentColor === yellow &&
      tileColor === "rgb(58, 58, 60)"
    ) {
      return;
    }

    keyboardButton.style.backgroundColor = tileColor;
    keyboardButton.style.color = "white";
  }

  keys.forEach((key) => {
    key.addEventListener("click", () => {
      const pressedKey = key.dataset.key;

      if (pressedKey === "enter") {
        handleSubmitWord();
        return;
      }

      if (pressedKey === "del") {
        handleDeleteLetter();
        return;
      }

      updateGuessedWords(pressedKey);
    });
  });

  // Optional: allow the physical keyboard to work too.
  document.addEventListener("keydown", (event) => {
    const pressedKey = event.key.toLowerCase();

    if (pressedKey === "enter") {
      handleSubmitWord();
      return;
    }

    if (pressedKey === "backspace" || pressedKey === "delete") {
      handleDeleteLetter();
      return;
    }

    if (/^[a-z]$/.test(pressedKey)) {
      updateGuessedWords(pressedKey);
    }
  });
});