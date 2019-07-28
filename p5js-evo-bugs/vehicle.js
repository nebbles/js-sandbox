var mutationRate = 0.01;

function Vehicle(x, y, dna) {
  this.acc = createVector(0, 0);
  this.vel = createVector(0, -2);
  this.pos = createVector(x, y);
  this.r = 4;
  this.maxspeed = 6;
  this.maxforce = 0.2;
  this.health = 1;

  this.dna = [];
  if (!dna) {

    // Food weighting
    this.dna[0] = random(-2, 2);
    // Poison weighting
    this.dna[1] = random(-2, 2);
    // Food perception
    this.dna[2] = random(0, 100);
    // Poison perception
    this.dna[3] = random(0, 100);
  } else {
    // Inherit
    this.dna[0] = dna[0];
    this.dna[1] = dna[1];
    this.dna[2] = dna[2];
    this.dna[3] = dna[3];

    // Mutation
    if (random() < mutationRate) {
      this.dna[0] += random(-0.1, 0.1);
    }
    if (random() < mutationRate) {
      this.dna[1] += random(-0.1, 0.1);
    }
    if (random() < mutationRate) {
      this.dna[2] += random(-10, 10);
    }
    if (random() < mutationRate) {
      this.dna[3] += random(-10, 10);
    }
  }



  // Update location
  this.update = function() {
    this.health -= 0.01;
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.behaviours = function(good, bad) {
    var steerG = this.eat(good, 0.3, this.dna[2]);
    var steerB = this.eat(bad, -0.75, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  };

  this.clone = function() {
    if (random(1) < 0.005) {
      return new Vehicle(this.pos.x, this.pos.y, this.dna);
    } else {
      return null;
    }
  };

  this.eat = function(list, nutrition, perception) {
    var record = Infinity;
    var closest = null;

    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.pos.dist(list[i]);

      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += nutrition;
      } else if (d < record && d < perception) {
        record = d;
        closest = list[i];
      }
    }

    // get a seeking force vector
    if (closest != null) {
      return this.seek(closest);
    } else {
      return createVector(0, 0);
    }
  };

  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);

    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);

    return steer;
  };

  this.dead = function() {
    return (this.health <= 0);
  };

  this.render = function() {
    var angle = this.vel.heading() + PI / 2;

    push(); // temporary origin move
    translate(this.pos.x, this.pos.y);
    rotate(angle);

    if (debug_behaviourProfile.checked) {
      // visualise the dna weighting
      fill(127, 10);

      strokeWeight(1);
      stroke(0, 255, 0, 100);
      ellipse(0, 0, this.dna[2] * 2);

      strokeWeight(1);
      stroke(255, 0, 0, 100);
      ellipse(0, 0, this.dna[3] * 2);

      strokeWeight(2);
      stroke(0, 255, 0, 100);
      line(0, 0, 0, -this.dna[0] * 20);

      strokeWeight(1);
      stroke(255, 0, 0, 100);
      line(0, 0, 0, -this.dna[1] * 20);
    }

    // draw the vehicles body
    var green = color(0, 255, 0);
    var red = color(255, 0, 0);
    var healthCol = lerpColor(red, green, this.health); // linear interpolation (of colours from r->g)
    fill(healthCol);
    stroke(healthCol);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape();

    pop(); // reset to original origin
  };

  this.boundaries = function() {
    var d = 25;
    var desired = null;

    if (this.pos.x < d) {
      desired = createVector(this.maxspeed, this.vel.y);
    } else if (this.pos.x > width - d) {
      desired = createVector(-this.maxspeed, this.vel.y);
    }

    if (this.pos.y < d) {
      desired = createVector(this.vel.x, this.maxspeed);
    } else if (this.pos.y > height - d) {
      desired = createVector(this.vel.x, -this.maxspeed);
    }

    if (desired != null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }

    // PUT UP PHYSICAL BOUNDARY WALLS
    if (this.pos.x < 0) this.pos.x = 0;
    if (this.pos.x > width) this.pos.x = width;
    if (this.pos.y < 0) this.pos.y = 0;
    if (this.pos.y > height) this.pos.y = height;
  };
}
