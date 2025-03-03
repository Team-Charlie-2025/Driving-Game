// classes/button.js

class Button { //regular rect button class
    constructor(label, x, y, callback, color = "na") {
      this.label = label;
      this.x = x;
      this.y = y;
      this.width;
      this.height;
      this.callback = callback;
      this.color = color;
    }
  
    display(p) {
      if(this.label == "Play" ){ //label depends on image for title page
        this.width = this.x /1.6;
        this.height = this.y / 4;
        p.image(window.playButton, this.x - this.width / 2 +15, this.y - this.height / 2, this.width, this.height);
      }
      else if(this.label == "Garage" ){
        this.width = this.x /1.6;
        this.height = this.y / 5.1;
        p.image(window.garageButton, this.x - this.width / 2 +15, this.y - this.height / 2, this.width, this.height);
      }
      else if(this.label == "Settings" ){
        this.width = this.x / 0.6;
        this.height = this.y / 2.2;
        p.image(window.setButton, this.x - this.width / 2.2, this.y - this.height / 2, this.width, this.height);
      }
      else if(this.label == "Leaderboard" ){
        this.width = this.x / 3.2;
        this.height = this.y / 3.5;
        p.image(window.leaderButton, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height * 2);
      }
      else if(this.label == "ExitIcon" ){
        this.width = 32;
        this.height = 32;
        p.image(window.ButtonIcons, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 160, 160, 16, 16);
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
      else if (this.label == "ℹ️") { // Info button (text-based)
        this.width = 40; // Fixed width for the info button
        this.height = 40; // Fixed height for the info button
        p.fill(34, 139, 34); // Green background
        p.noStroke();
        p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 10); // Rounded rectangle
        p.fill(255); // White text
        p.textSize(24);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(this.label, this.x, this.y); // Display the ℹ️ symbol
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