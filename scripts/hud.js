//scripts/hud.js

function showHud(p){
    // UI
    p.push();
      console.log("zoom: " + zoomFactor);
      // Draw Health Bar
      p.fill(50);
      p.rect(20, 20, 200, 25);
      p.fill(0, 255, 0);
      p.rect(20, 20, car.healthBar * 2, 25);
  
      // Draw Boost Meter
      p.fill(50);
      p.rect(20, 60, 200, 25);
      p.fill(255, 165, 0);
      p.rect(20, 60, car.boostMeter * 2, 25);
  
      // Labels
      p.fill(255);
      p.textSize(16);
      p.text("Health", 20, 18);
      p.text("Boost", 20, 58);

      ItemsManager.shieldDisplayBar(p);
      
      // Frame Rate
      p.textSize(12);
      p.textAlign(p.RIGHT, p.BOTTOM);
      p.fill(0);
      p.fps = p.frameRate();
      p.text("Frames: " + Math.round(p.fps), 75 ,p.height-22);
      // debug positional for car
      if (car) {
        p.textSize(12);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.fill(0);
        p.text(`Car: (${Math.round(car.position.x/gridSize)}, ${Math.round(car.position.y/gridSize)})`, 10, p.height - 10);
      }
      
      // timer, coins
      p.push();
        p.textSize(16);
        p.fill(255);
        p.textAlign(p.RIGHT, p.TOP);
        let secondsElapsed = ((p.millis() - p.startTime) / 1000).toFixed(1);
        p.text(`Time: ${secondsElapsed} sec`, p.width - 10, 10);
        p.text(`Coins: ${window.coinsCollected}`, p.width - 10, 30);
      p.pop();
    p.pop();

}