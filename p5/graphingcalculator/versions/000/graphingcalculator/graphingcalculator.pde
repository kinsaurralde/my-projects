int mode[] = {0, 1, 1, 1};                                            // Type of graph
int graphW = 1280, graphH = 720;                                      // Graph settings
int scroll = 50, translateX, translateY;                              // Transformation settings
int num = 1000, graphMax = 1;                                         // Graph min/max and density
int startTime, endTime, solveTime;                                    // Speed of graph
int inputSelected = 0;                                                // Where to type
int idk, i = 0;
boolean clicked;                                                      // Is mouse clicked
boolean updateDraw = false;                                           // Redraw graph
boolean decimal = false;                                              // Calculator decimal
float x, y, r, theta;                                                 // Graph variables
float scale = 400;                                                    // Graph magnifier
float prev2 = 0, display = 0, display2, number1, number2, function2;  // Calculator
float[][] px = new float[2001][6];                                    // Graph x coordinates
float[][] py = new float[2001][6];                                    // Graph y coordinates
int[] highlightButton = new int[50];                                  // Which buttons highlighted
String[][] storage = new String[20][20];                              // Stores number values in equation
String[][] inputstorage = new String[40][40];                         // Temporary storage when reformatting
String[][][] functions = new String[10][10][4];                       // Function stored
String calcdis = "0";
String finalValue = "";                                               // Value at last point
String[] input = { "", "", "" };                                      // Textbox input
String currentFunction[] = { "", "", "" };                            // Displayed function
String[][] examples = {                                               // Examples
  {"3", "2000", "3/2*cos(x)-cos(30*x)", "3/2*sin(x)-sin(30*x)"}, 
  {"3", "2000", "cos(5*x)", "sin(7*x)"}, 
  {"1", "1000", "x", "x+1"}, 
  {"1", "1000", "tan(x)", "1/tan(x)"}, 
  {"2", "1000", "sin(x)/cos(x)+1", "sin(tan(x*p))-1"}, 
  {"2", "1000", "x*x", "1/(x*x)"} };
int[][] show = {{1, 0, 255, 0, 0}, {1, 0, 0, 0, 255}, {1, 0, 0, 255, 0}};

void setup() {
  size(1920, 1080);
  background(255);
  highlightButton[1] = 1;
  highlightButton[4] = 1;
  highlightButton[8] = 1;
  highlightButton[12] = 1;
}

