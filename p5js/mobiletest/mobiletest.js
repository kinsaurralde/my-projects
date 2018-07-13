
 var canvas; 
    function init() {
      var touchzone = document.getElementById("mycanvas");
      touchzone.addEventListener("touchstart", draw, false);
    }
 
    function draw() {
      background(0,0,255);
      text(mouseX+" "+mouseY,300,300);
      alert("test");
    }

    function setup() {
      canvas = createCanvas(1920,1080);
    textSize(40);
    stroke(0);
    }

    function touchStarted() {
      console.log("touch");
    }