/****************************** Initial variable values *******************************/

var mainCanvas;
var buttonClicked = 0;
var windowScale = 1;
var numX = 9, numY = 9, numMines = 10;
var tiles = new Array(50);
var clicked = false;
var dimension = 1;
var explode = false;
var speed = 90;
var centerX = 0; centerY = 0;
var mouseDown;
var first = false;
var firstX, firstY;
var neighboorCheck = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, 2], [-2, 0], [2, 0]];
var stopper = 0;
var timer = 000, timerStart = 000;
var gameStatus = "inactive";
var face;
var maxTiles = 50;
var height2;
var testMode = false;



/****************************** Setup Window *******************************/

function setup() { // creates canvas and setups first game
  console.log("Minesweeper 002");
  mainCanvas = createCanvas(1, 1);
  background(0);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  mainCanvas.parent('sketch-holder');
  face = new Tile();
  for (i = 0; i < maxTiles; i++) {
    tiles[i] = new Array(maxTiles);
  }
  newTiles();
  setWindowSize();
  removeTiles();
  newGame();
}



/****************************** Constant drawing / Key checking *******************************/

function draw() {
  translate(width / 2, height2 / 2);
  background(255);
  stroke(105);
  strokeWeight(6 * windowScale);
  fill(225);
  scaleRect(0, 0, constrain(numX * dimension, 675, 2000), constrain(numY * dimension, 800, 2000)); // Game board background
  scaleRect(0, -465, constrain(numX * dimension, 675, 2000), 125); // score/timer/reset bar
  strokeWeight(2 * windowScale);
  stroke(180);
  for (i = 0; i < numX; i++) { // background grid
    scaleLine((-((numX / 2) * dimension) + (i * dimension)), -((numY / 2) * dimension), (-((numX / 2) * dimension) + (i * dimension)), (-((numY / 2) * dimension) + (numY * dimension)));
  }
  for (i = 0; i < numY; i++) { // background grid
    scaleLine(-((numX / 2) * dimension), (-((numY / 2) * dimension) + (i * dimension)), (-((numX / 2) * dimension) + (numX * dimension)), (-((numY / 2) * dimension) + (i * dimension)));
  }
  if (gameStatus == "active") {
    timer = nf(round((millis() - timerStart) / 1000), 3);
  }
  tileDraw();
  check();
  tileDrawExplode();
  checkWin();
  if (explode) {
    tilesExplode();
  }
  stroke(105);
  strokeWeight(4 * windowScale);
  noFill();
  scaleRect(0, 0, numX * dimension, numY * dimension);
  scaleRect(0, -465, constrain(numX * dimension, 675, 2000), 125);
  noStroke();
  textSize(60 * windowScale);
  fill(0);
  text(nf(countMines(true), 3), -275 * windowScale, -465 * windowScale);
  text(timer, 270 * windowScale, -465 * windowScale);
  face.displaySmile();
  win();
}

function keyPressed() { //keys used for testing
  if (testMode) {
    if (keyCode == 32) { // Space Bar:

    }
    if (keyCode == 38) { // increase number of tiles in height
      numY = constrain(numY + 1, 4, 20);
      resizeTiles();
    }
    if (keyCode == 40) { // decrease number of tiles in height
      numY = constrain(numY - 1, 4, 20);
      resizeTiles();
    }
    if (keyCode == 37) { // decrease number of tiles in width
      numX = constrain(numX - 1, 4, 20);
      resizeTiles();
    }
    if (keyCode == 39) { // increase number of tiles in width
      numX = constrain(numX + 1, 4, 20);
      resizeTiles();
    }
    if (keyCode == 70) { // F: Explode tiles
      explode = true;
      setExplode();
    }
    if (keyCode == 82) { // R: Reset for new game
      newGame();
    }
    if (keyCode == 83) { // S: Show (check) all tiles
      showAll();
    }
    if (keyCode == 72) { // H: Hide (uncheck) all tiles
      hideAll();
    }
  }
}



/****************************** Inspect Element Console Commands *******************************/

function showAll() { // Show (check) all tiles
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].show();
    }
  }
}

