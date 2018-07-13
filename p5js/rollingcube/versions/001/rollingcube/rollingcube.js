var rotateamount = 0;
var ty = 350;
var tx = -650;
var side = 1;
var i = 0;
var speed = 5;
var touchamount;
var mainCanvas;
var windowScale = 1;

function setup() {
  mainCanvas = createCanvas(1, 1);
  setWindowSize();
  background(0);
  rectMode(CENTER);
  frameRate(60);
  mainCanvas.parent('sketch-holder');
}

function draw() {
  console.log("Frame Rate: "+frameRate()+" rotate amount: "+rotateamount);
  translate(width/2, height/2);
  noFill();
  background(255);
  strokeWeight(5);
  rect(0, 0, 1400*windowScale, 800*windowScale);
  strokeWeight(1);
  for (i = 0; i < 2000; i = i+100) {
    line(i*windowScale, -2000*windowScale, i*windowScale, 2000*windowScale);
    line(-i*windowScale, -2000*windowScale, -i*windowScale, 2000*windowScale);
  }
  for (i = 0; i < 2000; i = i+100) {
    line(-2000*windowScale, i*windowScale, 2000*windowScale, i*windowScale);
    line(-2000*windowScale, -i*windowScale, 2000*windowScale, -i*windowScale);
  }

  if (side == 1) {
    ty = 350-(abs(sin(radians(rotateamount*2)))*(50*sqrt(2)-50));
    tx = tx+(speed*(10/9));
    if (tx >= 650) {
      side = 2;
      ty = 350;
      tx = 650;
      rotateamount = 0;
    }
  }
  if (side == 2) {
    ty = ty - (speed*10/9);
    tx = 650-(abs(sin(radians(rotateamount*2)))*(50*sqrt(2)-50));
    if (ty <= -350) {
      side = 3;
      ty = -350;
      tx = 650;
      rotateamount = 0;
    }
  }
  if (side == 3) {
    ty = -350+(abs(sin(radians(rotateamount*2)))*(50*sqrt(2)-50));
    tx = tx-(speed*(10/9));
    if (tx <= -650) {
      side = 4;
      ty = -350;
      tx = -650;
      rotateamount = 0;
    }
  }
  if (side == 4) {
    ty = ty + (speed*10/9);
    tx = -650+(abs(sin(radians(rotateamount*2)))*(50*sqrt(2)-50));
    if (ty >= 350) {
      side = 1;
      ty = 350;
      tx = -650;
      rotateamount = 0;
    }
  }

  fill(255, 255, 0);
  translate(tx*windowScale, ty*windowScale);
  rotate(radians(rotateamount));
  rect(0, 0, 100*windowScale, 100*windowScale);
  point(0, 0);
  rotateamount = rotateamount+speed;
  translate(-tx, -ty);
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
  windowScale = divWidth/1920;
  divHeight = divWidth*9/16;
  resizeCanvas(divWidth, divHeight);
  updateDraw = true;
}
