const palette = [
  { name: "red", hex: "#ff5757", glow: "rgba(255, 87, 87, 0.72)" },
  { name: "green", hex: "#24dd61", glow: "rgba(36, 221, 97, 0.72)" },
  { name: "orange", hex: "#ff8b3d", glow: "rgba(255, 139, 61, 0.72)" },
  { name: "blue", hex: "#2e9cff", glow: "rgba(46, 156, 255, 0.72)" },
  { name: "yellow", hex: "#ffd943", glow: "rgba(255, 217, 67, 0.72)" },
  { name: "purple", hex: "#7862e8", glow: "rgba(120, 98, 232, 0.72)" },
  { name: "cyan", hex: "#15c7e6", glow: "rgba(21, 199, 230, 0.72)" },
];

const maxAttempts = 7;
const codeLength = 4;
const state = {
  mode: "easy",
  level: 1,
  selectedSlot: 0,
  selectedColor: 0,
  activeRow: 0,
  guesses: [],
  feedbacks: [],
  answer: [],
  startedAt: 0,
  elapsedMs: 0,
  timerId: 0,
  solved: false,
  screen: "home",
};

const homeScreen = document.querySelector("#homeScreen");
const gameScreen = document.querySelector("#gameScreen");
const board = document.querySelector("#board");
const paletteEl = document.querySelector("#palette");
const timerEl = document.querySelector("#timer");
const bestTimeEl = document.querySelector("#bestTime");
const modeLabel = document.querySelector("#modeLabel");
const ruleNote = document.querySelector("#ruleNote");
const levelRange = document.querySelector("#levelRange");
const levelSelect = document.querySelector("#levelSelect");
const levelText = document.querySelector("#levelText");
const rankingEl = document.querySelector("#ranking");
const attemptDisplay = document.querySelector("#attemptDisplay");
const resultDialog = document.querySelector("#resultDialog");
const resultTitle = document.querySelector("#resultTitle");
const resultDetail = document.querySelector("#resultDetail");
const resultKicker = document.querySelector("#resultKicker");

function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatMoves(moves) {
  return `${moves} ${moves === 1 ? "move" : "moves"}`;
}

function storageKey() {
  return `tom-clues:mastermind:${state.mode}:level:${state.level}`;
}

function getRanks() {
  try {
    return JSON.parse(localStorage.getItem(storageKey()) || "[]");
  } catch {
    return [];
  }
}

function setRanks(ranks) {
  localStorage.setItem(storageKey(), JSON.stringify(ranks.slice(0, 10)));
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function generateAnswer(level, mode) {
  const random = seededRandom(level * 7919 + (mode === "hard" ? 15485863 : 32452843));
  const pool = palette.map((_, index) => index);
  const answer = [];

  while (answer.length < codeLength) {
    const pick = Math.floor(random() * pool.length);
    answer.push(pool.splice(pick, 1)[0]);
  }

  return answer;
}

function evaluateGuess(guess, answer) {
  const marks = Array(codeLength).fill("black");
  const remainingAnswer = [];
  const remainingGuess = [];

  guess.forEach((color, index) => {
    if (color === answer[index]) {
      marks[index] = "green";
    } else {
      remainingAnswer.push(answer[index]);
      remainingGuess.push({ color, index });
    }
  });

  remainingGuess.forEach(({ color, index }) => {
    const found = remainingAnswer.indexOf(color);
    if (found >= 0) {
      marks[index] = "white";
      remainingAnswer.splice(found, 1);
    }
  });

  const green = marks.filter((mark) => mark === "green").length;
  const white = marks.filter((mark) => mark === "white").length;
  return { marks, green, white, black: codeLength - green - white };
}

function showScreen(screen) {
  state.screen = screen;
  homeScreen.classList.toggle("is-hidden", screen !== "home");
  gameScreen.classList.toggle("is-hidden", screen !== "game");
  document.body.classList.toggle("in-game", screen === "game");

  if (screen === "home") {
    stopTimer();
    if (resultDialog.open) resultDialog.close();
  }
}

function ensureTimer() {
  if (state.startedAt || state.solved || state.screen !== "game") return;
  state.startedAt = Date.now() - state.elapsedMs;
  state.timerId = window.setInterval(() => {
    state.elapsedMs = Date.now() - state.startedAt;
    timerEl.textContent = formatTime(state.elapsedMs);
  }, 250);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = 0;
  }
  if (state.startedAt) {
    state.elapsedMs = Date.now() - state.startedAt;
  }
  timerEl.textContent = formatTime(state.elapsedMs);
}

function updateBestTime() {
  const best = getRanks()[0];
  bestTimeEl.textContent = best ? `Best ${formatTime(best.time)}` : "Best --:--";
}

