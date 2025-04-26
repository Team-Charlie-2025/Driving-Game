// classes/map.js

const gridSize = 32;
let mapSize = 500;
let centerX, centerY; // Downtown, center of city
let roadSizes = { tiny: 4, small: 5, normal: 6, big: 7, main: 9 , highway: 11};

// These are more like outer bounds, and i need to change building generation to be better for buildings
let buildingSizes = { smallHouse: 2, largeHouse: 4, shop: 8, shopWidth: 3,
  factoryWidth: 10, factoryLength: 20
}
const largeHouseSize = 4;
let map = []; 

function drawMap(p, center, zoomFactor) {
  p.background(0,0,0);
  let halfWidth = p.width / (2 * zoomFactor);
  let halfHeight = p.height / (2 * zoomFactor);
  let startX = Math.floor((center.x - halfWidth) / gridSize);
  let startY = Math.floor((center.y - halfHeight) / gridSize);
  let endX = Math.ceil((center.x + halfWidth) / gridSize);
  let endY = Math.ceil((center.y + halfHeight) / gridSize);
  
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      if (y >= 0 && y < map.length && x >= 0 && x < map[y].length) {
        let tile = map[y][x];
        if (tile) {
          if (typeof tile.draw === "function") {
            tile.draw(p);
          } else if (typeof tile.display === "function") {
            tile.display();
          }
        }
      }
    }
  }
}

//############################ Procedural Map ##############################
// This is the beginning of generation, starts with blank map of grass, adds roads, then takes grass and fills it with buildings
function generateGenMap(p, rows=500, cols=500) {
  // Initialize the map with Grass.
  // grassImg = p.loadImage("assets/mapBuildier/Terrain/terr04.png");
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Grass(p, x * gridSize + gridSize / 2, y * gridSize+ gridSize / 2, gridSize, gridSize, null);
    }
  }

  drawRectRoad(p,12,1,12+roadSizes.big,420);
  drawAngledRoad(p,20,15,420,42,roadSizes.big);
  drawBezierRoad(p,50,18,70,50,18,50,roadSizes.normal);
  drawAngledRoad(p,40,47,120,119,roadSizes.normal);
  drawRectRoad(p,119,22,119+roadSizes.big,252);
  drawLake(p,1,1,11,20)
  drawLake(p,42,27,49,38)
  drawLake(p,103,31,117,52);
  let blockSize = 50;
  for(let i=1; i<5; ++i){
    drawRectRoad(p,119+(i*blockSize),5,119+roadSizes.normal+(i*blockSize),252);   // Vertical roads
    drawRectRoad(p,119,22+(i*blockSize),380,22+roadSizes.normal+(i*blockSize));    // Horizontal Roads
  }

  drawBezierRoad(p,15,160,150,225,15,260,roadSizes.normal);
  drawAngledRoad(p,61,245,75,400,roadSizes.normal);
  drawAngledRoad(p,86,218,119,226,roadSizes.normal);
  //drawBezierRoad(10,10,30,30,40,5,6);

  //drawRectBuilding(27,25,47,39);
  //drawRectBuilding(27,57,35,97);
  //drawRowOfBuildings(1,1,12,101,8);
  fillBigBuildings(p,1,200,130,400);
  fillShopsDynamically(p,1,1,100,180);
  fillBuildingsDynamically(p,120,1,400,250);
  drawBezierRoad(p,20,105,80,100,75,75,roadSizes.normal)
}


// Determines if its inbounds
function canDrawRoadPath(x0, y0, x1, y1, visited) {
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let stepX = x0 < x1 ? 1 : -1;
  let stepY = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;

  const maxSteps = Math.max(dx, dy) * 2 + 10; // prevent infinite loops
  let steps = 0;

  while ((x !== x1 || y !== y1) && steps++ < maxSteps) {
    if (!inBounds(x, y) || visited[y][x]) return false;

    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += stepX; }
    if (e2 < dx) { err += dx; y += stepY; }
  }

  return x === x1 && y === y1;
}
  
function inBounds(x, y) {
  return y >= 1 && y < map.length - 1 && x >= 1 && x < map[0].length - 1;
}





//get tile type to determine if car is on grass or road
function getTileTypeAt(x, y) {
  let col = Math.floor(x / gridSize);
  let row = Math.floor(y / gridSize);

  if (row >= 0 && row < map.length && col >= 0 && col < map[row].length) {
      let tile = map[row][col];
      if (tile instanceof Road) {
          return "road";
      } else if (tile instanceof Grass) {
          return "grass";
      }
  }
  return "unknown"; //default case
}
  
