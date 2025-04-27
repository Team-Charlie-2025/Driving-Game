let startTime = 0;
let elapsedTime = 0;
let timerActive = false;

function TimerSketch(p) {
  
  p.setup = function () {
    p.windowResized();
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);
  };

  p.draw = function () {
    p.background(230); // Clear background

    if (timerActive) {
      elapsedTime = p.floor((p.millis() - startTime) / 1000);
      let minutes = p.floor(elapsedTime / 60);
      let seconds = elapsedTime % 60;
      p.textSize(32);
      p.text("Time: " + nf(minutes, 2) + ":" + nf(seconds, 2), p.width / 2, p.height / 2);
    } else {
      p.textSize(24);
      p.text("Press Play to start the timer", p.width / 2, p.height / 2);
    }
  };

  // Function to start the timer
  function startTimer() {
    if (!timerActive) {
      timerActive = true;
      startTime = p.millis();
    }
  }
}
