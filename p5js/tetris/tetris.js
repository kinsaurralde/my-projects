var activeShape;
var gameStatus = "inactive";
var gamePaused;
var dropHit;
var cycleTime = 1000;
var cycleChange = 1000;
var stats;
var sheet;
var rotateHolder;
var rotateFail = 0;
var cubes = new Array(10);
var rotateTemp = new Array(3);
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/10KDvI3D-s1Ev3t8t_xiQiyxilwulhu2xJ1fX64N3q0c/edit?usp=sharing';



/****************************** Setups *******************************/

function setup() {
  setupArrays();
  mainCanvas = createCanvas(1, 1);
  background(0);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  mainCanvas.parent('sketch-holder');
  reset();
  setWindowSize();
  stats = new Stat();
  getSheetData();
  gameStatus = "inactive";
}

function setupArrays() {
  for (i = 0; i < 10; i++) {
    cubes[i] = new Array(20);
    if (i < 3) {
      rotateTemp[i] = new Array(3);
      rotateTemp[i][0] = "";
      rotateTemp[i][1] = "";
      rotateTemp[i][2] = "";
    }
  }
}

function setupRotate(old) {
  if (rotateFail < 2) {
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        rotateTemp[i][j] = old[i][j];
      }
    }
    rotateTemp = rotateTemp.reverse();
    for (i = 0; i < 3; i++) {
      for (j = 0; j < i; j++) {
        var temp = rotateTemp[i][j];
        rotateTemp[i][j] = rotateTemp[j][i];
        rotateTemp[j][i] = temp;
      }
    }
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        activeShape.grid[i][j] = rotateTemp[i][j]
      }
    }
    if (rotateFail == 1) {
      rotateFail = 10;
    }
  }
  try {
    activeShape.checkPosition();
  } catch {
    console.log("Cant Rotate");
    rotateFail = 1;
    return true;
  }
}

function reset() {
  console.log("Reset", gameStatus);
  gamePaused = false;
  activeShape = new ActiveShape(floor(random(1, 8)));
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 20; j++) {
      cubes[i][j] = new Cube(i, j);
    }
  }
  waitForCycle();
}



/****************************** Main *******************************/

function draw() {
  background(0);
  translate(width / 2, height / 2);
  runGame();
}

function runGame() {
  drawGrid();
  drawSides();
  drawNextShape();
  if (gameStatus == "waiting") {
    waitForCycle();
  }
  if (gameStatus != "inactive") {
    drawCubes();
  }
  drawGridFrame();
  drawPause();
}

function waitForCycle() {
  console.log("Wait for cycle");
  if (millis() % cycleTime > cycleTime / 2) {
    gameStatus = "active";
  }
}

function clearRow(i) {
  console.log("row clearing", i);
  for (j = 0; j < 10; j++) {
    cubes[j][i].active = false;
  }
  dropRows(i - 1);
}

function dropRows(start) {
  console.log("Drop rows >", start + 1);
  for (i = 0; i < 10; i++) {
    for (j = start; j > 0; j--) {
      if (cubes[i][j].active) {
        cubes[i][j + 1].active = true;
        cubes[i][j + 1].r = cubes[i][j].r;
        cubes[i][j + 1].g = cubes[i][j].g;
        cubes[i][j + 1].b = cubes[i][j].b;
        cubes[i][j].active = false;
      }
    }
  }
}

function rotateLine() {
  var rotateTempLine = activeShape.grid;
  rotateTempLine = rotateTempLine.reverse();
  for (i = 0; i < 4; i++) {
    for (j = 0; j < i; j++) {
      var temp = rotateTempLine[i][j];
      rotateTempLine[i][j] = rotateTempLine[j][i];
      rotateTempLine[j][i] = temp;
    }
  }
}



/****************************** Draws *******************************/

function drawCubes() {
  activeShape.draw();
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 20; j++) {
      cubes[i][j].draw();
    }
  }
}

function drawGrid() {
  stroke(255);
  noFill();
  scaleStrokeWeight(1.5);
  stroke(205);
  for (i = -10; i < 11; i++) {
    scaleLine(-300, i * 60, 300, i * 60);
    if (i > -5 && i < 5) {
      scaleLine(i * 60, -600, i * 60, 600);
    }
  }
  stroke(255, 0, 0);
  scaleStrokeWeight(6);
  scaleLine(-300, -480, 300, -480);
}

function drawGridFrame() {
  scaleStrokeWeight(10);
  stroke(255);
  noFill();
  scaleRect(0, 0, 600, 1200, 10);
}

