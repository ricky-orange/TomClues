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

const bullsMaxAttempts = 10;
const bullsCodeLength = 4;
const bullsState = {
  level: 1,
  currentGuess: [],
  guesses: [],
  feedbacks: [],
  answer: [],
  activeRow: 0,
  startedAt: 0,
  elapsedMs: 0,
  timerId: 0,
  solved: false,
};

const wordSettings = {
  easy: { label: "Easy", length: 3, attempts: 5 },
  normal: { label: "Normal", length: 5, attempts: 6 },
  hard: { label: "Hard", length: 7, attempts: 8 },
};

const wordLists = {
  easy: [
    "age", "air", "arm", "art", "ask", "bad", "bat", "big", "bit", "box",
    "boy", "bug", "bus", "cat", "cow", "cup", "day", "dog", "ear", "eat",
    "egg", "eye", "fan", "far", "fox", "fun", "gas", "hat", "hen", "hot",
    "ice", "jam", "key", "leg", "man", "map", "net", "new", "old", "pen",
    "pig", "red", "run", "sad", "sea", "sun", "tea", "toy", "web", "yes",
  ],
  normal: [
    "apple", "beach", "black", "bread", "brown", "chair", "child", "class", "clean", "cloud",
    "dream", "drink", "earth", "fruit", "green", "happy", "heart", "honey", "house", "laugh",
    "learn", "light", "lunch", "money", "month", "movie", "music", "night", "paper", "party",
    "phone", "plant", "river", "round", "short", "sleep", "small", "smile", "sound", "speak",
    "stone", "story", "sugar", "sweet", "table", "teach", "train", "watch", "water", "world",
  ],
  hard: [
    "against", "already", "another", "because", "between", "brother", "careful", "central", "control", "country",
    "culture", "example", "evening", "freedom", "healthy", "history", "holiday", "journey", "kitchen", "library",
    "manager", "measure", "message", "million", "morning", "natural", "picture", "popular", "present", "problem",
    "quickly", "science", "service", "special", "station", "student", "subject", "success", "teacher", "traffic",
    "usually", "village", "weather", "website", "western", "without", "writing", "believe", "company", "nothing",
  ],
};

const wordsState = {
  mode: "easy",
  level: 1,
  currentGuess: [],
  guesses: [],
  feedbacks: [],
  answer: "",
  activeRow: 0,
  startedAt: 0,
  elapsedMs: 0,
  timerId: 0,
  solved: false,
};

const slideSettings = {
  easy: { label: "Easy", rows: 2, cols: 3, tiles: 4, blanks: 2, shuffle: 24 },
  medium: { label: "Medium", rows: 3, cols: 3, tiles: 8, blanks: 1, shuffle: 70 },
  hard: { label: "Hard", rows: 4, cols: 4, tiles: 12, blanks: 4, shuffle: 110 },
  hell: { label: "Hell", rows: 4, cols: 4, tiles: 15, blanks: 1, shuffle: 150 },
};

const slideState = {
  mode: "easy",
  level: 1,
  practice: false,
  practiceSeed: 1,
  board: [],
  startedAt: 0,
  elapsedMs: 0,
  timerId: 0,
  moves: 0,
  solved: false,
};

const homeScreen = document.querySelector("#homeScreen");
const gameScreen = document.querySelector("#gameScreen");
const bullsScreen = document.querySelector("#bullsScreen");
const slideScreen = document.querySelector("#slideScreen");
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
const bullsTimerEl = document.querySelector("#bullsTimer");
const bullsBestTimeEl = document.querySelector("#bullsBestTime");
const bullsLevelRange = document.querySelector("#bullsLevelRange");
const bullsLevelSelect = document.querySelector("#bullsLevelSelect");
const bullsLevelText = document.querySelector("#bullsLevelText");
const bullsGuessDisplay = document.querySelector("#bullsGuessDisplay");
const bullsBoard = document.querySelector("#bullsBoard");
const bullsKeypad = document.querySelector("#bullsKeypad");
const bullsAttemptDisplay = document.querySelector("#bullsAttemptDisplay");
const bullsRankingEl = document.querySelector("#bullsRanking");
const wordsScreen = document.querySelector("#wordsScreen");
const wordsModeLabel = document.querySelector("#wordsModeLabel");
const wordsTimerEl = document.querySelector("#wordsTimer");
const wordsBestTimeEl = document.querySelector("#wordsBestTime");
const wordsLevelRange = document.querySelector("#wordsLevelRange");
const wordsLevelSelect = document.querySelector("#wordsLevelSelect");
const wordsLevelText = document.querySelector("#wordsLevelText");
const wordsBoard = document.querySelector("#wordsBoard");
const wordsKeyboard = document.querySelector("#wordsKeyboard");
const wordsAttemptDisplay = document.querySelector("#wordsAttemptDisplay");
const wordsRankingEl = document.querySelector("#wordsRanking");
const wordsRuleNote = document.querySelector("#wordsRuleNote");
const slideModeLabel = document.querySelector("#slideModeLabel");
const slideTimerEl = document.querySelector("#slideTimer");
const slideBestTimeEl = document.querySelector("#slideBestTime");
const slideLevelRange = document.querySelector("#slideLevelRange");
const slideLevelSelect = document.querySelector("#slideLevelSelect");
const slideLevelText = document.querySelector("#slideLevelText");
const slideBoard = document.querySelector("#slideBoard");
const slideMoveDisplay = document.querySelector("#slideMoveDisplay");
const slideRankingEl = document.querySelector("#slideRanking");
const slideRuleNote = document.querySelector("#slideRuleNote");
const slidePracticeButton = document.querySelector("#slidePracticeButton");
const slideShuffleButton = document.querySelector("#slideShuffleButton");

