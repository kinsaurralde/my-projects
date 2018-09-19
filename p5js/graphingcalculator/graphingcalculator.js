var graphw = 1280, graphh = 720, windowScale = 1.5;                         // Graph settings
var scroll = 50, translateX = 0, translateY = 0;                            // Transformation settings
var updateDraw = true;
var solveTime = 0;
var leftSidePage = 0;
var sheet;                                                                  // Google Sheet
var graphScale = 100;                                                       // Graph magnifier
var inputs = new Array(2);                                                  // Input classes with settings
var publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1-NWCOzH_p1rwonypFwjT6pCwmvPlxbFBbmo2TEh-ECs/edit?usp=sharing";

function setup() {
  mainCanvas = createCanvas(1, 1);
  background(255, 0, 0);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  mainCanvas.parent('sketch-holder');
  inputs[0] = new Equation(0);
  inputs[1] = new Equation(1);
  setWindowSize();
  setupArrays();
  getSheetData();
}

function setupArrays() {
}

function draw() {
  translate(width / 2, height / 2);
  checkInputs();
  if (updateDraw) {
    drawClearedGraph();
    drawGraphWindow();
    drawPoints();
  }
  drawNonGraphBackground();
  drawGraphFrame();
  drawBoxes();
}

function drawPoints() {
  inputs[0].draw();
  inputs[1].draw();
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
  scaleRect(0, -520, 1280, 320); // Top Side
  scaleRect(0, 520, 1280, 320); // Bot Side
}

function drawClearedGraph() {
  stroke(0);
  scaleStrokeWeight(6);
  fill(255);
  scaleRect(0, 0, graphw, graphh);
}

function drawGraphFrame() {
  stroke(0);
  scaleStrokeWeight(6);
  noFill();
  scaleRect(0, 0, graphw, graphh);
}

function drawBoxes() {
  noFill();
  stroke(0);
  scaleStrokeWeight(5);

  scaleRectHighlight(0, -470, 790, 50, inputs[0].highlightInput, inputs[0].color); // f1(x) Upper Input
  scaleRectHighlight(-440, -470, 70, 50, inputs[0].highlightPolar, inputs[0].color); // f1(x) Polar Button
  scaleRectHighlight(-520, -470, 70, 50, inputs[0].highlightFunction, inputs[0].color); // f1(x) Function Button
  scaleRectHighlight(-600, -470, 70, 50, inputs[0].highlightParametric, inputs[0].color); // f1(x) Parametric Button
  scaleRectHighlight(440, -470, 70, 50, inputs[0].highlightPoints, inputs[0].color); // f1(x) Points Button
  scaleRectHighlight(520, -470, 70, 50, inputs[0].highlightLine, inputs[0].color); // f1(x) Line Button 
  scaleRectHighlight(600, -470, 70, 50, inputs[0].highlightClear, inputs[0].color);  // f1(x) Clear Button

  scaleRectHighlight(0, -410, 790, 50, inputs[1].highlightInput, inputs[1].color); // f2(x) Lower Input
  scaleRectHighlight(-440, -410, 70, 50, inputs[1].highlightPolar, inputs[1].color); // f2(x) Polar Button
  scaleRectHighlight(-520, -410, 70, 50, inputs[1].highlightFunction, inputs[1].color); // f2(x) Function Button
  scaleRectHighlight(-600, -410, 70, 50, inputs[1].highlightParametric, inputs[1].color); // f2(x) Parametric Button
  scaleRectHighlight(440, -410, 70, 50, inputs[1].highlightPoints, inputs[1].color); // f2(x) Points Button
  scaleRectHighlight(520, -410, 70, 50, inputs[1].highlightLine, inputs[1].color); // f2(x) Line Button 
  scaleRectHighlight(600, -410, 70, 50, inputs[1].highlightClear, inputs[1].color);  // f2(x) Clear Button

  for (i = 0; i < 8; i++) {
    scaleRectHighlight(-820, -250 + 70 * i, 204, 50); // Left
    scaleRectHighlight(820, -250 + 70 * i, 204, 50); // Right
  }

  /*    Text    */

  fill(0);
  stroke(0);
  scaleStrokeWeight(1);
  scaleTextSize(20);

  scaleText("r(\u03B8)", -440, -470); // f1(x) Polar Button
  scaleText("f(x)", -520, -470); // f1(x) Function Button
  scaleText("x(t)", -600, -470); // f1(x) Parametric Button
  scaleText("Points", 440, -470); // f1(x) Points Button
  scaleText("Line", 520, -470); // f1(x) Line Button 
  scaleText("Clear", 600, -470);  // f1(x) Clear Button

  scaleText("r(\u03B8)", -440, -410); // f2(x) Polar Button
  scaleText("f(x)", -520, -410); // f2(x) Function Button
  scaleText("y(t)", -600, -410); // f2(x) Parametric Button
  scaleText("Points", 440, -410); // f2(x) Points Button
  scaleText("Line", 520, -410); // f2(x) Line Button 
  scaleText("Clear", 600, -410); // f2(x) Clear Button

  /*
  scaleText("", -820, -250); // Parametric Example 1
  scaleText("", -820, -180); // Parametric Example 2
  scaleText("", -820, -110); // Polar Example 1
  scaleText("", -820, -40); // Polar Example 2
  scaleText("", -820, 30); // f(x) Example 1
  scaleText("", -820, 100); // f(x) Example 2
  */

  for (i = 0; i < 6; i++) {
    try {
      scaleText(sheet[i + (leftSidePage * 6)].Display, -820, -250 + 70 * i);
    } catch {
      scaleText("Loading . . .", -820, -250 + 70 * i);
    }
  }

  scaleText("Previous Page", -820, 170);
  scaleText("Next Page", -820, 240);

  scaleText("", 820, -250); // Undecided
  scaleText("", 820, -180); // Undecided
  scaleText("", 820, -110); // Undecided
  scaleText("", 820, -40); // Undecided
  scaleText("", 820, 30); // Undecided
  scaleText("", 820, 100); // Undecided

  fill(0);
  scaleTextSize(15);
  textAlign(CENTER);
  noStroke();
  scaleText("FPS: "+round(frameRate())+" Solve Time: "+round(solveTime)+"ms "+" Scale: "+graphScale+" Points: "+inputs[0].dots, 0, -370);
}

