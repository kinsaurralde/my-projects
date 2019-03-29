color white = color(255, 255, 255);
color black = color(0, 0, 0);
color lightblue = color(100, 150, 170);
color grayblue = color(175, 200, 225);
color darkblue = color(50, 125, 140);
color darkerblue = color(25, 75, 90);
color yellow = color(255, 255, 100);
int x = 750;
int y = 250;
int i;
int starX = 0;
int starY = 0;
IntList starx =  new IntList();
IntList stary = new IntList();
//
void setup() {
  size(1920, 1080);
  background(0, 0, 0);
  fill(yellow);
  noStroke();
  for ( i=0; i<100; i++) {
    starx.append(int(random(1920)));
    stary.append(int(random(1080)));
  }
  println("Necker Cube");
  println("Kyle Insaurralde Jake Rafac");
  println("2/19/2018  5th period");
}

void keyPressed() {
  if (keyCode == UP) {
    y = y-3;
  }
  if (keyCode == DOWN) {
    y = y+3;
  }
  if (keyCode == LEFT) {
    x = x-3;
  }
  if (keyCode == RIGHT) {
    x = x+3;
  }
  if (key == ' ') {
    x = 750;
    y = 250;
  }
}

void draw() {  
  //
  if (mouseButton == LEFT) {
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
      starX = starX + 1920;
    }
    if (starY < 0) {
      starY = starY + 1080;
    }
  }
  //
  background(black);
  for (i=0; i<100; i++) {
    fill(yellow);
    ellipse((starx.get(i) + starX) % 1920, (stary.get(i) + starY) % 1080, 5, 5);
  }
  translate(x, y);
  noStroke();
  //
  fill(grayblue);
  quad(174, 50, 362, 125, 347, 140, 174, 67);
  fill(grayblue);
  quad(174, 50, 75, 125, 89, 135, 174, 67);
  fill(grayblue);
  quad(75, 125, 95, 120, 275, 187, 275, 200);
  fill(grayblue);
  quad(275, 200, 266, 187, 334, 130, 347, 140);
  fill(darkblue);
  quad(177, 65, 177, 75, 110, 126, 100, 122);
  fill(lightblue);
  quad(177, 65, 177, 75, 328, 135, 337, 127);
  fill(darkblue);
  quad(75, 125, 275, 200, 275, 215, 75, 140);
  fill(lightblue);
  quad(275, 200, 275, 215, 362, 140, 362, 125);
  fill(lightblue);
  quad(177, 75, 163, 85, 163, 283, 177, 290);
  fill(darkblue);
  quad(187, 281, 177, 290, 177, 75, 187, 79);
  //
  fill(darkblue);
  quad(260, 205, 275, 210, 275, 425, 260, 420);
  fill(lightblue);
  quad(275, 210, 285, 200, 285, 425, 275, 425);
  //
  fill(grayblue);
  quad(174, 275, 362, 350, 347, 365, 174, 292);
  fill(grayblue);
  quad(174, 275, 75, 350, 89, 360, 174, 292);
  fill(grayblue);
  quad(75, 350, 95, 345, 275, 412, 275, 425);
  fill(grayblue);
  quad(275, 425, 266, 412, 334, 355, 347, 365);
  fill(darkblue);
  quad(177, 290, 177, 300, 110, 351, 100, 347);
  fill(lightblue);
  quad(177, 290, 177, 300, 328, 360, 337, 352);
  fill(darkblue);
  quad(75, 350, 275, 425, 275, 440, 75, 365);
  fill(lightblue);
  quad(275, 425, 275, 440, 362, 365, 362, 350);
  //
  fill(darkblue);
  quad(75, 125, 87, 129, 87, 355, 75, 350);
  fill(lightblue);
  quad(87, 355, 100, 347, 100, 149, 87, 144);
  fill(lightblue);
  quad(177, 178, 163, 173, 163, 283, 177, 290);
  fill(darkblue);
  quad(187, 281, 177, 290, 177, 178, 187, 180);
  //
  fill(darkblue);
  quad(260, 333, 275, 338, 275, 425, 260, 420);
  fill(lightblue);
  quad(275, 338, 285, 342, 285, 425, 275, 425);
  fill(darkblue);
  quad(353, 148, 337, 161, 337, 352, 353, 359);
  fill(lightblue);
  quad(353, 149, 362, 125, 362, 355, 353, 358);
  //
  translate(-x, -y);
  //
}