function drawSides() {
  scaleStrokeWeight(4);
  stroke(255);
  noFill();

  /* Left Side Boxes (Info / Setting) */
  scaleRect(-725, -450, 300, 300, 16); // Next Shape
  scaleRect(-725, -210, 480, 92, 16); // New Game
  scaleRect(-725, -90, 480, 92, 16); // Fullscreen
  scaleRect(-725, 35, 480, 92, 16); // Paused

  /* Right Side Boxes (Controls) */
  scaleRect(550, 0, 375, 650, 16); // Move Left
  scaleRect(950, 0, 375, 650, 16); // Move Right
  scaleRect(550, -495, 375, 300, 16); // Rotate Left
  scaleRect(950, -495, 375, 300, 16); // Rotate Left
  scaleRect(950, 495, 375, 300, 16); // Drop
  if (isMobileDevice()) {
    scaleRect(550, 415, 375, 140, 16); // Speed Up
    scaleRect(550, 575, 375, 140, 16); // Slow Down
  } else {
    scaleRect(550, 495, 375, 300, 16); // Speed Up
  }

  noStroke();
  fill(255);
  scaleTextSize(60);

  /* Left Side Text (Info / Setting) */
  scaleText("NEW GAME", -725, -210);
  scaleText("FULLSCREEN", -725, -90);
  scaleText("PAUSE", -725, 35);
  scaleText("HIGHSCORES", -725, 290);
  scaleText("1:", -900, 435);
  scaleText("2:", -900, 505);
  scaleText("3:", -900, 575);
  scaleTextSize(40);
  scaleText("Next Shape", -725, -545);
  scaleText("LINES CLEARED:", -725, 140);
  scaleText("SCORE:", -725, 215);
  scaleText("SCORE", -775, 360);
  scaleText("LINES", -600, 360);
  drawMiniHighScores();

  /* Right Side Text (Controls) */
  scaleTextSize(45);
  scaleText("ROTATE LEFT", 550, -495);
  scaleText("ROTATE RIGHT", 950, -495);
  scaleText("MOVE LEFT", 550, 0);
  scaleText("MOVE RIGHT", 950, 0);
  scaleText("DROP", 950, 495);
  if (isMobileDevice()) {
    scaleText("SPEED UP", 550, 420);
    scaleText("SLOW DOWN", 550, 575);
  } else {
    scaleText("SPEED UP", 550, 495);
  }
}

function drawMiniHighScores() {
  for (i = 0; i < 3; i++) {
    try {
      scaleText(stats.scores[i], -775, 435 + i * 70); // scores
      scaleText(stats.lines[i], -600, 435 + i * 70); // lines
    } catch {
      scaleText("---", -775, 435 + i * 70); // scores
      scaleText("---", -600, 435 + i * 70); // lines
    }
  }
}

function drawPause() {
  if (activeShape.cycleCount < 3 && gameStatus == "active") {
    scaleStrokeWeight(3);
    stroke(255);
    fill(0);
    scaleRect(0, 0, 200, 200, 16);
    scaleTextSize(150);
    fill(255);
    if (activeShape.cycleCount < 3) {
      scaleText(3 - activeShape.cycleCount, 0, 0);
    }
  }
}

function drawNextShape() {
  var nextActive = new ActiveShape(activeShape.nextShape);
  pattern = nextActive.grid;
  patternColor = color(nextActive.r, nextActive.g, nextActive.b);
  scaleStrokeWeight(4);
  stroke(0);
  fill(patternColor);
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      if (pattern[i][j] == 1 && gameStatus != "inactive") {
        if (activeShape.nextShape < 6) {
          scaleRect(-780 + j * 60, -410 + i * 60, 58, 58, 0);
        } else {
          if (activeShape.nextShape == 6) {
            scaleRect(-750 + j * 60, -410 + i * 60, 58, 58, 0);
          } else {
            scaleRect(-810 + j * 60, -440 + i * 60, 58, 58, 0);
          }
        }
      }
    }
  }
}



/****************************** Buttons *******************************/

function speedUp() {
  cycleChange = 200;
}

function speedNormal() {
  cycleChange = 1000;
}

function speedFast() {
  if (isMobileDevice()) {
    cycleChange = 200;
  }
}

function speedSlow() {
  if (isMobileDevice()) {
    cycleChange = 1000;
  }
}

function drop() {
  console.log("Drop:", activeShape.isHit);
  dropHit = activeShape.isHit;
  while (!dropHit) {
    activeShape.yChange++;
    activeShape.checkPosition();
  }
}

function fullScreen() {
  fullScreen(!fullScreen());
}

function startGame() {
  console.log("Start Game");
  gameStatus = "waiting";
  reset();
}

