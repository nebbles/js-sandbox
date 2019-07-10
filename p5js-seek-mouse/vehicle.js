function Vehicle(x, y) {
  this.acc = createVector(0, 0);
  this.vel = createVector(0, -2);
  this.pos = createVector(x, y);
  this.r = 6;
  this.maxspeed = 6;
  this.maxforce = 0.2;

  // Update location
  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.eat = function(food) {
    var record = Infinity;
    var closestIndex = -1;

    for (var i = 0; i < food.length; i++) {
      var d = this.pos.dist(food[i]);
      if (d < record) {
        record = d;
        closestIndex = i;
      }
    }

    this.seek(food[closestIndex]);

  };

  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);

    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  };

  this.render = function() {
    var angle = this.vel.heading() + PI / 2;
    fill(127);
    stroke(200);


    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);

    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  };
}
