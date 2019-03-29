var graphw = 1280, graphh = 720, windowScale = 1.5;                         // Graph settings
var scroll = 50, translateX = 0, translateY = 0, current = "none";          // Transformation settings
var xMin = -25, xMax = 25, xMin1 = -25, xMax1 = 25;
var manualDots = false;
var updateDraw = true;                                                      // 
var solveTime = 0;                                                          //
var leftSidePage = 0, bottomPage = 0;                                       // Page number for custom equations
var sheet;                                                                  // Google Sheet
var graphScale = 100;                                                       // Graph magnifier
var inputs = new Array(2);                                                  // Input classes with settings

function setup() {
  mainCanvas = createCanvas(1, 1);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  mainCanvas.parent('sketch-holder');
  inputs[0] = new Equation(0); // Top equation
  inputs[1] = new Equation(1); // Bottom equation
  setWindowSize();
  setupArrays();
  getSheetData();
}

function setupArrays() {
}

function draw() {
  translate(width / 2, height / 2);
  moveGraph();
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
  scaleRect(0, 0, graphw, graphh); // Erase graph background
}

function drawGraphFrame() {
  stroke(0);
  scaleStrokeWeight(6);
  noFill();
  scaleRect(0, 0, graphw, graphh); // Graph window border
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

  scaleRect(-580, 440, 120, 110); // Previous Page bottom bar
  scaleRect(580, 440, 120, 110); // Next page bottom bar

  if (bottomPage == 0) {
    scaleRect(0, 470, 230, 50); // Reset graph transformations
    scaleRect(-60, 410, 110, 50); // Up arrow transformation
    scaleRect(60, 410, 110, 50); // Down arrow transformation
    scaleRect(-180, 440, 110, 110); // Left arrow transformation
    scaleRect(180, 440, 110, 110); // Right arrow transformation
  }

  if (bottomPage == 1) {
    scaleRect(-200, 440, 110, 110); // Dots top
    scaleRect(-80, 440, 110, 110); // Reset top
    scaleRect(80, 440, 110, 110); // Reset bot
    scaleRect(200, 440, 110, 110); // Dots bot
    if (manualDots) {
      stroke(inputs[0].color); // Left boxes highlighted same as top
      scaleRect(-260, 440, 480, 120);
      stroke(inputs[1].color); // Right boxes highlighted same as bot
      scaleRect(260, 440, 480, 120);
    }
    stroke(0);
  }

  scaleRect(-320, 440, 110, 110); // Scale + // Min x top
  scaleRect(320, 440, 110, 110); // fullscreen // Min x bot

  scaleRect(-440, 440, 110, 110); // Scale - // Max x top
  scaleRectHighlight(440, 440, 110, 110, manualDots && bottomPage == 0, color(255, 255, 0)); // toggle manual // Max x bot

  for (i = 0; i < 8; i++) {
    scaleRectHighlight(-820, -250 + 70 * i, 204, 50); // Custom equation boxes (left)
    scaleRectHighlight(820, -250 + 70 * i, 204, 50); // Solving boxes (right)
  }

  /*    Text    */

  fill(0);
  stroke(0);
  scaleStrokeWeight(1);
  scaleTextSize(20);

  scaleText("r(\u03B8)", -440, -470); // f1(x) Polar Button (\u03B8 is theta symbol)
  scaleText("f(x)", -520, -470); // f1(x) Function Button
  scaleText("x(t)", -600, -470); // f1(x) Parametric Button
  scaleText("Points", 440, -470); // f1(x) Points Button
  scaleText("Line", 520, -470); // f1(x) Line Button 
  scaleText("Clear", 600, -470);  // f1(x) Clear Button

  scaleText("r(\u03B8)", -440, -410); // f2(x) Polar Button (\u03B8 is theta symbol)
  scaleText("f(x)", -520, -410); // f2(x) Function Button
  scaleText("y(t)", -600, -410); // f2(x) Parametric Button
  scaleText("Points", 440, -410); // f2(x) Points Button
  scaleText("Line", 520, -410); // f2(x) Line Button 
  scaleText("Clear", 600, -410); // f2(x) Clear Button

  for (i = 0; i < 6; i++) { // Custom function display name
    try {
      scaleText(sheet[i + (leftSidePage * 6)].Display, -820, -250 + 70 * i);
    } catch {
      scaleText("Loading . . .", -820, -250 + 70 * i); // Shown when equations not loading or dont exist
    }
  }

  scaleText("Previous Page", -820, 170); // left buttons
  scaleText("Next Page", -820, 240); // right buttons

  scaleText("", 820, -250); // Undecided
  scaleText("", 820, -180); // Undecided
  scaleText("", 820, -110); // Undecided
  scaleText("", 820, -40); // Undecided
  scaleText("", 820, 30); // Undecided
  scaleText("", 820, 100); // Undecided

  scaleTextSize(25);
  scaleText("Previous \nPage", -580, 440);
  scaleText("Next \nPage", 580, 440);

  if (bottomPage == 0) {
    scaleText("Reset", 0, 470);

    scaleText("Scale \n-", -440, 440);
    scaleText("Scale \n+", -320, 440);
    scaleText("Full \nscreen", 320, 440);
    scaleText("Manual \nDots", 440, 440);

    scaleTextSize(35);
    scaleText("\u2191", -60, 405); // Up arrow (bottom buttons)
    scaleText("\u2193", 60, 405); // Down arrow (bottom buttons)
    scaleTextSize(60);
    scaleText("\u2190", -180, 435); // Left arrow (bottom buttons)
    scaleText("\u2192", 180, 435); // Right arrow (bottom buttons)


  }
  if (bottomPage == 1) {
    scaleText("Max X", -440, 410);
    scaleText("Min X", -320, 410);
    scaleText("Dots", -200, 410);
    scaleText("Reset", -80, 440);
    scaleText("Reset", 80, 440);
    scaleText("Dots", 200, 410);
    scaleText("Min X", 320, 410);
    scaleText("Max X", 440, 410);
  }

  fill(0);
  scaleTextSize(15);
  textAlign(CENTER);
  noStroke();
  scaleText("FPS: " + round(frameRate()) + " Solve Time: " + round(solveTime) + "ms " + " Scale: " + graphScale + " Top Dots: " + inputs[0].dots + " Bot Dots: " + inputs[1].dots + " Scroll: " + scroll + " Min/Max X Top: " + inputs[0].minX +","+inputs[0].maxX  + " Min/Max X Bot: " + inputs[1].minX +","+inputs[1].maxX + " Manual: " + manualDots, 0, -370);
  noFill();
}