function checkInputs() {
  mX = (mouseX - width / 2) / windowScale;
  mY = (mouseY - height / 2) / windowScale;
  pMX = (pmouseX - width / 2) / windowScale;
  pMY = (pmouseY - height / 2) / windowScale;
  if (mX > -640 && mX < 640 && mY > -360 && mY < 360) {
    if (mouseButton == LEFT && mouseIsPressed) {
      //console.log(mouseX, mX);
      translateX -= pMX - mX;
      translateY -= pMY - mY;
      updateDraw = true;
    }
  }
  inputs[0].checkInput();
  inputs[1].checkInput();
}

function setGraph(setting) {
  inputs[0].inputHTML[0].children[0].value = setting.Top;
  inputs[0].highlightPoints = boolean(setting.PointsTop);
  inputs[0].highlightLine = boolean(setting.LineTop);
  inputs[0].highlightParametric = boolean(setting.ParametricTop);
  inputs[0].highlightFunction = boolean(setting.FunctionTop);
  inputs[0].highlightPolar = boolean(setting.PolarTop);

  if (inputs[0].highlightParametric) {
    inputs[0].mode = 1;
  } else {
    if (inputs[0].highlightFunction) {
      inputs[0].mode = 2;
    } else {
      if (inputs[0].highlightPolar) {
        inputs[0].mode = 3;
      }
    }
  }

  inputs[1].inputHTML[0].children[0].value = setting.Bot;
  inputs[1].highlightPoints = boolean(setting.PointsBot);
  inputs[1].highlightLine = boolean(setting.LineBot);
  inputs[1].highlightParametric = boolean(setting.ParametricBot);
  inputs[1].highlightFunction = boolean(setting.FunctionBot);
  inputs[1].highlightPolar = boolean(setting.PolarBot);

  if (inputs[1].highlightParametric) {
    inputs[1].mode = 1;
  } else {
    if (inputs[1].highlightFunction) {
      inputs[1].mode = 2;
    } else {
      if (inputs[1].highlightPolar) {
        inputs[1].mode = 3;
      }
    }
  }

  inputs[0].calculatePoints();
  inputs[1].calculatePoints();
}

/****************************** Sheets *******************************/

function getSheetData() {
  Tabletop.getSheetData(
    {
      key: publicSpreadsheetUrl,
      callback: showInfo,
      simpleSheet: true
    }
  )
}

function sendData() {
  getSheetData();
  //document.getElementById("frm1").submit();
}

function showInfo(data, tabletop) {
  sheet = data;
  console.log(sheet);
}



/****************************** Events and Buttons *******************************/

function mouseWheel(event) {
  mX = (mouseX - width / 2) / windowScale;
  mY = (mouseY - height / 2) / windowScale;
  if (mX > -640 && mX < 640 && mY > -360 && mY < 360) {
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
    updateDraw = true;
    return false;
  }
}

