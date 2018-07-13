var redStatus;
var yellowStatus;
var greenStatus;
var sleepTimer = 0;
var timer = 0;
var step = 0;

function setup() {
  createCanvas(windowWidth, 160);
  rectMode(CENTER);
  greenOn();
}

function draw() {
  background(255);
  fill(0);
  rect(width/2, 80, 80, 160);
  fill(255, 0, 0, redStatus);
  ellipse(width/2, 30, 45);
  fill(255, 255, 0, yellowStatus);
  ellipse(width/2, 80, 45);
  fill(0, 255, 0, greenStatus);
  ellipse(width/2, 130, 45);
  if (millis() - timer > 20000 && step == 0) {
    step = 1;
  }
  if (step == 1) {
    yellowOn();
    sleepTimer = millis();
    step = 2;
  }
  if (step == 2) {
    sleep(3);
  }
  if (step == 3) {
    redOn();
    sleepTimer = millis();
    step = 4;
  }
  if (step == 4) {
    sleep(6);
  }
  if (step == 5) {
    greenOn();
    step = 0;
  }
}

function mousePressed() {
  if (mouseX <= width/2+40 && mouseX >= width/2-40 && mouseY <= 160 && mouseY >= 0) {
    pedestrian();
  }
}

function pedestrian() {
  if (step == 0) {
    step = 1;
  }
}

function greenOn() {
  timer = millis();
  greenStatus = 255;
  redStatus = 120;
  yellowStatus = 120;
}

function yellowOn() {
  greenStatus = 120;
  redStatus = 120;
  yellowStatus = 255;
}

function redOn() {
  greenStatus = 120;
  redStatus = 255;
  yellowStatus = 120;
}

function sleep(seconds) {
  console.log(millis() - sleepTimer);
  if (millis() - sleepTimer > seconds*1000) {
    step++;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 160);
}
