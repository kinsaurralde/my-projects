var activeShape;
var gameStatus = "inactive";
var cycleTime = 1000;
var cycleChange = 1000;
var cubes = new Array(10);
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/10KDvI3D-s1Ev3t8t_xiQiyxilwulhu2xJ1fX64N3q0c/edit?usp=sharing';

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
}

function setupArrays() {
  for (i = 0; i < 10; i++) {
    cubes[i] = new Array(20);
  }
}

function reset() {
  activeShape = new ActiveShape(floor(random(1,8)));
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 20; j++) {
      cubes[i][j] = new Cube(i,j);
    }
  }
  waitForCycle();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  runGame();
}

function runGame() {
  drawGrid();
  if (gameStatus == "waiting") {
    waitForCycle();
  } else {
    if (gameStatus == "active") {
      drawCubes();
    }
  }
}

function waitForCycle() {
  if (millis() % cycleTime > cycleTime/2) {
    gameStatus = "active";
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
  scaleStrokeWeight(10);
  stroke(255);
  noFill();
  scaleRect(0, 0, 600, 1200, 10);
  scaleStrokeWeight(1.5);
  stroke(205);
  for (i = -10; i < 11; i++) {
    scaleLine(-300, i * 60, 300, i * 60);
    if (i > -5 && i < 5) {
      scaleLine(i * 60, -600, i * 60, 600);
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

function startGame() {
  gameStatus = "waiting";
  reset();
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
  windowScale = windowWidth / 1920;
  resizeCanvas(windowWidth, (windowWidth * 11 / 16));
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
  stats.update();
  //console.log("Sending:", stats.sendPlays.value, stats.sendWinner.value, stats.sendBotMode.value, stats.sendFPS.Value);
  //document.getElementById("frm1").submit();
}

function showInfo(data, tabletop) {
  sheet = data;
  stats.update();
  redraw();
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}



/****************************** Classes *******************************/

class ActiveShape {
  constructor(shape) {
    this.grid = new Array(4);
    for (var i = 0; i < 4; i++) {
      this.grid[i] = new Array(2);
    }
    if (shape == 1) { // __-- // S Shape
      this.grid[0][0] = 4;
      this.grid[0][1] = 0;
      this.grid[1][0] = 5;
      this.grid[1][1] = 0;
      this.grid[2][0] = 5;
      this.grid[2][1] = 1;
      this.grid[3][0] = 6;
      this.grid[3][1] = 1;
      this.r = 0;
      this.g = 255;
      this.b = 0;
    }

    if (shape == 2) { // --__ // Z Shape
      this.grid[0][0] = 5;
      this.grid[0][1] = 0;
      this.grid[1][0] = 6;
      this.grid[1][1] = 0;
      this.grid[2][0] = 4;
      this.grid[2][1] = 1;
      this.grid[3][0] = 5;
      this.grid[3][1] = 1;
      this.r = 255;
      this.g = 160;
      this.b = 0;
    }

    if (shape == 3) { // -___ // J Shape
      this.grid[0][0] = 4;
      this.grid[0][1] = 0;
      this.grid[1][0] = 4;
      this.grid[1][1] = 1;
      this.grid[2][0] = 5;
      this.grid[2][1] = 1;
      this.grid[3][0] = 6;
      this.grid[3][1] = 1;
      this.r = 0;
      this.g = 0;
      this.b = 255;
    }

    if (shape == 4) { // ___- // L Shape
      this.grid[0][0] = 6;
      this.grid[0][1] = 0;
      this.grid[1][0] = 4;
      this.grid[1][1] = 1;
      this.grid[2][0] = 5;
      this.grid[2][1] = 1;
      this.grid[3][0] = 6;
      this.grid[3][1] = 1;
      this.r = 255;
      this.g = 0;
      this.b = 255;
    }

    if (shape == 5) { // _-_ // T Shape
      this.grid[0][0] = 5;
      this.grid[0][1] = 0;
      this.grid[1][0] = 5;
      this.grid[1][1] = 1;
      this.grid[2][0] = 4;
      this.grid[2][1] = 1;
      this.grid[3][0] = 6;
      this.grid[3][1] = 1;
      this.r = 0;
      this.g = 255;
      this.b = 255;
    }

    if (shape == 6) { // O // O Shape
      this.grid[0][0] = 5;
      this.grid[0][1] = 0;
      this.grid[1][0] = 5;
      this.grid[1][1] = 1;
      this.grid[2][0] = 4;
      this.grid[2][1] = 0;
      this.grid[3][0] = 4;
      this.grid[3][1] = 1;
      this.r = 255;
      this.g = 255;
      this.b = 0;
    }

    if (shape == 7) { // ---- // Line Shape
      this.grid[0][0] = 3;
      this.grid[0][1] = 0;
      this.grid[1][0] = 4;
      this.grid[1][1] = 0;
      this.grid[2][0] = 5;
      this.grid[2][1] = 0;
      this.grid[3][0] = 6;
      this.grid[3][1] = 0;
      this.r = 255;
      this.g = 0;
      this.b = 0;
    }

    this.drop = 0;
    this.moving = false;
    this.active = true;
  }

  draw() {
    if (this.active) {
      if (millis() % cycleTime < cycleTime/2 && millis() > cycleTime) {
        this.drop += 60 / (frameRate() / (2000 / cycleTime));
        //console.log(this.drop,60/frameRate()/2);
        this.moving = true;
      } else {
        this.drop = 0;
        if (this.moving) {
          cycleTime = cycleChange;
          this.grid[0][1] += 1;
          this.grid[1][1] += 1;
          this.grid[2][1] += 1;
          this.grid[3][1] += 1;
          this.moving = false;
        }
      }
    

      this.checkPosition();

      scaleStrokeWeight(4);
      stroke(0);
      fill(this.r, this.g, this.b);
      for (i = 0; i < 4; i++) {
        scaleRect(-270 + this.grid[i][0] * 60, -570 + this.grid[i][1] * 60 + this.drop, 58, 58, 0);
      }
    }
  }

  checkPosition() {
    for (i = 0; i < 4; i++) {
      if (this.grid[i][1] > 18 || cubes[this.grid[i][0]][this.grid[i][1]+1].active) { // shape hits bottom or other shape
        this.active = false;
        for (i = 0; i < 4; i++) {
          //console.log(this.grid[i][0],this.grid[i][1])
          cubes[this.grid[i][0]][this.grid[i][1]].active = true;
          cubes[this.grid[i][0]][this.grid[i][1]].x = this.grid[i][0];
          cubes[this.grid[i][0]][this.grid[i][1]].y = this.grid[i][1];
          cubes[this.grid[i][0]][this.grid[i][1]].r = this.r;
          cubes[this.grid[i][0]][this.grid[i][1]].g = this.g;
          cubes[this.grid[i][0]][this.grid[i][1]].b = this.b;
          activeShape = new ActiveShape(floor(random(1,8)));
        }
      }
    }
  }
}

class Cube {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.active = false;
  }

  draw() {
    if (this.active) {
      //console.log(this.x,this.y,-270 + this.x * 60, -570 + this.y * 60);
      scaleStrokeWeight(4);
      stroke(0);
      fill(this.r, this.g, this.b);
      scaleRect(-270 + this.x * 60, -570 + this.y * 60, 58, 58, 0);
    }
  }
}

class Stat {
  constructor() {
  }

  update() {
  }
}