// classes/button.js
class Button {
    constructor(label, x, y, callback) {
      this.label = label;
      this.x = x;
      this.y = y;
      this.width = 200;
      this.height = 50;
      this.callback = callback;
    }
  
    display(p) {
      p.fill(200);
      p.stroke(0);
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 10);
      p.fill(0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.label, this.x, this.y);
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
  