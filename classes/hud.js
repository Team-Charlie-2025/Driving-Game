//scripts/hud.js
let windowHeightScale, windowWidthScale, windowScale;
function showHud(p,map,car){

    // Im counting a "standard" window as 1920x1080, which realistically the game plays at 1920x860 or 1731x3840 when zoomed out
    windowWidthScale = p.windowWidth/1920;
    windowHeightScale = p.windowHeight/1080;
    windowScale = (windowHeightScale + windowWidthScale) / 2 ; // Hopefully this works for text size
    let scale = {scale: windowScale, width: windowWidthScale, height: windowHeightScale};
    // UI
    p.push();
      
      //drawMinimap(p,map,4)
      drawDebugInfo(p,car,scale);
      drawMeters(p,car, scale);
      drawCoinsTimer(p,scale);
      ItemsManager.shieldDisplayBar(p,scale);
      drawInventory(p, scale);
      
      
      

    p.pop();

}

// Draws boost and health meters
function drawMeters(p,car,scale){
  // Labels
  p.fill(255);
  p.textSize(16*windowScale);
  p.text("Health", 10*windowWidthScale, 18*windowHeightScale);
  p.text("Boost", 10*windowWidthScale, 65*windowHeightScale);
  let maxHealth = (loadPersistentData().stats.health);  
  // Draw Health Bar
  p.fill(50);
  p.rect(10*windowWidthScale, 20*windowHeightScale, 200*windowWidthScale, 25*windowHeightScale);
  
  //color change as health decreases
  if(car.healthBar < maxHealth/4) //quarter health =  red
    p.fill(240, 20, 20);
  else if(car.healthBar < maxHealth /2) //half health =  yellow
    p.fill(223, 232, 100);
  else
    p.fill(0, 255, 0);
  
  p.rect(10*windowWidthScale, 20*windowHeightScale, (car.healthBar/maxHealth)*200*windowWidthScale, 25*windowHeightScale);

  // Draw Boost Meter
  p.fill(50);
  p.rect(10*windowWidthScale, 67*windowHeightScale, 200*windowWidthScale, 25*windowHeightScale);
  p.fill(255, 165, 0);
  //console.log("boost" + car.boostMeter);
  p.rect(10*windowWidthScale, 67*windowHeightScale, car.boostMeter * 2 * windowWidthScale, 25*windowHeightScale);

}

// Draws the framerate and car position
function drawDebugInfo(p,car,scale){
  // Frame Rate
  p.textSize(14*windowScale);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.fill(0);
  p.fps = p.frameRate();
  p.text("Frames: " + Math.round(p.fps), 10*windowWidthScale ,p.height-22*windowHeightScale);
  // debug positional for car
  if (car) {
    p.textSize(12*windowScale);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.fill(0);
    p.text(`Car: (${Math.round(car.position.x/gridSize)}, ${Math.round(car.position.y/gridSize)})`, 10*windowWidthScale, p.height - 10*windowHeightScale);
    }
}

function drawCoinsTimer(p,scale){
  p.push();
    p.textSize(16*windowScale);
    p.fill(255);
    p.textAlign(p.CENTER, p.TOP);
    let secondsElapsed = ((p.millis() - p.startTime) / 1000).toFixed(1);
    p.text(`Time: ${secondsElapsed} sec`, p.width/2 - 10*windowWidthScale, 10*windowHeightScale);
    p.text(`Coins: ${window.coinsCollected}`, p.width/2 - 10*windowWidthScale, 30*windowHeightScale);
  p.pop();
}
function drawInventory(p, scale){
  p.push(); //Bombs
    p.textSize(16*windowScale);
    p.fill(255);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(`Bomb Inventory: ${bombInventory}`, p.width - 10*windowWidthScale,  10*windowHeightScale);
  p.pop();

}

/*
function drawMinimap(p, map, tileSize) {
  let mapSize = 100; // minimap size in pixels
  let mapRows = 50;  // how much of the map is displayed
  let scaleFactor = mapSize / mapRows; // Scale tiles to fit minimap

  let xOffset = p.width - mapSize - 20; // Top-right corner
  let yOffset = 20;

  p.noStroke();
  p.translate(xOffset, yOffset); // Position minimap

  for (let y = 0; y < mapRows; y++) {
    for (let x = 0; x < mapRows; x++) {
      let tile = tilemap[y][x];

      // Choose colors based on tile type
      if (tile === 0) {
        p.fill(50, 50, 50); // Grey for roads
        } else {
          p.fill(0, 150, 0); // Green for grass
          }

            // Draw tile on minimap
            p.rect(x * scaleFactor, y * scaleFactor, scaleFactor, scaleFactor);
        }
    }

}
*/