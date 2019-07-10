function Firework() {
  this.hue = random(255);
  this.firework = new Particle(
    random(width), height,
    0, random(-12, -8),
    this.hue
  );
  this.exploded = false;
  this.particles = [];

  this.done = function() {
    if (this.exploded && this.particles.length == 0) {
      return true;
    }
    return false;
  };

  this.update = function() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      this.particles[i].vel.mult(0.95);
      this.particles[i].lifespan -= 5;
      if (this.particles[i].dead()) {
        this.particles.splice(i, 1);
      }
    }

  };

  this.explode = function() {
    for (var i = 0; i < 100; i++) {
      var vel = p5.Vector.random2D();
      vel.mult(random(0.5, 5));
      var p = new Particle(
        this.firework.pos.x, this.firework.pos.y,
        vel.x, vel.y,
        this.hue
      );
      p.strokeWeight = 2;
      this.particles.push(p);
    }
  };

  this.render = function() {
    if (!this.exploded) {
      this.firework.render();
    }
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].render();
    }
  };
}
