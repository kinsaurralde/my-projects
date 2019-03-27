var rotateamount = 0;
var ty = 350;
var tx = -650;
var side = 1;
var i = 0;
var speed = 5;
var touchamount;
var mainCanvas;
var windowScale = 1;
var points = new Array(1000);

function setup() {
  for (i = 0; i < 1000; i++) {
    points[i] = new Array(3);
  }
  mainCanvas = createCanvas(1, 1);
  setWindowSize();
  background(0);
  rectMode(CENTER);
  mainCanvas.parent('sketch-holder');
}

function draw() {
  translate(width / 2, height / 2);
  noFill();
  background(255);
  strokeWeight(5);
  rect(0, 0, 1400 * windowScale, 800 * windowScale);
  strokeWeight(1);
  for (i = 0; i < 2000; i = i + 100) {
    line(i * windowScale, -2000 * windowScale, i * windowScale, 2000 * windowScale);
    line(-i * windowScale, -2000 * windowScale, -i * windowScale, 2000 * windowScale);
  }
  for (i = 0; i < 2000; i = i + 100) {
    line(-2000 * windowScale, i * windowScale, 2000 * windowScale, i * windowScale);
    line(-2000 * windowScale, -i * windowScale, 2000 * windowScale, -i * windowScale);
  }

  tx = points[frameCount % (144 * speed)][0]; // 720 @ default speed of 5
  ty = points[frameCount % (144 * speed)][1];
  rotateamount = points[frameCount % (144 * speed)][2];

  fill(255, 255, 0);
  translate(tx * windowScale, ty * windowScale);
  rotate(radians(rotateamount));
  rect(0, 0, 100 * windowScale, 100 * windowScale);
  point(0, 0);
}

function keyPressed() {
  if (keyCode == 32) {
    var fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  setWindowSize();
}

function setWindowSize() {
  background(255, 255, 255);
  var container = document.getElementById('sketch-holder');
  var positionInfo = container.getBoundingClientRect();
  var divWidth = positionInfo.width;
  var divHeight;
  windowScale = divWidth / 1920;
  divHeight = divWidth * 9 / 16;
  resizeCanvas(divWidth, divHeight);
  calculatePoints();
}

function calculatePoints() {
  var side = 1;
  var y = 350;
  var x = -650;
  var rotate = 0;
  var speed = 5;
  for (i = 0; i < 144 * speed; i++) {
    if (side == 1) {
      y = 350 - (abs(sin(radians(rotate * 2))) * (50 * sqrt(2) - 50));
      x = x + (speed * (10 / 9));
      if (x >= 650) {
        side = 2;
        y = 350;
        x = 650;
        rotate = 0;
      }
    }
    if (side == 2) {
      y = y - (speed * 10 / 9);
      x = 650 - (abs(sin(radians(rotate * 2))) * (50 * sqrt(2) - 50));
      if (y <= -350) {
        side = 3;
        y = -350;
        x = 650;
        rotate = 0;
      }
    }
    if (side == 3) {
      y = -350 + (abs(sin(radians(rotate * 2))) * (50 * sqrt(2) - 50));
      x = x - (speed * (10 / 9));
      if (x <= -650) {
        side = 4;
        y = -350;
        x = -650;
        rotate = 0;
      }
    }
    if (side == 4) {
      y = y + (speed * 10 / 9);
      x = -650 + (abs(sin(radians(rotate * 2))) * (50 * sqrt(2) - 50));
      if (y >= 350) {
      }
    }
    points[i][0] = x;
    points[i][1] = y;
    points[i][2] = rotate;
    rotate = rotate + speed;
  }
}