void draw() {
  println(idk);
  rectMode(CENTER);
  stroke(0);
  noFill();
  strokeWeight(3);
  rect(width/2, height/2, graphW, graphH);
  translate(width/2, height/2);    // Center of screen is now 0,0
  if (mouseX > width/2-graphW/2 && mouseX < width/2+graphW/2 && mouseY > height/2-graphH/2 && mouseY < height/2+graphH/2) {
    if (mouseButton == LEFT) {
      translateX -= pmouseX - mouseX;
      translateY -= pmouseY - mouseY;
      updateDraw = true;
    }
  }

  /*************************************************************************** Line and Point Graph ***************************************************************************/

  if (updateDraw) {
    background(255);
    for (int i = 1; i < num+1; i++) {
      for (int i2 = mode[1]/3*2; i2 < 2+(mode[1]/3); i2++) {
        stroke(show[i2][2], show[i2][3], show[i2][4]);
        if (show[i2][0] == 1 && mode[i2+1] != 0) {
          strokeWeight(2);
          line((px[i][i2]*scale)+translateX, (py[i][i2]*-scale)+translateY, (px[i-1][i2]*scale)+translateX, (py[i-1][i2]*-scale)+translateY);
        }
        if (show[i2][1] == 1 && mode[i2+1] != 0) {
          strokeWeight(5);
          point((px[i][i2]*scale)+translateX, (py[i][i2]*-scale)+translateY);
        }
      }
    }
    updateDraw = false;
  }

  /*************************************************************************** Non Graph Background ***************************************************************************/

  rectMode(CORNER);
  noStroke();
  fill(200, 200, 200);
  rect(-width/2, -height/2, (width-graphW)/2, height);
  rect(graphW/2, -height/2, (width-graphW)/2, height);
  rect(-width/2, -height/2, width, (height-graphH)/2);
  rect(-width/2, graphH/2, width, (height-graphH)/2);

  /*************************************************************************** Graph Window ***************************************************************************/

  fill(0);
  textSize(15);
  textAlign(CENTER);
  text("Scale: "+scale+" Points: "+num+" Final Value: "+finalValue, 0, -graphH/2-10);
  textAlign(LEFT, CENTER);
  text("FPS: "+round(frameRate)+" Solve Time: "+solveTime+"ms", -960, - 532);
  stroke(0);
  strokeWeight(4);
  line(constrain(translateX, -graphW/2, graphW/2), graphH/2, constrain(translateX, -graphW/2, graphW/2), -graphH/2);
  line(-graphW/2, constrain(translateY, -graphH/2, graphH/2), graphW/2, constrain(translateY, -graphH/2, graphH/2));
  rectMode(CENTER);
  noFill();
  rect(0, 0, graphW, graphH);

  /*************************************************************************** Text Input and Buttons ***************************************************************************/

  textbox(0, -graphH/2-50, 790, 50, 0, true);                                     // Lower text box  Input slecected == 1
  button("r(θ)", -graphW/2+200, -graphH/2-50, 70, 50, 1, true, 0);
  button("f(x)", -graphW/2+120, -graphH/2-50, 70, 50, 2, true, 0);
  button("x(t)", -graphW/2+40, -graphH/2-50, 70, 50, 3, true, 0);
  button("Points", graphW/2-200, -graphH/2-50, 70, 50, 5, true, 0);
  button("Line", graphW/2-120, -graphH/2-50, 70, 50, 4, true, 0); 
  button("Clear", graphW/2-40, -graphH/2-50, 70, 50, 6, false, 0);
  textbox(0, -graphH/2-110, 790, 50, 7, true);                                   // Upper text box  Input slecected == 2
  button("r(θ)", -graphW/2+200, -graphH/2-110, 70, 50, 8, true, 1);
  button("f(x)", -graphW/2+120, -graphH/2-110, 70, 50, 9, true, 1);
  button("y(t)", -graphW/2+40, -graphH/2-110, 70, 50, 10, true, 1);
  button("Points", graphW/2-200, -graphH/2-110, 70, 50, 11, true, 1);
  button("Line", graphW/2-120, -graphH/2-110, 70, 50, 12, true, 1); 
  button("Clear", graphW/2-40, -graphH/2-110, 70, 50, 13, false, 1);

  button("Example: Parametric", -533, graphH/2+50, 204, 50, 40, false, 0);
  button("Example: Parametric", -320, graphH/2+50, 204, 50, 41, false, 0);
  button("Example: Polar", -107, graphH/2+50, 204, 50, 42, false, 0);
  button("Example: Polar", 107, graphH/2+50, 204, 50, 43, false, 0); 
  button("Example: f(x)", 320, graphH/2+50, 204, 50, 44, false, 0);
  button("Example: f(x)", 533, graphH/2+50, 204, 50, 45, false, 0); 

  button("1", graphW/2+100, graphH/2-200, 50, 50, 15, false, 0);
  button("2", graphW/2+160, graphH/2-200, 50, 50, 16, false, 0);
  button("3", graphW/2+220, graphH/2-200, 50, 50, 17, false, 0);
  button("+", graphW/2+280, graphH/2-200, 50, 50, 24, false, 0);
  button("4", graphW/2+100, graphH/2-260, 50, 50, 18, false, 0);
  button("5", graphW/2+160, graphH/2-260, 50, 50, 19, false, 0);
  button("6", graphW/2+220, graphH/2-260, 50, 50, 20, false, 0);
  button("-", graphW/2+280, graphH/2-260, 50, 50, 25, false, 0);  
  button("7", graphW/2+100, graphH/2-320, 50, 50, 21, false, 0);
  button("8", graphW/2+160, graphH/2-320, 50, 50, 22, false, 0);
  button("9", graphW/2+220, graphH/2-320, 50, 50, 23, false, 0);
  button("x", graphW/2+280, graphH/2-320, 50, 50, 26, false, 0);
  button("AC", graphW/2+100, graphH/2-380, 50, 50, 27, false, 0);
  button("+/-", graphW/2+160, graphH/2-380, 50, 50, 28, false, 0);
  button("%", graphW/2+220, graphH/2-380, 50, 50, 29, false, 0);
  button("/", graphW/2+280, graphH/2-380, 50, 50, 30, false, 0);
  button("0", graphW/2+130, graphH/2-140, 110, 50, 14, false, 0);
  button(".", graphW/2+220, graphH/2-140, 50, 50, 31, false, 0);
  button("=", graphW/2+280, graphH/2-140, 50, 50, 32, false, 0);
  textbox(graphW/2+190, graphH/2-440, 230, 50, 33, false);
}

