const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const customerCountEl = document.getElementById("customer-count");
const patienceEl = document.getElementById("patience");
const haircutEl = document.getElementById("haircut");
const scoreEl = document.getElementById("score");
const startButton = document.getElementById("start");
const cutButton = document.getElementById("cut");
const resetButton = document.getElementById("reset");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

const GAME_WIDTH = 640;
const GAME_HEIGHT = 360;
const CUSTOMERS_TOTAL = 3;
const PATIENCE_MAX = 18;
const HAIRCUT_MAX = 14;

let patience = [];
let haircut = [];
let score = 0;
let gameState = "idle";
let lastTick = 0;
let hairdresserLane = 1;
let hairdresserX = 0;
let hairdresserTargetX = 0;

const palette = {
  skin: "#f2c9b1",
  skin2: "#e0a880",
  hair: "#2a0f4a",
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
  mirror: "#2f2a4f",
  mirrorGlow: "#6ef5ff",
  overlay: "rgba(11, 11, 22, 0.7)",
  outline: "#160b2c",
  lip: "#d96fa8",
  blush: "#f3a0b6",
};

const hairdresserSprite = [
  "........3333333333333333........",
  "......333444444444444433......",
  ".....33444444444444444433.....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3355555555555555555533....",
  "....3351111111111111111133....",
  "....3351112222222222211133....",
  "....3351112000000000211133....",
  "....3351112000000000211133....",
  "....3351112333333333211133....",
  "....3351112333333333211133....",
  "....3351112222222222211133....",
  "....3351111111111111111133....",
  "....3351111111111111111133....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356677777777777776633....",
  "....3356777777777777777663....",
  "....3357777777777777777763....",
  "....3357777777777777777763....",
  "....3337777777777777777733....",
  ".....33333333333333333333.....",
];

const hairdresserMatchaSprite = [
  "........3333333333333333........",
  "......333444444444444433......",
  ".....33444444444444444433.....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3344444444444444444433....",
  "....3355555555555555555533....",
  "....3351111111111111111133....",
  "....3351112222222222211133....",
  "....3351112000000000211133....",
  "....3351112000000000211133....",
  "....3351112333333333211133....",
  "....3351112333333333211133....",
  "....3351112222222222211133....",
  "....3351111111111111111133....",
  "....3351111111111111111133....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356666666666666666633....",
  "....3356677777777777776633....",
  "....3356777777777777777663....",
  "....3357777777777777777763....",
  "....3357777777777777777763....",
  "....3337777777777777777733....",
  ".....33333333333333333333.....",
];

const customerSprite = [
  "........8888888888888888........",
  "......888888888888888888......",
  ".....88889999999999998888.....",
  "....8889999999999999999888....",
  "....8899999999999999999988....",
  "....8899999999999999999988....",
  "....8899999999999999999988....",
  "....8899999999999999999988....",
  "....8899999999999999999988....",
  "....8899111111111111199988....",
  "....8891122222222222111988....",
  "....8891120000000000211988....",
  "....8891120000000000211988....",
  "....8891122333333333211988....",
  "....8891122333333333211988....",
  "....8891122222222222111988....",
  "....8891111111111111199988....",
  "....8891111111111111199988....",
  "....8896666666666666699988....",
  "....8896666666666666699988....",
  "....8896666666666666699988....",
  "....8896666666666666699988....",
  "....8896666666666666699988....",
  "....8896666666666666699988....",
  "....8896666666666666699988....",
  "....8896677777777777699988....",
  "....8896777777777777799988....",
  "....8897777777777777799988....",
  "....8897777777777777799988....",
  "....8887777777777777788888....",
  ".....88888888888888888888.....",
];

const matchaSprite = [
  "............",
  "..cccccccc..",
  ".cccccccccc.",
  ".cccccccccc.",
  ".ccbbbbbbcc.",
  ".ccbbbbbbcc.",
  ".cccccccccc.",
  "..cccccccc..",
  "...ccsscc...",
  "....ssss....",
  "....ssss....",
  "............",
];

