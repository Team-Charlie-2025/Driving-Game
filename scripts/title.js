// scripts/title.js
function TitleSketch(p) {
  let buttons = [];
  let bgImage;
  let imgTitle;
  let bgMusic = null;

  p.preload = function() {
    if (bgMusic == null) {
      bgMusic = p.loadSound('sound/titleTheme.mp3', () => {bgMusic.loop();} );
      bgMusic.setVolume(0.15); // Set volume to level (change to loacal storage var to adjust by user)
    }
    
    bgImage = p.loadImage("graphics/mainbg.png");
    imgTitle = p.loadImage("graphics/title.png");
    if(!globalsLoaded) loadGlobals(p);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    createButtons();
  };


  p.draw = function () {
    if (bgImage) {
      p.background(bgImage);
    } else {
      p.background(30, 30, 30);
    }
    if (imgTitle) {
      p.image(
        imgTitle,
        p.windowWidth / 10,
        p.windowHeight / 12,
        p.windowWidth / 1.2,
        p.windowHeight / 2.6
      );
    }
    for (let btn of buttons) {
      btn.display(p);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    buttons = [];
    createButtons();
  };

  p.mousePressed = function () {
    bgMusic.loop(); //for chrome non-auto play rules
    for (let btn of buttons) {
      if (btn.isMouseOver(p)) {
        bgMusic.stop();
        btn.callback();
        break;
      }
    }
  };

  function createButtons() {
    buttons.push(
      new Button("Play Game", p.width / 2, p.height - p.height * 0.45, function () {
        switchSketch(Mode.PLAY);
      })
    );
    buttons.push(
      new Button("Garage", p.width / 2, p.height - p.height * 0.38, function () {
        switchSketch(Mode.GARAGE);
      })
    );
    buttons.push(
      new Button("Leaderboard", p.width / 2, p.height - p.height * 0.31, function () {
        switchSketch(Mode.LEADERBOARD);
      })
    );
    buttons.push(
      new Button("Settings", p.width / 2, p.height - p.height * 0.24, function () {
        switchSketch(Mode.SETTINGS);
      })
    );
    buttons.push(
      new Button("Exit", p.width / 2, p.height - p.height * 0.17, function () {
        if (currentSketch) {
          currentSketch.remove();
        }
      })
    );
    buttons.push(
      new Button("Login", p.width / 1.1, p.height - p.height * 0.95, function () {
        switchSketch(Mode.LOGIN);
      })
    );
    buttons.push(
      new Button("Sign Up", p.width / 1.1, p.height - p.height * 0.88, function () {
        switchSketch(Mode.SIGNUP);
      })
    );
  }
}
