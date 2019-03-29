var windowScale, windowWidth;
var poles = new Array(3);
var n = 3;
var diskWidth;
var steps;
var currentStep = 0;
var autoRun, autoOn = false;

function setup() {
    mainCanvas = createCanvas(1, 1);
    background(0);
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    mainCanvas.parent('sketch-holder');

    reset();

    setWindowSize();
}

function draw() {
    background(255);
    translate(width / 2, height / 2);
    stroke(0);
    scaleStrokeWeight(5);
    noFill();
    rect(0, 0, width, height);

    drawPoles();

    noLoop();
}

function reset() {
    console.log("\n\nReset\n\n");
    inputValue = document.getElementById("ecs036a-02-input").value;
    resetAuto();
    //stepsDone();
    if (inputValue > 12 || inputValue < 1) {
        if (inputValue != "") {
            document.getElementById("ecs036a-02-input").value = n;
        }
    } else {
        n = inputValue;
    }
    diskWidthChange = 96 / constrain(n - 1, 1, 12);
    for (i = 0; i < 3; i++) {
        poles[i] = new Pole(i);
    }

    for (i = n - 1; i > -1; i--) { // n - 1
        poles[0].stack.push(i);
    }

    for (i = 0; i < 3; i++) {
        poles[i].reset();
    }
    redraw();
}

function drawPoles() {
    for (i = 0; i < 3; i++) {
        poles[i].draw();
    }
}

function move(src, dst, usr) {
    if (usr) {
        console.log("User Clicked Move");
        resetAuto();
        stepsDone();
    }
    if (poles[dst].stack.length > 0) {
        srcLast = poles[src].stack[poles[src].stack.length - 1];
        dstLast = poles[dst].stack[poles[dst].stack.length - 1];
    } else {
        srcLast = 0;
        dstLast = 1;
    }
    if (poles[src].stack.length > 0 && srcLast < dstLast) {
        tmp = poles[src].stack.pop();
        poles[dst].stack.push(tmp);
        console.log("Move", src, dst);
    }
    redraw();
}

function resetAuto() {
    steps = outputList.length;
    currentStep = 0;
    updateSteps();
}

function updateSteps() {
    document.getElementById("ecs036a-02-auto-step-count").innerHTML = currentStep + " / " + steps;
    try {
        document.getElementById("ecs036a-02-auto-step").innerHTML = "Move Disk From "+outputList[currentStep][0]+" to "+outputList[currentStep][1];
    } catch(e) {
        console.log("Error",e);
    }
}

function nextStep() {
    if (currentStep == 0) {
        reset();
    }
    if (currentStep < steps) {
        var toMove = new Array(2);
        for (i = 0; i < 2; i++) {
            if (outputList[currentStep][i] == "A") {
                toMove[i] = 0;
            } else {
                if (outputList[currentStep][i] == "B") {
                    toMove[i] = 1;
                } else {
                    toMove[i] = 2;
                }
            }
        }
        move(toMove[0],toMove[1]);
        currentStep++;
        updateSteps();
    }
    if (currentStep == steps) {
        stepsDone();
    }
}

function stepsDone() {
    console.log("Auto Off");
    updateSteps();
    clearInterval(autoRun);
    autoOn = false;
}

function autoStart() {
    console.log("Auto Start:",autoOn);
    if (!autoOn) {
        reset();
        var autoSpeed = constrain(5000/steps,1,500);
        console.log("autospeed",autoSpeed);
        autoOn = true;
        autoRun = setInterval(function() {
            nextStep();
        }, autoSpeed);
    }
}



/****************************************  Window Resizing  ****************************************/

function windowResized() { // js function runs when window is resized
    setWindowSize();
    redraw();
}

function setWindowSize() { // Resizes canvas and sets windowScale
    windowWidth = document.getElementById("sketch-holder").offsetWidth - 10;
    windowScale = windowWidth / 480;
    console.log("Window Scale:", windowScale, windowWidth);
    resizeCanvas(windowWidth, (windowWidth * 9 / 16));
}



/****************************************  Scaled Shapes  ****************************************/

function scaleRect(x, y, w, h) {
    rect(x * windowScale, y * windowScale, w * windowScale, h * windowScale);
}

function scaleLine(x1, y1, x2, y2) {
    line(x1 * windowScale, y1 * windowScale, x2 * windowScale, y2 * windowScale);
}

function scaleStrokeWeight(x) {
    strokeWeight(x * windowScale);
}

function scaleTextSize(x) {
    textSize(x * windowScale);
}

function scaleText(txt, x, y) {
    text(txt, x * windowScale, y * windowScale);
}



/****************************************  Class  ****************************************/

class Pole {
    constructor(position) {
        this.position = position;
        this.x = -160 + this.position * 160;
        this.stack = new Array();
        this.current;
        this.i;
        this.widthChange;
    }

    reset() {

    }

    draw() {
        scaleStrokeWeight(10);
        scaleLine(this.x, -40, this.x, 160);

        scaleTextSize(30);
        noStroke();
        fill(0);
        if (this.position == 0) {
            scaleText("A", this.x, -80);
        } else {
            if (this.position == 1) {
                scaleText("B", this.x, -80);
            } else {
                scaleText("C", this.x, -80);
            }
        }

        stroke(0);
        scaleStrokeWeight(2);
        this.current = 0;
        for (this.i = 0; this.i < this.stack.length; this.i++) {
            var r = constrain(255-(this.stack[this.i]-3)*40,0,255);
            var g = constrain(255,0,255);
            var b = constrain((this.stack[this.i]-6)*40,0,255);
            fill(r, g, b);
            scaleRect(this.x, 125 - this.current * 15, 30 + diskWidthChange * this.stack[this.i], 15)
            this.current++;
        }
    }
}