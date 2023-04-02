/* eslint-disable @typescript-eslint/no-unused-vars */
import { realDictionary } from "./dictionary.js";

type State = {
  secret: string;
  grid: string[][];
  currentRow: number;
  currentCol: number;
};

const dictionary: string[] = realDictionary;
const message = document.getElementById("alert");

const state: State = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill("")
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
};

function drawGrid(container: HTMLElement) {
  const grid = document.createElement("div");
  grid.className = "grid";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }
  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`) as HTMLElement;
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(
  container: HTMLElement,
  row: number,
  col: number,
  letter = ""
): HTMLElement {
  const box = document.createElement("div");
  box.className = "box";
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    if (message) {
      message.style.visibility = "hidden";
      message.style.animation = "none";
    }
    const key = e.key;
    if (key === "Enter") {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word.toLowerCase())) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else if (message) {
          message.style.visibility = "visible";
          message.style.animation = "error 2s linear";
          message.innerHTML = "Essa palavra não é aceita!";
        }
      }
    }
    if (key === "Backspace") {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord(): string {
  const word = state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
  return word.toLowerCase();
}

function isWordValid(word: string): boolean {
  return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word: string, letter: string): number {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(
  word: string,
  letter: string,
  position: number
): number {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function revealWord(guess: string) {
  const row = state.currentRow;
  const animation_duration = 500; // ms

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`) as HTMLElement;
    const letter = box.textContent?.toLowerCase();
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter as string
    );
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(
      guess,
      letter as string
    );
    const letterPosition = getPositionOfOccurrence(guess, letter as string, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add("empty");
      } else {
        if (letter === state.secret[i]) {
          box.classList.add("right");
        } else if (state.secret.includes(letter as string)) {
          box.classList.add("wrong");
        } else {
          box.classList.add("empty");
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add("animated");
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner && message) {
      message.style.background = "#03C988";
      message.style.visibility = "visible";
      message.innerHTML = "PARABÉNS!";
    } else if (isGameOver && message) {
      message.style.visibility = "visible";
      message.style.animation = "error 2s linear";
      message.innerHTML = `Mais sorte da próxima vez! A palavra era ${state.secret.toUpperCase()}.`;
    }
  }, 3 * animation_duration);
}

function isLetter(key: string): boolean {
  return key.length === 1 && key.match(/[a-z]/i) !== null;
}

function addLetter(letter: string): void {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter(): void {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = "";
  state.currentCol--;
}

function startup(): void {
  const game = document.getElementById("game") as HTMLElement;
  drawGrid(game);
  registerKeyboardEvents();
}

startup();
