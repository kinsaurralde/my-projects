var windowScale;
var display;
var status;
var settings;
var scoreL;
var scoreR;
var paddle = new Array(4);
var bot = new Array(2);
var ball;
var countDown;
var showControls = false;
var runLeftUp = false;
var runLeftDown = false;
var runRightUp = false;
var runRightDown = false;
var sheet;
var read;
var plays;
var fpsCount;
var fpsNumber;
var fps;
var stats;
var fs;
var winnerSide;
var winner;
var botPoints;
var playerPoints;
var calcBounceCount = 0;
var calculatedY = 0;
var calculatedX = "NONE";
var lastHit = "5";
var winningScore = 3;
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1opQvnZCR9N9uIy9Imvaehyle8NQ969iJ-IgA19YBvk4/edit#gid=0';

function setup() {
  getSheetData();
  mainCanvas = createCanvas(1, 1);
  background(0);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  mainCanvas.parent('sketch-holder');
  reset();
  setWindowSize();
  stats = new Stat();
}

function getSheetData() {
  Tabletop.getSheetData(
    {
      key: publicSpreadsheetUrl,
      callback: showInfo,
      //simpleSheet: true 
    })
}

function sendData() {
  getSheetData();
  stats.update();
  console.log("Sending:", stats.sendPlays.value, stats.sendWinner.value, stats.sendBotMode.value, stats.sendFPS.Value);
  document.getElementById("frm1").submit();
}

function showInfo(data, tabletop) {
  sheet = data;
  stats.update();
}


function draw() {
  frameRate(60);
  calcFrameRate();
  translate(width / 2, height / 2);
  background(0);
  if (display == "menu") {
    drawMenu();
  } else {
    if (display == "game") {
      drawBoard();
    } else {
      if (display == "more-settings") {
        drawSettings();
      } else {
        if (display == "statistics") {
          drawStatistics();
        }
      }
    }
  }
}

function mouseClicked() {
  if (status != "paused") {
    loop();
  }
}

function reset() {
  display = "menu"
  status = "menu";
  calculatedX = "NONE";
  scoreL = 0;
  scoreR = 0;
  settings = new Setting();
  paddle[0] = new Paddle("L");
  paddle[1] = new Paddle("R");
  ball = new Ball();
  bot[0] = new Bot(0);
  bot[1] = new Bot(1);
  settings.updateHTML();
  settings.showSettings();
  settings.mainMenu.style.visibility = "hidden";
  settings.fullScreen.style.visibility = "hidden";
  fpsCount = 0;
  fpsNumber = 0;
  fps = 0;
  loop();
}

function calcFrameRate() {
  if (frameCount % 180 == 179) {
    fpsCount++;
    fpsNumber += frameRate();
    fps = fpsNumber / fpsCount;
    //console.log("FPS:",fps,frameRate());
  }
}

function drawMenu() {
  settings.updateHTML();
  stroke(255);
  fill(255);
  scaleTextSize(200);
  scaleText("PONG", 0, -300);
  scaleTextSize(50);
  scaleText("PLAYER", 0, 57);
  scaleText("BOT", 0, 137);
  if (!settings.isPlayerL || !settings.isPlayerR) {
    scaleText("EASY", 0, 217);
    scaleText("NORMAL", 0, 297);
    scaleText("IMPOSSIBLE", 0, 377);
  }
  for (i = 0; i < 5; i++) { // white box backgroud for check boxes
    if (i < 2 || !settings.isPlayerL) {
      scaleRect(-200, 57 + 80 * i, 50, 50, 0);
    }
    if (i < 2 || !settings.isPlayerR) {
      scaleRect(200, 57 + 80 * i, 50, 50, 0);
    }
  }
  fill(0);
  for (i = 0; i < 10; i += 2) { // black box check if checkbox == true
    if (settings.checkBoxes[i]) {
      if (i < 4 || !settings.isPlayerL) {
        scaleRect(-200, 57 + 40 * i, 40, 40, 0);
      }
    }
    if (settings.checkBoxes[i + 1]) {
      if (i < 4 || !settings.isPlayerR) {
        scaleRect(200, 57 + 40 * i, 40, 40, 0);
      }
    }
  }
  stroke(255);
  fill(0);
  scaleStrokeWeight(3);
  scaleRect(0, -80, 450, 70, 10, 0);
  scaleRect(-250, 470, 450, 70, 10);
  scaleRect(250, 470, 450, 70, 10);
  stroke(255);
  fill(255);
  scaleTextSize(60);
  scaleStrokeWeight(1);
  scaleText("PLAY", 0, -80);
  scaleTextSize(50);
  scaleText("MORE SETTINGS", -250, 470);
  scaleText("STATISTICS", 250, 470);
  try {
    if (stats.plays > 0) {
      scaleText(("Plays: " + stats.plays), 400, 0);
    }
  } catch {
  }
  noLoop();
}

