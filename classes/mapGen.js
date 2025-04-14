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

function generateDFSChunkedMap(p, rows, cols) {
  const chunkSize = 25;
  const chunkCols = Math.floor(cols / chunkSize);
  const chunkRows = Math.floor(rows / chunkSize);

  const chunks = Array.from({ length: chunkRows }, (_, y) =>
    Array.from({ length: chunkCols }, (_, x) => ({
      hasRoad: false,
      zone: "country",
      x,
      y
    }))
  );

  centerX = Math.floor(chunkCols / 2);
  centerY = Math.floor(chunkRows / 2);

  // Zoning
  for (let y = 0; y < chunkRows; y++) {
    for (let x = 0; x < chunkCols; x++) {
      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);
      const dist = Math.max(dx, dy);
      if (dist <= 4) chunks[y][x].zone = "downtown";
      else if (dist <= 9) chunks[y][x].zone = "residential";
    }
  }

  // Init map as grass
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Grass(p, x * gridSize + gridSize/2, y * gridSize + gridSize/2, gridSize, gridSize, null);
    }
  }

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  // Main roads
  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  centerX = midCol;
  centerY = midRow;
  drawAngledRoad(p, midCol, 0, midCol, rows - 1, roadSizes.main);
  drawAngledRoad(p, 0, midRow, cols - 1, midRow, roadSizes.main);
  markRoadVisited(midCol, 0, midCol, rows - 1, visited);
  markRoadVisited(0, midRow, cols - 1, midRow, visited);

  // Launch from main horizontal and vertical
  const offset = Math.ceil(roadSizes.main / 2) + 2;
  for (let y = 100; y < rows - 100; y += 50) {
    dfsChunkedBranch(p, midCol + offset - 1, y, visited, chunks, 0);
    dfsChunkedBranch(p, midCol - offset + 1, y, visited, chunks, 0);
  }
  for (let x = 50; x < cols - 50; x += 50) {
    dfsChunkedBranch(p, x, midRow + offset - 1, visited, chunks, 0);
    dfsChunkedBranch(p, x, midRow - offset + 1, visited, chunks, 0);
  }
}

