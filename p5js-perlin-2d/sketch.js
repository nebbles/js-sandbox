// var xoff1 = 0;
// var xoff2 = 1000;
//
var inc = 0.1;
var scl = 5;
var cols, rows;
var zoff = 0;

var particles = [];
var flowfield = [];

var currentPos = [];

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  pixelDensity(1);
  cols = floor(width / scl);
  rows = floor(height / scl);

  flowfield = new Array(cols * rows);

  for (var i = 0; i < 1500; i++) {
    particles[i] = new Particle();
    currentPos[i] = createVector(0, 0);
    currentPos[i].x = particles[i].pos.x;
    currentPos[i].y = particles[i].pos.y;
  }
}

function updatePosTracker() {
  for (var i = 0; i < particles.length; i++) {
    currentPos[i].x = particles[i].pos.x;
    currentPos[i].y = particles[i].pos.y;
  }
}

function showPosTracker() {
  for (var i = 0; i < currentPos.length; i++) {
    stroke(255, 0, 0, 100);
    strokeWeight(4);
    point(currentPos[i].x, currentPos[i].y);
  }
}

function draw() {
  // background(255);

  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = (x + y * cols);
      var angle = noise(xoff, yoff, zoff) * TWO_PI;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;

      // stroke(0, 100);
      // strokeWeight(1);
      // push();
      // translate(x * scl, y * scl);
      // rotate(v.heading());
      // line(0, 0, scl, 0);
      // pop();


    }
    yoff += inc;
  }
  zoff += 0.01;

  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].show();
  }
  // updatePosTracker();
  // showPosTracker();
}
