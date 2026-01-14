const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const customerCountEl = document.getElementById("customer-count");
const patienceEl = document.getElementById("patience");
const haircutEl = document.getElementById("haircut");
const scoreEl = document.getElementById("score");
const startButton = document.getElementById("start");
const cutButton = document.getElementById("cut");
const resetButton = document.getElementById("reset");

const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;
const CUSTOMERS_TOTAL = 3;
const PATIENCE_MAX = 18;
const HAIRCUT_MAX = 14;

let currentCustomer = 0;
let patience = PATIENCE_MAX;
let haircut = HAIRCUT_MAX;
let score = 0;
let gameState = "idle";
let lastTick = 0;
let loopId = null;

const palette = {
  skin: "#f2c9b1",
  skin2: "#e0a880",
  hair: "#3a135a",
  hairHighlight: "#b44bff",
  jacket: "#ff4fd8",
  jacket2: "#ff8cf1",
  shirt: "#4bf1ff",
  pants: "#2d1b44",
  chair: "#4d3a6f",
  chair2: "#6c4f9f",
  floor: "#1b112b",
  neon: "#4bf1ff",
  text: "#f6eaff",
  warn: "#ff9f43",
  good: "#74ff7a",
  cup: "#7adf7f",
  boba: "#1a1a1a",
  straw: "#ff4fd8",
};

const hairdresserSprite = [
  "................",
  "...333333333....",
  "..33444444433...",
  "..33444444433...",
  "..33555555533...",
  "..33511111533...",
  "..33511111533...",
  "..33511111533...",
  "..33511111533...",
  "..33511111533...",
  "..33566666533...",
  "..33566666533...",
  "..33567776533...",
  "..33577777533...",
  "..33377777733...",
  "...333333333....",
];

const hairdresserMatchaSprite = [
  "................",
  "...333333333....",
  "..33444444433...",
  "..33444444433...",
  "..33555555533...",
  "..33511111533...",
  "..33511111533...",
  "..33511111533...",
  "..33511111533...",
  "..33511111533...",
  "..33566666533...",
  "..33566666533...",
  "..33567776533...",
  "..33577777533...",
  "..33377777733...",
  "...333333333....",
];

const customerSprite = [
  "................",
  "....8888888.....",
  "...888888888....",
  "..88889999888...",
  "..88899999988...",
  "..88999999998...",
  "..88999999998...",
  "...889999998....",
  "....1999991.....",
  "....1199911.....",
  "....1122211.....",
  "....1133311.....",
  "....1133311.....",
  "....1333311.....",
  "....3333331.....",
  "....3333331.....",
];

const matchaSprite = [
  "........",
  "..cccc..",
  ".cccccc.",
  ".cccccc.",
  ".cbbbbc.",
  ".cbbbbc.",
  ".cccccc.",
  "..ccs...",
];

const huzzSprite = [
  "hhhhhhhhhh",
  "hzzzzzzzzh",
  "hzzzzzzzzh",
  "hzzzzzzzzh",
  "hzzzzzzzzh",
  "hzzzzzzzzh",
  "hzzzzzzzzh",
  "hhhhhhhhhh",
];

const spriteColors = {
  ".": null,
  "1": palette.skin,
  "2": palette.skin2,
  "3": palette.hair,
  "4": palette.hairHighlight,
  "5": palette.hairHighlight,
  "6": palette.jacket,
  "7": palette.pants,
  "8": palette.hair,
  "9": palette.hairHighlight,
  "c": palette.cup,
  "b": palette.boba,
  "s": palette.straw,
  "h": palette.warn,
  "z": palette.text,
};

const pixelSize = 4;

const salonProps = {
  neon: "O'S HAIR",
  posters: ["1987", "STYLE"],
};

const resizeCanvas = () => {
  const { innerWidth, innerHeight } = window;
  const ratio = GAME_WIDTH / GAME_HEIGHT;
  let width = innerWidth * 0.95;
  let height = width / ratio;
  const heightLimit = innerWidth > innerHeight ? innerHeight * 0.7 : innerHeight * 0.5;
  if (height > heightLimit) {
    height = heightLimit;
    width = height * ratio;
  }
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};

const resetGame = () => {
  currentCustomer = 0;
  patience = PATIENCE_MAX;
  haircut = HAIRCUT_MAX;
  score = 0;
  gameState = "idle";
  updateHud();
  drawScene();
};

const startGame = () => {
  if (gameState === "playing") return;
  gameState = "playing";
  lastTick = performance.now();
  loopId = requestAnimationFrame(gameLoop);
  updateHud();
};

const loseRound = () => {
  gameState = "lose";
  updateHud();
};

const winRound = () => {
  gameState = "win";
  updateHud();
};

