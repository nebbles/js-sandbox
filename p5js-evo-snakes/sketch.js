var snakes = [];
var food = [];
var poison = [];
var debug_behaviourProfile;
var debug_motionProfile;

function toggleDebug() {
  var x = document.getElementById("debug-panel");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  // Link debug checkboxes
  debug_behaviourProfile = document.getElementById('debugBehaviourProfile');
  debug_motionProfile = document.getElementById('debugMotionProfile');

  // debug_behaviourProfile.checked = true; // default to on
  // debug_motionProfile.checked = true; // default to on

  snakes.push(new Snake({
    nsegs: 60,
    seglen: 5,
    colourStart: color(0, 0, 255),
    colourEnd: color(255, 0, 0),
    maxspeed: 5,
    maxforce: 0.2,
    focusedFov: 30,
    foodPerception: random(width / 4, width / 2),
  }));

  snakes.push(new Snake({
    nsegs: 25,
    seglen: 5,
    colourStart: color(255, 0, 255),
    colourEnd: color(255, 255, 0),
    maxspeed: 3,
    maxforce: 0.35,
    foodPerception: random(100, 400),
  }, random(width), random(height)));

  snakes.push(new Snake({
    nsegs: 25,
    seglen: 2,
    colourStart: color(0, 255, 0),
    colourEnd: color(255),
    maxspeed: 2.5,
    maxforce: 0.42,
    focusedFov: 200,
    foodPerception: random(50, 200),
  }, random(width), random(height)));

  // for (var i = 0; i < 1; i++) {
  //   let x = random(width);
  //   let y = random(height);
  //   snakes.push(new Snake({
  //     nsegs: 25,
  //     seglen: 5,
  //     colourStart: color(255, 0, 255),
  //     colourEnd: color(255, 255, 0),
  //     maxspeed: 3,
  //     maxforce: 0.35,
  //   }, x, y));
  // }

  // Create food
  for (var j = 0; j < 40; j++) {
    food.push(createVector(random(width), random(height)));
  }
  // Create poison
  for (var k = 0; k < 20; k++) {
    poison.push(createVector(random(width), random(height)));
  }

  frameRate(30);
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

function mousePressed() {
  food.push(createVector(mouseX, mouseY));
}

function touchStarted() {
  food.push(createVector(mouseX, mouseY));
}

function touchMoved(event) {
  // each finger on screen will correspond to a different snake
  engageNSnakes = min(snakes.length, event.touches.length);
  for (let i = 0; i < engageNSnakes; i++) {
    let target = createVector(event.touches[i].screenX, event.touches[i].screenY);
    snakes[i].applyForce(snakes[i].seek(target));
  }
  return false; // return false to block page scrolling
}

function mouseDragged() {
  for (let s of snakes) {
    s.applyForce(s.seek(createVector(mouseX, mouseY)));
  }
  // food.push(createVector(mouseX, mouseY));
}

function draw() {
  background(51);

  // Randomly add food to map
  if (random() < 0.1) {
    food.push(createVector(random(width), random(height)));
  }

  // Randomly add poison to map
  if (random() < 0.01) {
    poison.push(createVector(random(width), random(height)));
  }

  // Render food
  for (let f of food) {
    fill(0, 255, 0);
    noStroke();
    ellipse(f.x, f.y, 4);
  }

  // Render poison
  for (let p of poison) {
    fill(255, 0, 0);
    noStroke();
    ellipse(p.x, p.y, 4);
  }

  for (var i = snakes.length - 1; i >= 0; i--) {

    // let mouse = createVector(mouseX, mouseY);
    // snakes[i].applyForce(snakes[i].seek(mouse));

    snakes[i].behaviours(food, poison);
    snakes[i].applyBoundaryForces(10);
    snakes[i].update();
    snakes[i].render();

    var newSnake = snakes[i].attemptClone();
    if (newSnake != null) snakes.push(newSnake);

    // if (snakes[i].isDead()) {
    //   var x = snakes[i].pos.x;
    //   var y = snakes[i].pos.y;
    //   food.push(createVector(x, y));
    //   snakes.splice(i, 1);
    // }
  }

  // Mark mouse position
  // stroke(255, 0, 0);
  // line(mouseX, 0, mouseX, height);
  // line(0, mouseY, width, mouseY);

  // Reload simulation when all agents dead
  // if (vehicles.length == 0) {
  //   location.reload();
  // }
}