function renderLevelOptions() {
  levelSelect.innerHTML = "";
  for (let level = 1; level <= 100; level += 1) {
    const option = document.createElement("option");
    option.value = String(level);
    option.textContent = `Lv. ${String(level).padStart(3, "0")}`;
    levelSelect.append(option);
  }
}

function renderPalette() {
  paletteEl.innerHTML = "";
  palette.forEach((color, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `palette-button${state.selectedColor === index ? " active" : ""}`;
    button.style.setProperty("--swatch", color.hex);
    button.setAttribute("aria-label", `Choose ${color.name}`);
    button.addEventListener("click", () => {
      state.selectedColor = index;
      setCurrentSlotColor(index);
      render();
    });
    paletteEl.append(button);
  });
}

function renderBoard() {
  board.innerHTML = "";
  const rows = Array.from({ length: maxAttempts }, (_, row) => state.guesses[row] || Array(codeLength).fill(null));

  rows.forEach((guess, rowIndex) => {
    const row = document.createElement("div");
    row.className = `guess-row${rowIndex === state.activeRow && !state.solved ? " active" : ""}`;

    guess.forEach((colorIndex, slotIndex) => {
      const cell = document.createElement("div");
      cell.className = "guess-cell";
      const peg = document.createElement("button");
      peg.type = "button";
      peg.className = "peg";
      peg.setAttribute("aria-label", `Attempt ${rowIndex + 1}, slot ${slotIndex + 1}`);

      if (colorIndex !== null && colorIndex !== undefined) {
        peg.classList.add("filled");
        peg.style.background = palette[colorIndex].hex;
        peg.style.setProperty("--glow", palette[colorIndex].glow);
      }

      if (rowIndex === state.activeRow && slotIndex === state.selectedSlot && !state.solved) {
        peg.classList.add("selected");
      }

      peg.addEventListener("click", () => {
        if (rowIndex !== state.activeRow || state.solved) return;
        state.selectedSlot = slotIndex;
        setCurrentSlotColor(state.selectedColor);
        render();
      });

      cell.append(peg);

      if (state.mode === "easy") {
        const clue = document.createElement("span");
        clue.className = `easy-clue ${state.feedbacks[rowIndex]?.marks[slotIndex] || ""}`;
        cell.append(clue);
      }

      row.append(cell);
    });

    const feedback = document.createElement("div");
    feedback.className = "feedback";
    const hardDots = buildHardDots(state.feedbacks[rowIndex]);
    hardDots.forEach((dotClass) => {
      const dot = document.createElement("span");
      dot.className = `feedback-dot ${state.mode === "hard" ? dotClass : ""}`;
      feedback.append(dot);
    });
    row.append(feedback);
    board.append(row);
  });
}

function buildHardDots(feedback) {
  if (!feedback) return Array(codeLength).fill("");
  return [
    ...Array(feedback.green).fill("green"),
    ...Array(feedback.white).fill("white"),
    ...Array(feedback.black).fill("black"),
  ].slice(0, codeLength);
}

