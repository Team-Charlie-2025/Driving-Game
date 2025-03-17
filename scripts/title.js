// scripts/title.js

function TitleSketch(p) {
  let buttons = [];
  let bgImage;
  let imgTitle;
  let debugCheckbox; 
  let showInfo = false;

  p.preload = function() {
    loadSound(p);
    
    bgImage = p.loadImage("graphics/titleBackground.png");
    imgTitle = p.loadImage("graphics/title.png");
    if(!globalsLoaded) loadGlobals(p);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    createButtons();
    if (window.debug === undefined) {
      window.debug = false;
    }
    debugCheckbox = p.createCheckbox("Debug", window.debug);
    debugCheckbox.position(10, 10);
    debugCheckbox.changed(() => {
      window.debug = debugCheckbox.checked();
      console.log("Debug mode set to:", window.debug);
    });
    window.titlebgMusic.loop(); //console.log("play");
    // stop loading
    window.LoadingScreen.hide();
  };


  p.draw = function () {
   if (bgImage) { //until background is done, commented out
      p.background(bgImage); 
    } else {
      p.background(222, 236, 250);
    }
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
    p.fill(34, 139, 34, 200); // Dark green with transparency
    p.noStroke();
    p.rect(p.width / 2 - 150, p.height / 2 - 50, 300, 100, 15); // Centered info box

    p.fill(255);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Still to be modified", p.width / 2, p.height / 2);
  }
};

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    buttons = [];
    createButtons();
    debugCheckbox.position(10, 10);
  };

  p.mousePressed = function () {
    if(!window.titlebgMusic.isPlaying()){//for chrome non-auto play rules
      window.titlebgMusic.loop(); //console.log("play"); 
    }
    for (let btn of buttons) {
      if (btn.isMouseOver(p)) {
        window.titlebgMusic.stop();
        btn.callback();
        break;
      }
    }
  };
  function toggleInfo() {
    showInfo = !showInfo;
  }

  function createButtons() {
    buttons.push(
      new Button("Play", p.width / 2, p.height - p.height * 0.38, p.width, p.height, function () {
        switchSketch(Mode.LEVELS); //will go to level/difficulty selection
      }, "navy")
    );
    buttons.push(
      new Button("Garage", p.width / 2, p.height - p.height * 0.20, p.width, p.height, function () {
        switchSketch(Mode.GARAGE);
      }, "blue")
    );
    buttons.push(
      new Button("Settings", p.width / 7, p.height - p.height * 0.15, p.width, p.height, function () {
          switchSketch(Mode.SETTINGS);
      })
  ); 
  buttons.push(
    new Button("Leaderboard", p.width / 1.2, p.height - p.height * 0.90, p.width, p.height, function () {
      switchSketch(Mode.LEADERBOARD);
    })
  );
  buttons.push(
    new Button("HELP", p.width / 1.05, p.height - p.height * 0.97, p.width, p.height, function () {
      toggleInfo(); 
    }, "blue")
  );


  
    /*
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
      
    );*/
  }
}
