var font;
var vehicle;
var food = [];

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  vehicle = new Vehicle(10, 10);

  for (var i = 0; i < 10; i++) {
    var x = random(width);
    var y = random(height);
    // food.push(createVector(x, y));
  }
}

function touchMoved(event) {
  // Override the mouseX/Y variables with the touch position
  mouseX = event.touches[0].clientX;
  mouseY = event.touches[0].clientY;
  return false; // return false to block page scrolling
}

function draw() {
  background(0);

  var mouse = createVector(mouseX, mouseY);

  fill(127);
  stroke(200);
  strokeWeight(2);
  ellipse(mouse.x, mouse.y, 48, 48);

  food.forEach(function(f) {
    fill(0, 255, 0);
    noStroke();
    ellipse(f.x, f.y, 8);
  });

  vehicle.seek(mouse);
  // vehicle.eat(food);
  vehicle.update();
  vehicle.render();

}