/*****************************************************************************************************************************************************************************************************
 
 Mouse/Keyboard
 
 *****************************************************************************************************************************************************************************************************/

void mouseWheel(MouseEvent event) {
  int wheel = -1*event.getCount();
  scroll = constrain(scroll + wheel, 0, 128);

  if (scroll <= 10) {
    scale = scroll*.1;
  } else {
    if (scroll <= 20) {
      scale = (scroll-10)*1;
    } else {
      if (scroll <= 50) {
        scale = ((scroll-20) *3)+10;
      } else {
        if (scroll <= 70) {
          scale = (scroll-30) *5;
        } else {
          if (scroll <= 90) {
            scale = (scroll-50) *10;
          } else {
            if (scroll <= 100) {
              scale = (scroll-70) *20;
            } else {
              if (scroll <= 110) {
                scale = (scroll-85) *40;
              } else {
                if (scroll <= 120) {
                  scale = (scroll-100) *100;
                } else {
                  scale = (scroll-118)*1000;
                }
              }
            }
          }
        }
      }
    }
  }
  updateDraw = true;
}

void keyPressed() {
  if (key == ' ') {
    scroll = 50;
    translateX = 0;
    translateY = 0;
    updateDraw = true;
  }
  if (keyCode == UP) {
    graphMax++;
    graphMax = constrain(graphMax, 1, 10);
    println("Graph Max: "+graphMax*2+"PI");
    update();
  }
  if (keyCode == DOWN) {
    graphMax--;
    graphMax = constrain(graphMax, 1, 10);
    println("Graph Max: "+graphMax*2);
    update();
  }
  if (keyCode == LEFT) {
    num -= 100;
    num = constrain(num, 100, 2000);
    println("Dots: "+num);
    update();
  }
  if (keyCode == RIGHT) {
    num += 100;
    num = constrain(num, 100, 2000);
    println("Dots: "+num);
    update();
  }

  if (inputSelected > 0) {
    if (key == ENTER) {
      store(input[inputSelected], inputSelected);
    } else {
      if (key == BACKSPACE) {
        if (input[inputSelected].length() > 0) {
          input[inputSelected] = input[inputSelected].substring(0, input[inputSelected].length()-1);
        }
      } else {
        if (key != CODED && key != ' ' && key != 'q') {
          input[inputSelected] = input[inputSelected]+key;
        }
      }
    }
    updateInput();
  }
}

void mousePressed() {
  clicked = true;
}

void mouseReleased() {
  clicked = false;
}

/*****************************************************************************************************************************************************************************************************
 
 Functions
 
 *****************************************************************************************************************************************************************************************************/

