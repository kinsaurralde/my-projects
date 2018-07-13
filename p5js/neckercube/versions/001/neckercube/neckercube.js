var x = 750;
var y = 250;
var i = 0;
var starX = 0;
var starY = 0;
var starx = [];
var stary = [];
var winScale = 1;
var divWidth = 100;
var windowHeight = 100;

function setup() {
  var canvas = createCanvas(1920, 1080);
  canvas.parent('sketch-holder');
  setWindowSize();
  background(0);
  fill(255, 255, 100);
  noStroke();

  for ( i = 0; i < 100; i++) {
    starx[i] = int(random(1920));
    stary[i] = int(random(1080));
  }
}

function draw() {
  var white = color(255, 255, 255);
  var black = color(0, 0, 0);
  var lightblue = color(100, 150, 170);
  var grayblue = color(175, 200, 225);
  var darkblue = color(50, 125, 140);
  var darkerblue = color(25, 75, 90);
  var yellow = color(255, 255, 100);

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (mouseButton == LEFT && mouseIsPressed) {
      if (pmouseX > mouseX) {
        starX = starX - (pmouseX - mouseX);
      }
      if (pmouseX < mouseX) {
        starX = starX + (mouseX - pmouseX);
      }
      if (pmouseY > mouseY) {
        starY = starY - (pmouseY - mouseY);
      }
      if (pmouseY < mouseY) {
        starY = starY + (mouseY - pmouseY);
      }
      if (starX < 0) {
        starX = starX + width;
      }
      if (starY < 0) {
        starY = starY + height;
      }
    }
    if (keyIsDown(32)) { // Space Bar
      return false;
    }
  }

  if (keyIsDown(UP_ARROW)) {
    y = y-3;
  }
  if (keyIsDown(DOWN_ARROW)) {
    y = y+3;
  }
  if (keyIsDown(LEFT_ARROW)) {
    x = x-3;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    x = x+3;
  }
  if (key === ' ') {
    x = 750;
    y = 250;
  }


  background(black);
  for (i = 0; i < 100; i++) {
    fill(yellow);
    ellipse(((starx[i]+starX)*winScale%width), ((stary[i]+starY)*winScale%height), 5*winScale, 5*winScale);
  }
  translate(x*winScale, y*winScale);
  noStroke();

  fill(grayblue);
  quadScale(174, 50, 362, 125, 347, 140, 174, 67);
  fill(grayblue);
  quadScale(174, 50, 75, 125, 89, 135, 174, 67);
  fill(grayblue);
  quadScale(75, 125, 95, 120, 275, 187, 275, 200);
  fill(grayblue);
  quadScale(275, 200, 266, 187, 334, 130, 347, 140);
  fill(darkblue);
  quadScale(177, 65, 177, 75, 110, 126, 100, 122);
  fill(lightblue);
  quadScale(177, 65, 177, 75, 328, 135, 337, 127);
  fill(darkblue);
  quadScale(75, 125, 275, 200, 275, 215, 75, 140);
  fill(lightblue);
  quadScale(275, 200, 275, 215, 362, 140, 362, 125);
  fill(lightblue);
  quadScale(177, 75, 163, 85, 163, 283, 177, 290);
  fill(darkblue);
  quadScale(187, 281, 177, 290, 177, 75, 187, 79);
  
  fill(darkblue);
  quadScale(260, 205, 275, 210, 275, 425, 260, 420);
  fill(lightblue);
  quadScale(275, 210, 285, 200, 285, 425, 275, 425);
  
  fill(grayblue);
  quadScale(174, 275, 362, 350, 347, 365, 174, 292);
  fill(grayblue);
  quadScale(174, 275, 75, 350, 89, 360, 174, 292);
  fill(grayblue);
  quadScale(75, 350, 95, 345, 275, 412, 275, 425);
  fill(grayblue);
  quadScale(275, 425, 266, 412, 334, 355, 347, 365);
  fill(darkblue);
  quadScale(177, 290, 177, 300, 110, 351, 100, 347);
  fill(lightblue);
  quadScale(177, 290, 177, 300, 328, 360, 337, 352);
  fill(darkblue);
  quadScale(75, 350, 275, 425, 275, 440, 75, 365);
  fill(lightblue);
  quadScale(275, 425, 275, 440, 362, 365, 362, 350);
  
  fill(darkblue);
  quadScale(75, 125, 87, 129, 87, 355, 75, 350);
  fill(lightblue);
  quadScale(87, 355, 100, 347, 100, 149, 87, 144);
  fill(lightblue);
  quadScale(177, 178, 163, 173, 163, 283, 177, 290);
  fill(darkblue);
  quadScale(187, 281, 177, 290, 177, 178, 187, 180);
  
  fill(darkblue);
  quadScale(260, 333, 275, 338, 275, 425, 260, 420);
  fill(lightblue);
  quadScale(275, 338, 285, 342, 285, 425, 275, 425);
  fill(darkblue);
  quadScale(353, 148, 337, 161, 337, 352, 353, 359);
  fill(lightblue);
  quadScale(353, 149, 362, 125, 362, 355, 353, 358);

  translate(-x*winScale, -y*winScale);
}

function quadScale(a, b, c, d, e, f, g, h) {
  quad(a*winScale, b*winScale, c*winScale, d*winScale, e*winScale, f*winScale, g*winScale, h*winScale);
}

function windowResized() {
  setWindowSize();
}

function setWindowSize() {
  var container = document.getElementById('sketch-holder');
  var positionInfo = container.getBoundingClientRect();
  var divWidth = positionInfo.width;
  var divHeight = divWidth*9/16;
  background(0);
  resizeCanvas(divWidth, divHeight);
  if (divWidth/1920 < (divHeight)/1080) {
    winScale = divWidth/1920;
  } else {
    winScale = (divHeight)/1080;
  }
}
