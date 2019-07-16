const TIME_STEPS = 10;
var balls = [];
// var food = [];
// var poison = [];
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

  balls.push(new Ball(100, 300, 50, 1));
  balls.push(new Ball(500, 300, 50, 1));

  // balls[0].vel = createVector(3 / TIME_STEPS, 0);
  // balls[2].vel = createVector(-10/TIME_STEPS, 10/TIME_STEPS);

  for (var i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    balls.push(new Ball(null, null, null, null));
  }

  frameRate(30);
} {
  // function windowResized() {
  //   resizeCanvas(windowWidth, windowHeight);
  // }

  // function mousePressed() {
  //   food.push(createVector(mouseX, mouseY));
  // }

  // function touchStarted() {
  //   food.push(createVector(mouseX, mouseY));
  // }

  // function touchMoved(event) {
  //   // each finger on screen will correspond to a different snake
  //   engageNSnakes = min(snakes.length, event.touches.length);
  //   for (let i = 0; i < engageNSnakes; i++) {
  //     let target = createVector(event.touches[i].screenX, event.touches[i].screenY);
  //     snakes[i].applyForce(snakes[i].seek(target));
  //   }
  //   return false; // return false to block page scrolling
  // }

  // function mouseDragged() {
  //   for (let s of snakes) {
  //     s.applyForce(s.seek(createVector(mouseX, mouseY)));
  //   }
  //   // food.push(createVector(mouseX, mouseY));
  // }
}

function draw() {
  background(0);

  // console.log(accelerationX); // DOES NOT WORK ON iOS 12.2+
  
  // let gravity = createVector(0, 0);
  // let gravity = createVector(-0.05 / TIME_STEPS, 0);
  
  let centre = createVector(width / 2, height / 2);
  let mouse = createVector(mouseX, mouseY);
  let gravity = p5.Vector.sub(mouse, centre).limit(0.05 / TIME_STEPS);
  if (debug_behaviourProfile.checked) {
    arrow(centre, gravity.copy().mult(5000), color(255, 0, 0));
  }


  for (let t = 0; t < TIME_STEPS; t++) {

    for (var i = balls.length - 1; i >= 0; i--) {

      balls[i].applyForce(gravity); // gravity

      // for every ball to check after this one
      for (let j = i - 1; j >= 0; j--) {
        balls[i].checkCollision(balls[j]);
      }
      balls[i].update();
    }
  }

  for (var i = balls.length - 1; i >= 0; i--) {
    balls[i].render();
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

// draw an arrow for a vector at a given base position
function arrow(base, vec, myColor, weight) {
  if (!weight) weight = 3;
  if (vec.mag() > 0) {
    push();
    stroke(myColor);
    strokeWeight(weight);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
}