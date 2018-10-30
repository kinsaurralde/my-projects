var cols = 40, rows, width;
var grid, next;
var output;
var active = false, timeout;
var speed = 10;
var lastCellAlive = false;
var currentX = 0, currentY = 0, currentI = 0, currentJ = 0;
var canDraw = true;

/****************************** Setups *******************************/

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

function reset() {
    stop();
    output = new OutputConsole();
    rows = cols / 2;
    size = 1600 / cols;
    grid = create2DArray(cols, rows);
    next = create2DArray(cols, rows);
    createCells();
}

function create2DArray(cols, rows) {
    arr = new Array(cols);
    for (i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function createCells() {
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j);
            //next[i][j] = new Cell(i, j);
        }
    }
}



/****************************** Main *******************************/

function draw() {
    background(255);
    translate(width / 2, height / 2);

    checkInput();

    drawGrid();
    //noLoop();
}

function drawGrid() {
    fill(0);
    noStroke();
    scaleTextSize(80);
    scaleText("Conway's Game of Life",0,-500);
    noFill();
    scaleStrokeWeight(10);
    stroke(0);
    scaleRect(0, 0, 1600, 800, 0);
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            grid[i][j].draw();
        }
    }
}

function drawCells() {
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            grid[i][j].draw();
        }
    }
}

function calculate() {
    next = create2DArray(cols, rows);
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            //console.log("ALive",i,j,grid[i][j].alive);
            grid[i][j].nextGen();
        }
    }
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            //console.log("Next",i,j,grid[i][j].sum);
            grid[i][j].alive = next[i][j];
        }
    }
    timeout = setTimeout(function() {calculate()}, speed);
    
}



/******************************Inputs *******************************/

function mousePressed() {
    getCoords();
    try {
        if (currentI > -1 && currentI < cols && currentJ > -1 && currentJ < rows) {
            lastCellAlive = !grid[currentI][currentJ].alive;
        }
    } catch(e) {
        console.log(e);
        console.log(currentI,currentJ);
    }
}

function mouseReleased() {
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            grid[i][j].switched = false;
        }
    }
}

function checkInput() {
    if (mouseIsPressed && canDraw) {
        getCoords();
        if (currentI > -1 && currentI < cols && currentJ > -1 && currentJ < rows) {
            grid[currentI][currentJ].switch(lastCellAlive);
        }
    }
}


function getCoords() {
    currentX = round(mouseX * (1 / windowScale) - 160);
    currentY = round(mouseY * (1 / windowScale) - 140);
    currentI = floor(currentX / size);
    currentJ = floor(currentY / size);
}

/****************************** Buttons *******************************/

function start() {
    if (!active) {
        calculate();
        active = true;
    }
}

function stop() {
    clearTimeout(timeout);
    active = false;
}

function setSize() {
    temp = document.getElementById("setting-size").value;
    if (temp > 1 && temp < 101) {
        if (temp % 2 == 0) {
            cols = temp;
        }
    } else {
        document.getElementById("setting-size").value = cols;
    }
    reset();
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
    document.getElementById("console").style.top = 960 * windowScale + "px";
}

function fullScreen() {
    fs = fullscreen();
    fullscreen(!fs);
}



/****************************** Classes *******************************/

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.switched = false;
        this.color = color(255, 0, 255);
        //this.alive = !boolean(floor(random(10)));
        this.alive = false;
    }

    draw() {
        scaleStrokeWeight(1);
        stroke(0);
        if (this.alive) {
            fill(this.color);
        } else {
            fill(255);
        }
        scaleRect(-800 + size / 2 + size * this.x, -400 + size / 2 + size * this.y, size, size, 0);
    }

    switch(status) {
        if (!this.switched) {
            this.alive = status;
            this.switched = true;
            output.print(5, "Current Position: " + currentX + "," + currentY + "   Current Cell: " + currentI + "," + currentJ);
        }
    }

    nextGen() {
        this.numNeigboors = this.checkNeighboors();
        //console.log("Neighboors of",this.x,this.y," = ",this.numNeigboors);
        if (this.alive) {
            if (this.numNeigboors > 3 || this.numNeigboors < 2) {
                next[this.x][this.y] = false;
            } else {
                next[this.x][this.y] = true;
            }
        } else {
            if (this.numNeigboors == 3) {
                next[this.x][this.y] = true;
            }
        }
    }

    checkNeighboors() {
        this.sum = 0;
        for (this.i = -1; this.i < 2; this.i++) {
            for (this.j = -1; this.j < 2; this.j++) {
                var checkI = (this.x + this.i + cols) % cols;
                var checkJ = (this.y + this.j + rows) % rows;
                //var checkI = this.x + this.i;
                //var checkJ = this.y + this.j;
                try {
                    if (grid[checkI][checkJ].alive) {
                        this.sum++;
                    }
                } catch(e) {
                    
                }
            }
        }
        if (this.alive) {
            this.sum--;
        }
        return this.sum;
    }
}

class OutputConsole {
    constructor() {
        this.outBox = document.getElementById("console");
    }

    print(lvl,msg) {
        if (lvl < 10) {
            this.outBox.innerHTML += msg;
            this.outBox.innerHTML += "\n";
            this.outBox.scrollTop = this.outBox.scrollHeight;
        }
        console.log("Level",lvl,"Message:",msg);
    }
}