void button(String buttontext, int buttonx, int buttony, int buttonw, int buttonh, int buttonnum, boolean highlight, int buttonMode) {
  if (mouseX-width/2 > buttonx-buttonw/2 && mouseX-width/2 < buttonx+buttonw/2 && mouseY-height/2 > buttony-buttonh/2 && mouseY-height/2 < buttony+buttonh/2 && clicked == true) {
    if (highlight == true) {
      highlightButton[buttonnum] = int(!boolean(highlightButton[buttonnum]));
      updateDraw = true;
    }
    if (buttonnum == 0) {                                  // Text box 1            
      if (highlightButton[buttonnum] == 1) {
        highlightButton[7] = 0;
        inputSelected = 1;
      } else {
        inputSelected = 0;
      }
    }
    if (buttonnum == 7) {                                    // Text box 2                             
      if (highlightButton[7] == 1) {
        inputSelected = 2;
        highlightButton[0] = 0;
      } else {
        inputSelected = 0;
      }
    }
    if (buttonnum == 8 || buttonnum == 1) {                // #1 r() 1 , #8 r(x) 2
      if (highlightButton[buttonnum] == 1) {
        highlightButton[buttonnum+1] = 0;
        highlightButton[buttonnum+2] = 0;
        mode[buttonMode+1] = 1;
        store(input[buttonMode+1], buttonMode+1);
      } else {
        mode[buttonMode+1] = 0;
      }
    }
    if (buttonnum == 2 || buttonnum == 9) {                // #2 f(x) 1 , #9 f(x) 2
      if (highlightButton[buttonnum] == 1) {
        highlightButton[buttonnum+1] = 0;
        highlightButton[buttonnum-1] = 0;
        mode[buttonMode+1] = 2;
        store(input[buttonMode+1], buttonMode+1);
      } else {
        mode[buttonMode+1] = 0;
      }
    }
    if (buttonnum == 4 || buttonnum == 5 || buttonnum == 11 || buttonnum == 12) {            // #4 Line 1 , #5 Points 1, #11 Points 2, #12 Line 2
      show[buttonMode][buttonnum % 2] = int(!boolean(show[buttonMode][buttonnum % 2]));
      if (show[0][buttonnum % 2] == 1 || show[1][buttonnum % 2] == 1) {
        show[2][buttonnum % 2] = 1;
      } else {
        show[2][buttonnum % 2] = 0;
      }
    }
    if (buttonnum == 3 || buttonnum == 10) {                                  // x(t) 1 
      if (highlightButton[3] == 1 || highlightButton[10] == 1) {
        removeHighlightType();
        highlightButton[10] = 1;
        highlightButton[3] = 1;
        mode[1]= 3;
        mode[2] = 3;
        update();
      } else {
        mode[1]= 0;
      }
    }
    if (buttonnum == 6 || buttonnum == 13) {                                  // Clear
      input[buttonMode+1] = "";
      store(input[buttonMode+1], buttonMode+1);
    }
    if (buttonnum >= 40 && buttonnum <= 47) {                                 // Examples
      input[1] = examples[buttonnum-40][2];
      input[2] = examples[buttonnum-40][3];    
      num = int(examples[buttonnum-40][1]);
      mode[1] = int(examples[buttonnum-40][0]); 
      mode[2] = int(examples[buttonnum-40][0]);
      removeHighlightType();
      highlightButton[mode[1]] = 1;
      highlightButton[mode[1]+7] = 1;
      update();
    }
    if (buttonnum >= 14 && buttonnum <= 23) {
      buttonfunc(buttonnum-14);
    }
    if (buttonnum == 29) {
      display = display * .01;
      calcdis = str(display);
    }
    if (buttonnum == 24) {
      number1 = float(calcdis);
      calcdis = "0";
      display = 0;
      function2 = 1;
      decimal = false;
      idk=0;
    }
    if (buttonnum == 25) {
      number1 = float(calcdis);
      calcdis = "0";
      display = 0;
      function2 = 2;
      decimal = false;
      idk=0;
    }
    if (buttonnum == 26) {
      number1 = float(calcdis);
      calcdis = "0";
      display = 0;
      function2 = 3;
      decimal = false;
      idk=0;
    }
    if (buttonnum == 30) {
      number1 = float(calcdis);
      calcdis = "0";
      display = 0;
      function2 = 4;
      decimal = false;
      idk=0;
    }
    if (buttonnum == 27) {
      calcdis = "0";
      display = 0;
      prev2 = 0;
      number1 = 0;
      number2 = 0;
      decimal = false;
      idk=0;
    }
    if (buttonnum == 28) {
      display = display * -1;
      calcdis = str(display);
      idk+=2;
    }
    if (buttonnum == 31) {
      decimal = true;
    }
    if (buttonnum == 32) {
      if (function2 == 1) {
        number2 = display;
        display2 = number1 + number2;
      }
      if (function2 == 2) {
        number2 = display;
        display2 = number1 - number2;
      }
      if (function2 == 3) {
        number2 = display;
        display2 = number1 * number2;
      }
      if (function2 == 4) {
        number2 = display;
        display2 = number1 / number2;
      }
      display2 = round(display2*100);
      display2 /= 100;      
      calcdis = str(display2);
      display = 0;
      decimal = false;
      idk=0;
    }
    clicked = false;
  }
  if (highlightButton[buttonnum] == 1) {
    fill(255, 255, 0);
  } else {
    noFill();
  }
  stroke(0);
  strokeWeight(3);
  rectMode(CENTER);
  rect(buttonx, buttony, buttonw, buttonh);
  textSize(20);
  fill(0);
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  if (buttontext != "Text Box") {
    text(buttontext, buttonx, buttony );
  }
}