function dfsChunkedBranch(p, x, y, visited, chunks, depth) {
  if (!inBounds(x, y)) return;
  if (visited[y][x]) return;

  const chunkSize = 25;
  const chunkX = Math.floor(x / chunkSize);
  const chunkY = Math.floor(y / chunkSize);
  if (!inChunkBounds(chunkX, chunkY, chunks)) return;

  const chunk = chunks[chunkY][chunkX];
  if (chunk.hasRoad) return;

  const centerTileX = chunkX * chunkSize + Math.floor(chunkSize / 2);
  const centerTileY = chunkY * chunkSize + Math.floor(chunkSize / 2);

  chunk.hasRoad = true;
  visited[centerTileY][centerTileX] = true;

  const directions = [
    { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
    { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
    { dx: 2, dy: 1 }, { dx: -2, dy: 1 },
    { dx: 2, dy: -1 }, { dx: -2, dy: -1 },
    { dx: 1, dy: 2 }, { dx: -1, dy: 2 },
    { dx: 1, dy: -2 }, { dx: -1, dy: -2 }
  ];

  directions.sort(() => Math.random() - 0.5);

  const zone = chunk.zone;
  const branchChance = zone === "downtown" ? 0.9 : zone === "residential" ? 0.4 : 0.25;

  for (let dir of directions) {
    const length = 40 + Math.floor(Math.random() * 110);
    const nx = centerTileX + dir.dx * length;
    const ny = centerTileY + dir.dy * length;
    const targetChunkX = Math.floor(nx / chunkSize);
    const targetChunkY = Math.floor(ny / chunkSize);

    if (!inBounds(nx, ny)) continue;
    if (!inChunkBounds(targetChunkX, targetChunkY, chunks)) continue;

    const nextChunk = chunks[targetChunkY][targetChunkX];
    if (nextChunk.hasRoad && !canDrawRoadPath(centerTileX, centerTileY, nx, ny, visited)) continue;

    const useCurve = zone === "country" ? Math.random() < 0.5 : Math.random() < 0.25;
    if (useCurve) {
      const midX = Math.floor((centerTileX + nx) / 2) + (Math.random() > 0.5 ? 12 : -12);
      const midY = Math.floor((centerTileY + ny) / 2) + (Math.random() > 0.5 ? 12 : -12);
      drawBezierRoad(p, centerTileX, centerTileY, midX, midY, nx, ny, roadSizes.normal);
    } else {
      drawAngledRoad(p, centerTileX, centerTileY, nx, ny, roadSizes.normal);
    }

    markRoadVisited(centerTileX, centerTileY, nx, ny, visited);
    nextChunk.hasRoad = true;
    visited[nx] = true;

    if (depth < 6 && Math.random() < branchChance) {
      dfsChunkedBranch(p, nx, ny, visited, chunks, depth + 1);
    }

    if (zone === "country" && Math.random() < 0.2) {
      const midX = Math.floor((centerTileX + nx) / 2);
      const midY = Math.floor((centerTileY + ny) / 2);
      dfsChunkedBranch(p, midX, midY, visited, chunks, depth + 1);
    }

    break; 
  }
}

function inChunkBounds(x, y, chunks) {
  return y >= 0 && y < chunks.length && x >= 0 && x < chunks[0].length;
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



function generateDFSMap(p, rows, cols) {
  // Initialize grass map
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Grass(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize, null);
    }
  }

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const midX = Math.floor(cols / 2);
  const midY = Math.floor(rows / 2);
  centerX = midX;
  centerY = midY;
  const mainWidth = roadSizes.main;
  const roadOffset = Math.floor(mainWidth / 2) + 2;

  // Draw the two main roads
  drawAngledRoad(p, midX, 0, midX, rows - 1, mainWidth);
  drawAngledRoad(p, 0, midY, cols - 1, midY, mainWidth);

  // Mark main roads as visited
  markRoadVisited(midX, 0, midX, rows - 1, visited);
  markRoadVisited(0, midY, cols - 1, midY, visited);


  for (let y = 100; y < rows - 100; y += 50) {
    dfsRoadGen(p, midX + roadOffset - 1, y, visited, 0);
    dfsRoadGen(p, midX - roadOffset + 1, y, visited, 0);
  }

  // Branch off from horizontal main road
  for (let x = 50; x < cols - 50; x += 50) {
    dfsRoadGen(p, x, midY + roadOffset -1 , visited, 0);
    dfsRoadGen(p, x, midY - roadOffset + 1, visited, 0);
  }


  // Fill buildings after roads
  fillBuildingsDynamically(p, 0, 0, cols, rows);
}

function dfsRoadGen(p, x, y, visited, depth) {
  if (!inBounds(x, y)) return;
  if (visited[y][x]) return;

  const angleBias = 1 + depth;

  let directions = [
    { dx: 2 * angleBias, dy: 1 },
    { dx: -2 * angleBias, dy: 1 },
    { dx: 2 * angleBias, dy: -1 },
    { dx: -2 * angleBias, dy: -1 },
    { dx: 1, dy: 2 * angleBias },
    { dx: -1, dy: 2 * angleBias },
    { dx: 1, dy: -2 * angleBias },
    { dx: -1, dy: -2 * angleBias },
    { dx: 1 * angleBias, dy: 0 },
    { dx: -1 * angleBias, dy: 0 },
    { dx: 0, dy: 1 * angleBias },
    { dx: 0, dy: -1 * angleBias }
  ];

  directions = directions.sort(() => Math.random() - 0.5);

  let drewAny = false;

  for (let dir of directions) {
    const length = 40 + Math.floor(Math.random() * 110); // 40–149 tiles
    const nx = x + dir.dx * length;
    const ny = y + dir.dy * length;

    if (!inBounds(nx, ny)) continue;
    if (!canDrawRoadPath(x, y, nx, ny, visited)) continue;

    const useCurve = Math.random() < 0.25;

    if (useCurve) {
      // Pull the control point 1 tile closer to origin, then offset
      const cxRaw = Math.floor((x + nx) / 2);
      const cyRaw = Math.floor((y + ny) / 2);

      const cx = cxRaw - Math.sign(nx - x); // shift one tile toward x
      const cy = cyRaw - Math.sign(ny - y); // shift one tile toward y

      const offsetX = (Math.random() > 0.5 ? 12 : -12);
      const offsetY = (Math.random() > 0.5 ? 12 : -12);

      drawBezierRoad(p, x, y, cx + offsetX, cy + offsetY, nx, ny, roadSizes.normal);
    } else {
      drawAngledRoad(p, x, y, nx, ny, roadSizes.normal);
    }

    markRoadVisited(x, y, nx, ny, visited);
    visited[y][x] = true;
    drewAny = true;

    if (depth < 5 && Math.random() > 0.3) {
      dfsRoadGen(p, nx, ny, visited, depth + 1);
    }

    if (depth < 4 && Math.random() < (0.25 + depth * 0.15)) {
      const midX = Math.floor((x + nx) / 2);
      const midY = Math.floor((y + ny) / 2);
      dfsRoadGen(p, midX, midY, visited, depth + 1);
    }
  }

  if (!drewAny) {
    visited[y][x] = false;
  }
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
  return "unknown"; //default case (e.g., out of bounds)
}
  