// ### Structured cidy generator, generates city then country ###
function generateImprovedCityMap(p, rows, cols) {
  const chunkSize = 25;
  const horizontalSpacing = 60;
  const verticalSpacing = 40;
  const alleyOffset = 20;

  const chunksX = Math.floor(cols / chunkSize);
  const chunksY = Math.floor(rows / chunkSize);
  const zoneMap = Array.from({ length: chunksY }, () => Array(chunksX).fill("country"));

  const centerChunkX = Math.floor(chunksX / 2);
  const centerChunkY = Math.floor(chunksY / 2);

  for (let y = 0; y < chunksY; y++) {
    for (let x = 0; x < chunksX; x++) {
      const dx = Math.abs(x - centerChunkX);
      const dy = Math.abs(y - centerChunkY);
      if (dx <= 1 && dy <= 1) zoneMap[y][x] = "downtown";
      else if (dx <= 4 && dy <= 4) zoneMap[y][x] = "residential";
    }
  }

  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Grass(p, x * gridSize + gridSize/2, y * gridSize + gridSize/2, gridSize, gridSize, null);
    }
  }

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  centerX = Math.floor(cols / 2);
  centerY = Math.floor(rows / 2);
  drawAngledRoad(p, centerX, 0, centerX, rows - 1, roadSizes.main);
  drawAngledRoad(p, 0, centerY, cols - 1, centerY, roadSizes.main);
  markRoadVisited(centerX, 0, centerX, rows - 1, visited);
  markRoadVisited(0, centerY, cols - 1, centerY, visited);
  launchGridFromMainRoad(p, visited, 60, 300, cols, rows);

  const residentialEnds = [];

  generateAngledGrid(p, zoneMap, "downtown", horizontalSpacing, verticalSpacing, alleyOffset, roadSizes.normal, visited);
  generateAngledGrid(p, zoneMap, "residential", horizontalSpacing, verticalSpacing, alleyOffset, roadSizes.small, visited, 0.25, residentialEnds, chunkSize);

  for (const pt of residentialEnds) {
    const forks = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < forks; i++) {
      generateCountryTree(p, pt.x, pt.y, visited, 0, 10);
    }
  }
  //fillShopsDynamically(p,200,200,300,300);
  let dockLength = 16;
  let dockWidth = 4;
  placeDock(p,rows-dockWidth,centerY-dockLength/2,rows,centerY+dockLength/2);
  fillBuildingsDynamically(p,0,0,rows,cols);
}


function markRoadVisited(x0, y0, x1, y1, visited) {
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let stepX = x0 < x1 ? 1 : -1;
  let stepY = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;

  while (x !== x1 || y !== y1) {
    if (inBounds(x, y)) visited[y][x] = true;

    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += stepX; }
    if (e2 < dx) { err += dx; y += stepY; }
  }
}