function drawBoard() {
  stroke(255);
  fill(255);
  scaleStrokeWeight(2);
  scaleTextSize(120);
  scaleText(scoreL, -160, -450);
  scaleText(scoreR, 160, -450);
  scaleStrokeWeight(1);
  for (i = -10; i < 11; i++) {
    scaleRect(0, i * 50, 10, 25, 0);
  }
  paddle[2] = paddle[0].y;
  paddle[3] = paddle[1].y;
  if (status == "countdown") {
    checkInput("");
    ball.draw();
  }
  if (status == "active") {
    checkInput("");
    ball.move();
  } else {
    if (status == "paused") {
      paddle[0].draw();
      paddle[1].draw();
      ball.draw();
    }
  }
  drawPause();
  drawCount();
  drawTrajectory();
  bot[0].move();
  bot[1].move();
}

function startInput(direction) {
  if (direction == "left-up") { // w up
    runLeftUp = true;
  }
  if (direction == "left-down") { // s down
    runLeftDown = true;
  }
  if (direction == "right-up") { // o up
    runRightUp = true;
  }
  if (direction == "right-down") { // k down
    runRightDown = true;
  }
}

function endInput(direction) {
  if (direction == "left-up") { // w up
    runLeftUp = false;
  }
  if (direction == "left-down") { // s down
    runLeftDown = false;
  }
  if (direction == "right-up") { // o up
    runRightUp = false;
  }
  if (direction == "right-down") { // k down
    runRightDown = false;
  }
}


function checkInput(direction) {
  var speed = paddle[0].speed;
  if ((keyIsDown(87) || runLeftUp) && settings.isPlayerL) { // w up
    paddle[0].move("left-up", speed);
  }
  if ((keyIsDown(83) || runLeftDown) && settings.isPlayerL) { // s down
    paddle[0].move("left-down", speed);
  }
  if ((keyIsDown(79) || runRightUp) && settings.isPlayerR) { // o up
    paddle[1].move("right-up", speed);
  }
  if ((keyIsDown(75) || runRightDown) && settings.isPlayerR) { // k down
    paddle[1].move("right-down", speed);
  }

  if (direction != "") {
    paddle[0].move(direction, speed);
    paddle[1].move(direction, speed);
  }
  paddle[0].draw();
  paddle[1].draw();
}

function drawPause() {
  if (status == "paused") {
    noStroke();
    fill(0, 0, 0, 200);
    scaleRect(0, 0, width * 2, height * 2, 0);
    if (showControls) {
      drawControls();
    }
    noFill();
    stroke(255);
    scaleStrokeWeight(3);
    scaleRect(0, 475, 380, 72, 10);
    scaleRect(0, -61, 380, 72, 10);
    fill(255);
    noStroke();
    scaleStrokeWeight(1);
    scaleTextSize(50);
    scaleText("MAIN MENU", 0, 475);
    scaleText("FULLSCREEN", 0, -61);
  }
}