const huzzSprite = [
  "hhhhhhhhhhhhhhhh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hzzzzzzzzzzzzzzh",
  "hhhhhhhhhhhhhhhh",
];

const spriteColors = {
  ".": null,
  "0": palette.outline,
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

const pixelSize = 2;
const lanes = [150, 320, 490];

const salonProps = {
  neon: "O'S HAIR",
  posters: ["1987", "STYLE"],
};

const resizeCanvas = () => {
  const { innerWidth, innerHeight } = window;
  const ratio = GAME_WIDTH / GAME_HEIGHT;
  let width = innerWidth * 0.95;
  let height = width / ratio;
  const heightLimit = innerWidth > innerHeight ? innerHeight * 0.75 : innerHeight * 0.55;
  if (height > heightLimit) {
    height = heightLimit;
    width = height * ratio;
  }
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};

const resetGame = () => {
  patience = Array.from({ length: CUSTOMERS_TOTAL }, () => PATIENCE_MAX);
  haircut = Array.from({ length: CUSTOMERS_TOTAL }, () => HAIRCUT_MAX);
  score = 0;
  gameState = "idle";
  hairdresserLane = 1;
  hairdresserX = lanes[hairdresserLane];
  hairdresserTargetX = lanes[hairdresserLane];
  updateHud();
  drawScene();
};

const startGame = () => {
  if (gameState === "playing") return;
  gameState = "playing";
  lastTick = performance.now();
  requestAnimationFrame(gameLoop);
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

const allStyled = () => haircut.every((value) => value <= 0);

const cutHair = () => {
  if (gameState !== "playing") return;
  const idx = hairdresserLane;
  if (haircut[idx] <= 0) return;
  haircut[idx] = Math.max(0, haircut[idx] - 1.2);
  score += 12;
  if (allStyled()) {
    score += Math.floor(patience.reduce((sum, value) => sum + value, 0) * 5);
    winRound();
  }
  updateHud();
};

const moveHairdresser = (direction) => {
  if (gameState === "lose" || gameState === "win") return;
  hairdresserLane = Math.max(0, Math.min(CUSTOMERS_TOTAL - 1, hairdresserLane + direction));
  hairdresserTargetX = lanes[hairdresserLane];
};

const updateHud = () => {
  const activeIndex = hairdresserLane + 1;
  customerCountEl.textContent = `${activeIndex} / ${CUSTOMERS_TOTAL}`;
  patienceEl.textContent = `${patience[hairdresserLane].toFixed(1)}s`;
  haircutEl.textContent = `${haircut[hairdresserLane].toFixed(1)}s`;
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
  ctx.fillRect(0, 280, GAME_WIDTH, 80);

  ctx.fillStyle = "#241339";
  ctx.fillRect(0, 0, GAME_WIDTH, 280);

  ctx.fillStyle = palette.mirror;
  ctx.fillRect(40, 60, 170, 90);
  ctx.strokeStyle = palette.mirrorGlow;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 60, 170, 90);
  ctx.fillRect(235, 60, 170, 90);
  ctx.strokeRect(235, 60, 170, 90);
  ctx.fillRect(430, 60, 170, 90);
  ctx.strokeRect(430, 60, 170, 90);

  ctx.strokeStyle = palette.neon;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 20, 180, 36);
  ctx.fillStyle = palette.neon;
  ctx.font = "14px 'Press Start 2P', monospace";
  ctx.fillText(salonProps.neon, 42, 45);

  ctx.strokeStyle = "#ff4fd8";
  ctx.strokeRect(440, 18, 170, 44);
  ctx.fillStyle = "#ff9f43";
  ctx.font = "10px 'Press Start 2P', monospace";
  ctx.fillText(salonProps.posters[0], 455, 38);
  ctx.fillText(salonProps.posters[1], 455, 54);

  lanes.forEach((x) => {
    ctx.fillStyle = palette.chair;
    ctx.fillRect(x - 30, 235, 60, 46);
    ctx.fillStyle = palette.chair2;
    ctx.fillRect(x - 24, 216, 48, 18);
  });
};

