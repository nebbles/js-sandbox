var font;
var vehicle;
var food = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  background(51);


  vehicle = new Vehicle(10, 10);

  for (var i = 0; i < 10; i++) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

}

function draw() {
  background(51);

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