function buttonSide(num) {
  if (num < 6) {
    try {
      setGraph(sheet[num + (leftSidePage * 6)]);
    } catch {
      console.log("ERROR: Custom graph data not found");
    }
    return;
  }
  if (num == 6 ) {
    leftSidePage = constrain(leftSidePage - 1, 0, 2);
    console.log("Previous custom graph page: ",leftSidePage);
  }
  if (num == 7) {
    leftSidePage = constrain(leftSidePage + 1, 0, 2);
    console.log("Next custom graph page: ",leftSidePage);
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

function scaleRectHighlight(x, y, w, h, condition, highlightColor) {
  if (condition) {
    fill(highlightColor);
  } else {
    noFill();
  }
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
  constructor(num) {
    this.number = num;
    this.mode; // 1 == parametric, 2 == function, 3 == polar

    /* Graph */
    this.x = new Array(2000);
    this.y = new Array(2000);
    this.minX = -20;
    this.maxX = 20;
    this.dots = 1000;

    /* HTML */

    if (num == 0) {
      this.inputHTML = document.getElementsByClassName("level-0");
    } else {
      this.inputHTML = document.getElementsByClassName("level-1");
    }
    this.equationOriginal = this.inputHTML[0].children[0].value;

    /* Outputs */
    this.color = color(255, 0, 255);
    this.highlightInput = false;
    this.highlightPoints = false;
    this.highlightLine = true;
    this.highlightClear = false;
    this.highlightParametric = false;
    this.highlightFunction = true;
    this.highlightPolar = false;

    this.mode = 2;

    this.inputText = "";
  }

  /* Buttons */

  buttonParametric() {
    inputs[0].highlightParametric = true;
    inputs[1].highlightParametric = true;
    inputs[0].highlightPolar = false;
    inputs[1].highlightPolar = false;
    inputs[0].highlightFunction = false;
    inputs[1].highlightFunction = false;
  }

  buttonFunction() {
    this.highlightFunction = true;
    this.highlightPolar = false;
    this.mode = 2;
    this.calculatePoints();
    if (inputs[0].highlightParametric) {
      inputs[0].highlightFunction = true;
      inputs[1].highlightFunction = true;
    }
    inputs[0].highlightParametric = false;
    inputs[1].highlightParametric = false;
  }

  buttonPolar() {
    this.highlightPolar = true;
    this.highlightFunction = false;
    this.mode = 3;
     this.calculatePoints();
    if (inputs[0].highlightParametric) {
      inputs[0].highlightPolar = true;
      inputs[1].highlightPolar = true;
    }
    inputs[0].highlightParametric = false;
    inputs[1].highlightParametric = false;
  }

  buttonInput() {
    //  if (this.highlightInput) {
    //    this.highlightInput = false;
    //  } else {
    //    inputs[0].highlightInput = false;
    //    inputs[1].highlightInput = false;
    //    this.highlightInput = true;
    //  }
  }

  buttonPoints() {
    this.highlightPoints = !this.highlightPoints;
    updateDraw = true;
  }

  buttonLine() {
    this.highlightLine = !this.highlightLine;
    updateDraw = true;
  }

  buttonClear() {

  }

  /* Inputs */

  checkInput() {
    if (document.activeElement.name == "input-" + this.number) {
      this.highlightInput = true;
    } else {
      this.highlightInput = false;
    }
  }

  /* Calculate */

  calculatePoints() {
    var solveTimeStart = millis();
    this.equationOriginal = this.inputHTML[0].children[0].value;
    var testDerivative = math.derivative(this.equationOriginal, 'x').toString();
    console.log("Derivative:",testDerivative);
    if (this.mode == 2) {
      this.minX = -20;
      this.maxX = 20;
      this.calculateFunction();
    } else {
      if (this.mode == 3) {
        this.minX = 0;
        this.maxX = 2*PI;
        this.calculatePolar();
      }
    }
    solveTime = millis() - solveTimeStart;
  }

  calculateFunction() {
    var currentEval = this.minX;
    var varChange = (this.maxX - this.minX) / this.dots;
    for (var i = 0; i < this.dots; i++) {
      currentEval += varChange;
      let scope = {
        x: currentEval
      };
      try {
        this.x[i] = currentEval;
        this.y[i] = math.eval(this.equationOriginal, scope);
        this.y[i] *= -1;
      }
      catch {
        //console.log("Invalid Input");
      }
    }
    updateDraw = true;
  }

  calculatePolar() {
    var currentEval = this.minX;
    var varChange = (this.maxX - this.minX) / this.dots;
    for (var i = 0; i < this.dots; i++) {
      currentEval += varChange;
      let scope = {
        x: currentEval
      };
      try {
        this.x[i] = math.eval(this.equationOriginal, scope) * cos(currentEval);
        this.y[i] = math.eval(this.equationOriginal, scope) * sin(currentEval);
        this.y[i] *= -1;
      }
      catch {
        //console.log("Invalid Input");
      }
    }
    updateDraw = true;
  }

  /* Draw */

  draw() {
    stroke(this.color);
    for (var i = 1; i < 1000; i++) {
      scaleStrokeWeight(5);
      if (this.highlightPoints) {
        scalePoint((this.x[i] * graphScale * windowScale) + translateX, (this.y[i] * graphScale * windowScale) + translateY);
      }
      if (this.highlightLine) {
        scaleLine((this.x[i] * graphScale * windowScale) + translateX, (this.y[i] * graphScale * windowScale) + translateY, (this.x[i-1] * graphScale * windowScale) + translateX, (this.y[i-1] * graphScale * windowScale) + translateY);
      }
    }
    updateDraw = false;
  }
}