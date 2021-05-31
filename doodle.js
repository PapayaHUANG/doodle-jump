const grid = document.querySelector(".grid");
const doodler = document.createElement("div");
let doodlerLeftSpace;
let doodlerBottomSpace = 150;
let startBottomSpace = doodlerBottomSpace;
let isGameOver = false;
let platformCount = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let isJumping = true;
let isMovingLeft = true;
let isMovingRight = true;
let leftTimerId;
let rightTimerId;

//Create Doolder
function createDoodler() {
  grid.appendChild(doodler);
  doodler.classList.add("doodler");
  doodlerLeftSpace = platforms[0].left;
  doodler.style.left = `${doodlerLeftSpace}px`;
  doodler.style.bottom = `${doodlerBottomSpace}px`;
}

//Create Platforms
class Platform {
  constructor(platformBottom) {
    this.left = Math.random() * 315;
    this.bottom = platformBottom;
    this.visual = document.createElement("div");

    const visual = this.visual;
    visual.classList.add("platform");
    visual.style.left = this.left + "px";
    visual.style.bottom = this.bottom + "px";
    grid.appendChild(visual);
  }
}

function createPlatforms() {
  for (let i = 0; i < platformCount; i++) {
    let platformGap = 600 / platformCount;
    let platformBottom = 100 + platformGap * i;
    let newPlatform = new Platform(platformBottom);
    platforms.push(newPlatform);
    // console.log(platforms);
  }
}

//Move Platforms(drop dowm)
function movePlatforms() {
  if (doodlerBottomSpace > 200) {
    platforms.forEach((platform) => {
      platform.bottom -= 4;
      let visual = platform.visual;
      visual.style.bottom = platform.bottom + "px";

      if (platform.bottom < 10) {
        let firstPlatform = platforms[0].visual;
        firstPlatform.classList.remove("platform");
        platforms.shift();
        // console.log(platforms);
        let newPlatform = new Platform(600);
        platforms.push(newPlatform);
      }
    });
  }
}

//Doodler Jump and Fall
function jump() {
  isJumping = true;
  clearInterval(downTimerId);
  upTimerId = setInterval(function () {
    doodlerBottomSpace += 30;
    doodler.style.bottom = doodlerBottomSpace + "px";
    if (doodlerBottomSpace > startBottomSpace + 300) {
      fall();
    }
  }, 30);
}

function fall() {
  isJumping = false;
  clearInterval(upTimerId);
  downTimerId = setInterval(function () {
    doodlerBottomSpace -= 5;
    doodler.style.bottom = doodlerBottomSpace + "px";
    if (doodlerBottomSpace <= 0) {
      gameOver();
    }
    platforms.forEach((platform) => {
      if (
        doodlerBottomSpace >= platform.bottom &&
        doodlerBottomSpace <= platform.bottom + 15 &&
        doodlerLeftSpace + 60 >= platform.left &&
        doodlerLeftSpace <= platform.left + 85 &&
        !isJumping
      ) {
        console.log("landed");
        jump();
      }
    });
  }, 30);
}

//Hookup keyboard
function control(e) {
  if (e.key === "ArrowUP") {
    //moveStraight
  }
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key == "ArrowRight") {
    moveRight();
  }
}

function moveLeft() {
  if (isMovingRight) {
    {
      clearInterval(rightTimerId);
      isMovingRight = false;
    }
    isMovingLeft = true;
    leftTimerId = setInterval(function () {
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace + "px";
    }, 30);
  }
}

function moveRight() {
  if (isMovingLeft) {
    {
      clearInterval(leftTimerId);
      isMovingRight = false;
    }
    isMovingRight = true;
    rightTimerId = setInterval(function () {
      doodlerLeftSpace += 5;
      doodler.style.left = doodlerLeftSpace + "px";
    }, 30);
  }
}

function moveStraight() {
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
  isMovingLeft = false;
  isMovingRight = false;
}

//Game Over
function gameOver() {
  isGameOver = true;
  console.log("game over");
  clearInterval(downTimerId);
}

//Start Game
function start() {
  if (!isGameOver) {
    createPlatforms();
    createDoodler();
    setInterval(movePlatforms, 30);
    jump();
    document.addEventListener("keyup", control);
  }
}

//attach to button
start();
