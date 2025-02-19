class Road {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = 'white';
      this.width = gridSize;
      this.height = gridSize;
    }
  
    draw(p) {
      p.fill(this.color);
      p.rect(this.x, this.y, this.width, this.height);
    }
  }