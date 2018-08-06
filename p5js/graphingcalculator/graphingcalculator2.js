var graphw = 1280, graphh = 720, windowScale = 1.5;                         // Graph settings
var scroll = 50, translateX = 0, translateY = 0;                            // Transformation settings
var mathX = 0;
var graphScale = 100;                                                       // Graph magnifier
var inputs = new Array(2);                                                  // Input classes with settings
var px = new Array(2001);                                                   // Graph x coordinates
var py = new Array(2001);                                                   // Graph y coordinates



function setup() {
  mainCanvas = createCanvas(1, 1);
  background(255, 0, 0);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  mainCanvas.parent('sketch-holder');
  setWindowSize();
  setupArrays();
}

function setupArrays() {
  for (i = 0; i < 2001; i++) {
    px[i] = new Array(8);
    py[i] = new Array(8);
  }
}

function draw() {
  translate(width / 2, height / 2);
  transformations();
  drawNonGraphBackground();
  drawClearedGraph();
  drawGraphWindow();
  drawBoxes();
  calculatePoints();
}

function drawGraphWindow() {
  stroke(0);
  strokeWeight(4);
  scaleLine(-640, constrain(translateY, -360, 360), 640, constrain(translateY, -360, 360)); // x axis
  scaleLine(constrain(translateX, -640, 640), -360, constrain(translateX, -640, 640), 360); // y axis
}

function drawNonGraphBackground() {
  noStroke();
  fill(200, 200, 200);
  scaleRect(-800, 0, 320, 1080); // Left Side
  scaleRect(800, 0, 320, 1080); // Right Side
  scaleRect(0, -520, 1280, 360); // Top Side
  scaleRect(0, 520, 1280, 360); // Bot Side
}

function drawClearedGraph() {
  stroke(0);
  scaleStrokeWeight(6);
  fill(255);
  scaleRect(0, 0, graphw, graphh);
}

function drawBoxes() {
  noFill();
  stroke(0);
  scaleStrokeWeight(5);

  scaleRectHighlight(0, -470, 790, 50); // f1(x) Upper Input
  scaleRectHighlight(-440, -470, 70, 50); // f1(x) Polar Button
  scaleRectHighlight(-520, -470, 70, 50); // f1(x) Function Button
  scaleRectHighlight(-600, -470, 70, 50); // f1(x) Parametric Button
  scaleRectHighlight(440, -470, 70, 50); // f1(x) Points Button
  scaleRectHighlight(520, -470, 70, 50); // f1(x) Line Button 
  scaleRectHighlight(600, -470, 70, 50);  // f1(x) Clear Button

  scaleRectHighlight(0, -410, 790, 50); // f2(x) Lower Input
  scaleRectHighlight(-440, -410, 70, 50); // f2(x) Polar Button
  scaleRectHighlight(-520, -410, 70, 50); // f2(x) Function Button
  scaleRectHighlight(-600, -410, 70, 50); // f2(x) Parametric Button
  scaleRectHighlight(440, -410, 70, 50); // f2(x) Points Button
  scaleRectHighlight(520, -410, 70, 50); // f2(x) Line Button 
  scaleRectHighlight(600, -410, 70, 50);  // f2(x) Clear Button

  scaleRectHighlight(-820, -250, 204, 50); // Parametric Example 1
  scaleRectHighlight(-820, -180, 204, 50); // Parametric Example 2
  scaleRectHighlight(-820, -110, 204, 50); // Polar Example 1
  scaleRectHighlight(-820, -40, 204, 50); // Polar Example 2
  scaleRectHighlight(-820, 30, 204, 50); // f(x) Example 1
  scaleRectHighlight(-820, 100, 204, 50); // f(x) Example 2

  scaleRectHighlight(820, -250, 204, 50); // Undecided
  scaleRectHighlight(820, -180, 204, 50); // Undecided
  scaleRectHighlight(820, -110, 204, 50); // Undecided
  scaleRectHighlight(820, -40, 204, 50); // Undecided
  scaleRectHighlight(820, 30, 204, 50); // Undecided
  scaleRectHighlight(820, 100, 204, 50); // Undecided

  /*    Text    */

  fill(0);
  noStroke();
  scaleTextSize(10);

  scaleText("",0000, -470); // f1(x) Upper Input
  scaleText("",-440, -470); // f1(x) Polar Button
  scaleText("",-520, -470); // f1(x) Function Button
  scaleText("",-600, -470); // f1(x) Parametric Button
  scaleText("",0440, -470); // f1(x) Points Button
  scaleText("",0520, -470); // f1(x) Line Button 
  scaleText("",0600, -470);  // f1(x) Clear Button

  scaleText("",0000, -410); // f2(x) Lower Input
  scaleText("",-440, -410); // f2(x) Polar Button
  scaleText("",-520, -410); // f2(x) Function Button
  scaleText("",-600, -410); // f2(x) Parametric Button
  scaleText("",0440, -410); // f2(x) Points Button
  scaleText("",0520, -410); // f2(x) Line Button 
  scaleText("",0600, -410); // f2(x) Clear Button

  scaleText("",-820, -250); // Parametric Example 1
  scaleText("",-820, -180); // Parametric Example 2
  scaleText("",-820, -110); // Polar Example 1
  scaleText("",-820, -040); // Polar Example 2
  scaleText("",-820, 0030); // f(x) Example 1
  scaleText("",-820, 0100); // f(x) Example 2

  scaleText("",0820, -250); // Undecided
  scaleText("",0820, -180); // Undecided
  scaleText("",0820, -110); // Undecided
  scaleText("",0820, -040); // Undecided
  scaleText("",0820, 0030); // Undecided
  scaleText("",0820, 0100); // Undecided
}