function generateAngledGrid(p, zoneMap, zoneName, hSpacing, vSpacing, alleyOffset, width, visited, alleyChance = 0.5, endpoints = [], chunkSize = 25) {
  const chunksY = zoneMap.length;
  const chunksX = zoneMap[0].length;

  for (let y = 0; y < chunksY; y++) {
    for (let x = 0; x < chunksX; x++) {
      if (zoneMap[y][x] !== zoneName) continue;

      const baseX = x * chunkSize + Math.floor(chunkSize / 2);
      const baseY = y * chunkSize + Math.floor(chunkSize / 2);

      const gx = Math.floor(baseX / hSpacing) * hSpacing + hSpacing / 2;
      const gy = Math.floor(baseY / vSpacing) * vSpacing + vSpacing / 2;

      const dx = Math.floor(Math.random() * 5) - 2;
      const dy = Math.floor(Math.random() * 5) - 2;

      if (gx + hSpacing < map[0].length) {
        drawAngledRoad(p, gx, gy, gx + hSpacing + dx, gy + dy, width);
        markRoadVisited(gx, gy, gx + hSpacing + dx, gy + dy, visited);
        if (zoneName === "residential" && x === 4) endpoints.push({ x: gx + hSpacing + dx, y: gy + dy });
      }
      if (gy + vSpacing < map.length) {
        drawAngledRoad(p, gx, gy, gx + dx, gy + vSpacing + dy, width);
        markRoadVisited(gx, gy, gx + dx, gy + vSpacing + dy, visited);
        if (zoneName === "residential" && y === 4) endpoints.push({ x: gx + dx, y: gy + vSpacing + dy });
      }

      if (Math.random() < alleyChance) {
        const ax = gx + (Math.random() > 0.5 ? -alleyOffset : alleyOffset);
        const ay = gy + (Math.random() > 0.5 ? -alleyOffset : alleyOffset);
        drawAngledRoad(p, gx, gy, ax, ay, roadSizes.tiny);
        markRoadVisited(gx, gy, ax, ay, visited);
      }
    }
  }
}
function generateCountryTree(p, x, y, visited, depth, maxDepth) {
  if (!inBounds(x, y, visited.length, visited[0].length)) return;
  if (visited[y][x]) return;

  visited[y][x] = true;

  const distFromCenter = Math.hypot(x - centerX, y - centerY);
  const dynamicForks = Math.min(6, 2 + Math.floor(distFromCenter / 250));
  const dynamicMaxDepth = Math.min(8, Math.floor(distFromCenter / 100) + 2);
  const windiness = Math.min(2.5, 0.5 + distFromCenter / 500);
  const curveChance = Math.min(0.3 + distFromCenter / 1000, 0.9);

  const directions = [
    { dx: 2, dy: 1 }, { dx: -2, dy: -1 },
    { dx: 1, dy: 2 }, { dx: -1, dy: -2 },
    { dx: 1, dy: 0 }, { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }, { dx: 0, dy: -1 }
  ].sort(() => Math.random() - 0.5);

  let branchesMade = 0;

  for (let dir of directions) {
    if (branchesMade >= dynamicForks) break;

    const len = 40 + Math.floor(Math.random() * 80);
    const nx = x + dir.dx * len;
    const ny = y + dir.dy * len;

    if (!inBounds(nx, ny, visited.length, visited[0].length)) continue;
    if (!canDrawRoadPath(x, y, nx, ny, visited)) continue;
    if (pathWouldOverlapRoad(x, y, nx, ny)) continue;

    if (Math.random() < curveChance) {
      const cx = Math.floor((x + nx) / 2) + (Math.random() * windiness * 20 - windiness * 10);
      const cy = Math.floor((y + ny) / 2) + (Math.random() * windiness * 20 - windiness * 10);
      drawBezierRoad(p, x, y, cx, cy, nx, ny, roadSizes.normal);
    } else {
      drawAngledRoad(p, x, y, nx, ny, roadSizes.normal);
    }

    markRoadVisited(x, y, nx, ny, visited);

    if (depth < dynamicMaxDepth && Math.random() < 0.9) {
      generateCountryTree(p, nx, ny, visited, depth + 1, dynamicMaxDepth);
    }

    if (depth >= 2 && Math.random() < 0.5) {
      const mx = Math.floor((x + nx) / 2);
      const my = Math.floor((y + ny) / 2);
      generateCountryTree(p, mx, my, visited, depth + 1, dynamicMaxDepth);
    }

    branchesMade++;
  }
}

function launchGridFromMainRoad(p, visited, spacing, range, cols, rows) {
  const mainX = Math.floor(cols / 2);
  const mainY = Math.floor(rows / 2);
  const offset = roadSizes.main;

  // Horizontal main road — vertical branches
  for (let x = mainX - range; x <= mainX + range; x += spacing) {
    const topY = mainY - Math.floor(offset / 2) - 1;
    const botY = mainY + Math.floor(offset / 2) + 1;
    if (inBounds(x, topY, rows, cols) && !visited[topY][x]) {
      launchInitialBranch(p, x, topY, visited);
    }
    if (inBounds(x, botY, rows, cols) && !visited[botY][x]) {
      launchInitialBranch(p, x, botY, visited);
    }
  }

  // Vertical main road — horizontal branches
  for (let y = mainY - range; y <= mainY + range; y += spacing) {
    const leftX = mainX - Math.floor(offset / 2) - 1;
    const rightX = mainX + Math.floor(offset / 2) + 1;
    if (inBounds(leftX, y, rows, cols) && !visited[y][leftX]) {
      launchInitialBranch(p, leftX, y, visited);
    }
    if (inBounds(rightX, y, rows, cols) && !visited[y][rightX]) {
      launchInitialBranch(p, rightX, y, visited);
    }
  }
}


function launchInitialBranch(p, x, y, visited) {
  const dirs = [
    { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
    { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
    { dx: 2, dy: 1 }, { dx: -2, dy: -1 },
    { dx: 1, dy: 2 }, { dx: -1, dy: -2 }
  ].sort(() => Math.random() - 0.5);

  for (let dir of dirs) {
    const len = 40 + Math.floor(Math.random() * 60);
    const nx = x + dir.dx * len;
    const ny = y + dir.dy * len;
    if (!inBounds(nx, ny, map.length, map[0].length)) continue;
    if (!canDrawRoadPath(x, y, nx, ny, visited)) continue;

    const curve = Math.random() < 0.3;
    if (curve) {
      const cx = Math.floor((x + nx) / 2) + (Math.random() > 0.5 ? 10 : -10);
      const cy = Math.floor((y + ny) / 2) + (Math.random() > 0.5 ? 10 : -10);
      drawBezierRoad(p, x, y, cx, cy, nx, ny, roadSizes.normal);
    } else {
      drawAngledRoad(p, x, y, nx, ny, roadSizes.normal);
    }

    markRoadVisited(x, y, nx, ny, visited);
    break;
  }
}