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
    p.rotate(this.angle);
    if (this.currentImage) {
      p.image(this.currentImage, -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      p.fill(this.defaultColor);
      p.noStroke();
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    p.pop();
  }  
}

class Barrier extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = true, rotation = 0) {
    super(p, x, y, width, height, img, "brown", createCollider, rotation);
  }
  collide(other) {
    return this.collider && other.collider && this.collider.intersects(other.collider);
  }
}

class Dirt extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = true, rotation = 0) {
    super(p, x, y, width, height, img, "saddlebrown", createCollider, rotation);
  }
  collide(other) {
    return this.collider && other.collider && this.collider.intersects(other.collider);
  }
}

class Grass extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = false, rotation = 0) {
    super(p, x, y, width, height, img || grassImg, "green", createCollider, rotation);
  }
  collide(other) {
    return this.collider && other.collider && this.collider.intersects(other.collider);
  }
}

class Dock extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = false, rotation = 0) {
    super(p, x, y, width, height, img , "brown", createCollider, rotation);
  }
  collide(other) {
    return this.collider && other.collider && this.collider.intersects(other.collider);
  }
}

class IceTile extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = true, rotation = 0) {
    super(p, x, y, width, height, img, "lightblue", createCollider, rotation);
  }
  collide(other) {
    return this.collider && other.collider && this.collider.intersects(other.collider);
  }
}

class LavaTile extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = true, rotation = 0) {
    super(p, x, y, width, height, img, "red", createCollider, rotation);
  }
  collide(other) {
    return this.collider && other.collider && this.collider.intersects(other.collider);
  }
}

class MudTile extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = true, rotation = 0) {
    super(p, x, y, width, height, img, "darkbrown", createCollider, rotation);
  }
  collide(other) {
    return this.collider && other.collider && this.collider.intersects(other.collider);
  }
}

class Water extends BaseTile {
  constructor(p, x, y, width, height, img = null, createCollider = true, rotation = 0) {
    super(p, x, y, width, height, img || waterImg, "blue", createCollider, rotation);
  }
  collide(other) {
    return this.collider && other.collider && this.collider.intersects(other.collider);
  }
}