function drawControls() {
  stroke(255);
  noFill();
  scaleStrokeWeight(3);
  scaleRect(-586, -268, 725, 520, 10);
  scaleRect(-586, 268, 725, 520, 10);
  scaleRect(586, -268, 725, 520, 10);
  scaleRect(586, 268, 725, 520, 10);
  scaleRect(0, 0, 415, 1056, 10);
  fill(255);
  noStroke();
  scaleTextSize(80);
  scaleText("LEFT UP", -586, -420);
  scaleText("LEFT DOWN", -586, 116);
  scaleText("RIGHT UP", 586, -420);
  scaleText("RIGHT DOWN", 586, 116);
  scaleText("PAUSE", 0, -420);
  scaleText("RESUME", 0, 116);
  scaleTextSize(40);
  scaleText("Click This Box", -586, -268);
  scaleText("or", -586, -218);
  scaleText("Press W", -586, -168);
  scaleText("Click This Box", -586, 268);
  scaleText("or", -586, 318);
  scaleText("Press S", -586, 368);
  scaleText("Click This Box", 586, -268);
  scaleText("or", 586, -218);
  scaleText("Press O", 586, -168);
  scaleText("Click This Box", 586, 268);
  scaleText("or", 586, 318);
  scaleText("Press K", 586, 368);
  scaleText("Click This Box", 0, -286);
  scaleText("or", 0, -218);
  scaleText("Press Space", 0, -168);
  scaleText("Click", 0, 268);
  scaleText("or", 0, 318);
  scaleText("Press Space", 0, 368);
}

function drawSettings() {
  noFill();
  stroke(255);
  scaleStrokeWeight(3);
  scaleRect(0, 475, 380, 72, 10); // main Menu

  fill(255);
  scaleRect(-325, -50, 400, 50, 0); // paddle speed
  scaleRect(325, -50, 400, 50, 0); // ball speed
  scaleRect(-325, 50, 400, 50, 0); // winning score
  scaleRect(325, 50, 400, 50, 0); // ball speed increase

  settings.updateSliders();
  fill(0);
  noStroke();
  scaleRect(-250, -50, 40, 40, 0); // paddle speed
  scaleRect(34 + int(ball.speed) * 11.6, -50, 40, 40, 0); // ball speed
  scaleRect(-350, 50, 40, 40, 0); // winning score
  scaleRect(350, 50, 40, 40, 0); // ball speed increase

  fill(255);
  noStroke();
  scaleStrokeWeight(1);
  scaleTextSize(50);
  scaleText("MAIN MENU", 0, 475);
  scaleTextSize(32);
  textAlign(RIGHT, CENTER);
  scaleText("PADDLE SPEED", -550, -50);
  scaleText("WINNING SCORE", -550, 50);
  textAlign(LEFT, CENTER);
  scaleText("BALL SPEED", 550, -50);
  scaleText("BALL SPEED INCREASE", 550, 50);

  textAlign(CENTER, CENTER);
  scaleTextSize(40);
  scaleText(paddle[0].speed, -75, -50);
  scaleText(ball.speed, 75, -50);
  scaleText(settings.winningScore, -75, 50);
  scaleText(ball.speedIncrease, 75, 50);

  scaleTextSize(200);
  scaleText("PONG", 0, -300);
}

function drawStatistics() {
  noFill();
  stroke(255);
  scaleStrokeWeight(3);
  scaleRect(0, 475, 380, 72, 10); // main Menu

  fill(255);
  noStroke();
  scaleRect(0, 200, 600, 50, 0);
  scaleRect(0, 350, 600, 50, 0);

  fill(255);
  noStroke();
  scaleStrokeWeight(1);
  if (status == "menu") {
    scaleTextSize(200);
    scaleText("PONG", 0, -300);
  } else {
    scaleTextSize(140);
    scaleText("GAME OVER", 0, -400);
    scaleTextSize(80);
    scaleText((scoreL + "  -  " + scoreR), 0, -250);
  }
  scaleTextSize(70);
  scaleText("STATS", 0, -75);
  scaleTextSize(50);
  scaleText("MAIN MENU", 0, 475);
  scaleTextSize(40);
  scaleText("TOTAL PLAYS: " + stats.plays, 0, 75);
  scaleText("WINNER", 0, 150);
  scaleText("BOT PLAYS", 0, 300);

  scaleTextSize(30);
  scaleText("EASY          NORMAL      IMPOSSIBLE", 0, 400);
  scaleText("Updates Every 15 Minutes", 0, -25);

  textAlign(LEFT, CENTER);
  scaleText("BOT", 320, 200);
  fill(0);
  scaleText(stats.botWins + " | ", -250, 200);

  textAlign(RIGHT, CENTER);
  fill(255);
  scaleText("PLAYER", -320, 200);
  fill(0);
  scaleText(stats.playerWins, -190, 200);

  textAlign(CENTER, CENTER);
}

