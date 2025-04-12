function LeaderboardSketch(p) {
    let leaderboardData = [];
    let ExitIcon;


    function loadLeaderboard() {
        fetch('http://127.0.0.1:5000/leaderboard')
          .then(response => response.json())
          .then(data => {
            leaderboardData = data;
          })
          .catch(error => {
            console.error("Error loading leaderboard:", error);
          });
    }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(32);
        p.background(240);
  
        // Exit button to go back to title
        ExitIcon = new Button("ExitIcon", p.width - 80, 30, function () {
          switchSketch(Mode.TITLE);
        });
        window.LoadingScreen.hide();
        loadLeaderboard();
      };

      
    p.draw = function () {
      p.background(240);

      // Title
      p.fill(50);
      p.textSize(60);
      p.text("🏆 Leaderboard", p.width / 2, 100);

      // Leaderboard entries
      p.textSize(28);
      if (leaderboardData.length === 0) {
        p.text("Loading...", p.width / 2, p.height / 2);
      } else {
        for (let i = 0; i < leaderboardData.length; i++) {
          const player = leaderboardData[i];
          const y = 180 + i * 40;
          p.fill(i === 0 ? "#DAA520" : "#000"); // Gold for 1st
          p.text(`${i + 1}. ${player.username} - 💰 ${player.coins} coins`, p.width / 2, y);
        }
      }

      ExitIcon.display(p);
    };

    p.mousePressed = function () {
      if (ExitIcon.isMouseOver(p)) {
        ExitIcon.callback();
      }
    };

    p.keyPressed = function () {
      if (p.keyCode === p.ESCAPE) {
        switchSketch(Mode.TITLE);
      }
    };
}