function hideAll() { // H: Hide (uncheck) all tiles
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].hide();
    }
  }
}



/****************************** Window Resizing *******************************/

function windowResized() { // js function runs when window is resized
  setWindowSize();
}

function setWindowSize() { // Resizes canvas and sets windowScale
  windowScale = windowWidth / 1920;
  resizeCanvas(windowWidth, windowWidth * 8 / 16);
  height2 = windowWidth * 9 / 16;
}



/****************************** Reset / Deletes *******************************/

function reset() { // Calls functions necessary to reset game
  hideAll();
  clearMines();
  resetNumbers();
  clearFlags();
  clicks = 0;
  shown = 0;
  error = false;
}

function clearMines() { // Removes all mines
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].mine = false;
    }
  }
}

function clearFlags() { // Removes all flags
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].flag = false;
    }
  }
}

function resetNumbers() { // Resets all tile numbers
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].number = 0;
    }
  }
}

function removeTiles() { // Deletes all tiles
  tiles.length = 0;
  tiles.length = 20;
  for (i = 0; i < maxTiles; i++) {
    tiles[i] = new Array(40);
  }
  newTiles();
}



/****************************** Setups *******************************/

function newGame() { // Sets up and starts new game
  console.log("New Game");
  reset();
  setDimensions();
  widthOutput.innerHTML = numX;
  heightOutput.innerHTML = numY;
  minesOutput.innerHTML = numMines;
  first = true;
  face.face = "happy";
}

function beginner() { // Sets variables for a beginner game
  console.log("Beginner");
  mode = beginner;
  numX = 9;
  numY = 9;
  numMines = 10;
  resizeTiles();
  newGame();
}

function intermediate() { // Sets variables for an intermediate game
  console.log("Intermedaite");
  mode = intermediate;
  numX = 16;
  numY = 16;
  numMines = 40;
  resizeTiles();
  newGame();
}

function expert() { // Sets variables for an expert game
  console.log("Expert");
  mode = expert;
  numX = 30;
  numY = 16;
  numMines = 99;
  resizeTiles();
  newGame();
}

function custom(number, type) { // Sets variables for a custom game
  console.log("Custom");
  if (type == "width") {
    numX = number;
  }
  if (type == "height") {
    numY = number;
  }
  if (type == "mines") {
    numMines = number;
  }
  resizeTiles();
  newGame();
}

function setMines(number) { // Sets placement of mines
  var x;
  var y;
  var mineX = firstX;
  var mineY = firstY;
  var count = 0;
  var count2 = 0;
  var i = 0;
  if (numMines > numX * numY) {
    alerts("Too many mines!");
    gameStatus == "toomanymines";
    return;
  }
  while (i < number && i < numX * numY - 1) {
    x = round(random(0, numX - 1));
    y = round(random(0, numY - 1));
    if (tiles[x][y].mine == false && (x != mineX || y != mineY)) {
      for (j = 0, count = 0, count2 = 0; j < 12; j++) {
        if (x != mineX + neighboorCheck[j][0] || y != mineY + neighboorCheck[j][1] || i > numX * numY - 13) {
          count++;
          try {
            if (tiles[x + neighboorCheck[j][0]][y + neighboorCheck[j][1]].mine == true) {
              count2++;
            }
          } catch { }
        }
      }
      if (count == 12) {
        if (random(0, count2) < 2) {
          tiles[x][y].mine = true;
          i++;
        }
      }
    }
  }
  if (i == numX * numY - 1) {
    numMines = numX * numY - 1;
    minesOutput.innerHTML = numMines;
  }
}

function setNumbers() { // Sets each tiles number based on how many mines nearby
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      if (tiles[i][j].mine == true) {
        neighboors(i + 1, j + 1);
        neighboors(i + 1, j);
        neighboors(i + 1, j - 1);
        neighboors(i, j - 1);
        neighboors(i, j + 1);
        neighboors(i - 1, j + 1);
        neighboors(i - 1, j);
        neighboors(i - 1, j - 1);
      }
    }
  }
}

