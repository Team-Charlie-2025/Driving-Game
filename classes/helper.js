// classes/helper.js

function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i].x, yi = polygon[i].y;
      let xj = polygon[j].x, yj = polygon[j].y;
      let intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
  
function lineIntersects(p1, p2, p3, p4) {
  let denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denom === 0) return false;
  let ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  let ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
  return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
}

function polygonsIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    let nextI = (i + 1) % poly1.length;
    for (let j = 0; j < poly2.length; j++) {
      let nextJ = (j + 1) % poly2.length;
      if (lineIntersects(poly1[i], poly1[nextI], poly2[j], poly2[nextJ])) {
        return true;
      }
    }
  }
  if (pointInPolygon(poly1[0], poly2)) return true;
  if (pointInPolygon(poly2[0], poly1)) return true;
  return false;
}

function getImagePolygon(img, alphaThreshold = 0) {
  img.loadPixels();
  let w = img.width, h = img.height;
  let binary = [];
  for (let y = 0; y < h; y++) {
    binary[y] = [];
    for (let x = 0; x < w; x++) {
      let idx = 4 * (x + y * w);
      let a = img.pixels[idx + 3];
      binary[y][x] = (a > alphaThreshold);
    }
  }
  let start = null;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (binary[y][x]) {
        start = { x, y };
        break;
      }
    }
    if (start) break;
  }
  if (!start) {
    console.error("getImagePolygon: No opaque pixels found in image!");
    return [];
  }
  let outline = [];
  let current = start;
  let directions = [
    { dx: 0, dy: -1 }, //down
    { dx: 1, dy: -1 }, //downright
    { dx: 1, dy: 0 }, //right
    { dx: 1, dy: 1 }, //up right
    { dx: 0, dy: 1 }, //up
    { dx: -1, dy: 1 }, //up left
    { dx: -1, dy: 0 }, //left
    { dx: -1, dy: -1 } //downleft
  ];
  let prevDirIndex = 6;
  outline.push({ x: current.x, y: current.y });
  while (true) {
    let startDir = (prevDirIndex + 1) % 8;
    let found = false;
    let next = null;
    let nextDirIndex = null;
    for (let i = 0; i < 8; i++) {
      let dirIndex = (startDir + i) % 8;
      let nx = current.x + directions[dirIndex].dx;
      let ny = current.y + directions[dirIndex].dy;
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
      if (binary[ny][nx]) {
        next = { x: nx, y: ny };
        nextDirIndex = dirIndex;
        found = true;
        break;
      }
    }
    if (!found) break;
    prevDirIndex = (nextDirIndex + 6) % 8;
    current = next;
    if (current.x === start.x && current.y === start.y) break;
    else outline.push({ x: current.x, y: current.y });
    if (outline.length > w * h) break; // safety check
  }
  return outline;
}

function checkCoinCollisions(coins, car, p) {
  if (!car) return coins;
  for (let coin of coins) {
    if (!coin.collected && coin.collider && coin.collider.intersects(car.collider)) {
      coin.collected = true;
      const oldCount = window.coinsCollected;
      window.coinsCollected++;
      const newTotal = CurrencyManager.computeCoinsEarned(window.coinsCollected);
      const oldTotal = CurrencyManager.computeCoinsEarned(oldCount);
      const incremental = newTotal - oldTotal;
      CurrencyManager.updateTotalCoins(incremental);
    }
  }
  return coins.filter(coin => !coin.collected);
}

function isCoinCollidingWithBuilding(coin) {
  const tileX = Math.floor(coin.position.x / gridSize);
  const tileY = Math.floor(coin.position.y / gridSize);
  for (let j = tileY - 1; j <= tileY + 1; j++) {
    for (let i = tileX - 1; i <= tileX + 1; i++) {
      if (map[j] && map[j][i] instanceof Building) {
        let building = map[j][i];
        if (coin.collider.intersects(building.collider)) {
          return true;
        }
      }
    }
  }
  return false;
}


//////////////////////////
// FOR AUDIO
//////////////////////////

function setMusicVolume(newVol) {
  currentMusicVolume = newVol;
  if (window.music) {
    for (let key in window.music) {
      window.music[key].forEach(sound => sound.setVolume(newVol));
    }
  }
}

function getMusicVolume() {
  return currentMusicVolume;
}

function music(key, p, mode = 'loop') {
  if (window.music && window.music[key] && window.music[key].length > 0) {
    let soundObj = window.music[key][0];
    if (soundObj.isPlaying()) {
      soundObj.stop();
    }
    if (mode === 'loop') {
      soundObj.loop();
    } else {
      soundObj.play();
    }
    return soundObj;
  } else {
    console.error("No music found for key: " + key);
  }
}

function soundEffect(key, p) {
  if (window.soundEffects && window.soundEffects[key] && window.soundEffects[key].length > 0) {
    let soundObj = window.soundEffects[key][0];
    soundObj.play();
    return soundObj;
  } else {
    console.error("No sound effect found for key: " + key);
  }
}