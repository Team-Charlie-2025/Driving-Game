function LeaderboardSketch(p) {
    let leaderboardData = [];
    let ExitIcon, bgImage;


    function loadLeaderboard() {
      fetch('http://127.0.0.1:9411/leaderboard')
        .then(response => response.json())
        .then(data => {
          // Map the data to ensure we handle missing or undefined scores gracefully
          leaderboardData = data.map(player => ({
            username: player.username || 'Unknown Player',  // Default username if missing
            score: player.score || 0  // Default score if missing
          }))
          .sort((a, b) => b.score - a.score)
          // Keep only top 10
          .slice(0, 10);
        })
        .catch(error => {
          console.error("Error loading leaderboard:", error);
        });
  }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(32* window.widthScale);
        p.background(240);
        p.fill(0);
        p.textFont(window.PixelFont);
        bgImage = p.loadImage("graphics/leaderBackground.png");
  
        // Exit button to go back to title
        ExitIcon = new Button("ExitIcon",
          p.width - p.width * 0.05,
          p.height - p.height * 0.95,
          function() {
            bgMusic(Mode.SETTINGS, p, "stop");
            switchSketch(Mode.TITLE);
          });
        window.LoadingScreen.hide();
        loadLeaderboard();
      };

      
    p.draw = function () {
      if (bgImage) {
        p.background(bgImage);
      } else {
        p.background(222, 236, 250);
      }

      // Title
      p.fill(0);
      p.textSize(120 * window.scale);
      p.text("Leaderboard", p.width / 2, 250*window.heightScale);

      // Leaderboard entries
      p.textSize(35* window.scale);
      if (leaderboardData.length === 0) {
        p.text("Loading...", p.width / 2, p.height / 2);
      } else {
        for (let i = 0; i < leaderboardData.length; i++) {
          const player = leaderboardData[i];
          const y = 375*window.heightScale + i * 45*window.heightScale;
          p.fill(i === 0 ? "#DAA520" : "#000"); // Gold for 1st
          p.text(`${i + 1}. ${player.username} - ${player.score || 0} score`, p.width / 2, y);
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
