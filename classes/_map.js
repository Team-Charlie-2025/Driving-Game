// classes/_map.js

class BaseTile extends GameObject {
  constructor(p, x, y, width, height, img, defaultColor, createCollider = true, rotation = 0) {
    super(x, y);
    this.p = p;
    this.width = width;
    this.height = height;
    this.currentImage = img;
    this.defaultColor = defaultColor;
    this.isStatic = true;
    this.angle = p.radians(rotation); 
  
    if (createCollider) {
      if (rotation !== 0) {
        let halfW = this.width / 2;
        let halfH = this.height / 2;
        let corners = [
          this.p.createVector(-halfW, -halfH),
          this.p.createVector( halfW, -halfH),
          this.p.createVector( halfW,  halfH),
          this.p.createVector(-halfW,  halfH)
        ];
        this.collider = new Collider(this, "polygon", {
          vertices: corners,
          offsetX: 0,
          offsetY: 0
        });
      } else {
        this.collider = new Collider(this, "rectangle", {
          width: this.width,
          height: this.height,
          offsetX: -this.width / 2,
          offsetY: -this.height / 2
        });
      }
    }
  }

  update() {}

  display() {
    let p = this.p;
    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.angle); // rotate the tile image
    if (this.currentImage) {
      p.image(
        this.currentImage,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      p.fill(this.defaultColor);
      p.noStroke();
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    p.pop();
  }  
}

class Grass extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = false) {
    super(p, x, y, width, height, img || grassImg, "green", createCollider);
  }
}

class Building extends BaseTile {
  constructor(p, x, y, width, height, img = null) {
    super(p, x, y, width, height, img, "yellow");
  }
}

class Rocks extends BaseTile {
  constructor(p, x, y, width, height, img = null) {
    super(p, x, y, width, height, img, "white");
  }
}

class Water extends BaseTile {
  constructor(p, x, y, width, height, img = null) {
    super(p, x, y, width, height, img, "blue");
  }
}

class Road extends BaseTile {
  constructor(p, x, y, width, height, img = null) {
    super(p, x, y, width, height, img, "gray", false);
  }
}

class Decoration extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = false) {
    super(p, x, y, width, height, img, "purple", createCollider);
  }
}

class Node extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = false) {
    super(p, x, y, width, height, img, "orange", createCollider);
  }
}

//////////////////////////////////
// EVERYTHING BELOW IS WIP
//////////////////////////////////


class Chunk {
  constructor(filename, mapX, mapY) {
    this.filename = filename;
    this.mapX = mapX;
    this.mapY = mapY;
    this.mapData = null;
    this.chunkWidth = 32;
    this.chunkHeight = 32;
    this.buffer = null; // offscreen graphics buffer for caching
  }

  async load() {
    try {
      const response = await fetch(this.filename);
      if (!response.ok) {
        throw new Error(`Failed to load map file: ${this.filename}`);
      }
      this.mapData = await response.json();
    } catch (error) {
      console.error("Error loading map:", error);
    }
  }

  preRender(p) {
    if (this.buffer) return; // already rendered

    const gs = window.gridSize || 32;
    const chunkPixelWidth  = this.chunkWidth  * gs;
    const chunkPixelHeight = this.chunkHeight * gs;
    this.buffer = p.createGraphics(chunkPixelWidth, chunkPixelHeight);
    this.buffer.imageMode(p.CENTER);
    
    const offsetX = this.mapX * chunkPixelWidth;
    const offsetY = this.mapY * chunkPixelHeight;
    
    this.mapData.tiles.forEach(tile => {
      const tileX = tile.col * gs;
      const tileY = tile.row * gs;
      const tileImg = window.assets[tile.category]?.[tile.index] || null;
      
      this.buffer.push();
      this.buffer.translate(tileX + tile.w / 2, tileY + tile.h / 2);
      this.buffer.rotate((tile.rotation || 0) * p.PI / 180);
      if (tileImg) {
        this.buffer.image(tileImg, 0, 0, tile.w, tile.h);
      } else {
        this.buffer.rectMode(p.CENTER);
        this.buffer.fill(200);
        this.buffer.stroke(0);
        this.buffer.rect(0, 0, tile.w, tile.h);
      }
      this.buffer.pop();
      
      if (tile.hasCollider && typeof createGameTile === "function") {
        const gameTile = createGameTile(p, {
          x: offsetX + tileX,
          y: offsetY + tileY,
          w: tile.w,
          h: tile.h,
          rotation: tile.rotation || 0,
          category: tile.category,
          index: tile.index,
          img: tileImg,
          hasCollider: tile.hasCollider
        });
        if (!window.gameObjects) window.gameObjects = [];
        window.gameObjects.push(gameTile);
      }
    });
  }

  draw(p) {
    if (!this.buffer) {
      this.preRender(p);
    }
    const gs = window.gridSize || 32;
    const chunkPixelWidth  = this.chunkWidth  * gs;
    const offsetX = this.mapX * chunkPixelWidth;
    const offsetY = this.mapY * chunkPixelWidth; 
    p.image(this.buffer, offsetX, offsetY);
  }
}

async function createChunk(filename, mapX, mapY) {
  const chunkInstance = new Chunk(filename, mapX, mapY);
  await chunkInstance.load();
  return chunkInstance;
}

async function loadMap() {
  const chunks = [];
  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      const chunkIndex = r * 5 + c + 1;
      const filename = "/maps/map01.json";
      const chunk = await createChunk(filename, c, r);
      row.push(chunk);
    }
    chunks.push(row);
  }
  return chunks;
}

function drawChunkMap(p, chunks) {
  for (let r = 0; r < chunks.length; r++) {
    for (let c = 0; c < chunks[r].length; c++) {
      let chunk = chunks[r][c];
      chunk.draw(p);
    }
  }
}

function createGameTile(p, tileData) {
  const centerX = tileData.x + tileData.w / 2;
  const centerY = tileData.y + tileData.h / 2;
  let TileClass;

  switch (tileData.category) {
    case "Terrain":       TileClass = Grass;       break;
    case "Buildings":     TileClass = Building;    break;
    case "Roads":         TileClass = Road;        break;
    case "Decorations":   TileClass = Decoration;  break;
    case "Nodes":         TileClass = Node;        break;
    default:              TileClass = BaseTile;    break;
  }
  const createCollider = tileData.hasCollider || false;
  
  return new TileClass(
    p,
    centerX,
    centerY,
    tileData.w,
    tileData.h,
    tileData.img,
    createCollider,
    tileData.rotation || 0
  );
}