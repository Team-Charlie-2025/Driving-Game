// classes/button.js

class Button { //regular rect button class
    constructor(label, x, y, callback, color = "blue", size = "small") {
      this.label = label;
      this.x = x;
      this.y = y;
      this.width;
      this.height;
      this.callback = callback;
      this.color = color;
      this.size = size ; //basic small, medium, large
      this.hoverScale = 1.05;
      this.textSize;
    }
  
    display(p) {
      let isHovered = this.isMouseOver(p); // for responsive buttons (get larger on hover)
      let hoverScale = isHovered ? this.hoverScale : 1;

      if(this.label == "ExitIcon" ){//specfic image for button
        this.width = 45 * window.widthScale;
        this.height = 45 * window.heightScale;
        let drawWidth = this.width * hoverScale;
        let drawHeight = this.height * hoverScale;
        p.image(window.exitButton, this.x - drawWidth / 2, this.y - drawHeight / 2, drawWidth, drawHeight);
        return;

      }
      else if(this.label == "SETTINGS" ){ //specfic image for button
        this.width = 350 * window.widthScale;
        this.height = 200 * window.heightScale;

        let drawWidth = this.width * hoverScale;
        let drawHeight = this.height * hoverScale;

        p.image(window.setButton, this.x-drawWidth /2, this.y-drawHeight/1.5, drawWidth , drawHeight * 1.8);

        p.textFont(window.PixelFont);
        p.textSize(drawWidth/5);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(this.label, this.x + this.width/20, this.y + this.height/28);
        return;
      }
      else if(this.label == "LEADERBOARD" ){ //specfic image for button
        this.width = 500 * window.widthScale;
        this.height = 180 * window.heightScale;
        let drawWidth = this.width * hoverScale;
        let drawHeight = this.height * hoverScale;
        p.image(window.leaderButton, this.x - drawWidth / 2, this.y - drawHeight  / 2, drawWidth, drawHeight  * 1.8);


        p.textFont(window.PixelFont);
        p.textSize(drawWidth/7);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(this.label, this.x+ this.width/75, this.y + this.height/20);
        return;
      }
      else if (this.size == "small"){
        this.width = 125 * window.widthScale;
        this.height = 40 * window.heightScale;
        this.textSize = 5;
      }
      else if (this.size == "medium"){
        this.width = 325 * window.widthScale;
        this.height = 100 * window.heightScale;
        this.textSize = 5;
      }
      else if(this.size == "large"){
        this.width = 375 * window.widthScale;
        this.height = 140 * window.heightScale;
        this.textSize = 4;
      }
      let buttonImg  = window.basicButton[this.color];
      let drawWidth = this.width * hoverScale;
      let drawHeight = this.height * hoverScale;
      p.image(buttonImg, this.x - drawWidth / 2, this.y - drawHeight / 2, drawWidth, drawHeight);

      p.fill(10);
      p.textSize(drawWidth/ this.textSize)
      p.textFont(window.PixelFont);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.label, this.x, this.y);
      
    }
  
    isMouseOver(p) {
      return (
        p.mouseX > this.x - this.width / 2  &&
        p.mouseX < this.x + this.width / 2  &&
        p.mouseY > this.y - this.height / 2  &&
        p.mouseY < this.y + this.height / 2 
      );
    }
  }