class Building extends BaseTile {
  constructor(p, x, y, width, height, img = null, rotation = 0) {
    super(p, x, y, width, height, img, "yellow", true, rotation);
    // this is for later
    // if (img) {
    //   this.collider = new Collider(this, "polygon", { offsetX: -width / 2, offsetY: -height / 2 }, img);
    // } else {
    //   let halfW = width / 2;
    //   let halfH = height / 2;
    //   const vertices = [
    //     p.createVector(-halfW, -halfH * 0.8),
    //     p.createVector( halfW, -halfH * 0.8),
    //     p.createVector( halfW,  halfH),
    //     p.createVector(-halfW,  halfH)
    //   ];
    //   this.collider = new Collider(this, "polygon", { vertices, offsetX: 0, offsetY: 0 });
    // }
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


// // // chunk WIP
// class Chunk {
//   constructor(filename, mapX, mapY) {
//     this.filename = filename;
//     this.mapX = mapX;
//     this.mapY = mapY;
//     this.mapData = null;
//     this.chunkWidth = 32;
//     this.chunkHeight = 32;
//     this.buffer = null; // Offscreen graphics buffer for caching
//   }

//   async load() {
//     try {
//       const response = await fetch(this.filename);
//       if (!response.ok) {
//         throw new Error(`Failed to load map file: ${this.filename}`);
//       }
//       this.mapData = await response.json();
//     } catch (error) {
//       console.error("Error loading map:", error);
//     }
//   }

//   preRender(p) {
//     if (this.buffer) return; 

//     const gs = window.gridSize || 32;
//     const chunkPixelWidth = this.chunkWidth * gs;
//     const chunkPixelHeight = this.chunkHeight * gs;
//     // Create offscreen graphics buffer.
//     this.buffer = p.createGraphics(chunkPixelWidth, chunkPixelHeight);
//     // Enable willReadFrequently on the underlying canvas context.
//     this.buffer.canvas.getContext('2d', { willReadFrequently: true });
    
//     // Set image mode once for the entire buffer.
//     this.buffer.imageMode(p.CENTER);
    
//     // Composite every tile into the offscreen buffer.
//     this.mapData.tiles.forEach(tile => {
//       const tileX = tile.col * gs;
//       const tileY = tile.row * gs;
//       const tileImg = window.assets?.[tile.category]?.[tile.index] || null;
      
//       this.buffer.push();
//       // Position the tile at its center.
//       this.buffer.translate(tileX + tile.w / 2, tileY + tile.h / 2);
//       // Convert rotation from degrees to radians if provided.
//       if (tile.rotation) {
//         this.buffer.rotate(p.radians(tile.rotation));
//       }
      
//       if (tileImg) {
//         this.buffer.image(tileImg, 0, 0, tile.w, tile.h);
//       } else {
//         // Draw a fallback rectangle if no image is provided.
//         this.buffer.rectMode(p.CENTER);
//         this.buffer.fill(200);
//         this.buffer.stroke(0);
//         this.buffer.rect(0, 0, tile.w, tile.h);
//       }
//       this.buffer.pop();

//       // Optionally, create colliders/game objects (unchanged from before)
//       if (tile.hasCollider && typeof createGameTile === "function") {
//         const chunkPixelWidth = this.chunkWidth * gs;
//         const worldX = this.mapX * chunkPixelWidth + tile.col * gs + tile.w / 2;
//         const worldY = this.mapY * chunkPixelWidth + tile.row * gs + tile.h / 2;
//         let gameTile;
//         if (tile.category === "Buildings") {
//           gameTile = new Building(p, worldX, worldY, tile.w, tile.h, tileImg, tile.rotation || 0);
//         } else if (tile.category === "Terrain") {
//           switch (tile.index) {
//             case 0: gameTile = new Barrier(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0); break;
//             case 1: gameTile = new Dirt(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0); break;
//             case 2: gameTile = new Grass(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0); break;
//             case 3: gameTile = new IceTile(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0); break;
//             case 4: gameTile = new LavaTile(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0); break;
//             case 5: gameTile = new MudTile(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0); break;
//             case 7: gameTile = new Water(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0); break;
//             default: gameTile = new Grass(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0); break;
//           }
//         } else {
//           let TileClass;
//           switch (tile.category) {
//             case "Roads": TileClass = Road; break;
//             case "Decorations": TileClass = Decoration; break;
//             case "Nodes": TileClass = Node; break;
//             default: TileClass = BaseTile; break;
//           }
//           gameTile = new TileClass(p, worldX, worldY, tile.w, tile.h, tileImg, tile.hasCollider, tile.rotation || 0);
//         }
//         if (!window.gameObjects) window.gameObjects = [];
//         window.gameObjects.push(gameTile);
//         if (window.physicsEngine) {
//           window.physicsEngine.add(gameTile);
//         }
//       }
//     });
//   }

//   draw(p) {
//     if (!this.buffer) {
//       this.preRender(p);
//     }
//     const gs = window.gridSize || 32;
//     const chunkPixelWidth = this.chunkWidth * gs;
//     p.push();
//     // Draw the composite offscreen image in one call.
//     p.translate(this.mapX * chunkPixelWidth, this.mapY * chunkPixelWidth);
//     p.image(this.buffer, 0, 0);
//     p.pop();
//   }
// }


// async function createChunk(filename, mapX, mapY) {
//   const chunkInstance = new Chunk(filename, mapX, mapY);
//   await chunkInstance.load();
//   return chunkInstance;
// }

// async function loadMap() {
//   const chunks = [];
//   for (let r = 0; r < 5; r++) {
//     const row = [];
//     for (let c = 0; c < 5; c++) {
//       const filename = "/maps/map01.json";
//       const chunk = await createChunk(filename, c, r);
//       row.push(chunk);
//     }
//     chunks.push(row);
//   }
//   return chunks;
// }

// function drawChunkMap(p, chunks) {
//   for (let r = 0; r < chunks.length; r++) {
//     for (let c = 0; c < chunks[r].length; c++) {
//       chunks[r][c].draw(p);
//     }
//   }
// }

// function createGameTile(p, tileData) {
//   const centerX = tileData.x + tileData.w / 2;
//   const centerY = tileData.y + tileData.h / 2;
//   if (tileData.category === "Buildings") {
//     return new Building(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.rotation || 0);
//   }
//   if (tileData.category === "Terrain") {
//     switch (tileData.index) {
//       case 0: return new Barrier(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.hasCollider, tileData.rotation || 0);
//       case 1: return new Dirt(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.hasCollider, tileData.rotation || 0);
//       case 2: return new Grass(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.hasCollider, tileData.rotation || 0);
//       case 3: return new IceTile(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.hasCollider, tileData.rotation || 0);
//       case 4: return new LavaTile(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.hasCollider, tileData.rotation || 0);
//       case 5: return new MudTile(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.hasCollider, tileData.rotation || 0);
//       case 7: return new Water(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.hasCollider, tileData.rotation || 0);
//       default: return new Grass(p, centerX, centerY, tileData.w, tileData.h, tileData.img, tileData.hasCollider, tileData.rotation || 0);
//     }
//   }
//   let TileClass;
//   switch (tileData.category) {
//     case "Roads": TileClass = Road; break;
//     case "Decorations": TileClass = Decoration; break;
//     case "Nodes": TileClass = Node; break;
//     default: TileClass = BaseTile; break;
//   }
//   const createCollider = tileData.hasCollider || false;
//   return new TileClass(p, centerX, centerY, tileData.w, tileData.h, tileData.img, createCollider, tileData.rotation || 0);
// }