const advanceCustomer = () => {
  currentCustomer += 1;
  if (currentCustomer >= CUSTOMERS_TOTAL) {
    winRound();
    return;
  }
  patience = PATIENCE_MAX;
  haircut = HAIRCUT_MAX;
  updateHud();
};

const cutHair = () => {
  if (gameState !== "playing") return;
  haircut = Math.max(0, haircut - 1.2);
  score += 15;
  if (haircut === 0) {
    score += Math.floor(patience * 8);
    advanceCustomer();
  }
  updateHud();
};

const updateHud = () => {
  customerCountEl.textContent = `${Math.min(currentCustomer + 1, CUSTOMERS_TOTAL)} / ${CUSTOMERS_TOTAL}`;
  patienceEl.textContent = `${patience.toFixed(1)}s`;
  haircutEl.textContent = `${haircut.toFixed(1)}s`;
  scoreEl.textContent = score.toString();
  cutButton.disabled = gameState !== "playing";
};

const drawSprite = (sprite, x, y, scale = 1) => {
  sprite.forEach((row, rowIndex) => {
    [...row].forEach((pixel, colIndex) => {
      const color = spriteColors[pixel];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(
        x + colIndex * pixelSize * scale,
        y + rowIndex * pixelSize * scale,
        pixelSize * scale,
        pixelSize * scale
      );
    });
  });
};

const drawSalon = () => {
  ctx.fillStyle = palette.floor;
  ctx.fillRect(0, 210, GAME_WIDTH, 60);

  ctx.fillStyle = "#2d1b44";
  ctx.fillRect(0, 0, GAME_WIDTH, 210);

  ctx.strokeStyle = palette.neon;
  ctx.strokeRect(30, 20, 140, 40);
  ctx.fillStyle = palette.neon;
  ctx.font = "14px 'Courier New', monospace";
  ctx.fillText(salonProps.neon, 44, 45);

  ctx.strokeStyle = "#ff4fd8";
  ctx.strokeRect(330, 18, 110, 44);
  ctx.fillStyle = "#ff9f43";
  ctx.font = "12px 'Courier New', monospace";
  ctx.fillText(salonProps.posters[0], 350, 38);
  ctx.fillText(salonProps.posters[1], 350, 52);

  ctx.fillStyle = palette.chair;
  ctx.fillRect(300, 150, 60, 40);
  ctx.fillStyle = palette.chair2;
  ctx.fillRect(305, 140, 50, 15);
};

const drawMeter = (label, value, max, x, y, color) => {
  ctx.fillStyle = "#120a24";
  ctx.fillRect(x, y, 160, 10);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, (value / max) * 160, 10);
  ctx.strokeStyle = "#2f1a4e";
  ctx.strokeRect(x, y, 160, 10);
  ctx.fillStyle = palette.text;
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillText(label, x, y - 4);
};

const drawStatusOverlay = () => {
  if (gameState === "playing" || gameState === "idle") return;
  ctx.fillStyle = "rgba(11, 11, 22, 0.7)";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = palette.text;
  ctx.font = "16px 'Courier New', monospace";
  ctx.textAlign = "center";

  if (gameState === "lose") {
    ctx.fillText("HUZZ!", GAME_WIDTH / 2, 120);
    drawSprite(huzzSprite, GAME_WIDTH / 2 - 40, 130, 2);
    ctx.fillText("Customer stormed out!", GAME_WIDTH / 2, 190);
  }

  if (gameState === "win") {
    ctx.fillText("YOU WIN!", GAME_WIDTH / 2, 90);
    ctx.fillText("Matcha break time", GAME_WIDTH / 2, 120);
    drawSprite(hairdresserMatchaSprite, GAME_WIDTH / 2 - 120, 130, 2);
    drawSprite(matchaSprite, GAME_WIDTH / 2 - 8, 150, 3);
  }

  ctx.textAlign = "left";
};

const drawScene = () => {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawSalon();

  drawSprite(hairdresserSprite, 80, 110, 2);
  drawSprite(customerSprite, 320, 110, 2);

  drawMeter("PATIENCE", patience, PATIENCE_MAX, 40, 80, palette.warn);
  drawMeter("HAIRCUT", haircut, HAIRCUT_MAX, 280, 80, palette.good);

  drawStatusOverlay();
};

const gameLoop = (timestamp) => {
  if (gameState !== "playing") {
    drawScene();
    return;
  }
  const delta = (timestamp - lastTick) / 1000;
  lastTick = timestamp;
  patience = Math.max(0, patience - delta);
  if (patience === 0) {
    loseRound();
  }
  drawScene();
  loopId = requestAnimationFrame(gameLoop);
};

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
cutButton.addEventListener("click", cutHair);

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
resetGame();

window.addEventListener("touchstart", (event) => {
  if (event.target === cutButton) return;
  if (gameState === "playing") {
    cutHair();
  }
});
