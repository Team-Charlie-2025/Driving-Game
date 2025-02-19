/* 
  #######################################################################
  This file is for trying to generate the building map through logic and chance
  
  Currently I am trying to generate maps with the logic of "neighborhoods"
  different areas have different generation
  #########################################################################
*/
function fillBuildingsDynamically(p, xPosStart, yPosStart, xPosEnd, yPosEnd) {
    for (let yStart = yPosStart; yStart < yPosEnd; yStart++) {
        for (let xStart = xPosStart; xStart < xPosEnd; xStart++) {
            // Check if this tile is empty (grass) and is adjacent to a road
            if (map[yStart][xStart] instanceof Grass && isAdjacentToRoad(p, xStart, yStart)) {

                // Decide expansion direction
                let expandLeft = Math.random() > 0.5 ? -1 : 1; 
                let expandUp = Math.random() > 0.5 ? -1 : 1;

                // Randomize building size
                let xEnd = xStart + expandLeft * (Math.floor(Math.random() * 3) + 3); // 3-6 tiles wide
                let yEnd = yStart + expandUp * (Math.floor(Math.random() * 3) + 3); // 3-6 tiles tall

                // Ensure xEnd/yEnd are in the correct order
                let finalXStart = Math.min(xStart, xEnd);
                let finalXEnd = Math.max(xStart, xEnd);
                let finalYStart = Math.min(yStart, yEnd);
                let finalYEnd = Math.max(yStart, yEnd);

                // Ensure space is free & includes gaps
                if (canPlaceBuilding(p, finalXStart, finalYStart, finalXEnd, finalYEnd)) {
                    drawRectBuilding(p, finalXStart, finalYStart, finalXEnd, finalYEnd);
                    //markBuildingArea(p, finalXStart, finalYStart, finalXEnd, finalYEnd); // Reserve the space
                }
            }
        }
    }
}


function fillShopsDynamically(p,xPosStart,yPosStart,xPosEnd,yPosEnd){
    for (let yStart = yPosStart; yStart < yPosEnd; yStart++) {
        for (let xStart = xPosStart; xStart < xPosEnd; xStart++) {
          // Check if this tile is empty (grass) and is adjacent to a road
          if (map[yStart][xStart] instanceof Grass && isAdjacentToRoad(p, xStart, yStart)) {
            
            // Randomize building size
            let xEnd = xStart + Math.floor(Math.random() * 7) + 3; // Between 2 and 4 tiles wide
            let yEnd = yStart + Math.floor(Math.random() * 7) + 3; // Between 2 and 4 tiles tall
    
            // Ensure space is free & includes gaps
            if (canPlaceBuilding(p, xStart, yStart, xEnd, yEnd)) {
              drawRectBuilding(p,xStart, yStart, xEnd, yEnd);
              //markBuildingArea(p, xStart, yStart, xEnd, yEnd); // Reserve the space
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
      (map[y][x - 2] && map[y][x - 2] instanceof Road) ||
      (map[y][x + 2] && map[y][x + 2]instanceof Road)
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
  
  const bigBuildingChance = 0.3;
  const bigBuildingSize = 30;
  const requiredOpenSpace = bigBuildingSize + 6; // Space needed to fit big buildings
  const grassBuffer = 5; // Distance between parking lot and road
  
  function fillBigBuildings(p,xPosStart,yPosStart,xPosEnd,yPosEnd) {
    for (let y = yPosStart; y < yPosEnd - requiredOpenSpace; y++) {  
      for (let x = xPosStart; x < xPosEnd - requiredOpenSpace; x++) {  
        if (map[y][x] instanceof Grass && Math.random() < bigBuildingChance) {
          let xEnd = x + bigBuildingSize/2;
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
  