function setDimensions() { // Sets dimensions of each tile
  dimension = 804 / numY;
  if (numX * dimension > 3000 * windowScale) {
    dimension = 1600 / numX;
  }

  w = dimension;
  h = dimension;
}

function newTiles() { // Creates new tiles
  console.log("New Tiles")
  setDimensions();
  for (i = 0; i < maxTiles; i++) {
    for (j = 0; j < maxTiles; j++) {
      tiles[i][j] = new Tile(i, j, windowScale);
    }
  }
}

function resizeTiles() { // Resizes tiles to fit in window
  console.log("Resize Tiles")
  reset();
  newTiles();
}

function firstClick(i, j) { // places mines after first click
  firstX = i;
  firstY = j;
  clearFlags();
  toggleCustom(false);
  setMines(numMines);
  setNumbers();
  first = false;
  timer = 0;
  timerStart = millis();
  gameStatus = "active";
}



/****************************** Display Tiles *******************************/

function tileDraw() { // Draws all tiles on screen
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].display();
    }
  }
}

function tileDrawExplode() { // Draws explosion if needed
  if (explode) {
    textAlign(CENTER, CENTER);
    textSize(20 * windowScale);
    strokeWeight(1 * windowScale);
    for (i = 0; i < numX; i++) {
      for (j = 0; j < numY; j++) {
        tiles[i][j].displayExplode();
      }
    }
  }
}

function setExplode() { // Gets tiles ready to explode
  explode = true;
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].setExplode();
    }
  }
}

function tilesExplode() { // Calculates new coordinates for each exploding tile
  showAll();
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].explode(speed);
    }
  }
  if (tiles[0][0].yExplode < -1000) {
    explode = false;
  }
}



/****************************** Check user clicks *******************************/

function check() { // Checks which mouse button was used
  if (mouseIsPressed) {
    mouseDown = true;
  } else {
    if (mouseDown == true && !mouseIsPressed) {
      if (mouseButton == "left") {
        checkTiles(mouseX - width / 2, mouseY - height2 / 2, dimension);
      } else {
        flagTile(mouseX - width / 2, mouseY - height2 / 2, dimension);
      }
      mouseDown = false;
    }
  }
}

function checkTiles(x, y, d) { // Determines which tile (or restart) was clicked
  var i = -1 * round(-x / (d * windowScale) - numX / 2 + .5);
  var j = -1 * round(-y / (d * windowScale) - numY / 2 + .5);
  if (i >= 0 && i < numX && j >= 0 && j < numY && tiles[i][j].flag == false) {
    if (first) {
      firstClick(i, j);
    }
    tiles[i][j].clicked();
    stopper = 0;
  }
  if (abs(x) < 45 * windowScale && abs(y + 465 * windowScale) < 45 * windowScale) {
    newGame();
  }
}

function flagTile(x, y, d) { // Toggles flag on clicked tile
  var i = -1 * round(-x / (d * windowScale) - numX / 2 + .5);
  var j = -1 * round(-y / (d * windowScale) - numY / 2 + .5);
  if (i >= 0 && i <= numX && j >= 0 && j <= numY && tiles[i][j].checked == false) {
    tiles[i][j].flag = !tiles[i][j].flag;
  }
}

/****************************** Game Over *******************************/

function checkWin() { // Checks if user won and ends game if true
  if (countTiles() == numX * numY && countMines(true) == 0 && gameStatus == "active" && !error) {
    gameStatus = "win";
    face.face = "win";
    face.displaySmile();
    //alert("sda");
  }
}

function win() {
  if (gameStatus == "win") {
    frameStart = frameCount;
    gameStatus = "waiting";
  }
  if (gameStatus == "waiting") {
    if (frameCount - frameStart > 1) {
      gameStatus = "winalert";
    }
  }
  if (gameStatus == "winalert") {
    console.log("Win");
    alert("You Won in " + timer + " seconds!");
    gameStatus = "inactive";
  } 
}
function gameOver() { // Mine explodes and game ends
  face.face = "dead";
  gameStatus = "inactive";
  setExplode();
}



/****************************** Other  *******************************/

