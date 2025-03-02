// scripts/signup.js

function SignupSketch(p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(230);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);
    p.text("Sign Up", p.width / 2, 150);

    // stop loading
    window.LoadingScreen.hide();
  };

  p.draw = function () {
    // tbd
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      switchSketch(Mode.TITLE);
    }
  };
}