void textbox(int x, int y, int w, int h, int buttonnum, boolean highlight) {
  button("Text Box", x, y, w, h, buttonnum, highlight, 0);
  rectMode(CENTER);
  stroke(0);
  noFill();
  rect(x, y, w, h);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(h*.8);
  if (buttonnum != 33) {
    text(currentFunction[(buttonnum % 2) + 1], x, y);
  } else {
    text(calcdis, x, y);
  }
}

void buttonfunc(float number) {
  if (decimal == false) {
    prev2 = int(display);
    display = prev2 * 10 + number;
    calcdis = str(display);
  } else {
      for (i=0; i < idk; i+=1) {
      number = number * 0.1;
    }
    prev2 = display;
    display = prev2 + number;
    calcdis = str(display);
  }
  idk += 1;
}
/************************************************* Store Function **********************************************/

void store(String input, int inputSelected) {
  updateInput();
  println("Input: "+input);
  int i;
  int i2;
  int i3;
  int place;
  int amount = 0;
  int oldi2;
  int storageLength;
  int inputlength;
  String newinput = "";
  for (i = 0; i < 10; i++) {    // Clears Arrays
    storage[i][inputSelected-1] = "";
    storage[i+10][inputSelected-1] = "";
    for (i2 = 0; i2 < 10; i2++) {
      for (i3 = inputSelected*2-2; i3 < inputSelected*2; i3++) {
        functions[i][i2][i3] = "";
      }
    }
  }
  for (i = 0; i < 40; i++) {
    inputstorage[i][inputSelected-1] = "";
  }
  i = 0;
  i2 = 0;
  i3 = 0;
  storageLength = 0;

  try {     // Stops graphing if input incorrect
    for (place = 0, i = 0; place < input.length(); place++, i++) {    // Changes input formatting
      if (int(input.charAt(place)) >= 48 && int(input.charAt(place)) <= 57 || input.charAt(place) == 'p') {
        if (input.charAt(place) == 'p') {
          storage[storageLength][inputSelected-1] = str(PI);
        } else {
          String digits = "";          
          while (place < input.length() && (int(input.charAt(place)) >= 48 && int(input.charAt(place)) <= 57)) {
            digits += str(input.charAt(place));
            println("Digits: "+digits);
            place++;
          }
          place--;
          storage[storageLength][inputSelected-1] = digits;
        }
        inputstorage[i][inputSelected-1] = "#"+storageLength;
        storageLength++;
      } else {
        if (input.charAt(place) == 'c' || input.charAt(place) == 's' || input.charAt(place) == 't') {
          inputstorage[i][inputSelected-1] = str(input.charAt(place));
          place += 2;
        } else {
          if (input.charAt(place) == '(') {
            if (place > 0) {
              if (int(input.charAt(place-1)) >= 48 && int(input.charAt(place-1)) <= 57 || input.charAt(place-1) == 'x') {
                inputstorage[i][inputSelected-1] = "*";
                i++;
              }
            }
            inputstorage[i][inputSelected-1] = str(input.charAt(place));
          } else {
            if (input.charAt(place) == 'x') {
              inputstorage[i][inputSelected-1] = "xx";
            } else {
              inputstorage[i][inputSelected-1] = str(input.charAt(place));
            }
          }
        }
      }
    }
    for (place = 0; place < i; place++) {    // Adds parenthesis to * and /
      if (inputstorage[place][inputSelected-1].charAt(0) == '*' || inputstorage[place][inputSelected-1].charAt(0) == '/') {
        amount = 0;
        if (inputstorage[place-1][inputSelected-1].charAt(0) == ')') {
          ;
          while (inputstorage[place+amount-1][inputSelected-1].charAt(0) != '(') {
            amount--;
          }
        }
        splice2D("(", place-1+amount, inputSelected);
        place++;
        amount = 0;
        if (inputstorage[place+1][inputSelected-1].charAt(0) == '(' || inputstorage[place+1][inputSelected-1].charAt(0) == 'c' || inputstorage[place+1][inputSelected-1].charAt(0) == 's' || inputstorage[place+1][inputSelected-1].charAt(0) == 't') {
          while (inputstorage[place+amount+2][inputSelected-1].charAt(0) != ')') {
            amount++;
          }
        }
        splice2D(")", place+2+amount, inputSelected);
        place++;
        storageLength += 2;
        i += 2;
      }
    }
    for (place = 0; place < i; place++) {    // Puts new function into string form
      newinput += inputstorage[place][inputSelected-1];
    }
    i = 0;
    i2 = 0;
    i3 = 0;
    inputlength = newinput.length();
    for (place = 0; place < inputlength; place++) {    // Split function by ()
      if (newinput.charAt(place) == '(') { 
        i++;
        oldi2 = i2;
        i2 = 0;
        while (functions[i][i2][(inputSelected-1)*2] != "") {
          i2++;
        }
        functions[i-1][oldi2][(inputSelected-1)*2] += ("@" + i2);
      } else {
        if (newinput.charAt(place) == ')' ) { 
          i--;
          i2 = 9;
          while (functions[i][i2][(inputSelected-1)*2] == "") {
            i2--;
          }
        } else {
          functions[i][i2][(inputSelected-1)*2] += str(newinput.charAt(place));
        }
      }
    }
  } 
  catch (Exception b) {
    println("Incorrect Input: "+b);
  }
  plot(inputSelected);
}

