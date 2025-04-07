// classes/coin.js

class Coin extends GameObject {
  constructor(p, x, y, size = 20) {
    super(x, y);
    this.p = p;
    this.size = size;
    this.collected = false;
    this.collider = new Collider(this, "rectangle", {
      width: this.size,
      height: this.size,
      offsetX: -this.size / 2,
      offsetY: -this.size / 2
    });
  }

  update() {
  }

  display() {
    const p = this.p;
    const frameDuration = 150; // 5fps
    const frameIndex = Math.floor(p.millis() / frameDuration) % window.animations["coin"].length;
    const coinImg = window.animations["coin"][frameIndex];

    p.push();
      p.translate(this.position.x, this.position.y);
      p.imageMode(p.CENTER);
      p.noStroke();
      p.image(coinImg, 0, 0, this.size, this.size);
    p.pop();
  }
}
