// classes/button.js

class Button { //regular rect button class
    constructor(label, x, y, callback) {
      this.label = label;
      this.x = x;
      this.y = y;
      this.width = 200;
      this.height = 50;
      this.callback = callback;
    }
  
    display(p) {
      if(this.label == "Play" ){ //label depends on image
        p.image(window.playButton, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      }
      else if(this.label == "Garage" ){
        p.image(window.garageButton, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      }
      else{
        p.fill(200);
        p.stroke(0);
        p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 10);
        p.fill(0);
        p.noStroke();
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