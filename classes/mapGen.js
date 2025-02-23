/* 
  #######################################################################
  This file is for trying to generate the building map through logic and chance
  
  Currently I am trying to generate maps with the logic of "neighborhoods"
  different areas have different generation
  #########################################################################
*/
function generateGenMap(p, rows, cols) {
  // Initialize the map with Grass.
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Grass(x * gridSize, y * gridSize);
    }
  }

  // Generate Roads.
  drawRectRoad(p, 12, 1, 25, 420);
  drawAngledRoad(p, 20, 15, 420, 42, 11);
  drawBezierRoad(p, 50, 18, 70, 50, 18, 50, 9);
  drawAngledRoad(p, 40, 47, 120, 119, 9);
  drawRectRoad(p, 119, 22, 130, 252);

  let blockSize = 50;
  for (let i = 1; i < 5; i++) {
    drawRectRoad(p, 119 + i * blockSize, 5, 128 + i * blockSize, 252);
    drawRectRoad(p, 119, 22 + i * blockSize, 380, 31 + i * blockSize);
  }

  drawBezierRoad(p, 15, 160, 150, 225, 15, 260, 9);
  drawAngledRoad(p, 61, 245, 75, 400, 9);
  drawAngledRoad(p, 86, 218, 119, 226, 8);
  drawBezierRoad(p, 20, 105, 80, 100, 75, 75, 9);

  // Generate Buildings.
  fillBigBuildings(p, 1, 200, 130, 400);
  fillShopsDynamically(p, 1, 1, 100, 180);
  fillBuildingsDynamically(p, 120, 1, 400, 250);

  console.log("generateGenMap: Completed procedural generation of map.");
}

function drawRectRoad(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] !== undefined) {
        // Adjust x and y to be centered on the tile.
        map[y][x] = new Road(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize);
      }
    }
  }
}

function drawAngledRoad(p, xStart, yStart, xEnd, yEnd, width) {
  let dx = Math.abs(xEnd - xStart);
  let dy = Math.abs(yEnd - yStart);
  let stepX = xStart < xEnd ? 1 : -1;
  let stepY = yStart < yEnd ? 1 : -1;
  let err = dx - dy;
  let x = xStart;
  let y = yStart;

  while (x !== xEnd || y !== yEnd) {
    for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
      let perpX = (dy > dx) ? j : 0;
      let perpY = (dx > dy) ? j : 0;
      let buildX = x + perpX;
      let buildY = y + perpY;
      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Road(p, buildX * gridSize + gridSize/2, buildY * gridSize + gridSize/2, gridSize, gridSize);
      }
    }
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += stepX; }
    if (e2 < dx) { err += dx; y += stepY; }
  }
}

function drawBezierRoad(p, x0, y0, x1, y1, x2, y2, width) {
  let numSteps = 1000;
  let prevX = x0, prevY = y0;
  for (let i = 0; i <= numSteps; i++) {
    let t = i / numSteps;
    let x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
    let y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
    let tangentX = x - prevX;
    let tangentY = y - prevY;
    let length = Math.sqrt(tangentX * tangentX + tangentY * tangentY) || 1;
    let perpX = -tangentY / length;
    let perpY = tangentX / length;

    for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
      let buildX = Math.round(x + j * perpX);
      let buildY = Math.round(y + j * perpY);
      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Road(p, buildX * gridSize + gridSize/2, buildY * gridSize + gridSize/2, gridSize, gridSize);
      }
    }
    prevX = x;
    prevY = y;
  }
}

function drawRectBuilding(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] !== undefined) {
        map[y][x] = new Building(
          p,
          x * gridSize + gridSize / 2,
          y * gridSize + gridSize / 2,
          gridSize,
          gridSize,
          buildingImg
        );
      }
    }
  }
}

function fillBuildingsDynamically(p, xPosStart, yPosStart, xPosEnd, yPosEnd) {
  for (let yStart = yPosStart; yStart < yPosEnd; yStart++) {
    for (let xStart = xPosStart; xStart < xPosEnd; xStart++) {
      if (map[yStart][xStart] instanceof Grass && isAdjacentToRoad(p, xStart, yStart)) {
        let expandLeft = Math.random() > 0.5 ? -1 : 1;
        let expandUp = Math.random() > 0.5 ? -1 : 1;
        let xEnd = xStart + expandLeft * (Math.floor(Math.random() * 3) + 3);
        let yEnd = yStart + expandUp * (Math.floor(Math.random() * 3) + 3);
        let finalXStart = Math.min(xStart, xEnd);
        let finalXEnd = Math.max(xStart, xEnd);
        let finalYStart = Math.min(yStart, yEnd);
        let finalYEnd = Math.max(yStart, yEnd);
        if (canPlaceBuilding(p, finalXStart, finalYStart, finalXEnd, finalYEnd)) {
          drawRectBuilding(p, finalXStart, finalYStart, finalXEnd, finalYEnd);
        }
      }
    }
  }
}