function pause() {
  console.log("Pause");
  if (gameStatus == "active") {
    gameStatus = "paused";
  } else {
    if (gameStatus == "paused") {
      gameStatus = "waiting";
    }
  }
}

function moveLeft() {
  if (gameStatus == "active") {
    console.log("Move Left");
    if (checkMove(-1)) {
      activeShape.xChange -= 1;
    }
  }
}

function moveRight() {
  if (gameStatus == "active") {
    console.log("Move Right");
    if (checkMove(1)) {
      activeShape.xChange += 1;
    }
  }
}

function checkMove(direction) {
  var undo = false;
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      if (activeShape.grid[j][i] == 1) {
        if (i + activeShape.xChange + direction < 0 || i + activeShape.xChange + direction > 9 || cubes[i + activeShape.xChange + direction][j + activeShape.yChange + 1].active) {
          console.log(activeShape.grid);
          console.log(i, j, i + activeShape.xChange + direction, j + activeShape.yChange + 1);
          console.log(activeShape.xChange, activeShape.yChange, direction);
          return false;
        }
      }
    }
  }
  return true;
}

function rotateLeftStart() {
  rotateFail = 0;
  rotateLeft();
}

function rotateLeft() {
  console.log("Rotate Left");
  //rotateHolder = activeShape.grid;
  //console.log(rotateHolder);
  if (activeShape.shape < 6) {
    for (loops = 0; loops < 3; loops++) {
      if (setupRotate(activeShape.grid)) {
        rotateRight();
      }
    }
  } else {
    if (activeShape.shape == 7) {
      rotateLine();
    }
  }
  //try {
  //  activeShape.checkPosition();
  //} catch {
  //  console.log("Cannot rotate");
  //  activeShape.grid = rotateHolder;
  //}
  //activeShape.grid = rotateHolder;
  //console.log(activeShape.grid,rotateHolder);
}

function rotateRightStart() {
  rotateFail = 0;
  rotateRight();
}

function rotateRight() {
  console.log("Rotate Right");
 //rotateHolder = activeShape.grid;
  if (activeShape.shape < 6) {
    if (setupRotate(activeShape.grid)) {
      rotateLeft();
    }
  } else {
    if (activeShape.shape == 7) {
      rotateLine();
    }
  }
  //try {
  //  activeShape.checkPosition();
  //} catch {
  //  console.log("Cannot Rotate");
  //  activeShape.grid = rotateHolder;
  //}
}

/****************************** Scaled Shapes *******************************/

function scaleTriangle(x1, y1, x2, y2, x3, y3) {
  triangle(x1 * windowScale, y1 * windowScale, x2 * windowScale, y2 * windowScale, x3 * windowScale, y3 * windowScale);
}

function scaleRect(x, y, w, h, c) {
  rect(x * windowScale, y * windowScale, w * windowScale, h * windowScale, c * windowScale);
}

function scaleLine(x1, y1, x2, y2) {
  line(x1 * windowScale, y1 * windowScale, x2 * windowScale, y2 * windowScale);
}

function scaleEllipse(x, y, w, h) {
  ellipse(x * windowScale, y * windowScale, w * windowScale, h * windowScale);
}

function scalePoint(x, y) {
  point(x * windowScale, y * windowScale);
}

function scaleCurve(x1, y1, x2, y2, x3, y3, x4, y4) {
  curve(x1 * windowScale, y1 * windowScale, x2 * windowScale, y2 * windowScale, x3 * windowScale, y3 * windowScale, x4 * windowScale, y4 * windowScale);
}

function scaleStrokeWeight(num) {
  strokeWeight(num * windowScale);
}

function scaleText(txt, x, y) {
  text(txt, x * windowScale, y * windowScale);
}

function scaleTextSize(num) {
  textSize(num * windowScale);
}



/****************************** Window Resizing *******************************/

function windowResized() { // js function runs when window is resized
  setWindowSize();
  redraw();
}

function setWindowSize() { // Resizes canvas and sets windowScale
  windowScale = windowWidth / 2346;
  resizeCanvas(windowWidth, (windowWidth * 9 / 16));
}

function fullScreen() {
  fs = fullscreen();
  fullscreen(!fs);
}



/****************************** Other *******************************/

function getSheetData() {
  Tabletop.getSheetData(
    {
      key: publicSpreadsheetUrl,
      callback: showInfo,
    }
  )
}

function sendData() {
  getSheetData();
  //stats.update();
  //document.getElementById("frm1").submit();
}

function showInfo(data, tabletop) {
  sheet = data;
  stats.update();
  //console.log(sheet["Read"]["elements"]);
  redraw();
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}



/****************************** Classes *******************************/