const drawMeter = (label, value, max, x, y, color) => {
  ctx.fillStyle = "#120a24";
  ctx.fillRect(x, y, 120, 10);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, (value / max) * 120, 10);
  ctx.strokeStyle = "#2f1a4e";
  ctx.strokeRect(x, y, 120, 10);
  ctx.fillStyle = palette.text;
  ctx.font = "9px 'Press Start 2P', monospace";
  ctx.fillText(label, x, y - 4);
};

const drawStatusOverlay = () => {
  if (gameState === "playing" || gameState === "idle") return;
  ctx.fillStyle = palette.overlay;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = palette.text;
  ctx.font = "18px 'Press Start 2P', monospace";
  ctx.textAlign = "center";

  if (gameState === "lose") {
    ctx.fillText("HUZZ!", GAME_WIDTH / 2, 140);
    drawSprite(huzzSprite, GAME_WIDTH / 2 - 80, 160, 2);
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.fillText("Customers stormed out!", GAME_WIDTH / 2, 235);
  }

  if (gameState === "win") {
    ctx.fillText("YOU WIN!", GAME_WIDTH / 2, 120);
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.fillText("Matcha break time", GAME_WIDTH / 2, 150);
    drawSprite(hairdresserMatchaSprite, GAME_WIDTH / 2 - 160, 165, 2);
    drawSprite(matchaSprite, GAME_WIDTH / 2 + 70, 210, 3);
  }

  ctx.textAlign = "left";
};

const drawScene = () => {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawSalon();

  lanes.forEach((x, index) => {
    const baseY = 132;
    drawSprite(customerSprite, x - 32, baseY, 2);
    drawMeter("PATIENCE", patience[index], PATIENCE_MAX, x - 60, 110, palette.warn);
    drawMeter("HAIRCUT", haircut[index], HAIRCUT_MAX, x - 60, 126, palette.good);
  });

  drawSprite(hairdresserSprite, hairdresserX - 32, 150, 2);

  drawStatusOverlay();
};

const updateHairdresser = (delta) => {
  const speed = 280;
  if (Math.abs(hairdresserTargetX - hairdresserX) < 1) {
    hairdresserX = hairdresserTargetX;
    return;
  }
  const direction = Math.sign(hairdresserTargetX - hairdresserX);
  hairdresserX += direction * speed * delta;
  if (direction > 0 && hairdresserX > hairdresserTargetX) {
    hairdresserX = hairdresserTargetX;
  }
  if (direction < 0 && hairdresserX < hairdresserTargetX) {
    hairdresserX = hairdresserTargetX;
  }
};

const gameLoop = (timestamp) => {
  if (gameState !== "playing") {
    drawScene();
    return;
  }
  const delta = (timestamp - lastTick) / 1000;
  lastTick = timestamp;

  patience = patience.map((value, index) => {
    const isStyled = haircut[index] <= 0;
    if (isStyled) return value;
    const active = index === hairdresserLane;
    const drain = active ? 0.4 : 0.95;
    return Math.max(0, value - delta * drain);
  });

  updateHairdresser(delta);

  for (let i = 0; i < patience.length; i += 1) {
    if (patience[i] <= 0 && haircut[i] > 0) {
      loseRound();
      break;
    }
  }

  if (allStyled()) {
    winRound();
  }

  updateHud();
  drawScene();
  requestAnimationFrame(gameLoop);
};

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
cutButton.addEventListener("click", cutHair);
leftButton.addEventListener("click", () => moveHairdresser(-1));
rightButton.addEventListener("click", () => moveHairdresser(1));

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
resetGame();

window.addEventListener("touchstart", (event) => {
  if (event.target === cutButton || event.target === leftButton || event.target === rightButton) return;
  if (gameState === "playing") {
    cutHair();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveHairdresser(-1);
  if (event.key === "ArrowRight") moveHairdresser(1);
  if (event.key === " " || event.key === "Enter") cutHair();
});
