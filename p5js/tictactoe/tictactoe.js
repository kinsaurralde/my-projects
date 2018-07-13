var windowScale;
var board = new Array(3);
var message;
var turn = "X";
var notTurn = "O";
var player = true;
var winPattern = false;
var bot;
var tileNumber = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
var patterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],];

function setup() {
  mainCanvas = createCanvas(1, 1);
  background(0);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  mainCanvas.parent('sketch-holder');
  for (i = 0; i < 3; i++) {
    board[i] = new Array(3);
  }
  bot = new Bot(false, "O", "easy");
  newTiles();
  reset();
  setWindowSize();
}

function draw() {
  translate(width / 2, height / 2);
  background(255);
  drawBoard();
}

function mouseClicked() {
  //if (player) {
  // x = mouseX - width / 2;
  // y = mouseY - height / 2;

  //  var i = 1 * round(y / (300 * windowScale)) + 1;
  // var j = 1 * round(x / (300 * windowScale)) + 1;
  //
  //  board[i][j].clicked(turn);
  //}
}

function drawBoard() {
  stroke(0);
  scaleStrokeWeight(20);
  scaleLine(-150, -450, -150, 450); // left
  scaleLine(150, -450, 150, 450); // right
  scaleLine(-450, 150, 450, 150); // down
  scaleLine(-450, -150, 450, -150); // up
  noStroke();
  scaleStrokeWeight(2);
  fill(0);
  scaleTextSize(55);
  scaleText(message + turn, 0, -500);
  drawTiles();
  winningLine();
  botActive();
}

function reset() {
  message = "Turn: ";
  turn = "X";
  winPattern = false;
  resetTiles();
}

function resetTiles() {
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      board[i][j].display = "B";
    }
  }
}

function newTiles() {
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      board[i][j] = new Tile(i, j, (j - 1) * 300, (i - 1) * 300);
    }
  }
}

function drawTiles() {
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      board[i][j].draw();
    }
  }
}

function getBoardFill() {
  var count = 0;
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      if (board[i][j].display != "B") {
        count++;
      }
    }
  }
  return count;
}

function switchTurns() {
  notTurn = turn;
  if (turn == "X") {
    turn = "O";
  } else {
    turn = "X";
  }
  checkForWin();
  console.log("  ");
  console.log(turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn+turn);
  console.log("Turn now:",turn,"Not Turn:",notTurn);
}

function checkForWin(bot) {
  for (i = 0, current = turn; i < 2; i++ , current = notTurn) {
    console.log("Win Check:",current);
    for (a = 0; a < 8; a++) {
      if (board[getTileCoordinateX(patterns[a][0])][getTileCoordinateY(patterns[a][0])].display == current && board[getTileCoordinateX(patterns[a][1])][getTileCoordinateY(patterns[a][1])].display == current && board[getTileCoordinateX(patterns[a][2])][getTileCoordinateY(patterns[a][2])].display == current) {
        if (bot) {
          console.log("Winner will be:",current);
          return true;
        } else {
          console.log("WIN");
          turn = "";
          message = current + " wins!";
          winPattern = a;
          return current;
        }
      }
    }
  }
  if (getBoardFill() == 9) {
    turn = "";
    message = "Tie";
    return false;
  }
  return false;
}

function winningLine() {
  if (winPattern !== false) {
    scaleStrokeWeight(20);
    stroke(0, 255, 0);
    if (winPattern <= 2) {
      m = 125;
      o = 0;
    }
    if (winPattern >= 3 && winPattern <= 5) {
      m = 0;
      o = 125;
    }
    if (winPattern == 6) {
      m = 125;
      o = 125;
    }
    if (winPattern == 7) {
      m = -125;
      o = 125;
    }
    i = getTileCoordinateX(patterns[winPattern][0]);
    j = getTileCoordinateY(patterns[winPattern][0]);
    k = getTileCoordinateX(patterns[winPattern][2]);
    l = getTileCoordinateY(patterns[winPattern][2]);
    scaleLine(board[i][j].x - m, board[i][j].y - o, board[k][l].x + m, board[k][l].y + o);
  }
}

function getTileNumber(i, j) {
  for (a = 0; a < 9; a++) {
    if (tileNumber[a][0] == i && tileNumber[a][1] == j) {
      return a;
    }
  }
}

function getTileCoordinateX(a) {
 // console.log("a =",a);
  try {
    return tileNumber[a][0];
  } catch {}
}

function getTileCoordinateY(a) {
  try {
    return tileNumber[a][1];
  } catch {}
}

function tileClear(num) {
  i = getTileCoordinateX(num);
  j = getTileCoordinateY(num);

 // console.log("Checking:",num,i,j);
  if (board[i][j].display == "B") { 
    console.log("Tile is Cleared:",num);
    return true;
  }
  //console.log("nope");
}

