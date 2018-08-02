var activeShape;
var gameStatus = "inactive";
var gamePaused;
var cycleTime = 1000;
var cycleChange = 1000;
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
  //console.log("Old:",old);
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      rotateTemp[i][j] = old[i][j];
    }
  }
  for (i = 0; i < 4; i++) {
    //rotateTemp[old[i][1]][old[i][0]] = 1;
  }
 // console.log("Step:",rotateTemp);
  rotateTemp = rotateTemp.reverse();
  for (i = 0; i < 3; i++) {
    for (j = 0; j < i; j++) {
      var temp = rotateTemp[i][j];
      rotateTemp[i][j] = rotateTemp[j][i];
      rotateTemp[j][i] = temp;
    }
  }
 // var k = 0;
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      //if (rotateTemp[i][j] == 1) {
      //  console.log(j, i);
      //  activeShape.grid[k][0] = j;
      //  activeShape.grid[k][1] = i;
      //  k++;
      //}
      activeShape.grid[i][j] = rotateTemp[i][j]
    }
  }
  //console.log("New:", activeShape.grid);
}

function reset() {
  gamePaused = false;
  activeShape = new ActiveShape(floor(random(1,8)));
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
}

function waitForCycle() {
  if (millis() % cycleTime > cycleTime / 2) {
    gameStatus = "active";
  }
}

function clearRow(i) {
  console.log("row clearing",i);
  for (j = 0; j < 10; j++) {
    cubes[j][i].active = false;
  }
  dropRows(i-1);
}

function dropRows(start) {
  console.log("Drop rows >",start+1);
  for (i = 0; i < 10; i++) {
    for (j = start; j > 0; j--) {
      if (cubes[i][j].active) {
        cubes[i][j+1].active = true;
        cubes[i][j+1].r = cubes[i][j].r;
        cubes[i][j+1].g = cubes[i][j].g;
        cubes[i][j+1].b = cubes[i][j].b;
        cubes[i][j].active = false;
      }
    }
  }
}

function rotateLine() {
  console.log(1,activeShape.grid);
  /*
  if (activeShape.grid[1][0] == 1) {
    console.log("UP");
    activeShape.grid = [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ];
  } else {
    if (activeShape.grid[0][1] == 1) {
      console.log("LEFT");
      activeShape.grid = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ];
    }
  }
  */
  var rotateTempLine = activeShape.grid;
  console.log(rotateTempLine);
  //for (i = 0; i < 4;i++) {
  //  for (j = 0; j < 4;j++) {
  //    activeShape.grid[i][j] = rotateTempLine[j][i];
  //  }
  //}

  rotateTempLine = rotateTempLine.reverse();
  for (i = 0; i < 4; i++) {
    for (j = 0; j < i; j++) {
      var temp = rotateTempLine[i][j];
      rotateTempLine[i][j] = rotateTempLine[j][i];
      rotateTempLine[j][i] = temp;
    }
  }
  console.log(2,activeShape.grid);
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
  //scaleStrokeWeight(10);
  stroke(255);
  noFill();
  //scaleRect(0, 0, 600, 1200, 10);
  scaleStrokeWeight(1.5);
  stroke(205);
  for (i = -10; i < 11; i++) {
    scaleLine(-300, i * 60, 300, i * 60);
    if (i > -5 && i < 5) {
      scaleLine(i * 60, -600, i * 60, 600);
    }
  }
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
  scaleRect(-725, -90, 480, 92, 16); // New Game
  scaleRect(-725, 90, 480, 92, 16); // Paused
  scaleRect(-725,-400,300,300,16); // Next Shape

  /* Right Side Boxes (Controls) */
  scaleRect(550, 0, 375, 650, 16); // Move Left
  scaleRect(950, 0, 375, 650, 16); // Move Right
  scaleRect(550, -495, 375, 300, 16); // Rotate Left
  scaleRect(950, -495, 375, 300, 16); // Rotate Left
  scaleRect(750, 495, 775, 300, 16); // Speed Up

  noStroke();
  fill(255);
  scaleTextSize(60);

  /* Left Side Text (Info / Setting) */
  scaleText("NEW GAME", -725, -90);
  scaleText("PAUSE", -725, 90);
  scaleTextSize(40);
  scaleText("Next Shape",-725,-500);

  /* Right Side Text (Controls) */
  scaleTextSize(45);
  scaleText("ROTATE LEFT", 550, -495);
  scaleText("ROTATE RIGHT", 950, -495);
  scaleText("MOVE LEFT", 550, 0);
  scaleText("MOVE RIGHT", 950, 0);
  scaleText("SPEED UP", 750, 495);

}

function drawNextShape() {
  var nextActive = new ActiveShape(activeShape.nextShape);
  pattern = nextActive.grid;
  patternColor = color(nextActive.r,nextActive.g,nextActive.b);
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
  //console.log(pattern);
}



/****************************** Buttons *******************************/

function speedUp() {
  cycleChange = 200;
}

function speedNormal() {
  cycleChange = 1000;
}

function speedToggle() {
  if (isMobileDevice()) {
    if (cycleChange == 500) {
      cycleChange = 1000;
    } else {
      cycleChange = 500;
    }
  }
}

function startGame() {
  gameStatus = "waiting";
  reset();
}