class ActiveShape {
  constructor(shape) {
    this.nextShape = floor(random(1, 8));
    this.grid = new Array(4);
    this.shape = shape;
    for (var i = 0; i < 4; i++) {
      this.grid[i] = new Array(4);
    }

    if (this.shape == 1) { // __-- // S Shape
      this.grid = [
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.r = 0;
      this.g = 255;
      this.b = 0;
    }

    if (this.shape == 2) { // --__ // Z Shape
      this.grid = [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.r = 255;
      this.g = 160;
      this.b = 0;
    }

    if (this.shape == 3) { // -___ // J Shape
      this.grid = [
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.r = 0;
      this.g = 0;
      this.b = 255;
    }

    if (this.shape == 4) { // ___- // L Shape
      this.grid = [
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.r = 255;
      this.g = 0;
      this.b = 255;
    }

    if (this.shape == 5) { // _-_ // T Shape
      this.grid = [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.r = 0;
      this.g = 255;
      this.b = 255;
    }

    if (this.shape == 6) { // O // O Shape
      this.grid = [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.r = 255;
      this.g = 255;
      this.b = 0;
    }

    if (this.shape == 7) { // ---- // Line Shape
      this.grid = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.r = 255;
      this.g = 0;
      this.b = 0;
    }

    this.yChange = 0;
    this.xChange = 0;
    this.drop = 0;
    this.isHit;
    this.moving = false;
    this.active = true;
    this.cycleCount = 0;
  }

  rotateLeft() {
    setupRotate(this.grid);
  }


  draw() {
    if (this.active) {
      if (gameStatus != "paused" && gameStatus != "waiting") {
        if (millis() % cycleTime < cycleTime / 2 && millis() > cycleTime) {
          if (this.cycleCount > 2) { // 1 less than start delay
            this.drop += 60 / (frameRate() / (2000 / cycleTime));
          }
          this.moving = true;
        } else {
          this.drop = 0;
          if (this.moving) {
            this.cycleCount++;
            cycleTime = cycleChange;
            if (this.cycleCount > 3) { // start delay
              this.yChange++;
            }
            this.moving = false;
          }
        }
      }

      this.checkPosition();

      scaleStrokeWeight(4);
      stroke(0);
      fill(this.r, this.g, this.b);
      for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
          if (this.grid[i][j] == 1) {
            scaleRect(-270 + (this.xChange + j) * 60, -570 + (this.yChange + i) * 60 + this.drop, 58, 58, 0);
          }
        }
      }
    }
  }

  checkPosition() {
    this.isHit = false;
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        if (activeShape.grid[i][j] == 1) {
          if (i + activeShape.yChange + 1 > 19 || cubes[j + activeShape.xChange][i + activeShape.yChange + 1].active) {
            this.isHit = true;
            dropHit = true;
          }
        }
      }
    }
    if (this.isHit) {
      this.hit();
      this.checkRows();
      activeShape = new ActiveShape(this.nextShape);
      gameStatus = "waiting";
      waitForCycle();
    }

  }

  checkRows() {
    var count = 0;
    for (i = 0; i < 20; i++) {
      for (j = 0, count = 0; j < 10; j++) {
        if (cubes[j][i].active) {
          count++;
        }
        if (count > 9) {
          count = 0;
          clearRow(i);
        }
      }
    }
  }

  hit() {
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        if (activeShape.grid[i][j] == 1) {
          cubes[j + activeShape.xChange][i + activeShape.yChange].active = true;
          cubes[j + activeShape.xChange][i + activeShape.yChange].r = this.r;
          cubes[j + activeShape.xChange][i + activeShape.yChange].g = this.g;
          cubes[j + activeShape.xChange][i + activeShape.yChange].b = this.b;
        }
      }
    }
  }
}

class Cube {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.active = false;
  }

  draw() {
    if (this.active) {
      scaleStrokeWeight(4);
      stroke(0);
      fill(this.r, this.g, this.b);
      scaleRect(-270 + this.x * 60, -570 + this.y * 60, 58, 58, 0);
    }
  }
}

class Stat {
  constructor() {
    this.read;
    this.scores;
    this.lines;
  }

  update() {
    this.read = sheet["Read"]["elements"];
    this.scores = new Array(constrain(this.read.length, 1, 50)); // score list cant be more than 50
    this.lines = new Array(constrain(this.read.length, 1, 50)); // line list cant be more than 50
    for (i = 0; i < this.read.length && i < 50; i++) {
      this.scores[i] = this.read[i]["Score"];
      this.lines[i] = this.read[i]["Lines"];
    }
    console.log("Scores:", this.scores, this.lines);
  }
}