function checkInputs() {
  mX = (mouseX - width / 2) / windowScale; // Mouse position with 0,0 in center
  mY = (mouseY - height / 2) / windowScale;
  pMX = (pmouseX - width / 2) / windowScale;
  pMY = (pmouseY - height / 2) / windowScale;
  if (mX > -640 && mX < 640 && mY > -360 && mY < 360) {
    if (mouseButton == LEFT && mouseIsPressed) { // Move inside of graph window
      translateX -= pMX - mX;
      translateY -= pMY - mY;
      updateDraw = true;
    }
  }
  inputs[0].checkInput(); // Highlight top textbox if focused
  inputs[1].checkInput(); // Highlight bottom textbox if focused
}

function setGraph(setting) {
  inputs[0].inputHTML[0].children[0].value = setting.Top; // Set top input to saved settings
  inputs[0].highlightPoints = boolean(setting.PointsTop);
  inputs[0].highlightLine = boolean(setting.LineTop);
  inputs[0].highlightParametric = boolean(setting.ParametricTop);
  inputs[0].highlightFunction = boolean(setting.FunctionTop);
  inputs[0].highlightPolar = boolean(setting.PolarTop);
  inputs[0].dots = setting.Dots;

  inputs[1].inputHTML[0].children[0].value = setting.Bot; // Set bottom input to saved settings
  inputs[1].highlightPoints = boolean(setting.PointsBot);
  inputs[1].highlightLine = boolean(setting.LineBot);
  inputs[1].highlightParametric = boolean(setting.ParametricBot);
  inputs[1].highlightFunction = boolean(setting.FunctionBot);
  inputs[1].highlightPolar = boolean(setting.PolarBot);
  inputs[1].dots = setting.Dots;

  for (i = 0; i < 2; i++) { // Change modes to match new settigns
    if (inputs[i].highlightParametric) {
      inputs[i].mode = 1;
    } else {
      if (inputs[i].highlightFunction) {
        inputs[i].mode = 2;
      } else {
        if (inputs[i].highlightPolar) {
          inputs[i].mode = 3;
        }
      }
    }
  }

  calculateAllPoints(); // Calculates both equations
}