/***************************************************** Plot **************************************************/

void plot(int inputSelected) {
  if ((mode[1]== 1 && inputSelected == 1) || (mode[2] == 1 && inputSelected == 2)) {
    theta = 0;
  }
  if ((mode[1]== 2 && inputSelected == 1) || (mode[2] == 2 && inputSelected == 2) || mode[1] == 3) {
    theta = -graphMax*20;
  }
  startTime = millis();
  for (int current = 0; current < num+1 && inputSelected != 0; current++) {
    if ((mode[1] == 1 && inputSelected == 1) || (mode[2] == 1 && inputSelected == 2)) {
      r = prepareToSolve(theta, inputSelected);
      x = r * cos(theta);
      y = r * sin(theta);
      theta = theta+(.002*graphMax*1000/num)*PI;
    }
    if ((mode[1] == 2 && inputSelected == 1) || (mode[2] == 2 && inputSelected == 2)) {
      y = prepareToSolve(theta, inputSelected);
      x = theta;
      theta = (theta+(.04*graphMax*1000/num));
    }
    px[current][inputSelected-1] = x;
    py[current][inputSelected-1] = y;
    if (mode[1]== 3 && mode[2] == 3) {
      x = prepareToSolve(theta, 1);
      y = prepareToSolve(theta, 2);     
      theta = (theta+(.04*graphMax*1000/num));
      py[current][2] = y;
      px[current][2] = x;
    }
  }
  finalValue = str(prepareToSolve(theta, inputSelected));
  endTime = millis();
  println("Final R: "+prepareToSolve(2*graphMax*PI, inputSelected));
  solveTime = endTime-startTime;
  println("Graph Time: "+solveTime+"ms");
  updateDraw = true;
}

/***************************************************** Solve **************************************************/

float prepareToSolve(float theta, int inputSelected) {
  try {
    for (int i = 9; i > -1; i--) {
      for (int i2 = 9; i2 > -1; i2--) {
        if (functions[i][i2][(inputSelected-1)*2] != "") {
          functions[i][i2][(inputSelected-1)*2+1] = solve(functions[i][i2][(inputSelected-1)*2], theta, i, inputSelected);
        }
      }
    }
    return float(functions[0][0][(inputSelected-1)*2+1]);
  } 
  catch (Exception a) {          // Does this if parametric is input before other types
    println(a);
    return float(0);
  }
}

