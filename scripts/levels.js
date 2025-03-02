function LevelsSketch(p) {
    let buttons = [];

    p.preload = function() {

        bgImage = p.loadImage("graphics/mainbg.png");
        imgTitle = p.loadImage("graphics/title.png");
        if(!globalsLoaded) loadGlobals(p);
    };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.textAlign(p.CENTER, p.CENTER);
        createLevelButtons(); //level options
        ExitIcon = new Button("ExitIcon", p.width - p .width * 0.05, p.height - p.height * 0.95, function () { 
            switchSketch(Mode.TITLE);
          });
    
        // stop loading
        window.LoadingScreen.hide();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        buttons = [];
        createLevelButtons();
    };

    p.draw = function () {
        p.background(225, 240, 255);
        ExitIcon.display(p);
     
        for (let btn of buttons) {
        btn.display(p);
        }
    };
    p.mousePressed = function () {
        for (let btn of buttons) {
          if (btn.isMouseOver(p)) {
            //bgMusic.stop();
            btn.callback();
            break;
          }
        }
        if (ExitIcon.isMouseOver(p)) {
            //bgMusic.stop();
            ExitIcon.callback();
          }
      };
      p.keyPressed = function () {
        if (p.keyCode === p.ESCAPE) {
          switchSketch(Mode.TITLE);
        }
      };

    function createLevelButtons () {
        buttons.push(
            new Button("EXTRA HARD", p.width / 2, p.height - p.height * 0.80, function () {
              switchSketch(Mode.PLAY); //CHANGE TO LEVELS
            }, "red"));
        buttons.push(
            new Button("HARD", p.width / 2, p.height - p.height * 0.60, function () {
                switchSketch(Mode.PLAY); //CHANGE TO LEVELS
                }, "orange"));
        buttons.push(
            new Button("MEDIUM", p.width / 2, p.height - p.height * 0.40, function () {
                switchSketch(Mode.PLAY); //CHANGE TO LEVELS
                }, "yellow"));
        buttons.push(
            new Button("EASY", p.width / 2, p.height - p.height * 0.20, function () {
                switchSketch(Mode.PLAY); //CHANGE TO LEVELS
                }, "green"));
    };

}