function countTiles() { // Returns number of tiles that are checked or flagged
  count = 0;
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      if (tiles[i][j].checked == true || tiles[i][j].flag == true) {
        count++;
      }
    }
  }
  return count;
}

function countMines(countTiles) { // Returns number of mines or number of mines - flags
  count = 0;
  count2 = 0;
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      if (tiles[i][j].mine == true) {
        count++;
      }
      if (tiles[i][j].flag == true) {
        count2++;
      }
    }
  }
  if (countTiles) {
    return (count - count2);
  } else {
    return count;
  }
}

function alerts(message) { // Alerts an error message
  gameOver();
  error = true;
  for (i = 0; i < numX; i++) {
    for (j = 0; j < numY; j++) {
      tiles[i][j].mine = true;
    }
  }
  alert(message);
}

function neighboors(i, j) {
  try {
    tiles[i][j].number++;
  } catch {
  }
}

function autoClear(x, y) {
  tiles[x][y].checkedAuto = true;
  stopper++;
  if (stopper > 10) {
  }
  for (i = 0; i < 8; i++) {
    var checkX = x + neighboorCheck[i][0];
    var checkY = y + neighboorCheck[i][1];
    try {
      if (tiles[checkX][checkY].checked == false) {
        tiles[checkX][checkY].clicked();
        autoClear(x, y);
      }
    } catch (e) {
      console.log(e);
    }
  }
}



/****************************** Scaled Shapes *******************************/

function scaleTriangle(x1, y1, x2, y2, x3, y3) {
  triangle(x1 * windowScale, y1 * windowScale, x2 * windowScale, y2 * windowScale, x3 * windowScale, y3 * windowScale);
}

