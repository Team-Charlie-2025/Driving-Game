// classes/button.js

class Button { //regular rect button class
    constructor(label, x, y, callback) {
      this.label = label;
      this.x = x;
      this.y = y;
      this.width;
      this.height;
      this.callback = callback;
    }
  
    display(p) {
      if(this.label == "Play" ){ //label depends on image
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
        this.height = this.y / 0.6;
        p.image(window.leaderButton, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height * 2);
      }
      /*else{ used for previous button version
        p.fill(200);
        p.stroke(0);
        p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 10);
        p.fill(0);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.text(this.label, this.x, this.y);
      }*/
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