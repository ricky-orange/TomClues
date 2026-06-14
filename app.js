const palette = [
  { name: "紅", hex: "#dc2f45", glow: "rgba(220, 47, 69, 0.72)" },
  { name: "綠", hex: "#21c768", glow: "rgba(33, 199, 104, 0.72)" },
  { name: "橙", hex: "#ff8127", glow: "rgba(255, 129, 39, 0.72)" },
  { name: "藍", hex: "#1689ff", glow: "rgba(22, 137, 255, 0.72)" },
  { name: "黃", hex: "#ffd32e", glow: "rgba(255, 211, 46, 0.72)" },
  { name: "紫", hex: "#8d4ce6", glow: "rgba(141, 76, 230, 0.72)" },
  { name: "青", hex: "#4ed7d5", glow: "rgba(78, 215, 213, 0.72)" },
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
};

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

function storageKey() {
  return `mastermind:${state.mode}:level:${state.level}`;
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

function ensureTimer() {
  if (state.startedAt || state.solved) return;
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
  bestTimeEl.textContent = best ? `最佳 ${formatTime(best.time)}` : "最佳 --:--";
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
    button.setAttribute("aria-label", `選擇${color.name}色`);
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
      peg.setAttribute("aria-label", `第 ${rowIndex + 1} 步第 ${slotIndex + 1} 格`);

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
    empty.textContent = "本關還沒有通關紀錄";
    rankingEl.append(empty);
    return;
  }

  ranks.forEach((rank) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${formatTime(rank.time)}</strong> / ${rank.moves} 步`;
    rankingEl.append(item);
  });
}

function renderMeta() {
  const levelName = `Lv. ${String(state.level).padStart(3, "0")}`;
  levelText.textContent = levelName;
  levelRange.value = String(state.level);
  levelSelect.value = String(state.level);
  attemptDisplay.textContent = state.solved ? "OK" : `${Math.min(state.activeRow + 1, maxAttempts)}/${maxAttempts}`;
  modeLabel.textContent = state.mode === "easy" ? "簡單規則" : "難規則";
  ruleNote.textContent = state.mode === "easy"
    ? "每格下方顯示提示：綠色位置正確，白色顏色正確但位置錯，黑色不在答案中。"
    : "右側圓點只顯示數量：綠點位置正確，白點顏色正確但位置錯，黑點不在答案中。";

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
  state.selectedSlot = (state.selectedSlot + direction + codeLength) % codeLength;
  render();
}

function moveColor(direction) {
  state.selectedColor = (state.selectedColor + direction + palette.length) % palette.length;
  setCurrentSlotColor(state.selectedColor);
  render();
}

function submitGuess() {
  if (state.solved) return;
  const guess = state.guesses[state.activeRow] || [];
  if (guess.length !== codeLength || guess.some((color) => color === null || color === undefined)) {
    flashAttempt("填滿");
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
  const answerText = state.answer.map((index) => palette[index].name).join("、");
  resultKicker.textContent = won ? "通關" : "挑戰失敗";
  resultTitle.textContent = won ? "密碼已破譯" : "步數用完";
  resultDetail.textContent = won
    ? `${formatTime(state.elapsedMs)}，第 ${state.activeRow + 1} 步完成。`
    : `答案是 ${answerText}。重來會保留同一關答案。`;

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
