// classes/button.js

class Button { //regular rect button class
    constructor(label, x, y, winx, winy, callback, color = "na") {
      this.label = label;
      this.x = x;
      this.y = y;
      this.winx = winx;
      this.winy = winy;
      this.width;
      this.height;
      this.callback = callback;
      this.color = color;
    }
  
    display(p) {
      if(this.label == "Play" || this.label == "Garage"){ //label depends on image for title page
        this.width = this.winx / 4.5;
        this.height = this.winy / 5.5;
        let buttonImg;
        if(this.label == "Play")
          buttonImg = window.playButton;
        else  
          buttonImg = window.garageButton;
        p.image(buttonImg, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        /*p.textFont(window.PixelFont);
        p.textSize(0.15 * this.width);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(this.label, this.x, this.y);*/
      }
      else if(this.label == "Settings" ){
        this.width = this.x / 0.6;
        this.height = this.y / 2.2;
        p.image(window.setButton, this.x - this.width / 2.2, this.y - this.height / 2, this.width, this.height);
      }
      else if(this.label == "Leaderboard" ){
        this.width = this.x / 3.2;
        this.height = this.y / 0.6;
        p.image(window.leaderButton, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height * 2);
      }
      else if(this.label == "ExitIcon" ){
        this.width = 32;
        this.height = 32;
        p.image(window.exitButton, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      }
      else if (this.label == "HELP") { // Info button
        this.width = this.x / 12; 
        this.height = this.y /0.5; 
        let buttonImg  = window.basicButton[this.color];
        p.image(buttonImg, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        p.textFont(window.PixelFont);
        p.textSize(this.width/8);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(this.label, this.x, this.y);
      }

      //basic button options, based on color and overlay text with pixel font
      else if (this.color != "na"){
        this.height = 192;
        this.width = 384;
        let buttonImg  = window.basicButton[this.color];

        p.image(buttonImg, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        p.textFont(window.PixelFont);
        p.textSize(35);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(this.label, this.x, this.y);
      }
      
    }
  
    isMouseOver(p) {
      return (
        p.mouseX >= this.x - this.width / 2 &&
        p.mouseX <= this.x + this.width / 2 &&
        p.mouseY >= this.y - this.height / 2 &&
        p.mouseY <= this.y + this.height / 2
      );
    }
  }