function tileBotClicked(num) {
  i = getTileCoordinateX(num);
  j = getTileCoordinateY(num);

  console.log("Bot Clicked:",num);
  board[i][j].display = turn;
  //console.log("Confirm:",board[i][j].display);

  if (checkForWin(true)) {
    console.log("Winner");
    bot.nextMove = num;
    console.log("Next Move:",bot.nextMove);
    tileUnClicked(num);
    return true;
  }

  i = getTileCoordinateX(num);
  j = getTileCoordinateY(num);
  console.log("Switch Check");
  board[i][j].display = notTurn;
  //console.log("Confirm:",board[i][j].display);

  if (checkForWin(true)) {
    console.log("Winner");
    bot.nextMove = num;
    console.log("Next Move:",bot.nextMove);
    tileUnClicked(num);
    return true;
  }

  tileUnClicked(num);
  return false;
}

function tileClicked(num, isBot) {
  i = getTileCoordinateX(num);
  j = getTileCoordinateY(num);
  console.log("Tile Clicked: "+num,i,j,turn);
  if (bot.active && turn == bot.turn && isBot == false) { // dont allow player to click on bot turn
    return false;
  }
  if (tileClear(num)) {
    console.log("Tile Clicked Success ");
    board[i][j].display = turn;
    switchTurns();
    //return true;
  } 
}

function tileUnClicked(num) {
  i = getTileCoordinateX(num);
  j = getTileCoordinateY(num);
  board[i][j].display = "B";
}

function tileHovered(num) {
  i = getTileCoordinateX(num);
  j = getTileCoordinateY(num);
  //console.log("Tile Hovered:", num, "i:", i, "j:", j);
  board[i][j].hovered = true;
}

function tileUnHovered(num) {
  i = getTileCoordinateX(num);
  j = getTileCoordinateY(num);
  //console.log("Tile UnHovered:", num, "i:", i, "j:", j);
  board[i][j].hovered = false;
}

function easy() {
  console.log("  ");
  console.log("**************************************************");
  console.log("  ");
  console.log("Easy");
  reset();
  bot = new Bot(true, "O", "easy");
}

function botActive() {
  if (bot.active && turn == bot.turn) {
    bot.choose();
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
}

function setWindowSize() { // Resizes canvas and sets windowScale
  windowScale = windowWidth / 1920;
  resizeCanvas(windowWidth, windowWidth * 9 / 16);
}



/****************************** Classes *******************************/

class Tile {
  constructor(i, j, x, y) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.j = j;
    this.display = "B";
    this.hovered = false;
  }

  draw() {
    var current;
    var opacity;
    strokeWeight(10);
    noFill();
    if (this.hovered && this.display == "B") {
      opacity = 100;
      current = turn;
    } else {
      opacity = 255;
      current = this.display;
    }
    if (current == "O") {
      stroke(0,0,255,opacity);
      scaleEllipse(this.x, this.y, 180, 180);
    }
    if (current == "X") {
      stroke(255,0,0,opacity);
      scaleLine(this.x - 100, this.y - 100, this.x + 100, this.y + 100);
      scaleLine(this.x + 100, this.y - 100, this.x - 100, this.y + 100);
    }
  }

  clicked(turn) {
  }
}

class Bot {
  constructor(active, turn, mode) {
    console.log("New Bot");
    console.log("  ");
    this.active = active;
    this.turn = turn;
    this.mode = mode;
    this.nextMove = "";
  }

  choose() {
    //console.log("wdaw",this.winNext());
    if (this.winNext()) {
      console.log("Win Next Move");
      tileClicked(this.nextMove, true);
    } else {
      if (this.mode == "easy") {
        this.easyPick();
        //this.nextMove = int(this.easyPick());
        //console.log("Almost Click:",this.nextMove);
        //tileClicked(this.nextMove, true);
        //switchTurns();
      }
    }
  }

  easyPick() {
    var move = floor(random(0,9));
    console.log("Move: "+move);
    if (tileClear(move)) {
      console.log("Easypick out: "+int(move));
      tileClicked(move, true);
      //return int(move);
    } else {
      console.log("Pick Again");
      this.easyPick();
    }
  }

  winNext() {
    var a;
    this.nextMove = "";
    for (a = 0; a < 9; a++) {
      console.log("Index:",a);
     if (tileClear(a)) {
       //tileBotClicked(a);
       if (tileBotClicked(a)) {
         console.log("a:",a);
         return true;
       }
       //console.log("tesst "+i);
     } else {
      // console.log("non clear");
     }
     //console.log(a);
    //console.log(i,i<9,i++);
    }
    console.log("no win next");
    console.log("  ");
    return false;
  }

}