function changeScale(scroll) {
  if (scroll <= 10) {
    graphScale = scroll * .1;
  }
  else {
    if (scroll <= 20) {
      graphScale = (scroll - 10) * 1;
    }
    else {
      if (scroll <= 50) {
        graphScale = ((scroll - 20) * 3) + 10;
      }
      else {
        if (scroll <= 70) {
          graphScale = (scroll - 30) * 5;
        }
        else {
          if (scroll <= 90) {
            graphScale = (scroll - 50) * 10;
          }
          else {
            if (scroll <= 100) {
              graphScale = (scroll - 70) * 20;
            }
            else {
              if (scroll <= 110) {
                graphScale = (scroll - 85) * 40;
              }
              else {
                if (scroll <= 120) {
                  graphScale = (scroll - 100) * 100;
                }
                else {
                  graphScale = (scroll - 118) * 1000;
                }
              }
            }
          }
        }
      }
    }
  }
}

function calculateAllPoints() {
  inputs[0].calculatePoints();
  inputs[1].calculatePoints();
}

function bottomPageVisibility() {
  document.getElementById("bottom-page-0").style.visibility = "hidden";
  document.getElementById("bottom-page-1").style.visibility = "hidden";
  document.getElementById("bottom-page-" + bottomPage).style.visibility = "visible";
}

function updateFromInputs() {
  inputs[0].maxXUnits = document.getElementById("max-x-top").value;
  inputs[0].minXUnits = document.getElementById("min-x-top").value;
  inputs[0].dots = document.getElementById("dots-top").value;
  inputs[1].maxXUnits = document.getElementById("max-x-bot").value;
  inputs[1].minXUnits = document.getElementById("min-x-bot").value;
  inputs[1].dots = document.getElementById("dots-bot").value;
  manualDots = true;
  calculateAllPoints();
}



/****************************** Sheets *******************************/

function getSheetData() {
  Tabletop.getSheetData(
    {
      key: "https://docs.google.com/spreadsheets/d/1-NWCOzH_p1rwonypFwjT6pCwmvPlxbFBbmo2TEh-ECs/edit?usp=sharing", // Google sheet public url
      callback: showInfo,
      simpleSheet: true // Delete this line if using more than one sheet
    }
  )
}

function sendData() {
  getSheetData();
}

function showInfo(data, tabletop) {
  sheet = data;
  console.log("Data downloaded:", sheet);
}



/****************************** Events and Buttons *******************************/

