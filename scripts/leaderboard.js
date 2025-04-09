function LeaderboardSketch(p) {
  let leaderboardData = [];

  p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(230);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(48);
      p.fill(50);
  
      ExitIcon = new Button("ExitIcon", p.width - p.width * 0.05, p.height - p.height * 0.95, function () { 
          switchSketch(Mode.TITLE);
      });

      fetchLeaderboard();
  };

  function fetchLeaderboard() {
      fetch("http://127.0.0.1:5000/leaderboard")
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              leaderboardData = data.leaderboard;
          } else {
              console.error("Failed to load leaderboard:", data.error);
          }
      })
      .catch(error => console.error("Error:", error));
  }

  p.draw = function () {
      p.background(230);
      p.fill(50);
      p.textSize(100);
      p.text("Leaderboard", p.width / 2, p.height / 10);

      p.textSize(32);
      for (let i = 0; i < leaderboardData.length; i++) {
          let player = leaderboardData[i];
          p.text(`${i + 1}. ${player[0]} - ${player[1]} pts`, p.width / 2, (i + 2) * 50);
      }

      ExitIcon.display(p);
  };

  p.mousePressed = function () {
      if (ExitIcon.isMouseOver(p)) {
          ExitIcon.callback();
      }
  };
}
