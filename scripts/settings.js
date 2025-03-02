// scripts/settings.js

function SettingsSketch(p) {
    p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(230);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(48);
      p.fill(50);
      p.text("Settings", p.width / 2, p.height / 2);

      // stop loading
      window.LoadingScreen.hide();
    };
  
    p.draw = function () {
      // tbd
      //create a button/slider for a local storage variable that determines sound volume
    };
  
    p.keyPressed = function () {
      if (p.keyCode === p.ESCAPE) {
        switchSketch(Mode.TITLE);
      }
    };
  }
  