let activeDialogGame = "mastermind";

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

function bullsStorageKey() {
  return `tom-clues:bulls-cows:level:${bullsState.level}`;
}

function wordsStorageKey() {
  return `tom-clues:word-clues:${wordsState.mode}:level:${wordsState.level}`;
}

function slideStorageKey() {
  return `tom-clues:sliding-puzzle:${slideState.mode}:level:${slideState.level}`;
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

function getBullsRanks() {
  try {
    return JSON.parse(localStorage.getItem(bullsStorageKey()) || "[]");
  } catch {
    return [];
  }
}

function setBullsRanks(ranks) {
  localStorage.setItem(bullsStorageKey(), JSON.stringify(ranks.slice(0, 10)));
}

function getWordsRanks() {
  try {
    return JSON.parse(localStorage.getItem(wordsStorageKey()) || "[]");
  } catch {
    return [];
  }
}

function setWordsRanks(ranks) {
  localStorage.setItem(wordsStorageKey(), JSON.stringify(ranks.slice(0, 10)));
}

function getSlideRanks() {
  try {
    return JSON.parse(localStorage.getItem(slideStorageKey()) || "[]");
  } catch {
    return [];
  }
}

function setSlideRanks(ranks) {
  localStorage.setItem(slideStorageKey(), JSON.stringify(ranks.slice(0, 10)));
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

function generateBullsAnswer(level) {
  const random = seededRandom(level * 104729 + 49979687);
  const pool = Array.from({ length: 10 }, (_, index) => index);
  const answer = [];

  while (answer.length < bullsCodeLength) {
    const pick = Math.floor(random() * pool.length);
    answer.push(pool.splice(pick, 1)[0]);
  }

  return answer;
}

function getWordAnswer(mode, level) {
  return wordLists[mode][level - 1];
}

function currentSlideSettings() {
  return slideSettings[slideState.mode];
}

function createSolvedSlideBoard(settings) {
  return [
    ...Array.from({ length: settings.tiles }, (_, index) => index + 1),
    ...Array(settings.rows * settings.cols - settings.tiles).fill(0),
  ];
}

function isSlideSolved(board, settings) {
  const solved = createSolvedSlideBoard(settings);
  return board.every((value, index) => value === solved[index]);
}

function getSlideNeighbors(index, settings) {
  const row = Math.floor(index / settings.cols);
  const col = index % settings.cols;
  const neighbors = [];

  if (row > 0) neighbors.push(index - settings.cols);
  if (row < settings.rows - 1) neighbors.push(index + settings.cols);
  if (col > 0) neighbors.push(index - 1);
  if (col < settings.cols - 1) neighbors.push(index + 1);

  return neighbors;
}

function getAdjacentSlideEmpty(index, board, settings) {
  return getSlideNeighbors(index, settings).find((neighbor) => board[neighbor] === 0);
}

function getSlideMovableIndexes(board, settings) {
  return board
    .map((value, index) => (value && getAdjacentSlideEmpty(index, board, settings) !== undefined ? index : -1))
    .filter((index) => index >= 0);
}

function swapSlideCells(board, from, to) {
  const next = [...board];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

function generateSlideBoard(mode, level, seedOffset = 0) {
  const settings = slideSettings[mode];
  const random = seededRandom(
    level * 1301081
      + settings.tiles * 104729
      + settings.rows * 8191
      + seedOffset * 49999,
  );
  let board = createSolvedSlideBoard(settings);
  let previous = "";

  for (let step = 0; step < settings.shuffle; step += 1) {
    const movable = getSlideMovableIndexes(board, settings);
    const candidates = movable.filter((index) => String(index) !== previous);
    const pool = candidates.length ? candidates : movable;
    const tileIndex = pool[Math.floor(random() * pool.length)];
    const emptyIndex = getAdjacentSlideEmpty(tileIndex, board, settings);
    previous = String(emptyIndex);
    board = swapSlideCells(board, tileIndex, emptyIndex);
  }

  if (isSlideSolved(board, settings)) {
    const tileIndex = getSlideMovableIndexes(board, settings)[0];
    board = swapSlideCells(board, tileIndex, getAdjacentSlideEmpty(tileIndex, board, settings));
  }

  return board;
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

function evaluateBullsGuess(guess, answer) {
  let a = 0;
  let b = 0;

  guess.forEach((digit, index) => {
    if (digit === answer[index]) {
      a += 1;
    } else if (answer.includes(digit)) {
      b += 1;
    }
  });

  return { a, b };
}

function evaluateWordGuess(guessLetters, answerWord) {
  const answer = answerWord.toUpperCase().split("");
  const marks = Array(answer.length).fill("black");
  const remaining = {};

  guessLetters.forEach((letter, index) => {
    if (letter === answer[index]) {
      marks[index] = "green";
    } else {
      remaining[answer[index]] = (remaining[answer[index]] || 0) + 1;
    }
  });

  guessLetters.forEach((letter, index) => {
    if (marks[index] === "green") return;
    if (remaining[letter] > 0) {
      marks[index] = "white";
      remaining[letter] -= 1;
    }
  });

  return marks;
}

function showScreen(screen) {
  state.screen = screen;
  homeScreen.classList.toggle("is-hidden", screen !== "home");
  gameScreen.classList.toggle("is-hidden", screen !== "mastermind");
  bullsScreen.classList.toggle("is-hidden", screen !== "bulls");
  wordsScreen.classList.toggle("is-hidden", screen !== "words");
  slideScreen.classList.toggle("is-hidden", screen !== "slide");
  document.body.classList.toggle("in-game", screen !== "home");

  if (screen === "home") {
    stopTimer();
    stopBullsTimer();
    stopWordsTimer();
    stopSlideTimer();
    if (resultDialog.open) resultDialog.close();
  }
}

function ensureTimer() {
  if (state.startedAt || state.solved || state.screen !== "mastermind") return;
  state.startedAt = Date.now() - state.elapsedMs;
  state.timerId = window.setInterval(() => {
    state.elapsedMs = Date.now() - state.startedAt;
    timerEl.textContent = formatTime(state.elapsedMs);
  }, 250);
}

function ensureBullsTimer() {
  if (bullsState.startedAt || bullsState.solved || state.screen !== "bulls") return;
  bullsState.startedAt = Date.now() - bullsState.elapsedMs;
  bullsState.timerId = window.setInterval(() => {
    bullsState.elapsedMs = Date.now() - bullsState.startedAt;
    bullsTimerEl.textContent = formatTime(bullsState.elapsedMs);
  }, 250);
}

function ensureWordsTimer() {
  if (wordsState.startedAt || wordsState.solved || state.screen !== "words") return;
  wordsState.startedAt = Date.now() - wordsState.elapsedMs;
  wordsState.timerId = window.setInterval(() => {
    wordsState.elapsedMs = Date.now() - wordsState.startedAt;
    wordsTimerEl.textContent = formatTime(wordsState.elapsedMs);
  }, 250);
}

function ensureSlideTimer() {
  if (slideState.startedAt || slideState.solved || state.screen !== "slide") return;
  slideState.startedAt = Date.now() - slideState.elapsedMs;
  slideState.timerId = window.setInterval(() => {
    slideState.elapsedMs = Date.now() - slideState.startedAt;
    slideTimerEl.textContent = formatTime(slideState.elapsedMs);
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

function stopBullsTimer() {
  if (bullsState.timerId) {
    clearInterval(bullsState.timerId);
    bullsState.timerId = 0;
  }
  if (bullsState.startedAt) {
    bullsState.elapsedMs = Date.now() - bullsState.startedAt;
  }
  bullsTimerEl.textContent = formatTime(bullsState.elapsedMs);
}

function stopWordsTimer() {
  if (wordsState.timerId) {
    clearInterval(wordsState.timerId);
    wordsState.timerId = 0;
  }
  if (wordsState.startedAt) {
    wordsState.elapsedMs = Date.now() - wordsState.startedAt;
  }
  wordsTimerEl.textContent = formatTime(wordsState.elapsedMs);
}

function stopSlideTimer() {
  if (slideState.timerId) {
    clearInterval(slideState.timerId);
    slideState.timerId = 0;
  }
  if (slideState.startedAt) {
    slideState.elapsedMs = Date.now() - slideState.startedAt;
  }
  slideTimerEl.textContent = formatTime(slideState.elapsedMs);
}

function updateBestTime() {
  const best = getRanks()[0];
  bestTimeEl.textContent = best ? `Best ${formatTime(best.time)}` : "Best --:--";
}

function updateBullsBestTime() {
  const best = getBullsRanks()[0];
  bullsBestTimeEl.textContent = best ? `Best ${formatTime(best.time)}` : "Best --:--";
}

function updateWordsBestTime() {
  const best = getWordsRanks()[0];
  wordsBestTimeEl.textContent = best ? `Best ${formatTime(best.time)}` : "Best --:--";
}

function updateSlideBestTime() {
  if (slideState.practice) {
    slideBestTimeEl.textContent = "Practice";
    return;
  }

  const best = getSlideRanks()[0];
  slideBestTimeEl.textContent = best ? `Best ${formatTime(best.time)}` : "Best --:--";
}

function renderLevelOptions() {
  levelSelect.innerHTML = "";
  bullsLevelSelect.innerHTML = "";
  wordsLevelSelect.innerHTML = "";
  slideLevelSelect.innerHTML = "";
  for (let level = 1; level <= 100; level += 1) {
    const option = document.createElement("option");
    option.value = String(level);
    option.textContent = `Lv. ${String(level).padStart(3, "0")}`;
    levelSelect.append(option);

    const bullsOption = document.createElement("option");
    bullsOption.value = String(level);
    bullsOption.textContent = `Lv. ${String(level).padStart(3, "0")}`;
    bullsLevelSelect.append(bullsOption);
  }

  for (let level = 1; level <= 50; level += 1) {
    const wordsOption = document.createElement("option");
    wordsOption.value = String(level);
    wordsOption.textContent = `Lv. ${String(level).padStart(3, "0")}`;
    wordsLevelSelect.append(wordsOption);
  }

  for (let level = 1; level <= 25; level += 1) {
    const slideOption = document.createElement("option");
    slideOption.value = String(level);
    slideOption.textContent = `Lv. ${String(level).padStart(3, "0")}`;
    slideLevelSelect.append(slideOption);
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

function renderBullsRanks() {
  const ranks = getBullsRanks();
  bullsRankingEl.innerHTML = "";

  if (!ranks.length) {
    const empty = document.createElement("li");
    empty.className = "empty-rank";
    empty.textContent = "No clears on this level yet";
    bullsRankingEl.append(empty);
    return;
  }

  ranks.forEach((rank) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${formatTime(rank.time)}</strong> / ${formatMoves(rank.moves)}`;
    bullsRankingEl.append(item);
  });
}

function renderWordsRanks() {
  const ranks = getWordsRanks();
  wordsRankingEl.innerHTML = "";

  if (!ranks.length) {
    const empty = document.createElement("li");
    empty.className = "empty-rank";
    empty.textContent = "No clears on this level yet";
    wordsRankingEl.append(empty);
    return;
  }

  ranks.forEach((rank) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${formatTime(rank.time)}</strong> / ${formatMoves(rank.moves)}`;
    wordsRankingEl.append(item);
  });
}

function renderSlideRanks() {
  slideRankingEl.innerHTML = "";

  if (slideState.practice) {
    const practice = document.createElement("li");
    practice.className = "empty-rank";
    practice.textContent = "Practice mode does not record ranking";
    slideRankingEl.append(practice);
    return;
  }

  const ranks = getSlideRanks();
  if (!ranks.length) {
    const empty = document.createElement("li");
    empty.className = "empty-rank";
    empty.textContent = "No clears on this level yet";
    slideRankingEl.append(empty);
    return;
  }

  ranks.forEach((rank) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${formatTime(rank.time)}</strong> / ${formatMoves(rank.moves)}`;
    slideRankingEl.append(item);
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

  document.querySelectorAll(".segment[data-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
}

function renderBullsGuessDisplay() {
  bullsGuessDisplay.innerHTML = "";
  for (let index = 0; index < bullsCodeLength; index += 1) {
    const slot = document.createElement("span");
    slot.textContent = bullsState.currentGuess[index] ?? "_";
    bullsGuessDisplay.append(slot);
  }
}

function renderBullsBoard() {
  bullsBoard.innerHTML = "";

  for (let rowIndex = 0; rowIndex < bullsMaxAttempts; rowIndex += 1) {
    const row = document.createElement("div");
    row.className = "bulls-row";

    const guess = document.createElement("div");
    guess.className = "bulls-guess";
    const digits = bullsState.guesses[rowIndex] || Array(bullsCodeLength).fill("_");
    digits.forEach((digit) => {
      const slot = document.createElement("span");
      slot.textContent = digit;
      guess.append(slot);
    });

    const clue = document.createElement("div");
    clue.className = "bulls-clue";
    const feedback = bullsState.feedbacks[rowIndex];
    clue.textContent = feedback ? `${feedback.a}A ${feedback.b}B` : "--";

    row.append(guess, clue);
    bullsBoard.append(row);
  }
}

function renderBullsKeypad() {
  bullsKeypad.innerHTML = "";
  const used = new Set(bullsState.currentGuess);

  for (let digit = 0; digit <= 9; digit += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "digit-button";
    button.textContent = String(digit);
    button.disabled = used.has(digit) || bullsState.solved;
    button.setAttribute("aria-label", `Enter ${digit}`);
    button.addEventListener("click", () => addBullsDigit(digit));
    bullsKeypad.append(button);
  }
}

function renderBullsMeta() {
  const levelName = `Lv. ${String(bullsState.level).padStart(3, "0")}`;
  bullsLevelText.textContent = levelName;
  bullsLevelRange.value = String(bullsState.level);
  bullsLevelSelect.value = String(bullsState.level);
  bullsAttemptDisplay.textContent = bullsState.solved ? "OK" : `${Math.min(bullsState.activeRow + 1, bullsMaxAttempts)}/${bullsMaxAttempts}`;
}

function currentWordSettings() {
  return wordSettings[wordsState.mode];
}

function renderWordsBoard() {
  const settings = currentWordSettings();
  wordsBoard.innerHTML = "";

  for (let rowIndex = 0; rowIndex < settings.attempts; rowIndex += 1) {
    const row = document.createElement("div");
    row.className = `word-row${rowIndex === wordsState.activeRow && !wordsState.solved ? " active" : ""}`;
    row.style.gridTemplateColumns = `repeat(${settings.length}, minmax(30px, 52px))`;

    const letters = wordsState.guesses[rowIndex]
      || (rowIndex === wordsState.activeRow ? wordsState.currentGuess : [])
      || [];
    const feedback = wordsState.feedbacks[rowIndex] || [];

    for (let slotIndex = 0; slotIndex < settings.length; slotIndex += 1) {
      const cell = document.createElement("div");
      cell.className = "word-cell";

      const letter = letters[slotIndex] || "";
      const mark = feedback[slotIndex] || "";
      const tile = document.createElement("span");
      tile.className = `letter-tile${letter ? " filled" : ""}${mark ? ` ${mark}` : ""}`;
      tile.textContent = letter;
      tile.setAttribute("aria-label", `Attempt ${rowIndex + 1}, letter ${slotIndex + 1}`);

      const clue = document.createElement("span");
      clue.className = `word-clue ${mark}`;

      cell.append(tile, clue);
      row.append(cell);
    }

    wordsBoard.append(row);
  }
}

function renderWordsKeyboard() {
  wordsKeyboard.innerHTML = "";
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  rows.forEach((letters, rowIndex) => {
    const row = document.createElement("div");
    row.className = "word-key-row";

    if (rowIndex === 2) {
      const enter = document.createElement("button");
      enter.type = "button";
      enter.className = "word-action-button";
      enter.textContent = "ENTER";
      enter.disabled = wordsState.solved;
      enter.addEventListener("click", submitWordGuess);
      row.append(enter);
    }

    letters.split("").forEach((letter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "letter-button";
      button.textContent = letter;
      button.disabled = wordsState.solved;
      button.setAttribute("aria-label", `Enter ${letter}`);
      button.addEventListener("click", () => addWordLetter(letter));
      row.append(button);
    });

    if (rowIndex === 2) {
      const erase = document.createElement("button");
      erase.type = "button";
      erase.className = "word-action-button";
      erase.textContent = "DEL";
      erase.disabled = wordsState.solved;
      erase.addEventListener("click", removeWordLetter);
      row.append(erase);
    }

    wordsKeyboard.append(row);
  });
}

function renderWordsMeta() {
  const settings = currentWordSettings();
  const levelName = `Lv. ${String(wordsState.level).padStart(3, "0")}`;
  wordsLevelText.textContent = levelName;
  wordsLevelRange.value = String(wordsState.level);
  wordsLevelSelect.value = String(wordsState.level);
  wordsAttemptDisplay.textContent = wordsState.solved
    ? "OK"
    : `${Math.min(wordsState.activeRow + 1, settings.attempts)}/${settings.attempts}`;
  wordsModeLabel.textContent = settings.label;
  wordsRuleNote.textContent = `Guess the ${settings.length}-letter word in ${settings.attempts} tries. Green means right letter and right spot. White means right letter in the wrong spot.`;

  document.querySelectorAll(".segment[data-word-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.wordMode === wordsState.mode);
  });
}

function renderSlideBoard() {
  const settings = currentSlideSettings();
  const movable = new Set(getSlideMovableIndexes(slideState.board, settings));
  slideBoard.innerHTML = "";
  slideBoard.style.gridTemplateColumns = `repeat(${settings.cols}, minmax(0, 1fr))`;

  slideState.board.forEach((value, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `slide-tile${value ? "" : " empty"}${movable.has(index) ? " movable" : ""}`;
    tile.textContent = value ? String(value) : "";
    tile.disabled = !value || slideState.solved;
    tile.setAttribute("aria-label", value ? `Slide tile ${value}` : "Empty space");
    tile.addEventListener("click", () => moveSlideTile(index));
    slideBoard.append(tile);
  });
}

function renderSlideMeta() {
  const settings = currentSlideSettings();
  const levelName = slideState.practice ? "Practice" : `Lv. ${String(slideState.level).padStart(3, "0")}`;
  slideLevelText.textContent = levelName;
  slideLevelRange.value = String(slideState.level);
  slideLevelSelect.value = String(slideState.level);
  slideLevelRange.disabled = slideState.practice;
  slideLevelSelect.disabled = slideState.practice;
  document.querySelector("#slidePrevLevel").disabled = slideState.practice;
  document.querySelector("#slideNextLevel").disabled = slideState.practice;
  slideMoveDisplay.textContent = slideState.solved ? "OK" : String(slideState.moves);
  slideModeLabel.textContent = settings.label;
  slidePracticeButton.textContent = slideState.practice ? "Practice On" : "Practice Off";
  slidePracticeButton.classList.toggle("active", slideState.practice);
  slideShuffleButton.disabled = !slideState.practice;
  slideRuleNote.textContent = slideState.practice
    ? `Free ${settings.label} board. Practice clears do not enter ranking.`
    : `${settings.label} ranked level. Solve the board in order to record time and moves.`;

  document.querySelectorAll(".segment[data-slide-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.slideMode === slideState.mode);
  });
}

function render() {
  renderPalette();
  renderBoard();
  renderRanks();
  renderMeta();
  updateBestTime();
}

function renderBulls() {
  renderBullsGuessDisplay();
  renderBullsBoard();
  renderBullsKeypad();
  renderBullsRanks();
  renderBullsMeta();
  updateBullsBestTime();
}

function renderWords() {
  renderWordsBoard();
  renderWordsKeyboard();
  renderWordsRanks();
  renderWordsMeta();
  updateWordsBestTime();
}

function renderSlide() {
  renderSlideBoard();
  renderSlideRanks();
  renderSlideMeta();
  updateSlideBestTime();
}

function setCurrentSlotColor(colorIndex) {
  if (state.solved) return;
  ensureTimer();
  const current = state.guesses[state.activeRow] || Array(codeLength).fill(null);
  current[state.selectedSlot] = colorIndex;
  state.guesses[state.activeRow] = current;
}

function moveSlot(direction) {
  if (state.screen !== "mastermind") return;
  state.selectedSlot = (state.selectedSlot + direction + codeLength) % codeLength;
  render();
}

function moveColor(direction) {
  if (state.screen !== "mastermind") return;
  state.selectedColor = (state.selectedColor + direction + palette.length) % palette.length;
  setCurrentSlotColor(state.selectedColor);
  render();
}

function submitGuess() {
  if (state.solved || state.screen !== "mastermind") return;
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

function addBullsDigit(digit) {
  if (bullsState.solved || state.screen !== "bulls") return;
  if (bullsState.currentGuess.length >= bullsCodeLength) return;
  if (bullsState.currentGuess.includes(digit)) {
    flashBullsAttempt("Unique");
    return;
  }

  ensureBullsTimer();
  bullsState.currentGuess.push(digit);
  renderBulls();
}

function removeBullsDigit() {
  if (bullsState.solved || state.screen !== "bulls") return;
  bullsState.currentGuess.pop();
  renderBulls();
}

function submitBullsGuess() {
  if (bullsState.solved || state.screen !== "bulls") return;
  if (bullsState.currentGuess.length !== bullsCodeLength) {
    flashBullsAttempt("Fill");
    return;
  }

  ensureBullsTimer();
  const guess = [...bullsState.currentGuess];
  const feedback = evaluateBullsGuess(guess, bullsState.answer);
  bullsState.guesses[bullsState.activeRow] = guess;
  bullsState.feedbacks[bullsState.activeRow] = feedback;
  bullsState.currentGuess = [];

  if (feedback.a === bullsCodeLength) {
    winBullsGame();
    return;
  }

  if (bullsState.activeRow >= bullsMaxAttempts - 1) {
    loseBullsGame();
    return;
  }

  bullsState.activeRow += 1;
  renderBulls();
}

function addWordLetter(letter) {
  const settings = currentWordSettings();
  if (wordsState.solved || state.screen !== "words") return;
  if (wordsState.currentGuess.length >= settings.length) return;

  ensureWordsTimer();
  wordsState.currentGuess.push(letter.toUpperCase());
  renderWords();
}

function removeWordLetter() {
  if (wordsState.solved || state.screen !== "words") return;
  wordsState.currentGuess.pop();
  renderWords();
}

function submitWordGuess() {
  const settings = currentWordSettings();
  if (wordsState.solved || state.screen !== "words") return;
  if (wordsState.currentGuess.length !== settings.length) {
    flashWordsAttempt("Fill");
    return;
  }

  ensureWordsTimer();
  const guess = [...wordsState.currentGuess];
  const feedback = evaluateWordGuess(guess, wordsState.answer);
  wordsState.guesses[wordsState.activeRow] = guess;
  wordsState.feedbacks[wordsState.activeRow] = feedback;
  wordsState.currentGuess = [];

  if (feedback.every((mark) => mark === "green")) {
    winWordsGame();
    return;
  }

  if (wordsState.activeRow >= settings.attempts - 1) {
    loseWordsGame();
    return;
  }

  wordsState.activeRow += 1;
  renderWords();
}

function moveSlideTile(index) {
  const settings = currentSlideSettings();
  if (slideState.solved || state.screen !== "slide") return;

  const emptyIndex = getAdjacentSlideEmpty(index, slideState.board, settings);
  if (emptyIndex === undefined) return;

  ensureSlideTimer();
  slideState.board = swapSlideCells(slideState.board, index, emptyIndex);
  slideState.moves += 1;

  if (isSlideSolved(slideState.board, settings)) {
    winSlideGame();
    return;
  }

  renderSlide();
}

function moveSlideByKey(key) {
  const settings = currentSlideSettings();
  if (slideState.solved || state.screen !== "slide") return;

  const emptyIndexes = slideState.board
    .map((value, index) => (value === 0 ? index : -1))
    .filter((index) => index >= 0);
  const offsets = {
    ArrowUp: settings.cols,
    ArrowDown: -settings.cols,
    ArrowLeft: 1,
    ArrowRight: -1,
  };
  const offset = offsets[key];
  const emptyIndex = emptyIndexes.find((candidate) => {
    const tileIndex = candidate + offset;
    if (tileIndex < 0 || tileIndex >= slideState.board.length) return false;
    if (key === "ArrowLeft" && Math.floor(candidate / settings.cols) !== Math.floor(tileIndex / settings.cols)) return false;
    if (key === "ArrowRight" && Math.floor(candidate / settings.cols) !== Math.floor(tileIndex / settings.cols)) return false;
    return slideState.board[tileIndex] !== 0;
  });

  if (emptyIndex === undefined) return;
  moveSlideTile(emptyIndex + offset);
}

function flashBullsAttempt(text) {
  const original = bullsAttemptDisplay.textContent;
  bullsAttemptDisplay.textContent = text;
  window.setTimeout(() => {
    bullsAttemptDisplay.textContent = original;
  }, 650);
}

function flashWordsAttempt(text) {
  const original = wordsAttemptDisplay.textContent;
  wordsAttemptDisplay.textContent = text;
  window.setTimeout(() => {
    wordsAttemptDisplay.textContent = original;
  }, 650);
}

function flashAttempt(text) {
  const original = attemptDisplay.textContent;
  attemptDisplay.textContent = text;
  window.setTimeout(() => {
    attemptDisplay.textContent = original;
  }, 650);
}

function winGame() {
  activeDialogGame = "mastermind";
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
  activeDialogGame = "mastermind";
  stopTimer();
  state.solved = true;
  showResult(false);
  render();
}

function winBullsGame() {
  activeDialogGame = "bulls";
  bullsState.solved = true;
  stopBullsTimer();
  const ranks = getBullsRanks();
  ranks.push({
    time: bullsState.elapsedMs,
    moves: bullsState.activeRow + 1,
    date: new Date().toISOString(),
  });
  ranks.sort((a, b) => a.time - b.time || a.moves - b.moves);
  setBullsRanks(ranks);
  showBullsResult(true);
  renderBulls();
}

function loseBullsGame() {
  activeDialogGame = "bulls";
  stopBullsTimer();
  bullsState.solved = true;
  showBullsResult(false);
  renderBulls();
}

function winWordsGame() {
  activeDialogGame = "words";
  wordsState.solved = true;
  stopWordsTimer();
  const ranks = getWordsRanks();
  ranks.push({
    time: wordsState.elapsedMs,
    moves: wordsState.activeRow + 1,
    date: new Date().toISOString(),
  });
  ranks.sort((a, b) => a.time - b.time || a.moves - b.moves);
  setWordsRanks(ranks);
  showWordsResult(true);
  renderWords();
}

function loseWordsGame() {
  activeDialogGame = "words";
  stopWordsTimer();
  wordsState.solved = true;
  showWordsResult(false);
  renderWords();
}

function winSlideGame() {
  activeDialogGame = "slide";
  slideState.solved = true;
  stopSlideTimer();

  if (!slideState.practice) {
    const ranks = getSlideRanks();
    ranks.push({
      time: slideState.elapsedMs,
      moves: slideState.moves,
      date: new Date().toISOString(),
    });
    ranks.sort((a, b) => a.time - b.time || a.moves - b.moves);
    setSlideRanks(ranks);
  }

  showSlideResult();
  renderSlide();
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

function showBullsResult(won) {
  const answerText = bullsState.answer.join("");
  resultKicker.textContent = won ? "Solved" : "Case Failed";
  resultTitle.textContent = won ? "Code Cracked" : "No Moves Left";
  resultDetail.textContent = won
    ? `${formatTime(bullsState.elapsedMs)}, solved in ${formatMoves(bullsState.activeRow + 1)}.`
    : `The answer was ${answerText}. Reset keeps the same level answer.`;

  if (typeof resultDialog.showModal === "function") {
    resultDialog.showModal();
  }
}

function showWordsResult(won) {
  const answerText = wordsState.answer.toUpperCase();
  resultKicker.textContent = won ? "Solved" : "Case Failed";
  resultTitle.textContent = won ? "Word Found" : "No Moves Left";
  resultDetail.textContent = won
    ? `${formatTime(wordsState.elapsedMs)}, solved in ${formatMoves(wordsState.activeRow + 1)}.`
    : `The answer was ${answerText}. Reset keeps the same level answer.`;

  if (typeof resultDialog.showModal === "function") {
    resultDialog.showModal();
  }
}

function showSlideResult() {
  resultKicker.textContent = slideState.practice ? "Practice Clear" : "Solved";
  resultTitle.textContent = "Puzzle Solved";
  resultDetail.textContent = slideState.practice
    ? `${formatTime(slideState.elapsedMs)}, ${formatMoves(slideState.moves)}. Practice clears are not ranked.`
    : `${formatTime(slideState.elapsedMs)}, solved in ${formatMoves(slideState.moves)}.`;

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

function resetBullsGame({ keepElapsed = false } = {}) {
  stopBullsTimer();
  bullsState.answer = generateBullsAnswer(bullsState.level);
  bullsState.currentGuess = [];
  bullsState.guesses = [];
  bullsState.feedbacks = [];
  bullsState.activeRow = 0;
  bullsState.startedAt = 0;
  bullsState.elapsedMs = keepElapsed ? bullsState.elapsedMs : 0;
  bullsState.solved = false;
  bullsTimerEl.textContent = formatTime(bullsState.elapsedMs);
  renderBulls();
}

function resetWordsGame({ keepElapsed = false } = {}) {
  stopWordsTimer();
  wordsState.answer = getWordAnswer(wordsState.mode, wordsState.level);
  wordsState.currentGuess = [];
  wordsState.guesses = [];
  wordsState.feedbacks = [];
  wordsState.activeRow = 0;
  wordsState.startedAt = 0;
  wordsState.elapsedMs = keepElapsed ? wordsState.elapsedMs : 0;
  wordsState.solved = false;
  wordsTimerEl.textContent = formatTime(wordsState.elapsedMs);
  renderWords();
}

function resetSlideGame({ keepElapsed = false, newPractice = false } = {}) {
  stopSlideTimer();
  if (newPractice) {
    slideState.practiceSeed += 1;
  }
  const seedOffset = slideState.practice ? slideState.practiceSeed : 0;
  slideState.board = generateSlideBoard(slideState.mode, slideState.level, seedOffset);
  slideState.startedAt = 0;
  slideState.elapsedMs = keepElapsed ? slideState.elapsedMs : 0;
  slideState.timerId = 0;
  slideState.moves = 0;
  slideState.solved = false;
  slideTimerEl.textContent = formatTime(slideState.elapsedMs);
  renderSlide();
}

function setLevel(level) {
  state.level = Math.min(100, Math.max(1, Number(level)));
  resetGame();
}

function setBullsLevel(level) {
  bullsState.level = Math.min(100, Math.max(1, Number(level)));
  resetBullsGame();
}

function setWordsLevel(level) {
  wordsState.level = Math.min(50, Math.max(1, Number(level)));
  resetWordsGame();
}

function setSlideLevel(level) {
  slideState.level = Math.min(25, Math.max(1, Number(level)));
  resetSlideGame();
}

function setMode(mode) {
  state.mode = mode;
  resetGame();
}

function setWordsMode(mode) {
  wordsState.mode = mode;
  resetWordsGame();
}

function setSlideMode(mode) {
  slideState.mode = mode;
  resetSlideGame({ newPractice: slideState.practice });
}

function toggleSlidePractice() {
  slideState.practice = !slideState.practice;
  resetSlideGame({ newPractice: slideState.practice });
}

function clearRank() {
  localStorage.removeItem(storageKey());
  render();
}

function clearBullsRank() {
  localStorage.removeItem(bullsStorageKey());
  renderBulls();
}

function clearWordsRank() {
  localStorage.removeItem(wordsStorageKey());
  renderWords();
}

function clearSlideRank() {
  if (slideState.practice) return;
  localStorage.removeItem(slideStorageKey());
  renderSlide();
}

function bindEvents() {
  document.querySelector("[data-open-game='mastermind']").addEventListener("click", () => {
    showScreen("mastermind");
    render();
  });

  document.querySelector("[data-open-game='bulls']").addEventListener("click", () => {
    showScreen("bulls");
    renderBulls();
  });

  document.querySelector("[data-open-game='words']").addEventListener("click", () => {
    showScreen("words");
    renderWords();
  });

  document.querySelector("[data-open-game='slide']").addEventListener("click", () => {
    showScreen("slide");
    renderSlide();
  });

  document.querySelector("#backHome").addEventListener("click", () => showScreen("home"));
  document.querySelector("#bullsBackHome").addEventListener("click", () => showScreen("home"));
  document.querySelector("#wordsBackHome").addEventListener("click", () => showScreen("home"));
  document.querySelector("#slideBackHome").addEventListener("click", () => showScreen("home"));

  document.querySelectorAll(".segment[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  document.querySelectorAll(".segment[data-word-mode]").forEach((button) => {
    button.addEventListener("click", () => setWordsMode(button.dataset.wordMode));
  });

  document.querySelectorAll(".segment[data-slide-mode]").forEach((button) => {
    button.addEventListener("click", () => setSlideMode(button.dataset.slideMode));
  });

  levelRange.addEventListener("input", (event) => setLevel(event.target.value));
  levelSelect.addEventListener("change", (event) => setLevel(event.target.value));
  document.querySelector("#prevLevel").addEventListener("click", () => setLevel(state.level - 1));
  document.querySelector("#nextLevel").addEventListener("click", () => setLevel(state.level + 1));
  document.querySelector("#judgeButton").addEventListener("click", submitGuess);
  document.querySelector("#resetButton").addEventListener("click", () => resetGame());
  document.querySelector("#clearRank").addEventListener("click", clearRank);
  bullsLevelRange.addEventListener("input", (event) => setBullsLevel(event.target.value));
  bullsLevelSelect.addEventListener("change", (event) => setBullsLevel(event.target.value));
  document.querySelector("#bullsPrevLevel").addEventListener("click", () => setBullsLevel(bullsState.level - 1));
  document.querySelector("#bullsNextLevel").addEventListener("click", () => setBullsLevel(bullsState.level + 1));
  document.querySelector("#bullsCheckButton").addEventListener("click", submitBullsGuess);
  document.querySelector("#bullsResetButton").addEventListener("click", () => resetBullsGame());
  document.querySelector("#bullsClearRank").addEventListener("click", clearBullsRank);
  wordsLevelRange.addEventListener("input", (event) => setWordsLevel(event.target.value));
  wordsLevelSelect.addEventListener("change", (event) => setWordsLevel(event.target.value));
  document.querySelector("#wordsPrevLevel").addEventListener("click", () => setWordsLevel(wordsState.level - 1));
  document.querySelector("#wordsNextLevel").addEventListener("click", () => setWordsLevel(wordsState.level + 1));
  document.querySelector("#wordsEnterButton").addEventListener("click", submitWordGuess);
  document.querySelector("#wordsResetButton").addEventListener("click", () => resetWordsGame());
  document.querySelector("#wordsClearRank").addEventListener("click", clearWordsRank);
  slideLevelRange.addEventListener("input", (event) => setSlideLevel(event.target.value));
  slideLevelSelect.addEventListener("change", (event) => setSlideLevel(event.target.value));
  document.querySelector("#slidePrevLevel").addEventListener("click", () => setSlideLevel(slideState.level - 1));
  document.querySelector("#slideNextLevel").addEventListener("click", () => setSlideLevel(slideState.level + 1));
  document.querySelector("#slideResetButton").addEventListener("click", () => resetSlideGame());
  document.querySelector("#slideShuffleButton").addEventListener("click", () => resetSlideGame({ newPractice: slideState.practice }));
  document.querySelector("#slideClearRank").addEventListener("click", clearSlideRank);
  slidePracticeButton.addEventListener("click", toggleSlidePractice);
  document.querySelector("#dialogReplay").addEventListener("click", () => {
    resultDialog.close();
    if (activeDialogGame === "bulls") {
      resetBullsGame();
    } else if (activeDialogGame === "words") {
      resetWordsGame();
    } else if (activeDialogGame === "slide") {
      resetSlideGame({ newPractice: slideState.practice });
    } else {
      resetGame();
    }
  });
  document.querySelector("#dialogNext").addEventListener("click", () => {
    resultDialog.close();
    if (activeDialogGame === "bulls") {
      setBullsLevel(bullsState.level === 100 ? 1 : bullsState.level + 1);
    } else if (activeDialogGame === "words") {
      setWordsLevel(wordsState.level === 50 ? 1 : wordsState.level + 1);
    } else if (activeDialogGame === "slide") {
      if (slideState.practice) {
        resetSlideGame({ newPractice: true });
      } else {
        setSlideLevel(slideState.level === 25 ? 1 : slideState.level + 1);
      }
    } else {
      setLevel(state.level === 100 ? 1 : state.level + 1);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (resultDialog.open) return;
    const isLetter = /^[a-z]$/i.test(event.key);
    if (state.screen === "words" && isLetter) {
      event.preventDefault();
      addWordLetter(event.key.toUpperCase());
      return;
    }

    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " ", "Backspace", "Delete"];
    const isDigit = /^[0-9]$/.test(event.key);
    if (state.screen === "bulls" && isDigit) {
      event.preventDefault();
      addBullsDigit(Number(event.key));
      return;
    }
    if (!keys.includes(event.key)) return;
    if (state.screen === "home") return;
    event.preventDefault();

    if (state.screen === "mastermind") {
      if (event.key === "ArrowLeft") moveSlot(-1);
      if (event.key === "ArrowRight") moveSlot(1);
      if (event.key === "ArrowUp") moveColor(-1);
      if (event.key === "ArrowDown") moveColor(1);
      if (event.key === "Enter" || event.key === " ") submitGuess();
    }

    if (state.screen === "bulls") {
      if (event.key === "Backspace" || event.key === "Delete") removeBullsDigit();
      if (event.key === "Enter" || event.key === " ") submitBullsGuess();
    }

    if (state.screen === "words") {
      if (event.key === "Backspace" || event.key === "Delete") removeWordLetter();
      if (event.key === "Enter") submitWordGuess();
    }

    if (state.screen === "slide") {
      if (event.key.startsWith("Arrow")) moveSlideByKey(event.key);
    }
  });
}

renderLevelOptions();
bindEvents();
resetGame();
resetBullsGame();
resetWordsGame();
resetSlideGame();
showScreen("home");
