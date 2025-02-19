class Building {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = 'yellow';
      this.width = gridSize;
      this.height = gridSize;
    }
  
    draw(p) {
      p.fill(this.color);
      p.noStroke();
      p.rect(this.x, this.y, this.width, this.height);
    }
  }