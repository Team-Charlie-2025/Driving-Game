// scripts/leaderboard.js
function LeaderboardSketch(p) {
    p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(230);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(48);
      p.fill(50);
      p.text("Leaderboard", p.width / 2, p.height / 2);
      
      // stop loading
      window.LoadingScreen.hide();
    };
  
    p.draw = function () {
      // tbd // needs backend
    };
  
    p.keyPressed = function () {
      if (p.keyCode === p.ESCAPE) {
        switchSketch(Mode.TITLE);
      }
    };
  }
  