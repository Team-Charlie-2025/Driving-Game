// scripts/leaderboard.js
function LeaderboardSketch(p) {
    p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(230);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(48);
      p.fill(50);
      p.text("Leaderboard", p.width / 2, p.height / 2);
      
      ExitIcon = new Button("ExitIcon", p.width - p .width * 0.05, p.height - p.height * 0.95, function () { 
        switchSketch(Mode.TITLE);
      });

      // stop loading
      window.LoadingScreen.hide();
    };
  
    p.draw = function () {
      ExitIcon.display(p);
      // tbd // needs backend
    };
    p.mousePressed = function() {
      if (ExitIcon.isMouseOver(p)) {
        bgMusic.stop();
        ExitIcon.callback();
      }
    }
  
    p.keyPressed = function () {
      if (p.keyCode === p.ESCAPE) {
        switchSketch(Mode.TITLE);
      }
    };
  }
  