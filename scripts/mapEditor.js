// /scripts/mapEditor.js

function MapEditorSketch(p) {
  const categories = ['Buildings', 'Roads', 'Terrain', 'Decorations', 'Nodes'];
  let currentTab = 'Buildings';
  let assetManifest = {}; // Loaded from manifest.txt files
  let assets = {};
  let thumbnails = [];
  let selectedTile = null;
  let selectedLayer = 0;
  let hasColliderCheckbox;
  let saveButton, loadButton, mapSelect;
  let placedTiles = [];
  let thumbnailScroll = 0;
  let currentRotation = 0; 

  const gridSize = 32;
  const mapFilenames = ["map01.json","map02.json","map03.json","map04.json","map05.json"];
  const mapCols = 32;
  const mapRows = 32;
  const assetPanelWidth = gridSize * 6;
  const visibleThumbnailCount = 6;
  const thumbnailSize = gridSize * 4;
  const thumbnailSpacing = 10;
  const categoryButtonHeight = 40;
  const categoryButtonsHeight = categories.length * categoryButtonHeight + 20;
  const thumbnailsAreaY = categoryButtonsHeight;

  function getGridOffset() {
    const gridWidth = mapCols * gridSize;
    const gridHeight = mapRows * gridSize;
    return {
      x: (p.windowWidth - gridWidth) / 2,
      y: (p.windowHeight - gridHeight) / 2,
      gridWidth,
      gridHeight
    };
  }

  p.preload = function() {
    categories.forEach(cat => {
      p.loadStrings(`/assets/mapBuilder/${cat}/manifest.txt`, function(fileList) {
        assetManifest[cat] = fileList;
        assets[cat] = new Array(fileList.length);
        fileList.forEach((filename, i) => {
          let cleanName = filename.trim();
          let path = `/assets/mapBuilder/${cat}/${cleanName}`;
          p.loadImage(path, img => {
            assets[cat][i] = img;
          });
        });
      });
    });
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    createAssetTabs();
    updateThumbnails();

    let layerSelect = p.createSelect();
    layerSelect.position(assetPanelWidth + 10, 10);
    for (let i = 0; i < 5; i++) layerSelect.option(i);
    layerSelect.changed(() => selectedLayer = Number(layerSelect.value()));

    hasColliderCheckbox = p.createCheckbox("hasCollider", false);
    hasColliderCheckbox.position(assetPanelWidth + 10, 40);

    saveButton = p.createButton("Save Map");
    saveButton.position(assetPanelWidth + 10, 70);
    saveButton.mousePressed(saveMap);

    mapSelect = p.createSelect();
    mapSelect.position(assetPanelWidth + 10, 100);
    mapFilenames.forEach(fn => mapSelect.option(fn));

    loadButton = p.createButton("Load Map");
    loadButton.position(assetPanelWidth + 10, 130);
    loadButton.mousePressed(loadMap);

    let eraseMapButton = p.createButton("Erase Map");
    eraseMapButton.position(assetPanelWidth + 10, 160);
    eraseMapButton.mousePressed(() => {
      placedTiles = [];
    });

    p.canvas.oncontextmenu = e => e.preventDefault();

    p.mouseWheel = function(event) {
      if (p.mouseX < assetPanelWidth) {
        thumbnailScroll += event.delta;
        let totalHeight = thumbnails.length * (thumbnailSize + thumbnailSpacing);
        let visibleHeight = visibleThumbnailCount * (thumbnailSize + thumbnailSpacing);
        thumbnailScroll = p.constrain(thumbnailScroll, 0, Math.max(totalHeight - visibleHeight, 0));
        return false;
      }
    };
    window.LoadingScreen.hide();
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      switchSketch(Mode.TITLE);
    }
  };

  function createAssetTabs() {
    let xPos = 10;
    let yPos = 10;
    categories.forEach(cat => {
      let btn = p.createButton(cat);
      btn.position(xPos, yPos);
      btn.mousePressed(() => {
        currentTab = cat;
        updateThumbnails();
        thumbnailScroll = 0;
      });
      yPos += categoryButtonHeight;
    });
  }

  function updateThumbnails() {
    thumbnails = assets[currentTab];
    selectedTile = null;
  }

  function getEffectiveDimensions(img, rotation) {
    const origW = Math.ceil(img.width / gridSize) * gridSize;
    const origH = Math.ceil(img.height / gridSize) * gridSize;
    if (rotation % 180 !== 0) {
      return { w: origH, h: origW };
    }
    return { w: origW, h: origH };
  }

  p.draw = function() {
    p.background(220);
    drawGrid();
    drawPlacedTiles();
    drawMouseOver();
    drawAssetPanel();

    if (selectedTile) {
      let { w: previewW, h: previewH } = getEffectiveDimensions(selectedTile.img, selectedTile.rotation);
      p.push();
      p.translate(p.mouseX + 10 + previewW / 2, p.mouseY + 10 + previewH / 2);
      p.rotate(selectedTile.rotation * p.PI / 180);
      p.tint(255, 200);
      p.image(selectedTile.img, -previewW / 2, -previewH / 2, previewW, previewH);
      p.pop();
    }
  };

  function drawMouseOver(){
    if (selectedTile) {
      let offset = getGridOffset();
      if (
        p.mouseX >= offset.x &&
        p.mouseX <= offset.x + offset.gridWidth &&
        p.mouseY >= offset.y &&
        p.mouseY <= offset.y + offset.gridHeight
      ) {
        const snappedX = offset.x + Math.floor((p.mouseX - offset.x) / gridSize) * gridSize;
        const snappedY = offset.y + Math.floor((p.mouseY - offset.y) / gridSize) * gridSize;
        let { w: shadowW, h: shadowH } = getEffectiveDimensions(selectedTile.img, selectedTile.rotation);
        p.push();
        p.translate(snappedX + shadowW / 2, snappedY + shadowH / 2);
        p.rotate(selectedTile.rotation * p.PI / 180);
        p.tint(255, 100); 
        p.image(selectedTile.img, -shadowW / 2, -shadowH / 2, shadowW, shadowH);
        p.pop();
      }
    }
  }
  function drawGrid() {
    let offset = getGridOffset();
    p.stroke(180);
    for (let x = offset.x; x <= offset.x + offset.gridWidth; x += gridSize)
      p.line(x, offset.y, x, offset.y + offset.gridHeight);
    for (let y = offset.y; y <= offset.y + offset.gridHeight; y += gridSize)
      p.line(offset.x, y, offset.x + offset.gridWidth, y);
    p.noFill();
    p.stroke(0);
    p.rect(offset.x, offset.y, offset.gridWidth, offset.gridHeight);
  }

  function drawPlacedTiles() {
    placedTiles.sort((a, b) => a.layer - b.layer).forEach(tile => {
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

  function drawAssetPanel() {
    p.push();
    p.noStroke();
    p.fill(240);
    p.rect(0, 0, assetPanelWidth, p.height);
    p.stroke(150);
    p.line(0, thumbnailsAreaY - 10, assetPanelWidth, thumbnailsAreaY - 10);

    p.beginClip(0, thumbnailsAreaY - 1, assetPanelWidth, p.height - thumbnailsAreaY + 1);
    for (let i = 0; i < thumbnails.length; i++) {
      let img = thumbnails[i];
      let thumbX = 10;
      let thumbY = thumbnailsAreaY + i * (thumbnailSize + thumbnailSpacing) - thumbnailScroll;

      p.stroke(0);
      p.noFill();
      p.rect(thumbX, thumbY, thumbnailSize, thumbnailSize);
      if (img.width > 0) p.image(img, thumbX, thumbY, thumbnailSize, thumbnailSize);

      if (selectedTile && selectedTile.img === img && selectedTile.category === currentTab && selectedTile.index === i) {
        p.noFill();
        p.stroke(255, 0, 0);
        p.rect(thumbX, thumbY, thumbnailSize, thumbnailSize);
      }
    }
    p.endClip();

    let totalListHeight = thumbnails.length * (thumbnailSize + thumbnailSpacing);
    let visibleHeight = visibleThumbnailCount * (thumbnailSize + thumbnailSpacing);
    if (totalListHeight > visibleHeight) {
      let scrollbarHeight = visibleHeight * (visibleHeight / totalListHeight);
      let maxScroll = totalListHeight - visibleHeight;
      let scrollbarY = thumbnailsAreaY + (thumbnailScroll / maxScroll) * (visibleHeight - scrollbarHeight);
      p.noStroke();
      p.fill(200);
      p.rect(assetPanelWidth - 10, thumbnailsAreaY, 10, visibleHeight);
      p.fill(150);
      p.rect(assetPanelWidth - 10, scrollbarY, 10, scrollbarHeight);
    }
    p.pop();
  }

  function placeTile() {
    if (!selectedTile) return;
    let offset = getGridOffset();
    let img = selectedTile.img;
    let rotation = selectedTile.rotation || 0;
    let { w: effectiveW, h: effectiveH } = getEffectiveDimensions(img, rotation);

    const centerX = p.mouseX;
    const centerY = p.mouseY;

    const snappedX = offset.x + Math.floor((centerX - offset.x) / gridSize) * gridSize;
    const snappedY = offset.y + Math.floor((centerY - offset.y) / gridSize) * gridSize;

    if (
      snappedX < offset.x ||
      snappedX + effectiveW > offset.x + offset.gridWidth ||
      snappedY < offset.y ||
      snappedY + effectiveH > offset.y + offset.gridHeight
    ) {
      return;
    }
    for (let tile of placedTiles) {
      if (tile.layer === selectedLayer) {
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
    placedTiles.push({
      img: img,
      x: snappedX,
      y: snappedY,
      w: effectiveW,
      h: effectiveH,
      layer: selectedLayer,
      hasCollider: hasColliderCheckbox.checked(),
      category: selectedTile.category,
      index: selectedTile.index,
      rotation: rotation
    });
  }

  function eraseTile() {
    let offset = getGridOffset();
    for (let i = placedTiles.length - 1; i >= 0; i--) {
      let tile = placedTiles[i];
      if (
        p.mouseX >= tile.x &&
        p.mouseX <= tile.x + tile.w &&
        p.mouseY >= tile.y &&
        p.mouseY <= tile.y + tile.h &&
        tile.layer === selectedLayer
      ) {
        placedTiles.splice(i, 1);
        break;
      }
    }
  }

  function fillTiles() {
    if (!selectedTile) return;
    
    let offset = getGridOffset();
    let img = selectedTile.img;
    let rotation = selectedTile.rotation || 0;
    let { w: effectiveW, h: effectiveH } = getEffectiveDimensions(img, rotation);
    const tileCellsWide = effectiveW / gridSize;
    const tileCellsHigh = effectiveH / gridSize;
    
    let startCol = Math.floor((p.mouseX - offset.x) / gridSize);
    let startRow = Math.floor((p.mouseY - offset.y) / gridSize);
    
    if (
      startCol < 0 || startRow < 0 ||
      startCol > mapCols - tileCellsWide ||
      startRow > mapRows - tileCellsHigh
    ) {
      return;
    }
    
    let queue = [];
    let visited = {};
    let key = (c, r) => `${c},${r}`;
    
    queue.push({col: startCol, row: startRow});
    visited[key(startCol, startRow)] = true;
    
    while (queue.length) {
      let cell = queue.shift();
      if (canPlaceTileAt(cell.col, cell.row, effectiveW, effectiveH)) {
        placedTiles.push({
          img: img,
          x: offset.x + cell.col * gridSize,
          y: offset.y + cell.row * gridSize,
          w: effectiveW,
          h: effectiveH,
          layer: selectedLayer,
          hasCollider: hasColliderCheckbox.checked(),
          category: selectedTile.category,
          index: selectedTile.index,
          rotation: rotation
        });
        
        let neighbors = [
          {col: cell.col + 1, row: cell.row},
          {col: cell.col - 1, row: cell.row},
          {col: cell.col, row: cell.row + 1},
          {col: cell.col, row: cell.row - 1}
        ];
        
        for (let n of neighbors) {
          if (
            n.col >= 0 && n.row >= 0 &&
            n.col <= mapCols - tileCellsWide &&
            n.row <= mapRows - tileCellsHigh &&
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
    let targetTile = null;
    
    for (let i = placedTiles.length - 1; i >= 0; i--) {
      let tile = placedTiles[i];
      if (
        p.mouseX >= tile.x &&
        p.mouseX <= tile.x + tile.w &&
        p.mouseY >= tile.y &&
        p.mouseY <= tile.y + tile.h &&
        tile.layer === selectedLayer
      ) {
        targetTile = tile;
        break;
      }
    }
    
    if (targetTile) {
      placedTiles = placedTiles.filter(tile => {
        return !(tile.layer === selectedLayer &&
                 tile.category === targetTile.category &&
                 tile.index === targetTile.index);
      });
    }
  }
  
  function canPlaceTileAt(col, row, effectiveW, effectiveH) {
    let offset = getGridOffset();
    let candidateX = offset.x + col * gridSize;
    let candidateY = offset.y + row * gridSize;
    
    if (
      candidateX < offset.x ||
      candidateY < offset.y ||
      candidateX + effectiveW > offset.x + offset.gridWidth ||
      candidateY + effectiveH > offset.y + offset.gridHeight
    ) {
      return false;
    }
    
    for (let tile of placedTiles) {
      if (tile.layer === selectedLayer) {
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
  
    if (p.mouseX < assetPanelWidth) {
      const startY = thumbnailsAreaY;
      for (let i = 0; i < thumbnails.length; i++) {
        const thumbX = 10;
        const thumbY = startY + i * (thumbnailSize + thumbnailSpacing) - thumbnailScroll;
        if (
          p.mouseX >= thumbX &&
          p.mouseX <= thumbX + thumbnailSize &&
          p.mouseY >= thumbY &&
          p.mouseY <= thumbY + thumbnailSize
        ) {
          selectedTile = {
            img: thumbnails[i],
            category: currentTab,
            index: i,
            rotation: currentRotation
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
      currentRotation = (currentRotation - 90 + 360) % 360;
      if (selectedTile) {
        selectedTile.rotation = currentRotation;
      }
    } else if (p.key === 'e' || p.key === 'E') {
      currentRotation = (currentRotation + 90) % 360;
      if (selectedTile) {
        selectedTile.rotation = currentRotation;
      }
    }
  };

  function saveMap() {
    let mapData = {
      gridSize: gridSize,
      tiles: placedTiles.map(tile => ({
        col: (tile.x - getGridOffset().x) / gridSize,
        row: (tile.y - getGridOffset().y) / gridSize,
        w: tile.w,
        h: tile.h,
        layer: tile.layer,
        hasCollider: tile.hasCollider,
        category: tile.category,
        index: tile.index,
        rotation: tile.rotation
      }))
    };
    let filename = mapSelect.value();
    p.saveJSON(mapData, `/maps/${filename}`);
  }
  
  function loadMap(e) {
    if (e) e.stopPropagation();
    let filename = mapSelect.value();
    if (!filename) {
      alert("Please select a map file to load.");
      return;
    }
    p.loadJSON(`/maps/${filename}`, (mapData) => {
      placedTiles = [];
      mapData.tiles.forEach(t => {
        let img = assets[t.category][t.index];
        placedTiles.push({
          img: img,
          x: getGridOffset().x + t.col * gridSize,
          y: getGridOffset().y + t.row * gridSize,
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