function pause() {
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
    //var undo = false;
    //for (i = 0; i < 4; i++) {
      //activeShape.grid[i][0] -= 1;
      console.log("Move Left");
      if (checkMove(-1)) {
        activeShape.xChange -= 1;
      }
    //  if (activeShape.grid[i][0] < 0 || activeShape.grid[i][0] > 9 || cubes[activeShape.grid[i][0]][activeShape.grid[i][1]].active) {
    //    undo = true;
    //  }
    //}
    //if (undo) {
    //  moveRight();
    //}
  }
}

function moveRight() {
  if (gameStatus == "active") {
    //var undo = false;
    //for (i = 0; i < 4; i++) {
      //activeShape.grid[i][0] += 1;
      //activeShape.xChange += 1;
      console.log("Move Right");
      if (checkMove(1)) {
        activeShape.xChange += 1;
      }
      //activeShape.xChange += 1;
    //}
    //if (undo) {
    //  moveLeft();
    //}
  }
}

function checkMove(direction) {
  var undo = false;
  //console.log("MOVE");
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      if (activeShape.grid[j][i] == 1) {
        //console.log(cubes[j + activeShape.xChange][i + activeShape.yChange + 1].active , cubes[j + activeShape.xChange][i + activeShape.yChange].active);
        if (i + activeShape.xChange + direction < 0 || i + activeShape.xChange + direction > 9 || cubes[i + activeShape.xChange + direction][j + activeShape.yChange + 1].active) {
          console.log(activeShape.grid);
          console.log(i,j,i + activeShape.xChange + direction,j + activeShape.yChange + 1);
          console.log(activeShape.xChange,activeShape.yChange,direction);
          // console.log(j + activeShape.xChange  + direction < 0 , j + activeShape.xChange + direction > 9 ,j,i,activeShape.xChange, j + activeShape.xChange,i + activeShape.yChange);
          return false;
        }
      }
    }
  }
  return true; 
}

function rotateLeft() {
  if (activeShape.shape < 6) {
    for (loops = 0; loops < 3; loops++) {
      console.log("RL");
      setupRotate(activeShape.grid);
    }
  } else {
  //  console.log("cant rotate");
    if (activeShape.shape == 7) {
      //setupRotate(activeShape.grid, 4);
      rotateLine();
    }
  }
}

function rotateRight() {
  if (activeShape.shape < 6) {
    console.log("RR");
    setupRotate(activeShape.grid);
  } else {
  //  console.log("cant rotate");
    if (activeShape.shape == 7) {
      //setupRotate(activeShape.grid, 4);
      rotateLine();
    }
  }
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
    this.nextShape = floor(random(1,8));
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
    //console.log(this.grid);
    this.drop = 0;
    this.moving = false;
    this.active = true;
  }

  rotateLeft() {
    setupRotate(this.grid);
  }


  draw() {
    if (this.active) {
      if (gameStatus != "paused" && gameStatus != "waiting") {
        if (millis() % cycleTime < cycleTime / 2 && millis() > cycleTime) {
          this.drop += 60 / (frameRate() / (2000 / cycleTime));
          //console.log(this.drop,60/frameRate()/2);
          this.moving = true;
        } else {
          this.drop = 0;
          if (this.moving) {
            cycleTime = cycleChange;
            //this.grid[0][1] += 1;
            //this.grid[1][1] += 1;
            //this.grid[2][1] += 1;
            //this.grid[3][1] += 1;
            this.yChange++;
            this.moving = false;
          }
        }
      }

      this.checkPosition();
      //checkMove("D");

      scaleStrokeWeight(4);
      stroke(0);
      fill(this.r, this.g, this.b);
      for (i = 0; i < 4; i++) {
        //scaleRect(-270 + this.grid[i][0] * 60, -570 + this.grid[i][1] * 60 + this.drop, 58, 58, 0);
        for (j = 0; j < 4; j++) {
          if (this.grid[i][j] == 1) {
            scaleRect(-270 + (this.xChange + j) * 60, -570 + (this.yChange + i) * 60 + this.drop, 58, 58, 0);
          }
        }
      }
    }
  }

  checkPosition() {
    /*
    for (i = 0; i < 4; i++) {
      if (this.grid[i][1] > 18 || cubes[this.grid[i][0]][this.grid[i][1] + 1].active) { // shape hits bottom or other shape
        this.active = false;
        for (i = 0; i < 4; i++) {
          //console.log(this.grid[i][0],this.grid[i][1])
          cubes[this.grid[i][0]][this.grid[i][1]].active = true;
          cubes[this.grid[i][0]][this.grid[i][1]].x = this.grid[i][0];
          cubes[this.grid[i][0]][this.grid[i][1]].y = this.grid[i][1];
          cubes[this.grid[i][0]][this.grid[i][1]].r = this.r;
          cubes[this.grid[i][0]][this.grid[i][1]].g = this.g;
          cubes[this.grid[i][0]][this.grid[i][1]].b = this.b;
          activeShape = new ActiveShape(floor(random(1, 8)));
        }
      }
    }
    */

   var hit = false;
   for (i = 0; i < 4; i++) {
     for (j = 0; j < 4; j++) {
       if (activeShape.grid[i][j] == 1) {
        // console.log(j + activeShape.xChange,i + activeShape.yChange);
       // console.log(j,activeShape.xChange);
         if (i + activeShape.yChange + 1 > 19 || cubes[j + activeShape.xChange][i + activeShape.yChange + 1].active) {
          hit = true;
         }
       }
     }
   }
   if (hit) {
    this.hit();
    this.checkRows();
    activeShape = new ActiveShape(this.nextShape);
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
          console.log("clear row:",i);
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