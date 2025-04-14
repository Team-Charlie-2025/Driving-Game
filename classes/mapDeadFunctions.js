// This function makes 2 main road, then goes through and randomly generates roads off of the main road
function generateProceduralMap(p, rows, cols) {
    for (let y = 0; y < rows; y++) {
      map[y] = [];
      for (let x = 0; x < cols; x++) {
        map[y][x] = new Grass(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize, null);
      }
    }
  
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    centerX = 125 + Math.floor(Math.random() * (cols - 255));
    centerY = 125 + Math.floor(Math.random() * (rows - 255));
  
    const mainOffset = Math.ceil(roadSizes.main / 2);
    const cityBlockSize = 40 + Math.floor(Math.random() * 15);
    const residentialBlockSize = 50 + Math.floor(Math.random() * 25);
    const numResidentialBlocks = 2 + Math.floor(Math.random() * 2);
    const alleyOffset = Math.floor(roadSizes.small / 2);
  
    // --- Main roads
    drawAngledRoad(p, centerX, 0, centerX, rows - 1, roadSizes.main);
    drawAngledRoad(p, 0, centerY, cols - 1, centerY, roadSizes.main);
    markRoadVisited(centerX, 0, centerX, rows - 1, visited);
    markRoadVisited(0, centerY, cols - 1, centerY, visited);
  
    // --- Downtown blocks
    for (let i = 0; i < 2; i++) {
      const offset = 3 + Math.floor(Math.random() * 3);
      const layerOffset = cityBlockSize * (i + 1);
  
      // Horizontal city roads
      let yAbove = centerY - mainOffset - layerOffset;
      let yBelow = centerY + mainOffset + layerOffset;
  
      if (yAbove > 0)
        drawAngledRoad(p, centerX - 100, yAbove, centerX + 100, yAbove + offset, roadSizes.normal);
      if (yBelow < rows)
        drawAngledRoad(p, centerX - 100, yBelow, centerX + 100, yBelow - offset, roadSizes.normal);
  
      // Vertical city roads
      let xLeft = centerX - mainOffset - layerOffset;
      let xRight = centerX + mainOffset + layerOffset;
  
      if (xLeft > 0)
        drawAngledRoad(p, xLeft, centerY - 100, xLeft + offset, centerY + 100, roadSizes.normal);
      if (xRight < cols)
        drawAngledRoad(p, xRight, centerY - 100, xRight - offset, centerY + 100, roadSizes.normal);
  
      // Curved road chance
      if (Math.random() < 0.3 && i === 1) {
        const cx = centerX + (Math.random() < 0.5 ? 30 : -30);
        const cy = centerY + (Math.random() < 0.5 ? 30 : -30);
        drawBezierRoad(p, centerX - 40, centerY, cx, cy, centerX + 40, centerY + 30, roadSizes.normal);
      }
    }
  
    // --- Alley 1 exactly between downtown blocks
    const alleyY = centerY - mainOffset - cityBlockSize - alleyOffset;
    const alleyX = centerX - mainOffset - cityBlockSize - alleyOffset;
    drawAngledRoad(p, centerX - 100, alleyY, centerX + 100, alleyY, roadSizes.small);
    drawAngledRoad(p, alleyX, centerY - 100, alleyX, centerY + 100, roadSizes.small);
  
    // --- Residential area
    for (let i = 1; i <= numResidentialBlocks; i++) {
      const dist = cityBlockSize * 2 + i * residentialBlockSize;
  
      // Horizontal res. roads
      let yUp = centerY - mainOffset - dist;
      let yDown = centerY + mainOffset + dist;
      if (yUp > 0)
        drawAngledRoad(p, centerX - 100, yUp, centerX + 100, yUp, roadSizes.normal);
      if (yDown < rows)
        drawAngledRoad(p, centerX - 100, yDown, centerX + 100, yDown, roadSizes.normal);
  
      // Vertical res. roads
      let xLeft = centerX - mainOffset - dist;
      let xRight = centerX + mainOffset + dist;
      if (xLeft > 0)
        drawAngledRoad(p, xLeft, centerY - 100, xLeft, centerY + 100, roadSizes.normal);
      if (xRight < cols)
        drawAngledRoad(p, xRight, centerY - 100, xRight, centerY + 100, roadSizes.normal);
  
      // Alley 2 between residential blocks
      if (i === 1) {
        const midY = centerY + mainOffset + dist - Math.floor(residentialBlockSize / 2);
        drawAngledRoad(p, centerX - 100, midY, centerX + 100, midY, roadSizes.small);
      }
    }
  
    // --- Country DFS
    const dfsStartDistance = 60 + Math.floor(Math.random() * 40);
    const countryStarts = [
      { x: centerX + dfsStartDistance, y: centerY },
      { x: centerX - dfsStartDistance, y: centerY },
      { x: centerX, y: centerY + dfsStartDistance },
      { x: centerX, y: centerY - dfsStartDistance }
    ];
  
    for (const pt of countryStarts) {
      if (inBounds(pt.x, pt.y)) {
        if (Math.random() < 0.5) {
          // Short loop road
          const nx = pt.x + (Math.random() < 0.5 ? -20 : 20);
          const ny = pt.y + (Math.random() < 0.5 ? -20 : 20);
          drawAngledRoad(p, pt.x, pt.y, nx, ny, roadSizes.normal);
          drawAngledRoad(p, nx, ny, pt.x, pt.y, roadSizes.normal);
        } else {
          // Sprawling country road
          dfsRoadGenScaled(p, pt.x, pt.y, visited, 0, 6, 40, 150, [], 25);
        }
      }
    }
  }
  
  
  function generateCityMap(p, rows, cols) {
    // Init map
    for (let y = 0; y < rows; y++) {
      map[y] = [];
      for (let x = 0; x < cols; x++) {
        map[y][x] = new Grass(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize, null);
      }
    }
  
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  
    // CHUNK SETUP
    const chunkSize = 25;
    const chunkRows = Math.ceil(rows / chunkSize);
    const chunkCols = Math.ceil(cols / chunkSize);
    const chunkVisited = Array.from({ length: chunkRows }, () => Array(chunkCols).fill(false));
  
    centerX = 75 + Math.floor(Math.random() * (cols - 150));
    centerY = 75 + Math.floor(Math.random() * (rows - 150));
    offset = 5 + Math.floor((Math.random() * 10));
  
    drawAngledRoad(p, centerX, 0, centerX + offset, rows - 1, roadSizes.main);
    drawAngledRoad(p, 0, centerY, cols - 1, centerY + offset, roadSizes.main);
    markRoadVisited(centerX, 0, centerX + offset, rows - 1, visited);
    markRoadVisited(0, centerY, cols - 1, centerY + offset, visited);
  
    const launchRadius = 300;
    const spacing = 25;
  
    for (let y = centerY - launchRadius; y <= centerY + launchRadius; y += spacing) {
      for (let x = centerX - launchRadius; x <= centerX + launchRadius; x += spacing) {
        if (!inBounds(x, y)) continue;
  
        const dist = Math.hypot(x - centerX, y - centerY);
        const norm = dist / launchRadius;
  
        const maxDepth = Math.floor(2 + norm * 5);
        const minLen = Math.floor(30 + norm * 30);
        const maxLen = Math.floor(60 + norm * 90);
        const launchChance = 1.0 - norm * 0.8;
  
        if (Math.random() < launchChance) {
          dfsRoadGenScaled(p, x, y, visited, 0, maxDepth, minLen, maxLen, chunkVisited, chunkSize);
        }
      }
    }
  }
  
  
  function dfsRoadGenScaled(p, x, y, visited, depth, maxDepth, minLen, maxLen, chunkVisited, chunkSize) {
    if (!inBounds(x, y)) return;
    if (visited[y][x]) return;
  
    const directions = [
      { dx: 4, dy: 1 }, { dx: -4, dy: 1 },
      { dx: 4, dy: -1 }, { dx: -4, dy: -1 },
      { dx: 1, dy: 4 }, { dx: -1, dy: 4 },
      { dx: 1, dy: -4 }, { dx: -1, dy: -4 },
      { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
    ];
  
    directions.sort(() => Math.random() - 0.5);
  
    const fromChunkX = Math.floor(x / chunkSize);
    const fromChunkY = Math.floor(y / chunkSize);
  
    let drewAny = false;
  
    for (let dir of directions) {
      const scale = Math.pow(0.85, depth);
      const scaledMin = Math.max(20, Math.floor(minLen * scale));
      const scaledMax = Math.floor(maxLen * scale);
      const len = scaledMin + Math.floor(Math.random() * (scaledMax - scaledMin));
  
      const nx = x + dir.dx * len;
      const ny = y + dir.dy * len;
  
      if (!inBounds(nx, ny)) continue;
  
      const toChunkX = Math.floor(nx / chunkSize);
      const toChunkY = Math.floor(ny / chunkSize);
      const chunkSpan = Math.max(Math.abs(toChunkX - fromChunkX), Math.abs(toChunkY - fromChunkY));
  
      const sameChunk = toChunkX === fromChunkX && toChunkY === fromChunkY;
      const targetChunkVisited = chunkVisited[toChunkY][toChunkX];
  
      // Prevent entry into already visited chunks unless we actually touch a road
      if (!sameChunk && targetChunkVisited) {
        if (!pathWouldTouchExistingRoad(nx, ny, nx, ny)) {
          continue;
        }
      }
  
      if (pathWouldOverlapRoad(x, y, nx, ny)) continue;
  
      // Curved or straight
      const distFromCenter = Math.hypot(x - centerX, y - centerY);
      const curveChance = Math.min(0.3 + distFromCenter / 1000, 0.9);
      const shouldCurve = Math.random() < curveChance;
  
      if (shouldCurve) {
        if (chunkSpan < 3) continue; // ✅ Require curved roads to span ≥3 chunks
  
        const windiness = Math.min(2, 0.5 + distFromCenter / 500);
        const numCurves = 2 + Math.floor(Math.random() * 2);
        //drawCurvedChain(p, x, y, nx, ny, numCurves, roadSizes.normal, windiness);
      } else {
        if (chunkSpan < 2) continue; // ✅ Require angled roads to span ≥2 chunks
        drawAngledRoad(p, x, y, nx, ny, roadSizes.normal);
      }
  
      markRoadVisited(x, y, nx, ny, visited);
      visited[y][x] = true;
      chunkVisited[toChunkY][toChunkX] = true;
      drewAny = true;
  
      if (depth < maxDepth && Math.random() < 0.7) {
        dfsRoadGenScaled(p, nx, ny, visited, depth + 1, maxDepth, minLen, maxLen, chunkVisited, chunkSize);
      }
  
      if (depth < maxDepth && Math.random() < 0.3) {
        const mx = Math.floor((x + nx) / 2);
        const my = Math.floor((y + ny) / 2);
        dfsRoadGenScaled(p, mx, my, visited, depth + 1, maxDepth, minLen, maxLen, chunkVisited, chunkSize);
      }
  
      break;
    }
  
    if (!drewAny) visited[y][x] = false;
  }
  function generateCityMap2(p, rows, cols) {
    for (let y = 0; y < rows; y++) {
      map[y] = [];
      for (let x = 0; x < cols; x++) {
        map[y][x] = new Grass(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize, null);
      }
    }
  
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const chunkSize = 25;
    const chunkRows = Math.ceil(rows / chunkSize);
    const chunkCols = Math.ceil(cols / chunkSize);
    const chunkVisited = Array.from({ length: chunkRows }, () => Array(chunkCols).fill(false));
  
    centerX = 75 + Math.floor(Math.random() * (cols - 150));
    centerY = 75 + Math.floor(Math.random() * (rows - 150));
    offset = 5 + Math.floor(Math.random() * 10);
  
    drawAngledRoad(p, centerX, 0, centerX + offset, rows - 1, roadSizes.main);
    drawAngledRoad(p, 0, centerY, cols - 1, centerY + offset, roadSizes.main);
    markRoadVisited(centerX, 0, centerX + offset, rows - 1, visited);
    markRoadVisited(0, centerY, cols - 1, centerY + offset, visited);
  
    const maxLayers = 6;
    const spacing = 50; // Downtown road spacing
    const layerQueues = Array.from({ length: maxLayers }, () => []);
  
    // Create a dense block of roads around the center
    const gridRadius = 2;
    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      const x = centerX + dx * spacing;
      drawAngledRoad(p, x, centerY - spacing * gridRadius, x, centerY + spacing * gridRadius, roadSizes.normal);
      markRoadVisited(x, centerY - spacing * gridRadius, x, centerY + spacing * gridRadius, visited);
      layerQueues[0].push({ x, y: centerY });
    }
  
    for (let dy = -gridRadius; dy <= gridRadius; dy++) {
      const y = centerY + dy * spacing;
      drawAngledRoad(p, centerX - spacing * gridRadius, y, centerX + spacing * gridRadius, y, roadSizes.normal);
      markRoadVisited(centerX - spacing * gridRadius, y, centerX + spacing * gridRadius, y, visited);
      layerQueues[0].push({ x: centerX, y });
    }
  
    // 📤 Run layered branching
    for (let layer = 0; layer < maxLayers; layer++) {
      const layerQueue = layerQueues[layer];
      const nextQueue = layerQueues[layer + 1] || [];
  
      const branchesPerRoad = (layer === 0 || layer === 1) ? 1 : layer + 1;
      const allowChildren = layer > 0;
      const curveChance = Math.min(0.1 + layer * 0.2, 0.9);
      const slopeCap = (layer <= 1) ? 12 : 5;
  
      for (const { x, y } of layerQueue) {
        for (let b = 0; b < branchesPerRoad; b++) {
          const branch = attemptBranch(p, x, y, visited, chunkVisited, chunkSize, layer, slopeCap, curveChance);
          if (branch && allowChildren) {
            nextQueue.push(branch);
          }
        }
      }
    }
  
    console.log("Branches: " );
  }
  function attemptBranch(p, x, y, visited, chunkVisited, chunkSize, layer, slopeCap, curveChance) {
    const directions = [];
  
    for (let slope = 2; slope <= slopeCap; slope++) {
      directions.push({ dx: slope, dy: 1 }, { dx: -slope, dy: 1 });
      directions.push({ dx: slope, dy: -1 }, { dx: -slope, dy: -1 });
      directions.push({ dx: 1, dy: slope }, { dx: -1, dy: slope });
      directions.push({ dx: 1, dy: -slope }, { dx: -1, dy: -slope });
    }
  
    directions.push({ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 });
    directions.sort(() => Math.random() - 0.5);
  
    for (const dir of directions) {
      const len = 30 + Math.floor(Math.random() * 80);
      const mag = Math.hypot(dir.dx, dir.dy);
      const scaledDx = Math.round((dir.dx / mag) * len);
      const scaledDy = Math.round((dir.dy / mag) * len);
      const nx = x + scaledDx;
      const ny = y + scaledDy;
  
      if (!inBounds(nx, ny)) continue;
      if (nx === x && ny === y) continue; // prevent zero-length roads
  
      const fromChunkX = Math.floor(x / chunkSize);
      const fromChunkY = Math.floor(y / chunkSize);
      const toChunkX = Math.floor(nx / chunkSize);
      const toChunkY = Math.floor(ny / chunkSize);
      const chunkSpan = Math.max(Math.abs(toChunkX - fromChunkX), Math.abs(toChunkY - fromChunkY));
  
      if (chunkVisited[toChunkY][toChunkX] && !pathWouldTouchExistingRoad(nx, ny, nx, ny)) continue;
      if (!canDrawRoadPath(x, y, nx, ny, visited)) continue;
  
      if (pathWouldOverlapRoad(x, y, nx, ny)) {
        const isPerpendicular = checkPerpendicularNearby(nx, ny, x, y, nx, ny);
        if (!isPerpendicular) continue;
      }
  
      const shouldCurve = Math.random() < curveChance;
  
      // Loosened chunk restrictions slightly
      if (shouldCurve && chunkSpan < 2) continue;
      if (!shouldCurve && chunkSpan < 1) continue;
  
      if (shouldCurve) {
        const windiness = Math.min(2.5, 0.5 + layer * 0.4);
        const numCurves = 2 + Math.floor(Math.random() * 2);
        drawCurvedChain(p, x, y, nx, ny, numCurves, roadSizes.normal, windiness);
      } else {
        drawAngledRoad(p, x, y, nx, ny, roadSizes.normal);
      }
  
      markRoadVisited(x, y, nx, ny, visited);
      visited[y][x] = true;
      chunkVisited[toChunkY][toChunkX] = true;
  
      return { x: nx, y: ny };
    }
  
    return null;
  }

  function pathWouldOverlapRoad(x0, y0, x1, y1) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let stepX = x0 < x1 ? 1 : -1;
    let stepY = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;
  
    const maxSteps = Math.max(dx, dy) * 2 + 10;
    let steps = 0;
  
    while ((x !== x1 || y !== y1) && steps++ < maxSteps) {
      if (!inBounds(x, y)) return true;
  
      if (map[y][x] instanceof Road) {
        // Allow connection if road is perpendicular or nearly touching a perpendicular one
        const touchingPerpendicular = checkPerpendicularNearby(x, y, x0, y0, x1, y1);
        if (!touchingPerpendicular && !(x === x0 && y === y0) && !(x === x1 && y === y1)) {
          return true;
        }
      }
  
      let e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += stepX; }
      if (e2 < dx) { err += dx; y += stepY; }
    }
  
    return false;
  }
  
  function checkPerpendicularNearby(x, y, x0, y0, x1, y1) {
    const dirX = x1 - x0;
    const dirY = y1 - y0;
  
    if (Math.abs(dirY) > Math.abs(dirX)) {
      for (let dx = -roadSizes.normal - 3; dx <= roadSizes.normal + 3; dx++) {
        if (map[y][x + dx] instanceof Road) return true;
      }
    } else {
      for (let dy = -roadSizes.normal - 3; dy <= roadSizes.normal + 3; dy++) {
        if (map[y + dy] && map[y + dy][x] instanceof Road) return true;
      }
    }
  
    return false;
  }
  
  
  function pathWouldTouchExistingRoad(x0, y0, x1, y1) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let stepX = x0 < x1 ? 1 : -1;
    let stepY = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;
  
    const maxSteps = Math.max(dx, dy) * 2 + 10;
    let steps = 0;
  
    while ((x !== x1 || y !== y1) && steps++ < maxSteps) {
      if (inBounds(x, y) && map[y][x] instanceof Road) {
        return true;
      }
  
      let e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += stepX; }
      if (e2 < dx) { err += dx; y += stepY; }
    }
  
    return false;
  }
  