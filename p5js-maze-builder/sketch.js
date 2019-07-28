var cols, rows;
var w = 30;
var grid = [];
var current;
var stack = [];

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  frameRate(20);
  cols = floor(width/w);
  rows = floor(height/w);
  w = max(width / cols, height / rows)-0.05;
  console.log(w);

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var cell = new Cell(x, y);
      grid.push(cell);
    }
  }

  current = grid[0];
}

function draw() {
  background(220);
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  // STEP 1
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true; // TODO remove

    // STEP 2
    stack.push(current);

    // STEP 3
    removeWalls(current, next);

    // STEP 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

function index(i, j) {
  if (i<0 || j<0 || i>cols-1 || j>rows-1) return -1;
  return i + j * cols;
}


function Cell(i, j) {
   this.i = i;
   this.j = j;
   this.walls = [true, true, true, true]; // N E S W
   this.visited = false;

   this.checkNeighbors = function() {
     var neighbors = [];

     var top    = grid[index(i,   j-1)];
     var right  = grid[index(i+1, j)];
     var bottom = grid[index(i,   j+1)];
     var left   = grid[index(i-1, j)];

     if (top    && !top.visited) neighbors.push(top);
     if (right  && !right.visited) neighbors.push(right);
     if (bottom && !bottom.visited) neighbors.push(bottom);
     if (left   && !left.visited) neighbors.push(left);

     if (neighbors.length > 0) {
       var r = floor(random(0, neighbors.length));
       return neighbors[r];
     } else {
       return undefined;
     }
   };

   this.highlight = function() {
     var x = this.i*w;
     var y = this.j*w;
     noStroke();
     fill(200,100,50);
     rect(x, y, w, w);
   };

   this.show = function() {
     var x = this.i*w;
     var y = this.j*w;

     if (this.visited) {
       noStroke();
       fill(0);
       rect(x, y, w, w);
     }

     stroke(255);
     if (this.walls[0]) line(x,   y,   x+w, y);
     if (this.walls[1]) line(x+w, y,   x+w, y+w);
     if (this.walls[2]) line(x+w, y+w, x,   y+w);
     if (this.walls[3]) line(x,   y+w, x,   y);

   };
}

function removeWalls(a, b) {
  var x = a.i - b.i; // -1=right // +1=left
  if (x == 1) {
    a.walls[3] = false; // remove left wall of current
    b.walls[1] = false; // remove right wall of neighbor
  } else if (x == -1) {
    a.walls[1] = false; // remove right wall of current
    b.walls[3] = false; // remove left wall of neighbor
  }

  var y = a.j - b.j; // +1=above // -1=below
  if (y == 1) {
    a.walls[0] = false; // remove left wall of current
    b.walls[2] = false; // remove right wall of neighbor
  } else if (y == -1) {
    a.walls[2] = false; // remove right wall of current
    b.walls[0] = false; // remove left wall of neighbor
  }
}
