var grid;
var TILE_SIZE = 20;
var TILE_DENSITY = 0.3;
var PROB_MOVEMENT = 0.1;
var FRAME_RATE = 10;

function setup() {
  console.log(pixelDensity());

  // Retrieve the window data
  var ww = displayWidth;
  var wh = displayHeight;

  // Number of tiles in x/y i.e. cols and rows
  var ntx = floor(ww / TILE_SIZE) + 1;
  var nty = floor(wh / TILE_SIZE) + 1;

  // Set up canvas - fill screen with grid
  canvas = createCanvas(TILE_SIZE * ntx, TILE_SIZE * nty);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  // Create grid object and active a number of them
  grid = new Grid(ntx, nty, TILE_SIZE);
  let numTiles = int(TILE_DENSITY * grid.tiles.length);
  grid.activate(numTiles);

  // Constrain frame rate
  frameRate(FRAME_RATE);

  // Initial set up logs
  console.log("-- Tiles - an original work by B.Greenberg --")
  console.log("<< Global vars >>");
  console.log("TILE_SIZE", TILE_SIZE);
  console.log("TILE_DENSITY", TILE_DENSITY);
  console.log("PROB_MOVEMENT", PROB_MOVEMENT);
  console.log("FRAME_RATE", FRAME_RATE);
  console.log("<< Derived vars >>");
  console.log("Number of columns", ntx);
  console.log("Number of rows", nty);
  console.log("Total tiles", grid.tiles.length);
  console.log("Active tiles", numTiles);
}

function draw() {
  background(255, 255, 0);
  grid.update();
  grid.render();
}

class Grid {
  constructor(cols, rows, tileSize) {
    this.cols = cols;
    this.rows = rows;
    this.tiles = [];
    for (let iy = 0; iy < this.rows; iy++) {
      for (let ix = 0; ix < this.cols; ix++) {

        let currentTile = ix + iy * this.cols; // current tile index

        let validTiles = [] // array of legal moves    
        if (ix != 0) { // check to the left
          validTiles.push({
            id: currentTile - 1,
            dir: "W"
          });
        }
        if (ix != this.cols - 1) { // check to the right
          validTiles.push({
            id: currentTile + 1,
            dir: "E"
          });
        }
        if (iy != 0) { // check above
          validTiles.push({
            id: ix + (iy - 1) * this.cols,
            dir: "N"
          });
        }
        if (iy != this.rows - 1) { // check below
          validTiles.push({
            id: ix + (iy + 1) * this.cols,
            dir: "S"
          });
        }

        this.tiles.push(new Tile(ix * tileSize, iy * tileSize, tileSize, validTiles));
      }
    }
  }

  // Will activate the state of a fixed number of random tiles
  activate(nTiles) {
    let num = int(nTiles);
    for (let n = 0; n < num; n++) {
      // this.tiles[int(random(0, this.tiles.length))].activateState();
      random(this.tiles).activateState();
    }
  }

  // Will update the state of each tile in turn
  update() {
    let ignoreList = [];
    for (let iy = 0; iy < this.rows; iy++) {
      for (let ix = 0; ix < this.cols; ix++) {

        let currentTile = ix + iy * this.cols; // current tile index

        if (this.tiles[currentTile].inTransition()) {
          this.tiles[currentTile].updateState();

        } else if (this.tiles[currentTile].inActiveState() &&
          random() < PROB_MOVEMENT &&
          !ignoreList.includes(currentTile)) {

          let options = [] // available tiles to move to
          for (let t of this.tiles[currentTile].validTiles) {
            if (this.tiles[t.id].inNonActiveState()) {
              options.push(t);
            }
          }

          if (options.length > 0) {
            let choice = random(options);
            let newTile = choice.id;

            this.tiles[currentTile].setTransitionState(true, choice.dir);
            this.tiles[newTile].setTransitionState(false, choice.dir);

            // new tile should not be considered for starting a transition
            ignoreList.push(newTile);
          }
        }
      }
    }
  }

  render() {
    for (let tile of this.tiles) {
      tile.render();
    }
  }
}

class Tile {
  constructor(x, y, size, validTiles) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.validTiles = validTiles;

    this.state = {
      value: 0,
      direction: null, // will be set to a char: N / E / S / W
      donor: false
    };
  }

  setTransitionState(donor, dir) {
    let val = donor ? 90 : 10;
    this.state = {
      value: val,
      direction: dir,
      donor: donor
    }
  }

  activateState() {
    this.state.value = 100;
  }

  inActiveState() {
    return this.state.value == 100;
  }

  inTransition() {
    return this.state.value < 100 && this.state.value > 0;
  }

  inNonActiveState() {
    return this.state.value == 0;
  }

  updateState() {
    if (this.state.donor) {
      this.state.value -= 10;
    } else {
      this.state.value += 10;
    }
  }

  render() {
    noStroke();


    if (this.inTransition()) {
      
      // Draw black tile first for background
      fill(0);
      rect(this.x, this.y, this.size, this.size);

      // Now draw partial tile
      if (this.state.donor) {
        if (this.state.value > 50) { // before halfway transition point

          // Calculate partial tile size and corresponding grey
          let partialSize = int(this.size * (this.state.value - 50) / 50);
          fill(int(255 * (this.state.value - 50) / 50));
          
          // Draw tile based on direction of transition
          if (this.state.direction == "N") {
            rect(this.x, this.y, this.size, partialSize);
          }
          if (this.state.direction == "W") {
            rect(this.x, this.y, partialSize, this.size);
          }
          if (this.state.direction == "E") {
            rect(this.x + this.size - partialSize, this.y, partialSize, this.size);
          }
          if (this.state.direction == "S") {
            rect(this.x, this.y + this.size - partialSize, this.size, partialSize);
          }
        }
      } else { // this is for receivers
        if (this.state.value > 50) { // beyond halfway transition point

          // Calculate partial tile size and corresponding grey
          let partialSize = int(this.size * (this.state.value - 50) / 50);
          fill(int(255 * (this.state.value - 50) / 50));

          // Draw tile based on direction of transition
          if (this.state.direction == "S") {
            rect(this.x, this.y, this.size, partialSize);
          }
          if (this.state.direction == "E") {
            rect(this.x, this.y, partialSize, this.size);
          }
          if (this.state.direction == "W") {
            rect(this.x + this.size - partialSize, this.y, partialSize, this.size);
          }
          if (this.state.direction == "N") {
            rect(this.x, this.y + this.size - partialSize, this.size, partialSize);
          }
        }
      }
    } else { // not in a transition phase
      if (this.state.value == 100) {
        fill(255);
      } else if (this.state.value == 0) {
        fill(0);
      } else {
        fill(255, 0, 0);
      }
      rect(this.x, this.y, this.size, this.size);
    }
  }
}