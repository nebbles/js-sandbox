var inc = 0.01;
var start = 0;

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');
}

function draw() {
  background(0);

  stroke(255);
  noFill();
  beginShape();
  var xoff = start;
  for (var x = 0; x < width; x++) {
    var y = noise(xoff)*height;
    vertex(x, y);

    xoff += inc;
  }
  endShape();

  start += inc;
}