function mouseWheel(event) {
  mX = (mouseX - width / 2) / windowScale;
  mY = (mouseY - height / 2) / windowScale;
  if (mX > -640 && mX < 640 && mY > -360 && mY < 360) { // Only scroll if mouse is hovering over graph window
    if (event.delta > 0) {
      var amount = 1;
    } else {
      amount = -1;
    }
    var wheel = -1 * amount;
    scroll = constrain(scroll + wheel, 0, 128);
    changeScale(scroll);
    updateDraw = true;
    return false; // Prevent browser scrolling
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
  if (num == 6) { // Previous page button
    leftSidePage = constrain(leftSidePage - 1, 0, 2);
    console.log("Previous custom graph page: ", leftSidePage);
  }
  if (num == 7) { // Next page button
    leftSidePage = constrain(leftSidePage + 1, 0, 2);
    console.log("Next custom graph page: ", leftSidePage);
  }
}

function bottomPreviousPage() {
  bottomPage = constrain(bottomPage - 1, 0, 2);
  bottomPageVisibility();
}

function bottomNextPage() {
  bottomPage = constrain(bottomPage + 1, 0, 2);
  bottomPageVisibility();
}

function resetTransformations() {
  translateX = 0;
  translateY = 0;
  graphScale = 100;
  calculateAllPoints();
  updateDraw = true;
}

function moveGraph() {
  checkInputs();
  if (current == "none") {
    return;
  }
  if (current == "left") {
    translateX -= 10;
  }
  if (current == "right") {
    translateX += 10;
  }
  if (current == "up") {
    translateY -= 10;
  }
  if (current == "down") {
    translateY += 10;
  }
  if (current == "scroll+") {
    scroll = constrain(scroll + 1, 0, 128);
    changeScale(scroll);
  }
  if (current == "scroll-") {
    scroll = constrain(scroll - 1, 0, 128);
    changeScale(scroll);
  }
  updateDraw = true;
}

function moveStart(direction) {
  current = direction;
  return false;
}

function moveEnd() {
  current = "none";
  return false;
}

function toggleManual() {
  manualDots = !manualDots;
  if (manualDots) {
    updateFromInputs();
  }
  calculateAllPoints();
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
  setTimeout(function () { updateDraw = true; }, 500);
}



/****************************** Classes *******************************/

class Equation {
  constructor(num) {
    this.number = num;
    this.mode; // 1 == parametric, 2 == function, 3 == polar

    /* Graph */
    this.x = new Array(2000);
    this.y = new Array(2000);
    this.minXUnits = -25;
    this.maxXUnits = 25;
    this.minX = this.minXUnits;
    this.maxX = this.maxXUnits;
    this.dots = 400;

    /* HTML */

    if (num == 0) {
      this.inputHTML = document.getElementsByClassName("level-0");
    } else {
      this.inputHTML = document.getElementsByClassName("level-1");
    }
    this.equationOriginal = this.inputHTML[0].children[0].value;

    /* Outputs */
    if (this.number == 0) {
      this.color = color(255, 0, 0);
    } else {
      this.color = color(0, 0, 255);
    }
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
    this.mode = 1;
    this.calculatePoints();
    inputs[1].clearPoints();
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

  buttonPoints() {
    this.highlightPoints = !this.highlightPoints;
    updateDraw = true;
  }

  buttonLine() {
    this.highlightLine = !this.highlightLine;
    updateDraw = true;
  }

  buttonClear() {
    this.inputHTML[0].children[0].value = "";
    calculateAllPoints();
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
    try {
      var testDerivative = math.derivative(this.equationOriginal, 'x').toString();
      console.log("Derivative (", this.number, ") :", testDerivative);
      if (!manualDots && this.mode == 2) {
        if (testDerivative < 100) {
          console.log("Equation (", this.number, ") is a line");
          this.dots = 2;
          this.minXUnits = -100000;
          this.maxXUnits = 100000;
        } else {
          this.dots = 400;
          this.minXUnits = -25;
          this.maxXUnits = 25;
        }
      }
    } catch {
      console.log("Derivative not avalible (", this.number, ")");
    }
    if (this.mode == 1) {
      //if (this.number == 0) {
      this.minX = this.minXUnits;
      this.maxX = this.maxXUnits;
      this.calculateParametric();
      //}
    } else {
      if (this.mode == 2) {
        this.minX = this.minXUnits;
        this.maxX = this.maxXUnits;
        this.calculateFunction();
      } else {
        if (this.mode == 3) { // polar
          this.minX = (this.minXUnits + 25) / 25 * PI;
          this.maxX = (this.maxXUnits + 25) / 25 * PI;
          this.calculatePolar();
        }
      }
    }
    solveTime = millis() - solveTimeStart;
  }

  calculateFunction() {
    var currentEval = this.minX;
    var varChange = (this.maxX - this.minX) / (this.dots - 1);
    currentEval -= varChange;
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
        console.log("Invalid Input (", this.number, ")");
        return;
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
        console.log("Invalid Input");
      }
    }
    updateDraw = true;
  }

  calculateParametric() {
    console.log("Parametric");
    var currentEval = this.minX;
    var varChange = (this.maxX - this.minX) / this.dots;
    for (var i = 0; i < this.dots; i++) {
      currentEval += varChange;
      let scope = {
        x: currentEval
      };
      try {
        this.x[i] = math.eval(inputs[0].equationOriginal, scope);
        this.y[i] = math.eval(inputs[1].equationOriginal, scope);
        this.y[i] *= -1;
      }
      catch {
        console.log("Invalid Input");
      }
    }
    updateDraw = true;
  }

  clearPoints() {
    for (var i = 0; i < 2000; i++) {
      this.x[i] = 0;
      this.y[i] = 0;
    }
  }

  /* Draw */

  draw() {
    stroke(this.color);
    for (var i = 0; i < this.dots; i++) {
      scaleStrokeWeight(15);
      if (this.highlightPoints) {
        scalePoint((this.x[i] * graphScale * windowScale) + translateX, (this.y[i] * graphScale * windowScale) + translateY);
      }
      scaleStrokeWeight(5);
      if (this.highlightLine) {
        scaleLine((this.x[i] * graphScale * windowScale) + translateX, (this.y[i] * graphScale * windowScale) + translateY, (this.x[i - 1] * graphScale * windowScale) + translateX, (this.y[i - 1] * graphScale * windowScale) + translateY);
      }
    }
    updateDraw = false;
  }
}