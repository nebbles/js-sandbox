var fireworks = [];
var gravity;

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  gravity = createVector(0, 0.2);
  colorMode(HSB, 255);
}

function touchMoved(event) {
  return false; // return false to block page scrolling
}

function draw() {
  background(0, 0, 0, 25);
  if (random() < 0.02) {
    fireworks.push(new Firework());
  }
  for (var i = fireworks.length-1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].render();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}
