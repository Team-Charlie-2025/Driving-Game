function Signup(p) {
  p.preload = function(){
    loadMusic(p);
    loadSoundEffects(p);
  }
    p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(230);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(48);
      p.fill(50);
      p.text("Signup", p.width / 2, p.height / 2);
      
      ExitIcon = new Button("ExitIcon", p.width - p .width * 0.05, p.height - p.height * 0.95, p.width, p.height, function () { 
        switchSketch(Mode.TITLE);
      });

      //stop loading
   //  window.LoadingScreen.hide();
    };
  
    p.draw = function () {
      ExitIcon.display(p);
      p.textSize(80);
      p.fill(50);
      p.text("Login",p.width / 2, p.height / 2);
      p.text("signup",p.width / 2, p.height / 2 + 100);

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
  