function fillShopsDynamically(p, xPosStart, yPosStart, xPosEnd, yPosEnd) {
  for (let yStart = yPosStart; yStart < yPosEnd; yStart++) {
    for (let xStart = xPosStart; xStart < xPosEnd; xStart++) {
      if (map[yStart][xStart] instanceof Grass && isAdjacentToRoad(p, xStart, yStart)) {
        let xEnd = xStart + Math.floor(Math.random() * 7) + 3;
        let yEnd = yStart + Math.floor(Math.random() * 7) + 3;
        if (canPlaceBuilding(p, xStart, yStart, xEnd, yEnd)) {
          drawRectBuilding(p, xStart, yStart, xEnd, yEnd);
        }
      }
    }
  }
}

function isAdjacentToRoad(p, x, y) {
  return (
    (map[y - 2] && map[y - 2][x] instanceof Road) ||
    (map[y + 2] && map[y + 2][x] instanceof Road) ||
    (map[y][x - 2] && map[y][x - 2] instanceof Road) ||
    (map[y][x + 2] && map[y][x + 2] instanceof Road)
  );
}

function canPlaceBuilding(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart - 1; y <= yEnd; y++) {
    for (let x = xStart - 1; x <= xEnd; x++) {
      if (
        y < 0 || y >= map.length ||
        x < 0 || x >= map[y].length ||
        !(map[y][x] instanceof Grass)
      ) {
        return false;
      }
    }
  }
  return true;
}

const bigBuildingChance = 0.3;
const bigBuildingSize = 30;
const requiredOpenSpace = bigBuildingSize + 6;
const grassBuffer = 5;

function fillBigBuildings(p, xPosStart, yPosStart, xPosEnd, yPosEnd) {
  for (let y = yPosStart; y < yPosEnd - requiredOpenSpace; y++) {
    for (let x = xPosStart; x < xPosEnd - requiredOpenSpace; x++) {
      if (map[y][x] instanceof Grass && Math.random() < bigBuildingChance) {
        let xEnd = x + Math.floor(bigBuildingSize / 2);
        let yEnd = y + bigBuildingSize;
        if (canPlaceLargeBuilding(p, x, y, xEnd, yEnd)) {
          drawRectBuilding(p, x, y, xEnd, yEnd);
          let lotXStart = x - 4, lotXEnd = xEnd + 4;
          let lotYStart = y - 4, lotYEnd = yEnd + 4;
          drawParkingLot(p, lotXStart, lotYStart, lotXEnd, lotYEnd);
          createParkingLotEntrances(p, lotXStart, lotYStart, lotXEnd, lotYEnd);
        }
      }
    }
  }
}

function canPlaceLargeBuilding(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart - grassBuffer - 3; y < yEnd + grassBuffer + 3; y++) {
    for (let x = xStart - grassBuffer - 3; x < xEnd + grassBuffer + 3; x++) {
      if (
        y < 0 || x < 0 || y >= map.length || x >= map[y].length ||
        !(map[y][x] instanceof Grass)
      ) {
        return false;
      }
    }
  }
  return true;
}

function createParkingLotEntrances(p, lotXStart, lotYStart, lotXEnd, lotYEnd) {
  let possibleEntrances = [];
  if (isAdjacentToRoad(p, lotXStart - grassBuffer, Math.floor((lotYStart + lotYEnd) / 2)))
    possibleEntrances.push({ x: lotXStart - 1, y: Math.floor((lotYStart + lotYEnd) / 2) });
  if (isAdjacentToRoad(p, lotXEnd + grassBuffer, Math.floor((lotYStart + lotYEnd) / 2)))
    possibleEntrances.push({ x: lotXEnd, y: Math.floor((lotYStart + lotYEnd) / 2) });
  if (isAdjacentToRoad(p, Math.floor((lotXStart + lotXEnd) / 2), lotYStart - grassBuffer))
    possibleEntrances.push({ x: Math.floor((lotXStart + lotXEnd) / 2), y: lotYStart - 1 });
  if (isAdjacentToRoad(p, Math.floor((lotXStart + lotXEnd) / 2), lotYEnd + grassBuffer))
    possibleEntrances.push({ x: Math.floor((lotXStart + lotXEnd) / 2), y: lotYEnd });

    // Pick two random entrance/exits
  if (possibleEntrances.length > 1) {
    let entrance = possibleEntrances.splice(Math.floor(Math.random() * possibleEntrances.length), 1)[0];
    let exit = possibleEntrances.splice(Math.floor(Math.random() * possibleEntrances.length), 1)[0];
    map[entrance.y][entrance.x] = new Road(p, entrance.x * gridSize + gridSize/2, entrance.y * gridSize + gridSize/2, gridSize, gridSize);
    map[exit.y][exit.x] = new Road(p, exit.x * gridSize + gridSize/2, exit.y * gridSize + gridSize/2, gridSize, gridSize);
  }
}

function drawParkingLot(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] instanceof Grass) {
        map[y][x] = new Road(p, x * gridSize + gridSize/2, y * gridSize + gridSize/2, gridSize, gridSize);
      }
    }
  }
}