function scaleRect(x, y, w, h) {
  rect(x * windowScale, y * windowScale, w * windowScale, h * windowScale);
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



/****************************** Tile Class *******************************/

class Tile {
  constructor(i, j) {
    this.x = -((numX / 2 - .5) * dimension) + (i * dimension);
    this.y = -((numY / 2 - .5) * dimension) + (j * dimension);
    this.i = i;
    this.j = j;
    this.w = dimension;
    this.h = dimension;
    this.checked = false;
    this.checkedAuto = false;
    this.mine = false;
    this.number = 0;
    this.flag = false;
    this.face = "happy";
  }


  display() {
    if (this.checked == false) {
      this.emptyTile();
      if (this.flag) { // flagged tile
        this.flaggedTile();
      }
    } else {
      if (this.mine == true) {
        this.mineTile();
      } else {
        noStroke();
        fill(0);
        textSize(40 * windowScale * dimension / 80);
        textAlign(CENTER);
        if (this.number != 0) {
          text(this.number, this.x * windowScale, this.y * windowScale);
        }
      }
    }
  }

  displayExplode() {
    if (this.flag) {
      fill(0);
      noStroke();
      scaleRect((this.xExplode - 2.4), (this.yExplode), 5 * dimension / 80, 46 * dimension / 80);
      scaleRect((this.xExplode - 2), (this.yExplode + 20), 25 * dimension / 80, 8 * dimension / 80);
      scaleRect((this.xExplode - 2), (this.yExplode + 25), 45 * dimension / 80, 8 * dimension / 80);
      fill(255, 0, 0);
      scaleTriangle(this.xExplode, this.yExplode, this.xExplode, this.yExplode - 28, this.xExplode - 20, this.yExplode - 14);
    } else {
      fill(200);
      scaleRect(this.xExplode, this.yExplode, this.w, this.h);
    }
  }

  clicked() {
    this.checked = true;
    if (this.mine && gameStatus == "active") {
      explode = true;
      gameOver();
    }
    if (this.number == 0 && this.i < numX && this.j < numY) {
      stopper = 0;
      autoClear(this.i, this.j);
    }
  }

  show() {
    this.checked = true;
  }

  hide() {
    this.checked = false;
  }

  setExplode() {
    this.xExplode = this.x;
    this.yExplode = this.y;
    this.theta = atan((this.x - centerX) / (this.y - centerY));
    this.r = sqrt(pow(this.x - centerX, 2) + pow(this.y - centerY, 2));
  }

  explode(speed) {
    this.r = (this.r) + speed;
    this.yExplode = abs(this.r * cos(this.theta)) * (this.yExplode / abs(this.yExplode)) + centerY;
    this.xExplode = abs(this.r * sin(this.theta)) * (this.xExplode / abs(this.xExplode)) + centerX;
  }

  displaySmile() {
    fill(255, 255, 0);
    stroke(0);
    strokeWeight(4 * windowScale);
    scaleEllipse(0, -465, 90, 90);
    if (this.face == "happy") {
      strokeWeight(10 * windowScale);
      scalePoint(-18, -477);
      scalePoint(18, -477);
      strokeWeight(6 * windowScale);
      scaleCurve(-30, -560, -22, -455, 22, -455, 30, -560);
    }
    if (this.face == "win") {
      strokeWeight(6 * windowScale);
      scaleCurve(-30, -560, -22, -455, 22, -455, 30, -560);
      strokeWeight(2 * windowScale);
      fill(0);
      scaleLine(-40, -477, 40, -477);
      scaleEllipse(-18, -477, 24, 18);
      scaleEllipse(18, -477, 24, 18);
    }
    if (this.face == "dead") {
      strokeWeight(6 * windowScale);
      scaleCurve(-30, -350, -22, -445, 22, -445, 30, -350);
      scalePoint(-18, -477);
      scalePoint(18, -477);
      scaleLine(-24, -471, -12, -483);
      scaleLine(-24, -483, -12, -471);
      scaleLine(24, -471, 12, -483);
      scaleLine(24, -483, 12, -471);
    }
  }

  flaggedTile() {
    fill(0);
    noStroke();
    scaleRect((this.x), (this.y + 1.6 * dimension / 80), 5 * dimension / 80, 46 * dimension / 80); // flag pole
    scaleRect((this.x - 2 * dimension / 80), (this.y + 20 * dimension / 80), 25 * dimension / 80, 8 * dimension / 80); // upper base
    scaleRect((this.x - 2 * dimension / 80), (this.y + 25 * dimension / 80), 45 * dimension / 80, 8 * dimension / 80); // lower base
    fill(255, 0, 0);
    scaleTriangle((this.x + 1.6 * dimension / 80) + 1.5, this.y, (this.x + 1.6 * dimension / 80) + 1.5, (this.y - 28 * dimension / 80), (this.x - 20 * dimension / 80), (this.y - 14 * dimension / 80));
  }

  emptyTile() {
    noStroke();
    fill(200);
    strokeWeight(1 * windowScale);
    fill(245); // empty tile
    scaleRect(this.x, this.y, this.w, this.h);
    fill(165);
    scaleTriangle(this.x + this.w / 2, this.y + this.w / 2, this.x + this.w / 2, this.y - this.w / 2, this.x - this.w / 2, this.y + this.w / 2);
    fill(205);
    scaleRect(this.x, this.y, this.w * .9, this.h * .9);
  }

  mineTile() {
    fill(0);
    noStroke();
    scaleEllipse(this.x, this.y, 32 * dimension / 80, 32 * dimension / 80);
    stroke(0);
    strokeWeight(3 * dimension / 80 * windowScale);
    scaleLine(this.x - 18 * dimension / 80, this.y - 18 * dimension / 80, this.x + 18 * dimension / 80, this.y + 18 * dimension / 80);
    scaleLine(this.x - 18 * dimension / 80, this.y + 18 * dimension / 80, this.x + 18 * dimension / 80, this.y - 18 * dimension / 80);
    scaleLine(this.x, this.y - 24 * dimension / 80, this.x, this.y + 24 * dimension / 80);
    scaleLine(this.x - 24 * dimension / 80, this.y, this.x + 24 * dimension / 80, this.y);
    fill(255);
    scaleEllipse(this.x - 5 * dimension / 80, this.y - 5 * dimension / 80, 10 * dimension / 80, 10 * dimension / 80);
  }

}



/****************************** END *******************************/