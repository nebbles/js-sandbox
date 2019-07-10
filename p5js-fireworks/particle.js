function Particle(x, y, vx, vy, hue) {
  this.pos = createVector(x, y);
  this.vel = createVector(vx, vy);
  this.acc = createVector(0, 0);
  this.lifespan = 255;
  this.strokeWeight = 4;
  this.hue = hue;

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.dead = function() {
    if (this.lifespan < 0) return true;
    return false;
  };

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.render = function() {
    stroke(this.hue, 255, 255, this.lifespan);
    strokeWeight(this.strokeWeight);
    point(this.pos.x, this.pos.y);
  };
}
