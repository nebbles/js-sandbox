var fireworks = [];
var gravity;

function setup() {
  createCanvas(400, 300);
  gravity = createVector(0, 0.2);
  colorMode(HSB, 255);

}

function draw() {
  background(0, 0, 0, 25);
  if (random() < 0.02) {
    fireworks.push(new Firework());
  }
  for (var i = 0; i < fireworks.length; i++) {
    fireworks[i].update();
    fireworks[i].render();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}
