// scripts/title.js
function TitleSketch(p) {
  let buttons = [];
  let levelButtons = [];
  let bgImage;
  let imgTitle;
  let debugCheckbox; 
  let showInfo = false;
  let showLevelSelection = false;
  let ExitIcon;
  let windowHeightScale, windowWidthScale, windowScale;

  p.preload = function() {    
    loadMusic(p);
    loadSoundEffects(p);
    bgImage = p.loadImage("graphics/titleBackground.png");
    imgTitle = p.loadImage("graphics/title.png");
    if (!globalsLoaded) loadGlobals(p);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);

    createTitleButtons();
    createLevelButtons();

    if (window.debug === undefined) {
      window.debug = false;
    }
    debugCheckbox = p.createCheckbox("Debug", window.debug);
    debugCheckbox.checked(false)
    debugCheckbox.position(10*window.widthScale, 10*window.heightScale);
    debugCheckbox.changed(() => {
      window.debug = debugCheckbox.checked();
      console.log("Debug mode set to:", window.debug);
    });

    bgMusic(Mode.TITLE, p, "loop");
    p.windowResized();
    window.LoadingScreen.hide();
  };

  p.draw = function () {
    if (bgImage) {
      p.background(bgImage);
    } else {
      p.background(222, 236, 250);
    }

    if (showLevelSelection) {
      ExitIcon.display(p);
      for (let btn of levelButtons) {
        btn.display(p);
      }
    } else {
      for (let btn of buttons) {
        btn.display(p);
      }

      if (imgTitle) {
        p.image(
          imgTitle,
          p.windowWidth / 10,
          p.windowHeight / 6,
          p.windowWidth / 1.2,
          p.windowHeight / 2.6
        );
      }

      if (showInfo) {
        p.fill(34, 139, 34, 200);
        p.noStroke();
        p.rect(p.width / 2 - 150, p.height / 2 - 50, 300, 100, 15);
        p.fill(255);
        p.textSize(16);
        p.text("Still to be modified", p.width / 2, p.height / 2);
      }
    }
  };

  p.mousePressed = function () {
    if (showLevelSelection) {
      for (let btn of levelButtons) {
        if (btn.isMouseOver(p)) {
          btn.callback();
          break;
        }
      }
  
      if (ExitIcon.isMouseOver(p)) {
        bgMusic(Mode.TITLE, p, "loop");
        showLevelSelection = false;
      }
  
    } else {
      for (let btn of buttons) {
        if (btn.isMouseOver(p)) {
          if (btn.label !== "Play") {
            bgMusic(Mode.TITLE, p, "stop");
          }
          btn.callback();
          break;
        }
      }
    }
  };

  p.keyPressed = function () {
    if (showLevelSelection && p.keyCode === p.ESCAPE) {
      bgMusic(Mode.TITLE, p, "loop");
      showLevelSelection = false;
    }
  };


  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    window.heightScale = p.windowHeight / 1080;
    window.widthScale = p.windowWidth / 1920;
    window.scale = (window.widthScale + window.heightScale)/2;
    buttons = [];
    levelButtons = [];
    createTitleButtons();
    createLevelButtons();
  };

  function toggleInfo() {
    showInfo = !showInfo;
  }

  function createTitleButtons() {
    buttons.push(
      new Button("Play", p.width / 2, p.height - p.height * 0.38, function () {
        showLevelSelection = true;
      }, "purple", "large")
    );
    buttons.push(
      new Button("Garage", p.width / 2, p.height - p.height * 0.18, function () {
        switchSketch(Mode.GARAGE);
      }, "teal", "large")
    );
    buttons.push(
      new Button("Settings", p.width / 7, p.height - p.height * 0.15, function () {
        switchSketch(Mode.SETTINGS);
      })
    );
    buttons.push(
      new Button("Leaderboard", p.width / 1.2, p.height - p.height * 0.90, function () {
        switchSketch(Mode.LEADERBOARD);
      })
    );
    buttons.push(
      new Button("Help", p.width / 10, p.height - p.height * 0.97, function () {
        toggleInfo();
      }, "blue")
    );
    buttons.push(
      new Button("Map Editor", p.width / 1.05, p.height - p.height * 0.05, function () {
        switchSketch(Mode.MAP_EDITOR);
      })
    );    
    buttons.push(
      new Button("Signup", p.width/ 1.05, p.height - p.height * 0.10, function () {
        switchSketch(Mode.SIGNUP);
      })
    );
  
    buttons.push(
      new Button("Login", p.width/ 1.05, p.height - p.height * 0.15, function () {
        switchSketch(Mode.LOGIN);
      })
    );
  }

  function createLevelButtons() {
    levelButtons.push(
      new Button("EXTRA HARD", p.width / 2, p.height - p.height * 0.80, function () {
        window.difficulty = 1.5;
        console.log("Difficulty changed to EXTRA HARD value, " + window.difficulty);
        bgMusic(Mode.TITLE, p, "stop");
        switchSketch(Mode.PLAY);
      }, "red", "medium")
    );
    levelButtons.push(
      new Button("HARD", p.width / 2, p.height - p.height * 0.60, function () {
        window.difficulty = 1.25;
        console.log("Difficulty changed to HARD value, " + window.difficulty);
        bgMusic(Mode.TITLE, p, "stop");
        switchSketch(Mode.PLAY);
      }, "orange", "medium")
    );
    levelButtons.push(
      new Button("MEDIUM", p.width / 2, p.height - p.height * 0.40,function () {
        window.difficulty = 1.0;
        console.log("Difficulty changed to MEDIUM, value " + window.difficulty);
        bgMusic(Mode.TITLE, p, "stop");
        switchSketch(Mode.PLAY);
      }, "yellow", "medium")
    );
    levelButtons.push(
      new Button("EASY", p.width / 2, p.height - p.height * 0.20, function () {
        window.difficulty = 0.8;
        console.log("Difficulty changed to EASY, value " + window.difficulty);
        bgMusic(Mode.TITLE, p, "stop");
        switchSketch(Mode.PLAY);
      }, "green", "medium")
    );

    ExitIcon = new Button("ExitIcon", p.width - p.width * 0.05, p.height - p.height * 0.95, function () {
      showLevelSelection = false;
      bgMusic(Mode.TITLE, p, "loop");
    });
  }
}