function calculatePoints() {
  mathX++;
  let scope = {
    x: mathX
  }
  //console.log(math.eval("x-3*2", scope));
}

function transformations() {
  if (mouseX > width / 2 - graphw / 2 && mouseX < width / 2 + graphw / 2 && mouseY > height / 2 - graphh / 2 && mouseY < height / 2 + graphh / 2) {
    if (mouseButton == LEFT && mouseIsPressed) {
      translateX -= pmouseX - mouseX;
      translateY -= pmouseY - mouseY;
      //updateDraw = true;
    }
  }
}



/****************************** Events *******************************/

function mouseWheel(event) {
  if (mouseX > width / 2 - graphw / 2 && mouseX < width / 2 + graphw / 2 && mouseY > height / 2 - graphh / 2 && mouseY < height / 2 + graphh / 2) {
    if (event.delta > 0) {
      var amount = 1;
    } else {
      amount = -1;
    }
    var wheel = -1 * amount;
    scroll = constrain(scroll + wheel, 0, 128);
    if (scroll <= 10) {
      graphScale = scroll * .1;
    } else {
      if (scroll <= 20) {
        graphScale = (scroll - 10) * 1;
      } else {
        if (scroll <= 50) {
          graphScale = ((scroll - 20) * 3) + 10;
        } else {
          if (scroll <= 70) {
            graphScale = (scroll - 30) * 5;
          } else {
            if (scroll <= 90) {
              graphScale = (scroll - 50) * 10;
            } else {
              if (scroll <= 100) {
                graphScale = (scroll - 70) * 20;
              } else {
                if (scroll <= 110) {
                  graphScale = (scroll - 85) * 40;
                } else {
                  if (scroll <= 120) {
                    graphScale = (scroll - 100) * 100;
                  } else {
                    graphScale = (scroll - 118) * 1000;
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log("Graph Scale:", graphScale);
    //update();
    return false;
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

function scaleRectHighlight(x, y, w, h) {
  rect(x * windowScale, y * windowScale, w * windowScale, h * windowScale);
}

/****************************** Window Resizing *******************************/

function windowResized() { // js function runs when window is resized
  setWindowSize();
  redraw();
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

class Equation {
  constructor() {
    //this.
  }
}