// mapEditor.js

function MapEditorSketch(p) {

  function getEffectiveDimensions(img, rotation) {
    const origW = Math.ceil(img.width / window.gridSize) * window.gridSize;
    const origH = Math.ceil(img.height / window.gridSize) * window.gridSize;
    return { w: origW, h: origH };
  }

  p.preload = function() {
    window.loadMapAssets(p);
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    createAssetTabs();
    updateThumbnails();

    window.onlyShowLayerCheckbox = p.createCheckbox("Only Show Selected Layer", false);
    window.onlyShowLayerCheckbox.position(window.assetPanelWidth + 10, 10);
    window.onlyShowLayerCheckbox.changed(() => {
      window.onlyShowCurrentLayer = window.onlyShowLayerCheckbox.checked();
    });

    window.hasColliderCheckbox = p.createCheckbox("hasCollider", false);
    window.hasColliderCheckbox.position(window.assetPanelWidth + 10, 40);

    window.saveButton = p.createButton("Save Map");
    window.saveButton.position(window.assetPanelWidth + 10, 70);
    window.saveButton.mousePressed(saveMap);

    window.mapSelect = p.createSelect();
    window.mapSelect.position(window.assetPanelWidth + 10, 100);
    window.mapFilenames.forEach(fn => window.mapSelect.option(fn));

    window.loadButton = p.createButton("Load Map");
    window.loadButton.position(window.assetPanelWidth + 10, 130);
    window.loadButton.mousePressed(loadMap);

    let eraseMapButton = p.createButton("Erase Map");
    eraseMapButton.position(window.assetPanelWidth + 10, 160);
    eraseMapButton.mousePressed(() => {
      window.placedTiles = [];
    });

    p.canvas.oncontextmenu = e => e.preventDefault();

    p.mouseWheel = function(event) {
      if (p.mouseX < window.assetPanelWidth) {
        window.thumbnailScroll += event.delta;
        let totalHeight = window.thumbnails.length * (window.thumbnailSize + window.thumbnailSpacing);
        let visibleHeight = window.visibleThumbnailCount * (window.thumbnailSize + window.thumbnailSpacing);
        window.thumbnailScroll = p.constrain(window.thumbnailScroll, 0, Math.max(totalHeight - visibleHeight, 0));
        return false;
      }
    };
    window.LoadingScreen.hide();
  };

  function createAssetTabs() {
    let xPos = 10;
    let yPos = 10;
    window.categories.forEach(cat => {
      let btn = p.createButton(cat);
      btn.position(xPos, yPos);
      btn.mousePressed(() => {
        window.currentTab = cat;
        updateThumbnails();
        window.thumbnailScroll = 0;
      });
      yPos += window.categoryButtonHeight;
    });
  }

  function updateThumbnails() {
    window.thumbnails = window.assets[window.currentTab];
    window.selectedTile = null;
  }

  function getGridOffset() {
    const gridWidth = window.mapCols * window.gridSize;
    const gridHeight = window.mapRows * window.gridSize;
    return {
      x: (p.windowWidth - gridWidth) / 2,
      y: (p.windowHeight - gridHeight) / 2,
      gridWidth,
      gridHeight
    };
  }

  function drawGrid() {
    let offset = getGridOffset();
    p.stroke(180);
    for (let x = offset.x; x <= offset.x + offset.gridWidth; x += window.gridSize) {
      p.line(x, offset.y, x, offset.y + offset.gridHeight);
    }
    for (let y = offset.y; y <= offset.y + offset.gridHeight; y += window.gridSize) {
      p.line(offset.x, y, offset.x + offset.gridWidth, y);
    }
    p.noFill();
    p.stroke(0);
    p.rect(offset.x, offset.y, offset.gridWidth, offset.gridHeight);
  }

  function drawPlacedTiles() {
    window.placedTiles.sort((a, b) => a.layer - b.layer).forEach(tile => {
      if (window.onlyShowCurrentLayer && tile.layer !== window.getLayerForCategory(window.currentTab)) {
        return;
      }
      p.push();
      p.translate(tile.x + tile.w / 2, tile.y + tile.h / 2);
      p.rotate(tile.rotation * p.PI / 180);
      p.image(tile.img, -tile.w / 2, -tile.h / 2, tile.w, tile.h);
      if (tile.hasCollider) {
        p.noFill();
        p.stroke(255, 0, 0);
        p.rect(-tile.w / 2, -tile.h / 2, tile.w, tile.h);
      }
      p.pop();
    });
  }

  function drawMouseOver() {
    if (window.selectedTile) {
      let offset = getGridOffset();
      if (
        p.mouseX >= offset.x &&
        p.mouseX <= offset.x + offset.gridWidth &&
        p.mouseY >= offset.y &&
        p.mouseY <= offset.y + offset.gridHeight
      ) {
        const snappedX = offset.x + Math.floor((p.mouseX - offset.x) / window.gridSize) * window.gridSize;
        const snappedY = offset.y + Math.floor((p.mouseY - offset.y) / window.gridSize) * window.gridSize;
        let { w: effectiveW, h: effectiveH } = getEffectiveDimensions(window.selectedTile.img, window.selectedTile.rotation);
        p.push();
        p.translate(snappedX + effectiveW / 2, snappedY + effectiveH / 2);
        p.rotate(window.selectedTile.rotation * p.PI / 180);
        p.tint(255, 100);
        p.image(window.selectedTile.img, -effectiveW / 2, -effectiveH / 2, effectiveW, effectiveH);
        p.pop();
      }
    }
  }

  p.draw = function() {
    p.background(220);
    drawGrid();
    drawPlacedTiles();
    drawMouseOver();
    drawAssetPanel();

    if (window.selectedTile) {
      let { w: effectiveW, h: effectiveH } = getEffectiveDimensions(window.selectedTile.img, window.selectedTile.rotation);
      p.push();
      p.translate(p.mouseX + 10 + effectiveW / 2, p.mouseY + 10 + effectiveH / 2);
      p.rotate(window.selectedTile.rotation * p.PI / 180);
      p.tint(255, 200);
      p.image(window.selectedTile.img, -effectiveW / 2, -effectiveH / 2, effectiveW, effectiveH);
      p.pop();
    }
  };

  function drawAssetPanel() {
    p.push();
    p.noStroke();
    p.fill(240);
    p.rect(0, 0, window.assetPanelWidth, p.height);
    p.stroke(150);
    p.line(0, window.thumbnailsAreaY - 10, window.assetPanelWidth, window.thumbnailsAreaY - 10);

    p.beginClip(0, window.thumbnailsAreaY - 1, window.assetPanelWidth, p.height - window.thumbnailsAreaY + 1);
    for (let i = 0; i < window.thumbnails.length; i++) {
      let img = window.thumbnails[i];
      let thumbX = 10;
      let thumbY = window.thumbnailsAreaY + i * (window.thumbnailSize + window.thumbnailSpacing) - window.thumbnailScroll;

      p.stroke(0);
      p.noFill();
      p.rect(thumbX, thumbY, window.thumbnailSize, window.thumbnailSize);
      if (img.width > 0) {
        p.image(img, thumbX, thumbY, window.thumbnailSize, window.thumbnailSize);
      }

      if (
        window.selectedTile &&
        window.selectedTile.img === img &&
        window.selectedTile.category === window.currentTab &&
        window.selectedTile.index === i
      ) {
        p.noFill();
        p.stroke(255, 0, 0);
        p.rect(thumbX, thumbY, window.thumbnailSize, window.thumbnailSize);
      }
    }
    p.endClip();

    let totalListHeight = window.thumbnails.length * (window.thumbnailSize + window.thumbnailSpacing);
    let visibleHeight = window.visibleThumbnailCount * (window.thumbnailSize + window.thumbnailSpacing);
    if (totalListHeight > visibleHeight) {
      let scrollbarHeight = visibleHeight * (visibleHeight / totalListHeight);
      let maxScroll = totalListHeight - visibleHeight;
      let scrollbarY = window.thumbnailsAreaY + (window.thumbnailScroll / maxScroll) * (visibleHeight - scrollbarHeight);
      p.noStroke();
      p.fill(200);
      p.rect(window.assetPanelWidth - 10, window.thumbnailsAreaY, 10, visibleHeight);
      p.fill(150);
      p.rect(window.assetPanelWidth - 10, scrollbarY, 10, scrollbarHeight);
    }
    p.pop();
  }

  function placeTile() {
    if (!window.selectedTile) return;
    let offset = getGridOffset();
    let img = window.selectedTile.img;
    let rotation = window.selectedTile.rotation || 0;
    let { w: effectiveW, h: effectiveH } = getEffectiveDimensions(img, rotation);

    const centerX = p.mouseX;
    const centerY = p.mouseY;
    const snappedX = offset.x + Math.floor((centerX - offset.x) / window.gridSize) * window.gridSize;
    const snappedY = offset.y + Math.floor((centerY - offset.y) / window.gridSize) * window.gridSize;

    if (
      snappedX < offset.x ||
      snappedX + effectiveW > offset.x + offset.gridWidth ||
      snappedY < offset.y ||
      snappedY + effectiveH > offset.y + offset.gridHeight
    ) {
      return;
    }
    const tileLayer = window.getLayerForCategory(window.selectedTile.category);
    for (let tile of window.placedTiles) {
      if (tile.layer === tileLayer) {
        if (
          snappedX < tile.x + tile.w &&
          snappedX + effectiveW > tile.x &&
          snappedY < tile.y + tile.h &&
          snappedY + effectiveH > tile.y
        ) {
          return;
        }
      }
    }
    window.placedTiles.push({
      img: img,
      x: snappedX,
      y: snappedY,
      w: effectiveW,
      h: effectiveH,
      layer: tileLayer,
      hasCollider: window.hasColliderCheckbox.checked(),
      category: window.selectedTile.category,
      index: window.selectedTile.index,
      rotation: rotation
    });
  }

  function eraseTile() {
    let offset = getGridOffset();
    const activeLayer = window.getLayerForCategory(window.currentTab);
    for (let i = window.placedTiles.length - 1; i >= 0; i--) {
      let tile = window.placedTiles[i];
      if (
        p.mouseX >= tile.x &&
        p.mouseX <= tile.x + tile.w &&
        p.mouseY >= tile.y &&
        p.mouseY <= tile.y + tile.h &&
        tile.layer === activeLayer
      ) {
        window.placedTiles.splice(i, 1);
        break;
      }
    }
  }

  function fillTiles() {
    if (!window.selectedTile) return;
    
    let offset = getGridOffset();
    let img = window.selectedTile.img;
    let rotation = window.selectedTile.rotation || 0;
    let { w: effectiveW, h: effectiveH } = getEffectiveDimensions(img, rotation);
    const tileCellsWide = effectiveW / window.gridSize;
    const tileCellsHigh = effectiveH / window.gridSize;
    
    let startCol = Math.floor((p.mouseX - offset.x) / window.gridSize);
    let startRow = Math.floor((p.mouseY - offset.y) / window.gridSize);
    
    if (
      startCol < 0 || startRow < 0 ||
      startCol > window.mapCols - tileCellsWide ||
      startRow > window.mapRows - tileCellsHigh
    ) {
      return;
    }
    
    let queue = [];
    let visited = {};
    let key = (c, r) => `${c},${r}`;
    
    queue.push({ col: startCol, row: startRow });
    visited[key(startCol, startRow)] = true;
    
    const tileLayer = window.getLayerForCategory(window.selectedTile.category);
    while (queue.length) {
      let cell = queue.shift();
      if (canPlaceTileAt(cell.col, cell.row, effectiveW, effectiveH)) {
        window.placedTiles.push({
          img: img,
          x: offset.x + cell.col * window.gridSize,
          y: offset.y + cell.row * window.gridSize,
          w: effectiveW,
          h: effectiveH,
          layer: tileLayer,
          hasCollider: window.hasColliderCheckbox.checked(),
          category: window.selectedTile.category,
          index: window.selectedTile.index,
          rotation: rotation
        });
        
        let neighbors = [
          { col: cell.col + 1, row: cell.row },
          { col: cell.col - 1, row: cell.row },
          { col: cell.col, row: cell.row + 1 },
          { col: cell.col, row: cell.row - 1 }
        ];
        
        for (let n of neighbors) {
          if (
            n.col >= 0 && n.row >= 0 &&
            n.col <= window.mapCols - tileCellsWide &&
            n.row <= window.mapRows - tileCellsHigh &&
            !visited[key(n.col, n.row)]
          ) {
            visited[key(n.col, n.row)] = true;
            queue.push(n);
          }
        }
      }
    }
  }

  function eraseAllSameTile() {
    let offset = getGridOffset();
    const activeLayer = window.getLayerForCategory(window.currentTab);
    let targetTile = null;
    
    for (let i = window.placedTiles.length - 1; i >= 0; i--) {
      let tile = window.placedTiles[i];
      if (
        p.mouseX >= tile.x &&
        p.mouseX <= tile.x + tile.w &&
        p.mouseY >= tile.y &&
        p.mouseY <= tile.y + tile.h &&
        tile.layer === activeLayer
      ) {
        targetTile = tile;
        break;
      }
    }
    
    if (targetTile) {
      window.placedTiles = window.placedTiles.filter(tile => {
        return !(
          tile.layer === activeLayer &&
          tile.category === targetTile.category &&
          tile.index === targetTile.index
        );
      });
    }
  }
  
  function canPlaceTileAt(col, row, effectiveW, effectiveH) {
    let offset = getGridOffset();
    let candidateX = offset.x + col * window.gridSize;
    let candidateY = offset.y + row * window.gridSize;
    
    if (
      candidateX < offset.x ||
      candidateY < offset.y ||
      candidateX + effectiveW > offset.x + offset.gridWidth ||
      candidateY + effectiveH > offset.y + offset.gridHeight
    ) {
      return false;
    }
    
    const activeLayer = window.getLayerForCategory(window.currentTab);
    for (let tile of window.placedTiles) {
      if (tile.layer === activeLayer) {
        if (
          candidateX < tile.x + tile.w &&
          candidateX + effectiveW > tile.x &&
          candidateY < tile.y + tile.h &&
          candidateY + effectiveH > tile.y
        ) {
          return false;
        }
      }
    }
    return true;
  }

  p.mousePressed = function(e) {
    if (e.target !== p.canvas) return;
  
    if (p.mouseX < window.assetPanelWidth) {
      const startY = window.thumbnailsAreaY;
      for (let i = 0; i < window.thumbnails.length; i++) {
        const thumbX = 10;
        const thumbY = startY + i * (window.thumbnailSize + window.thumbnailSpacing) - window.thumbnailScroll;
        if (
          p.mouseX >= thumbX &&
          p.mouseX <= thumbX + window.thumbnailSize &&
          p.mouseY >= thumbY &&
          p.mouseY <= thumbY + window.thumbnailSize
        ) {
          window.selectedTile = {
            img: window.thumbnails[i],
            category: window.currentTab,
            index: i,
            rotation: window.currentRotation
          };
          break;
        }
      }
      return;
    }
  
    if (p.mouseButton === p.LEFT) {
      if (p.keyIsDown(p.SHIFT)) {
        fillTiles();
      } else {
        placeTile();
      }
    } else if (p.mouseButton === p.RIGHT) {
      if (p.keyIsDown(p.SHIFT)) {
        eraseAllSameTile();
      } else {
        eraseTile();
      }
    }
  };

  p.mouseDragged = function(e) {
    if (e.target !== p.canvas) return;
    if (p.mouseButton === p.LEFT) {
      placeTile();
    } else if (p.mouseButton === p.RIGHT) {
      eraseTile();
    }
  };

  p.keyPressed = function() {
    if (p.key === 'q' || p.key === 'Q') {
      window.currentRotation = (window.currentRotation - 90 + 360) % 360;
      if (window.selectedTile) {
        window.selectedTile.rotation = window.currentRotation;
      }
    } else if (p.key === 'e' || p.key === 'E') {
      window.currentRotation = (window.currentRotation + 90) % 360;
      if (window.selectedTile) {
        window.selectedTile.rotation = window.currentRotation;
      }
    } else if (p.keyCode === p.ESCAPE) {
      switchSketch(Mode.TITLE);
    }
  };

  function saveMap() {
    let mapData = {
      gridSize: window.gridSize,
      tiles: window.placedTiles.map(tile => ({
        col: (tile.x - getGridOffset().x) / window.gridSize,
        row: (tile.y - getGridOffset().y) / window.gridSize,
        w: tile.w,
        h: tile.h,
        layer: tile.layer,
        hasCollider: tile.hasCollider,
        category: tile.category,
        index: tile.index,
        rotation: tile.rotation
      }))
    };
    let filename = window.mapSelect.value();
    p.saveJSON(mapData, `/maps/${filename}`);
  }
  
  function loadMap(e) {
    if (e) e.stopPropagation();
    let filename = window.mapSelect.value();
    if (!filename) {
      alert("Please select a map file to load.");
      return;
    }
    p.loadJSON(`/maps/${filename}`, (mapData) => {
      window.placedTiles = [];
      mapData.tiles.forEach(t => {
        let img = window.assets[t.category][t.index];
        window.placedTiles.push({
          img: img,
          x: getGridOffset().x + t.col * window.gridSize,
          y: getGridOffset().y + t.row * window.gridSize,
          w: t.w,
          h: t.h,
          layer: t.layer,
          hasCollider: t.hasCollider,
          category: t.category,
          index: t.index,
          rotation: t.rotation
        });
      });
    }, 'json', (err) => {
      console.error("Error loading map file:", err);
    });
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