function play() {
  //reset();
  settings.hideSettings();
  settings.updateSliders();
  showControls = true;
  display = "game";
  status = "paused";
  redraw();
  drawBoard();
  status = "active";
  pause();
}

function moreSettings() {
  display = "more-settings";
  for (i = 0; i < 10; i++) {
    settings.checkButtons[i].style.visibility = "hidden";
  }
  settings.play.style.visibility = "hidden";
  settings.moreSettings.style.visibility = "hidden";
  settings.statistics.style.visibility = "hidden";
  settings.mainMenu.style.visibility = "visible";
}

function statistics() {
  display = "statistics";
  for (i = 0; i < 10; i++) {
    settings.checkButtons[i].style.visibility = "hidden";
  }
  settings.play.style.visibility = "hidden";
  settings.pause.style.visibility = "hidden";
  settings.moreSettings.style.visibility = "hidden";
  settings.statistics.style.visibility = "hidden";
  settings.mainMenu.style.visibility = "visible";
}

function startCountdown() {
  status = "countdown";
  ball.setupArrow();
  countDown = millis() + 3000;
  drawCount();
}

function pause() {
  console.log("Game Paused/Resumed");
  if (status == "active" || status == "countdown") {
    status = "paused";
    settings.pause.style.width = "100vw";
    settings.pause.style.left = "0vw";
    settings.mainMenu.style.visibility = "visible";
    settings.fullScreen.style.visibility = "visible";
    //redraw();
    //drawPause();
    noLoop();
  } else {
    if (status == "paused") {
      status = "countdown";
      settings.pause.style.width = "22vw";
      settings.pause.style.left = "39vw";
      settings.mainMenu.style.visibility = "hidden";
      settings.fullScreen.style.visibility = "hidden";
      loop();
      startCountdown();
    }
  }
}

function drawCount() {
  var displayedCount = ceil((countDown - millis()) / 1000);
  if (status == "countdown") {
    if (displayedCount <= 0) {
      status = "active";
      calcTrajectory();
      //bot[1].calcMove();
    }
    stroke(255);
    fill(0);
    scaleStrokeWeight(3);
    scaleRect(0, -300, 125, 125, 10);
    scaleTextSize(100);
    fill(255);
    scaleText(displayedCount, 0, -300);
    ball.drawArrow(3000 + millis() - countDown);
  }
}

function score(side) {
  if (side == "l") {
    scoreL++;
  }
  if (side == "r") { // hits left wall
    scoreR++;
  }
  if (scoreR == winningScore || scoreL == winningScore) {
    gameOver();
  } else {
    ball.reset();
    startCountdown();
  }
}

function gameOver() {
  //console.log(":isPLayer",settings.isPlayerL != settings.isPlayerR);
  statistics();
  status = "game-over";
  if (scoreR == winningScore) {
    winnerSide = "Right";
  } else {
    if (scoreL == winningScore) {
      winnerSide = "Left";
    }
  }
  //console.log("Win side:",winnerSide);
  if (settings.isPlayerL != settings.isPlayerR) {
    if (winnerSide == "Right") {
      // console.log("Right win:",settings.isPlayerR);
      if (settings.isPlayerR) {
        winner = "Player";
        // console.log("winner:",winner);
      } else {
        winner = "Bot";
        // console.log("winner:",winner);
      }
    } else {
      if (winnerSide == "Left") {
        //console.log("Left win:",settings.isPlayerL);
        if (settings.isPlayerL) {
          winner = "Player";
          //console.log("winner:",winner);
        } else {
          winner = "Bot";
          //console.log("winner:",winner);
        }
      }
    }
    if (settings.isPlayerL) {
      playerPoints = scoreL;
      botPoints = scoreR;
    } else {
      playerPoints = scoreR;
      botPoints = scoreL;
    }
  }
  //console.log("winnnnnner",winner);
  sendData();
  console.log("   ");
  console.log("Game Over");
  console.log("Score:", scoreL, scoreR, "Winner:", winnerSide);
  console.log("   ");
  console.log("   ");
  console.log("   ");
  console.log("   ");
  console.log("   ");
}

