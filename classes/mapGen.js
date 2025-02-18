/* 
  #######################################################################
  This file is for trying to generate the building map through logic and chance
  
  Currently I am trying to generate maps with the logic of "neighborhoods"
  different areas have different generation
  #########################################################################
*/
function fillBuildingsDynamically(p) {
    for (let yStart = 1; yStart < map.length - 1; yStart++) {
      for (let xStart = 1; xStart < map[yStart].length - 1; xStart++) {
        // Check if this tile is empty (grass) and is adjacent to a road
        if (map[yStart][xStart] instanceof Grass && isAdjacentToRoad(p, xStart, yStart)) {
          
          // Randomize building size
          let xEnd = xStart + Math.floor(Math.random() * 7) + 3; // Between 2 and 4 tiles wide
          let yEnd = yStart + Math.floor(Math.random() * 5) + 3; // Between 2 and 4 tiles tall
  
          // Ensure space is free & includes gaps
          if (canPlaceBuilding(p, xStart, yStart, xEnd, yEnd)) {
            drawRectBuilding(p,xStart, yStart, xEnd, yEnd);
            markBuildingArea(p, xStart, yStart, xEnd, yEnd); // Reserve the space
          }
        }
      }
    }
  }
  
  // Check if a tile is adjacent to a road but maintains a 1-tile gap
  function isAdjacentToRoad(p, x, y) {
    return (
      (map[y - 2] && map[y - 2][x] instanceof Road) ||
      (map[y + 2] && map[y + 2][x] instanceof Road) ||
      (map[y][x - 2] instanceof Road) ||
      (map[y][x + 2] instanceof Road)
    );
  }
  
  // Ensure space is free for the building, considering gaps
  function canPlaceBuilding(p, xStart, yStart, xEnd, yEnd) {
    for (let y = yStart - 1; y <= yEnd; y++) {
      for (let x = xStart - 1; x <= xEnd; x++) {
        // Check that its grass and within bounds
        if (y < 0 || y >= map.length || x < 0 || x >= map[y].length || !(map[y][x] instanceof Grass)) {
          return false;
        }
      }
    }
    return true;
  }
  
  // Mark the area as occupied to prevent overlapping buildings
  function markBuildingArea(p, xStart, yStart, xEnd, yEnd) {
    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        map[y][x] = new Building(x * gridSize, y * gridSize);
      }
    }
  }
  
  const bigBuildingChance = 0.3;
  const bigBuildingSize = 10;
  const requiredOpenSpace = 16; // Space needed to fit big buildings
  const grassBuffer = 2; // Distance between parking lot and road
  
  function fillBigBuildings(p) {
    for (let y = 1; y < 100 - requiredOpenSpace; y++) {  
      for (let x = 1; x < 100 - requiredOpenSpace; x++) {  
        if (map[y][x] instanceof Grass && Math.random() < bigBuildingChance) {
          let xEnd = x + bigBuildingSize;
          let yEnd = y + bigBuildingSize;
  
          if (canPlaceLargeBuilding(p, x, y, xEnd, yEnd)) {
            drawRectBuilding(p,x, y, xEnd, yEnd);
            let lotXStart = x - 4, lotXEnd = xEnd + 4;
            let lotYStart = y - 4, lotYEnd = yEnd + 4;
  
            drawParkingLot(p, lotXStart, lotYStart, lotXEnd, lotYEnd);
            createParkingLotEntrances(p, lotXStart, lotYStart, lotXEnd, lotYEnd);
          }
        }
      }
    }
  }
  
  // Ensure space is large enough for the building + buffer
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
  
  // Create entrance/exit paths for the parking lot
  function createParkingLotEntrances(p, lotXStart, lotYStart, lotXEnd, lotYEnd) {
    let possibleEntrances = [];
  
    // Check each side of the parking lot for the nearest road
    if (isAdjacentToRoad(p, lotXStart - grassBuffer, (lotYStart + lotYEnd) / 2)) 
      possibleEntrances.push({ x: lotXStart - 1, y: (lotYStart + lotYEnd) / 2 });
    
    if (isAdjacentToRoad(p, lotXEnd + grassBuffer, (lotYStart + lotYEnd) / 2)) 
      possibleEntrances.push({ x: lotXEnd, y: (lotYStart + lotYEnd) / 2 });
    
    if (isAdjacentToRoad(p, (lotXStart + lotXEnd) / 2, lotYStart - grassBuffer)) 
      possibleEntrances.push({ x: (lotXStart + lotXEnd) / 2, y: lotYStart - 1 });
    
    if (isAdjacentToRoad(p, (lotXStart + lotXEnd) / 2, lotYEnd + grassBuffer)) 
      possibleEntrances.push({ x: (lotXStart + lotXEnd) / 2, y: lotYEnd });
  
    // Pick two random entrance/exits
    if (possibleEntrances.length > 1) {
      let entrance = possibleEntrances.splice(Math.floor(Math.random() * possibleEntrances.length), 1)[0];
      let exit = possibleEntrances.splice(Math.floor(Math.random() * possibleEntrances.length), 1)[0];
  
      map[entrance.y][entrance.x] = new Road();
      map[exit.y][exit.x] = new Road();
    }
  }
  
  function drawParkingLot(p, xStart, yStart, xEnd, yEnd) {
    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        if (map[y] && map[y][x] instanceof Grass) { 
          map[y][x] = new Road(x * gridSize, y * gridSize);
        }
      }
    }
  }
  
  // ROAD GENERATION 
  /*
  
       Whole lotta nothings
  
  */
  