String solve(String equation, float theta, int i, int inputSelected) {
  int place = 0;
  float valueA = 0;
  float valueB = 0;  
  if (equation.length() > 1) {
    if (equation.charAt(0) == 'c' || equation.charAt(0) == 's' || equation.charAt(0) == 't') {
      valueA = getValue(equation.charAt(0), equation.charAt(1), int(str(equation.charAt(2))), i, theta, inputSelected);
    } else {
      valueA = getValue('!', equation.charAt(0), int(str(equation.charAt(1))), i, theta, inputSelected);
    }
  } else {
    valueA = getValue('!', equation.charAt(0), 0, i, theta, inputSelected);
  }

  for (place = 0; place < equation.length(); place++) {
    if (equation.charAt(place) == '*' || equation.charAt(place) == '/' || equation.charAt(place) == '+' || equation.charAt(place) == '-') {
      if (equation.charAt(place+1) == 'c' || equation.charAt(place+1) == 's' || equation.charAt(place+1) == 't') {
        valueB = getValue(equation.charAt(place+1), equation.charAt(place+2), int(str(equation.charAt(place+3))), i, theta, inputSelected);
      } else {
        valueB = getValue('!', equation.charAt(place+1), int(str(equation.charAt(place+2))), i, theta, inputSelected);
      }
    }

    if (equation.charAt(place) == '*') {
      valueA *= valueB;
    }
    if (equation.charAt(place) == '/') {
      valueA /= valueB;
    }
    if (equation.charAt(place) == '+') {
      valueA += valueB;
    }
    if (equation.charAt(place) == '-') {
      valueA -= valueB;
    }
  }
  return str(valueA);
}

float getValue(char trig, char symbol, int number, int i, float theta, int inputSelected) {
  float value = 0;
  if (trig != '!') {
    if (trig == 's') {
      value = sin(getValue('!', symbol, number, i, theta, inputSelected));
    }
    if (trig == 'c') {
      value = cos(getValue('!', symbol, number, i, theta, inputSelected));
    }
    if (trig == 't') {
      value = tan(getValue('!', symbol, number, i, theta, inputSelected));
    }
  } else {
    if (symbol == 'x') {
      value = theta;
    }
    if (symbol == '@') {
      value = float(functions[i+1][number][inputSelected*2-1]);
    }
    if (symbol == '#') {
      value = float(storage[number][inputSelected-1]);
    }
  }
  return value;
}

/***************************************************** Other **************************************************/

void splice2D(String character, int amount, int inputSelected) {
  String[] placeholder = new String[40];
  for (int i = 0; i < 40; i++) {
    placeholder[i] = inputstorage[i][inputSelected-1];
  }
  placeholder = splice(placeholder, character, amount);
  for (int i = 0; i < 40; i++) {
    inputstorage[i][inputSelected-1] = placeholder[i];
  }
}

void update() {
  store(input[1], 1);
  store(input[2], 2);
}

void updateInput() {
  currentFunction[1] = "";
  currentFunction[2] = "";
  for (int selected = 1; selected < 3; selected++) {
    input[selected] = input[selected].toLowerCase();
    for (int i = 0; i < input[selected].length(); i++) {
      if (input[selected].charAt(i) == 'x') {
        if (mode[selected] == 1) {
          currentFunction[selected] += "θ";
        }
        if (mode[selected] == 2) {
          currentFunction[selected] += "x";
        }
        if (mode[selected] == 3) {
          currentFunction[selected] += "t";
        }
      } else {
        if (input[selected].charAt(i) == 'p') {
          currentFunction[selected] += "π";
        } else {
          currentFunction[selected] += input[selected].charAt(i);
        }
      }
    }
  }
}

void removeHighlightType() {
  highlightButton[1] = 0;
  highlightButton[2] = 0;
  highlightButton[3] = 0;
  highlightButton[8] = 0;
  highlightButton[9] = 0;
  highlightButton[10] = 0;
}