function renderRanks() {
  const ranks = getRanks();
  rankingEl.innerHTML = "";

  if (!ranks.length) {
    const empty = document.createElement("li");
    empty.className = "empty-rank";
    empty.textContent = "No clears on this level yet";
    rankingEl.append(empty);
    return;
  }

  ranks.forEach((rank) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${formatTime(rank.time)}</strong> / ${formatMoves(rank.moves)}`;
    rankingEl.append(item);
  });
}

function renderMeta() {
  const levelName = `Lv. ${String(state.level).padStart(3, "0")}`;
  levelText.textContent = levelName;
  levelRange.value = String(state.level);
  levelSelect.value = String(state.level);
  attemptDisplay.textContent = state.solved ? "OK" : `${Math.min(state.activeRow + 1, maxAttempts)}/${maxAttempts}`;
  modeLabel.textContent = state.mode === "easy" ? "Easy Rules" : "Hard Rules";
  ruleNote.textContent = state.mode === "easy"
    ? "Each slot shows a clue below it: green means right color and right spot, white means right color in the wrong spot, black means the color is not in the answer."
    : "The dots on the right show only totals: green dots are right color and right spot, white dots are right color in the wrong spot, black dots are colors not in the answer.";

  document.querySelectorAll(".segment").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
}

function render() {
  renderPalette();
  renderBoard();
  renderRanks();
  renderMeta();
  updateBestTime();
}

function setCurrentSlotColor(colorIndex) {
  if (state.solved) return;
  ensureTimer();
  const current = state.guesses[state.activeRow] || Array(codeLength).fill(null);
  current[state.selectedSlot] = colorIndex;
  state.guesses[state.activeRow] = current;
}

function moveSlot(direction) {
  if (state.screen !== "game") return;
  state.selectedSlot = (state.selectedSlot + direction + codeLength) % codeLength;
  render();
}

function moveColor(direction) {
  if (state.screen !== "game") return;
  state.selectedColor = (state.selectedColor + direction + palette.length) % palette.length;
  setCurrentSlotColor(state.selectedColor);
  render();
}

function submitGuess() {
  if (state.solved || state.screen !== "game") return;
  const guess = state.guesses[state.activeRow] || [];
  if (guess.length !== codeLength || guess.some((color) => color === null || color === undefined)) {
    flashAttempt("Fill");
    return;
  }

  ensureTimer();
  const feedback = evaluateGuess(guess, state.answer);
  state.feedbacks[state.activeRow] = feedback;

  if (feedback.green === codeLength) {
    winGame();
    return;
  }

  if (state.activeRow >= maxAttempts - 1) {
    loseGame();
    return;
  }

  state.activeRow += 1;
  state.selectedSlot = 0;
  state.guesses[state.activeRow] = Array(codeLength).fill(null);
  render();
}

function flashAttempt(text) {
  const original = attemptDisplay.textContent;
  attemptDisplay.textContent = text;
  window.setTimeout(() => {
    attemptDisplay.textContent = original;
  }, 650);
}

function winGame() {
  state.solved = true;
  stopTimer();
  const ranks = getRanks();
  ranks.push({
    time: state.elapsedMs,
    moves: state.activeRow + 1,
    date: new Date().toISOString(),
  });
  ranks.sort((a, b) => a.time - b.time || a.moves - b.moves);
  setRanks(ranks);
  showResult(true);
  render();
}

function loseGame() {
  stopTimer();
  state.solved = true;
  showResult(false);
  render();
}

function showResult(won) {
  const answerText = state.answer.map((index) => palette[index].name).join(", ");
  resultKicker.textContent = won ? "Solved" : "Case Failed";
  resultTitle.textContent = won ? "Code Cracked" : "No Moves Left";
  resultDetail.textContent = won
    ? `${formatTime(state.elapsedMs)}, solved in ${formatMoves(state.activeRow + 1)}.`
    : `The answer was ${answerText}. Reset keeps the same level answer.`;

  if (typeof resultDialog.showModal === "function") {
    resultDialog.showModal();
  }
}

function resetGame({ keepElapsed = false } = {}) {
  stopTimer();
  state.answer = generateAnswer(state.level, state.mode);
  state.selectedSlot = 0;
  state.selectedColor = 0;
  state.activeRow = 0;
  state.guesses = [Array(codeLength).fill(null)];
  state.feedbacks = [];
  state.startedAt = 0;
  state.elapsedMs = keepElapsed ? state.elapsedMs : 0;
  state.solved = false;
  timerEl.textContent = formatTime(state.elapsedMs);
  render();
}

function setLevel(level) {
  state.level = Math.min(100, Math.max(1, Number(level)));
  resetGame();
}

function setMode(mode) {
  state.mode = mode;
  resetGame();
}

function clearRank() {
  localStorage.removeItem(storageKey());
  render();
}

function bindEvents() {
  document.querySelector("[data-open-game='mastermind']").addEventListener("click", () => {
    showScreen("game");
    render();
  });

  document.querySelector("#backHome").addEventListener("click", () => showScreen("home"));

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  levelRange.addEventListener("input", (event) => setLevel(event.target.value));
  levelSelect.addEventListener("change", (event) => setLevel(event.target.value));
  document.querySelector("#prevLevel").addEventListener("click", () => setLevel(state.level - 1));
  document.querySelector("#nextLevel").addEventListener("click", () => setLevel(state.level + 1));
  document.querySelector("#judgeButton").addEventListener("click", submitGuess);
  document.querySelector("#resetButton").addEventListener("click", () => resetGame());
  document.querySelector("#clearRank").addEventListener("click", clearRank);
  document.querySelector("#dialogReplay").addEventListener("click", () => {
    resultDialog.close();
    resetGame();
  });
  document.querySelector("#dialogNext").addEventListener("click", () => {
    resultDialog.close();
    setLevel(state.level === 100 ? 1 : state.level + 1);
  });

  window.addEventListener("keydown", (event) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "];
    if (!keys.includes(event.key)) return;
    if (state.screen !== "game") return;
    event.preventDefault();

    if (event.key === "ArrowLeft") moveSlot(-1);
    if (event.key === "ArrowRight") moveSlot(1);
    if (event.key === "ArrowUp") moveColor(-1);
    if (event.key === "ArrowDown") moveColor(1);
    if (event.key === "Enter" || event.key === " ") submitGuess();
  });
}

renderLevelOptions();
bindEvents();
resetGame();
showScreen("home");