function calcTrajectory() {
  var ballX = ball.x;
  var ballY = ball.y;
  var xSpeed = (ball.speed) * cos(-1 * ball.realAngle);
  var ySpeed = (ball.speed) * sin(-1 * ball.realAngle);
  ballX += xSpeed;
  ballY += ySpeed;
  while ((ballX > -890 && ballX < 890)) {
    if (ballY >= 520 || ballY <= -520) {
      ySpeed *= -1;
      ballX += xSpeed;
      ballY += ySpeed;
    } else {
      ballX += xSpeed;
      ballY += ySpeed;
    }
  }
  calculatedX = ballX;
  calculatedY = ballY;
  console.log("Calculated: (", ballX, " , ", ballY, ")");
  console.log("   ");
}

function drawTrajectory() {
  if (calculatedX != "NONE") {
    noStroke();
    fill(255, 0, 0);
    scaleEllipse(calculatedX, calculatedY, 40, 40);
    fill(255);
    scaleEllipse(calculatedX, calculatedY, 26, 26);
    fill(255, 0, 0);
    scaleEllipse(calculatedX, calculatedY, 15, 15);
    noFill();
    stroke(0, 255, 0);
    scaleStrokeWeight(1);
    scaleLine(ball.x, ball.y, calculatedX, calculatedY);
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
}

function setWindowSize() { // Resizes canvas and sets windowScale
  windowScale = windowWidth / 1920;
  resizeCanvas(windowWidth, (windowWidth * 9 / 16));
}

function fullScreen() {
  fs = fullscreen();
  fullscreen(!fs);
}

/****************************** Classes *******************************/

class Setting {
  constructor() {
    this.checkBoxes = new Array(10);
    this.checkButtons = new Array(10);
    this.play = document.getElementById("play");
    this.moreSettings = document.getElementById("moreSettings");
    this.statistics = document.getElementById("statistics");
    this.mainMenu = document.getElementById("mainMenu");
    this.fullScreen = document.getElementById("fullScreen");
    this.pause = document.getElementById("pause-button");
    this.rightUp = document.getElementById("right-up");
    this.leftUp = document.getElementById("left-up");
    this.rightDown = document.getElementById("right-down");
    this.leftDown = document.getElementById("left-down");
    this.paddleSpeed = document.getElementById("paddle-speed");
    this.ballSpeed = document.getElementById("ball-speed");

    this.playerL = document.getElementById("playerL");
    this.botL = document.getElementById("botL");
    this.easyL = document.getElementById("easyL");
    this.normalL = document.getElementById("normalL");
    this.impossibleL = document.getElementById("impossibleL");
    this.playerR = document.getElementById("playerR");
    this.botR = document.getElementById("botR");
    this.easyR = document.getElementById("easyR");
    this.normalR = document.getElementById("normalR");
    this.impossibleR = document.getElementById("impossibleR");

    this.winningScore = 10;

    this.checkButtons[0] = this.playerL;
    this.checkButtons[1] = this.botL;
    this.checkButtons[2] = this.easyL;
    this.checkButtons[3] = this.normalL;
    this.checkButtons[4] = this.impossibleL;
    this.checkButtons[5] = this.playerR;
    this.checkButtons[6] = this.botR;
    this.checkButtons[7] = this.easyR;
    this.checkButtons[8] = this.normalR;
    this.checkButtons[9] = this.impossibleR;

    this.isPlayerL;
    this.isPlayerR;
    this.botModeL;
    this.botModeR;
    this.botMode;
  }

  updateHTML() {

    this.checkBoxes[0] = this.playerL.checked;
    this.checkBoxes[1] = this.playerR.checked;
    this.checkBoxes[2] = this.botL.checked;
    this.checkBoxes[3] = this.botR.checked;
    this.checkBoxes[4] = this.easyL.checked;
    this.checkBoxes[5] = this.easyR.checked;
    this.checkBoxes[6] = this.normalL.checked;
    this.checkBoxes[7] = this.normalR.checked;
    this.checkBoxes[8] = this.impossibleL.checked;
    this.checkBoxes[9] = this.impossibleR.checked;


    this.isPlayerL = this.checkBoxes[0];
    this.isPlayerR = this.checkBoxes[1];

    //if (this.isPlayerL != this.isPlayerR) {
      if (this.checkBoxes[4]) {
        this.botModeL = "Easy";
      }
      if (this.checkBoxes[6]) {
        this.botModeL = "Normal";
      }
      if (this.checkBoxes[8]) {
        this.botModeL = "Impossible";
      }
      if (this.checkBoxes[5]) {
        this.botModeR = "Easy";
      }
      if (this.checkBoxes[7]) {
        this.botModeR = "Normal";
      }
      if (this.checkBoxes[9]) {
        this.botModeR = "Impossible";
      }
    //}
  }

  updateSliders() {
    ball.speed = this.ballSpeed.value;
  }

  hideSettings() {
    for (i = 0; i < 10; i++) {
      this.checkButtons[i].style.visibility = "hidden";
    }
    this.play.style.visibility = "hidden";
    this.moreSettings.style.visibility = "hidden";
    this.statistics.style.visibility = "hidden";
    this.pause.style.visibility = "visible";
    this.rightUp.style.visibility = "visible";
    this.leftUp.style.visibility = "visible";
    this.rightDown.style.visibility = "visible";
    this.leftDown.style.visibility = "visible";
  }

  showSettings() {
    for (var i = 0; i < 10; i++) {
      this.checkButtons[i].style.visibility = "visible";
    }
    this.play.style.visibility = "visible";
    this.moreSettings.style.visibility = "visible";
    this.statistics.style.visibility = "visible";
    this.pause.style.visibility = "hidden";
    this.rightUp.style.visibility = "hidden";
    this.leftUp.style.visibility = "hidden";
    this.rightDown.style.visibility = "hidden";
    this.leftDown.style.visibility = "hidden";
  }
}

class Ball {
  constructor() {
    this.x;
    this.y;
    this.xSpeed;
    this.ySpeed;
    this.ex = 0;
    this.angle;
    this.quadrant;
    this.realAngle;
    this.speed;
    this.speedIncrease = 1;
    this.frame = frameCount;
    this.flipX;
    this.flipY;
    this.arrowX;
    this.arrowY;
    this.arrowT;
    this.arrowFinal;
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.flipX = 1;
    this.flipY = 1;
    this.lastHit = 5;
    this.speed = settings.ballSpeed.value;
    this.hit;
    calculatedX = "NONE";
    paddle[0].y = 0;
    paddle[1].y = 0;
    if (floor(random(1, 11)) > 5) {
      this.opposite = -1
    } else {
      this.opposite = 1;
    }
    this.angle = random(10, 35);
    this.quadrant = floor(random(1, 5));
    this.calcRealAngle();
    console.log("        ");
    console.log("        ");
    console.log("STARTING VALUES")
    console.log("Real Angle:", this.realAngle, "Quadrant:", this.quadrant, "Angle:", this.angle, "Speed:", this.speed);
    console.log("Ball Info:",ball);
    console.log("        ");
  }

  calcRealAngle() {
    if (this.quadrant == 1) {
      this.realAngle = this.angle;
    }
    if (this.quadrant == 2) {
      this.realAngle = 180 - this.angle;
    }
    if (this.quadrant == 3) {
      this.realAngle = this.angle + 180;
    }
    if (this.quadrant == 4) {
      this.realAngle = 360 - this.angle;
    }
    this.frame = frameCount;

  }

  bounce(hitPaddle, side) {
    console.log("Ball Info:",ball);
    this.newAngle();
    if (hitPaddle) {
      this.paddleMin = paddle[side].y - 110;
      this.paddleMax = paddle[side].y + 110;
      if (this.y > this.paddleMin && this.y < this.paddleMax && lastHit != side) {
        console.log("Paddle Hit:", side);
        //this.flipX *= -1;
        //this.realAngle *= 1.5;
        if (this.quadrant == 1) {
          this.quadrant = 2;
        } else {
          if (this.quadrant == 2) {
            this.quadrant = 1;
          }
        }
        if (this.quadrant == 3) {
          this.quadrant = 4;
        } else {
          if (this.quadrant == 4) {
            this.quadrant = 3;
          }
        }
        this.angle += random(-15, 15);
        this.angle = constrain(this.angle, 10, 30);
        this.calcRealAngle();
        lastHit = side;
        console.log("Real Angle:", this.realAngle, "Quadrant:", this.quadrant, "Angle:", this.angle);
        this.speed = constrain(float(this.speed) + float(this.speedIncrease), 20, 50);
        console.log("New Speed:", this.speed, "Attempted Change: +" + this.speedIncrease);
      } else {
        if (this.x < -940 && lastHit != side) {
          console.log("SCORE L");
          score("l");
        } else {
          if (this.x > 940 && lastHit != side) {
            console.log("SCORE R");
            score("r");
          }
        }
      }
    } else {
      if (lastHit != side) {
        console.log("Wall Hit:", side);
        if (this.quadrant == 1) {
          this.quadrant = 4;
        } else {
          if (this.quadrant == 4) {
            this.quadrant = 1;
          }
        }
        if (this.quadrant == 3) {
          this.quadrant = 2;
        } else {
          if (this.quadrant == 2) {
            this.quadrant = 3;
          }
        }
        //this.angle += random(-15,15);
        this.angle = constrain(this.angle, 10, 30);
        this.calcRealAngle();
        lastHit = side;
        console.log("Real Angle:", this.realAngle, "Quadrant:", this.quadrant, "Angle:", this.angle);
      }
    }
    console.log("Last Hit:",lastHit);
    calcTrajectory();
    // bot[1].calcMove();
  }

  move() {
    if (status == "active") {
      angleMode(DEGREES);
      this.xSpeed = (this.speed) * cos(-1 * this.realAngle);
      this.ySpeed = (this.speed) * sin(-1 * this.realAngle);
      this.x += this.xSpeed/1;
      this.y += this.ySpeed/1;
      this.checkHit();
      this.draw();
    }
  }

  draw() {
    noStroke();
    fill(255);
    scaleRect(this.x, this.y, 40, 40, 0);
  }

  checkHit() {
    //if (this.x > 950) { // hits right wall
    //  score("l");
    //  return;
    //}
    //if (this.x < -950) { // hits left wall
    //  score("r");
    //  return;
    //}
    if (this.x > 890) {  // hits right paddle
      this.bounce(true, 1);
      return;
    }
    if (this.x < -890) {  // hits left paddle
      this.bounce(true, 0);
      return;
    }
    if (this.y > 520) {  // hits bottom wall
      this.bounce(false, 2);
      return;
    }
    if (this.y < -520) {  // hits top wall
      this.bounce(false, 3);
      return;
    }

    this.hit = true;
  }

  newAngle() {
  }

  setupArrow() {
    this.arrowFinal = this.realAngle + 360;
    this.arrowT = 90;
    //console.log("Arrow Angle:", this.arrowFinal - 360);
  }

  drawArrow(count) {
    angleMode(DEGREES);
    if (this.arrowT < this.arrowFinal) {
      this.arrowT = this.arrowFinal * count / 2000;
    }
    this.arrowX = 60 * cos(-1 * this.arrowT);
    this.arrowY = 60 * sin(-1 * this.arrowT);
    stroke(255);
    fill(255);
    scaleStrokeWeight(6);
    scaleLine(this.arrowX + this.x, this.arrowY + this.y, this.arrowX * 2 + this.x, this.arrowY * 2 + this.y);
    scaleLine(this.arrowX * 2 + this.x, this.arrowY * 2 + this.y, 98 * cos(-1 * ball.arrowT - 8) + this.x, 98 * sin(-1 * ball.arrowT - 8) + this.y);
    scaleLine(this.arrowX * 2 + this.x, this.arrowY * 2 + this.y, 98 * cos(-1 * ball.arrowT + 8) + this.x, 98 * sin(-1 * ball.arrowT + 8) + this.y);
  }
}

class Paddle {
  constructor(side) {
    this.x = -920;
    this.y = 0;
    this.speed = 20;
    this.paddleSpeed;
    this.side = side;
    if (this.side == "R") {
      this.flip = -1;
    } else {
      this.flip = 1;
    }
  }

  move(direction, speed) {
    if (status == "active") {
      if (this.side == "R") {
        if (direction == "right-up") {
          //this.y -= this.speed;
          this.y -= speed;
        }
        if (direction == "right-down") {
          //this.y += this.speed;
          this.y += speed;
        }
      }
      if (this.side == "L") {
        if (direction == "left-up") {
          this.y -= speed;
        }
        if (direction == "left-down") {
          this.y += speed;
        }
      }
      this.y = constrain(this.y, -440, 440);
      this.draw();
    }
  }

  draw() {
    noStroke();
    fill(255);
    scaleRect(this.x * this.flip, this.y, 20, 220, 0);
  }
}

class Stat {
  constructor() {
    this.read;

    this.plays;
    this.playerWins;
    this.botWins;

    this.sendPlays = document.getElementById("stat-plays");
    this.sendWinner = document.getElementById("stat-winner");
    this.sendBotMode = document.getElementById("stat-botmode");
    this.sendBotPoints = document.getElementById("stat-botpoints");
    this.sendPlayerPoints = document.getElementById("stat-playerpoints");
    this.sendFPS = document.getElementById("stat-fps");
  }

  update() {
    console.log("Stats Updated");
    this.read = sheet["Read"]["elements"];

    this.plays = this.read[0].Value;
    this.playerWins = this.read[3].Value;
    this.botWins = this.read[4].Value;

    this.sendPlays.value = this.plays;
    this.sendFPS.value = fps;
    if (settings.isPlayerL != settings.isPlayerR) {
      this.sendWinner.value = winner;
      this.sendBotMode.value = settings.botMode;
      this.sendBotPoints.value = botPoints;
      this.sendPlayerPoints.value = playerPoints;
    } else {
      this.sendWinner.value = "FALSE";
      this.sendBotMode.value = "FALSE";
      this.sendBotPoints.value = "FALSE";
      this.sendPlayerPoints.value = "FALSE";
    }
  }
}

class Bot {
  constructor(side) {
    this.side = side;
    this.canMove = true;
    //this.mode = settings.botMode;
    this.moveTo;
    this.error;
    if (side == 0) {
      this.mode = settings.botModeL;
    } else {
      this.mode = settings.botModeR;
    }
  }

  move() {
    if (settings.isPlayerL) {
      if (this.side == 0) {
        this.canMove = false;
      }
    }
    if (settings.isPlayerR) {
      if (this.side == 1) {
        this.canMove = false;
      }
    }
    if (this.canMove) {
      var direction;

      if (this.side == 0) {
        direction = "left";
        if (ball.xSpeed < 0) {
          this.moveTo = calculatedY;
        } else {
          this.moveTo = calculatedY / 2;
        }
      } else {
        direction = "right";
        if (ball.xSpeed > 0) {
          this.moveTo = calculatedY;
        } else {
          this.moveTo = calculatedY / 1.5;
        }
      }

      // this.moveTo += this.error;

      // console.log(this.side);
      if (abs(paddle[this.side].y - this.moveTo) > paddle[this.side].speed) {
        if (paddle[this.side].y > this.moveTo) {
          paddle[this.side].move(direction + "-up", this.calcSpeed());
        } else {
          paddle[this.side].move(direction + "-down", this.calcSpeed());
        }
      }
    }
  }

  calcSpeed() {
    if (this.side == 0) {
      this.mode = settings.botModeL;
    } else {
      this.mode = settings.botModeR;
    }
    var speed;
    if (this.mode == "Easy") {
      speed = (paddle[0].speed / 3) + random(0,4); // third speed (same as player)
    }
    if (this.mode == "Normal") {
      speed = (paddle[0].speed / 2) + random(0,8); // half speed 
    }
    if (this.mode == "Impossible") {
      speed = paddle[0].speed; // full speed (same as player)
    }
    //console.log(this.mode);
    //console.log(" Speed:",constrain(speed, 5, paddle[0].speed), this.side, paddle[0].speed);
    return constrain(speed, 8, paddle[0].speed);
  }

}
