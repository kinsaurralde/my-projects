var shapes = [];
var vertices = [];
var dotsDrawn = 100;



function setup() {
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    mainCanvas = createCanvas(windowWidth, windowHeight);
    mainCanvas.parent('sketch-holder');
    setWindowSize();
    frameRate(30);
}

function draw() {
    frameRate(1);
    translate(width / 2, height / 2);
    background(0);

    scaleStrokeWeight(2);
    stroke(255);
    noFill();
    scaleRect(0, 0, 1025, 1025, 10);

    for (num = 0; num < shapes.length; num++) {
        shapes[num].next();
        shapes[num].draw();
    }

    drawLabels();
}

function pushShape() {
    let n = document.getElementById("chaos-vertices").value;
    let mode = document.getElementById("chaos-mode").value;
    let r = document.getElementById("chaos-r").value;
    let g = document.getElementById("chaos-g").value;
    let b = document.getElementById("chaos-b").value;
    let dpf = document.getElementById("chaos-dpf").value;
    let percent = document.getElementById("chaos-percent").value;
    let maxPoints = document.getElementById("chaos-max-points").value;
    vertices = calcVertices(n, mode);
    let newShape = new Shape(vertices, [floor(random(-500, 500)), floor(random(-500, 500))], color(r, g, b), dpf, percent, maxPoints);
    shapes.push(newShape);
}

function popShape() {
    if (shapes.length > 0) {
        shapes.pop();
    }
}

function clearAllShapes() {
    while (shapes.length > 0) {
        shapes.pop();
    }
}

function drawLabels() {
    fill(255);
    noStroke();
    scaleTextSize(35);
    scaleText("Vertices", -765, -270);
    scaleText("Color", -765, -80);
    scaleText("Dots per Frame", -765, 40);
    scaleText("Max Dots", -765, 150);
    scaleText("Distance %", -765, 260);

    scaleText("Percent Dots Drawn", 730, 150);
}

function calcVertices(n, mode) {
    let output = [];
    if (mode == "random") {
        output = randomVertices(n);
    } else if (mode == "equal") {
        for (i = 0; i < n; i++) {
            let a = i * TWO_PI / n;
            let vec = p5.Vector.fromAngle(a);
            let r = 3 * PI / 2;
            let x = (vec.x * cos(r) - vec.y * sin(r)) * 500;
            let y = (vec.x * sin(r) + vec.y * cos(r)) * 500;
            output.push([x, y]);
        }
    }
    return output
}

function randomVertices(n) {
    let output = [];
    for (i = 0; i < n; i++) {
        output.push([floor(random(-500, 500)), floor(random(-500, 500))])
    }
    return output
}

function sierpinski() {
    let n = document.getElementById("chaos-vertices").value;
    let r = 100 - sierpinskiSolve(n);
    document.getElementById("chaos-percent").value = r;
    document.getElementById("chaos-mode").value = "equal";
    document.getElementById("chaos-dpf").value = "5000";
    document.getElementById("chaos-max-points").value = "50000";
    pushShape();
}

function sierpinskiSolve(n) {
    let sum = 0;
    for (i = 1; i <= n / 4; i++) {
        sum += cos((TWO_PI * i) / n);
    }
    let r = (1 / (2 * (1 + sum))) * 100
    return r
}

function updateSliders() {
    frameRate(30);
    dotsDrawn = document.getElementById("chaos-draw-end").value;
    loop();
}



class Shape {
    constructor(vertices, initial, color, dpf, percent, maxPoints) {
        this.initial = initial;
        this.vertices = vertices;
        this.n = this.vertices.length;
        this.points = [this.initial];
        this.color = color;
        this.dpf = dpf;
        this.percent = percent / 100;
        this.maxPoints = maxPoints;
    }

    next() {
        if (this.points.length < this.maxPoints) {
            frameRate(30);
            for (this.i = 0; this.i < this.dpf; this.i++) {
                this.lastPoint = [this.points[this.points.length - 1][0], this.points[this.points.length - 1][1]];
                this.random = floor(random(0, this.n));
                this.nextPoint = [lerp(this.lastPoint[0], this.vertices[this.random][0], this.percent), lerp(this.lastPoint[1], this.vertices[this.random][1], this.percent)];
                this.points.push(this.nextPoint);
            }
        }
    }

    draw() {
        this.drawVertices();
        this.drawPoints();
    }

    drawVertices() {
        scaleStrokeWeight(10);
        stroke(255);
        for (let i = 0; i < this.n; i++) {
            scalePoint(this.vertices[i][0], this.vertices[i][1]);
        }
    }

    drawPoints() {
        scaleStrokeWeight(10);
        stroke(255);
        scalePoint(this.points[0][0], this.points[0][1]);

        scaleStrokeWeight(2);
        stroke(this.color);
        let maxDotNum = floor(this.points.length * dotsDrawn / 100)
        for (let i = 1; i < maxDotNum; i++) {
            scalePoint(this.points[i][0], this.points[i][1]);
        }
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
    redraw();
}

function setWindowSize() { // Resizes canvas and sets windowScale
    windowScale = (windowWidth - 10) / 1920;
    resizeCanvas(windowWidth - 10, ((windowWidth - 10) * 9 / 16));
}

function fullScreen() {
    fs = fullscreen();
    fullscreen(!fs);
}