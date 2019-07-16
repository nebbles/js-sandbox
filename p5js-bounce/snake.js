class Snake {

  constructor(dna, x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 1);
    this.acc = createVector(0, 0);

    // Establish DNA
    this.configureDna(dna);
    console.log("DNA", this.dna);

    // Set general snake settings
    this.health = 1;
    this.mutationRate = 0.01;
    this.len = this.dna.nsegs;

    // Create snake head
    this.body = [new Segment(this.dna.seglen, 0)];
    this.body[0].colour = this.dna.colourEnd;

    // Create the rest of the body
    for (let i = 1; i < this.dna.nsegs; i++) {
      this.body.push(new Segment(this.dna.seglen, 0));
      this.body[i].follow(this.body[i - 1].a);
      this.body[i].colour = lerpColor(this.dna.colourStart, this.dna.colourEnd, i / (this.dna.nsegs - 1));
      this.body[i].weight = map(i, 0, this.len, 5, 1);
    }
  }

  isDead() {
    return this.health <= 0;
  }

  configureDna(dna) {
    this.dna = dna;

    // Default values
    if (!this.dna) this.dna = {};
    if (!this.dna.nsegs) this.dna.nsegs = 25;
    if (!this.dna.seglen) this.dna.seglen = 10;

    if (!this.dna.maxspeed) this.dna.maxspeed = 3;
    if (!this.dna.maxforce) this.dna.maxforce = 0.2;
    if (!this.dna.focusedFov) this.dna.focusedFov = 45;
    if (!this.dna.cloneProb) this.dna.cloneProb = 0; //0.005;

    // snakes default to white if no colour previously given
    if (!this.dna.colourStart) this.dna.colourStart = color(255);
    if (!this.dna.colourEnd) this.dna.colourEnd = color(255);

    // set to default if nonexistent or mutate existing value
    if (!this.dna.foodAttraction) this.dna.foodAttraction = random(1, 2);
    else if (random() < this.mutationRate) this.dna.foodAttraction += random(-0.1, 0.1);
    if (!this.dna.poisonAttraction) this.dna.poisonAttraction = random(-2, -1);
    else if (random() < this.mutationRate) this.dna.poisonAttraction += random(-0.1, 0.1);
    if (!this.dna.foodPerception) this.dna.foodPerception = random(100, max(width, height) / 3);
    else if (random() < this.mutationRate) this.dna.foodPerception += random(-10, 10);
    if (!this.dna.poisonPerception) this.dna.poisonPerception = random(10, 30);
    else if (random() < this.mutationRate) this.dna.poisonPerception += random(-10, 10);
  }

  attemptClone() {
    if (random(1) < this.dna.cloneProb) {
      return new Snake(this.dna, this.pos.x, this.pos.y);
    } else {
      return null;
    }
  }

  behaviours(food, poison) {
    let steerFood = this.eat(food, 0.3, this.dna.foodPerception, this.fov);
    let steerPoison = this.eat(poison, -0.75, this.dna.poisonPerception);

    steerFood.mult(this.dna.foodAttraction);
    steerPoison.mult(this.dna.poisonAttraction);

    this.applyForce(steerFood);
    this.applyForce(steerPoison);
  }

  eat(list, nutrition, perception, fov) {
    var record = Infinity;
    var closest = null;
    var recordFov = Infinity;
    var closestFov = null;
    var distToItem = null;

    // Loop through all items in list (reverse order for splicing)
    for (var i = list.length - 1; i >= 0; i--) {

      // Consume item if within range
      distToItem = this.pos.dist(list[i]);
      if (distToItem < this.dna.maxspeed) {
        list.splice(i, 1);
        this.health += nutrition;
        continue; // item was consumed so skip to the nex in the list
      }

      // carry on checks if within range
      if (distToItem < perception) {

        // record closest item in general perception field
        if (distToItem < record) {
          record = distToItem;
          closest = list[i];
        }

        let vecToItem = p5.Vector.sub(list[i], this.pos);

        // draw a light line
        if (debug_behaviourProfile.checked) {
          push();
          translate(this.pos.x, this.pos.y);
          stroke(255, 255, 0, 20);
          line(0, 0, vecToItem.x, vecToItem.y);
          pop();
        }
        
        // Check field of view if we have it to consider
        if (fov) {
          let angleToItem = this.vel.angleBetween(vecToItem);

          // if within field of view
          if (angleToItem <= fov / 2) {

            // draw a heavier line within field of view
            if (debug_behaviourProfile.checked) {
              push();
              translate(this.pos.x, this.pos.y);
              stroke(255, 255, 0, 100);
              line(0, 0, vecToItem.x, vecToItem.y);
              pop();
            }

            // only record the closest item
            if (distToItem < recordFov) {
              recordFov = distToItem;
              closestFov = list[i];
            }
          }
        }

      }

    }

    // designate the target
    let target = null;
    if (closestFov) target = closestFov;
    else if (closest) target = closest;

    // get a seeking force vector to the target
    if (target) {
      if (debug_behaviourProfile.checked) {
        let vecToItem = p5.Vector.sub(target, this.pos);
        push();
        translate(this.pos.x, this.pos.y);
        stroke(255, 255, 255, 200);
        line(0, 0, vecToItem.x, vecToItem.y);
        pop();
      }
      return this.seek(target);

    } else {
      return createVector(0, 0);
    }
  };

  seek(targetPos) {
    var desiredVec = p5.Vector.sub(targetPos, this.pos);
    desiredVec.setMag(this.dna.maxspeed); // set to max speed
    // find steering force to correct to desired vector
    var steerForce = p5.Vector.sub(desiredVec, this.vel);
    steerForce.limit(this.dna.maxforce);
    return steerForce;
  };

  applyForce(force) {
    this.acc.add(force);
  }

  applyBoundaryForces(proximity) {
    var repelDir = null;

    if (this.pos.x < proximity) { // LEFT WALL
      repelDir = createVector(this.dna.maxspeed, this.vel.y);
    } else if (this.pos.x > width - proximity) { // RIGHT WALL
      repelDir = createVector(-this.dna.maxspeed, this.vel.y);
    }

    if (this.pos.y < proximity) { // TOP WALL
      repelDir = createVector(this.vel.x, this.dna.maxspeed);
    } else if (this.pos.y > height - proximity) { // BOTTOM WALL
      repelDir = createVector(this.vel.x, -this.dna.maxspeed);
    }

    if (repelDir != null) {
      repelDir.normalize();
      repelDir.mult(this.dna.maxspeed);
      var repelForce = p5.Vector.sub(repelDir, this.vel);
      repelForce.limit(this.dna.maxforce);
      this.applyForce(repelForce);
    }
  };

  follow(target) {
    this.body[0].follow(target);
    for (let i = 1; i < this.len; i++) {
      this.body[i].follow(this.body[i - 1].a);
    }
  }

  update() {
    this.health -= 0.01;

    if (this.acc.mag() > 0) {
      this.vel.add(this.acc); // update speed
      this.vel.limit(this.dna.maxspeed); // limit the speed
    } else {
      this.vel.setMag(this.vel.mag() * 0.98); // slow down when no force is applied
    }

    // Update field of view
    this.fov = map(this.vel.mag(), 0, this.dna.maxspeed, 300, this.dna.focusedFov) / 180 * PI;

    if (debug_motionProfile.checked) {
      {
        push();
        translate(this.pos.x, this.pos.y);
        let an = this.vel.heading();
        rotate(an);
        stroke(0, 255, 255);
        line(0, 0, this.vel.mag() * 20, 0);
        pop();
      } {
        push();
        translate(this.pos.x, this.pos.y);
        let an = this.acc.heading();
        rotate(an);
        stroke(255, 0, 255);
        line(0, 0, this.acc.mag() * 50, 0);
        pop();
      }
    }

    // this.vel = createVector();
    this.pos.add(this.vel); // update the position
    this.acc.mult(0); // reset acceleration

    // PUT UP PHYSICAL BOUNDARY WALLS
    if (this.pos.x < 0) this.pos.x = 0;
    if (this.pos.x > width) this.pos.x = width;
    if (this.pos.y < 0) this.pos.y = 0;
    if (this.pos.y > height) this.pos.y = height;

    // Follow its own position
    this.follow(this.pos);

    // Update all segments of the body
    for (let i = 0; i < this.len; i++) {
      this.body[i].update();
    }
  }

  render() {
    // draw debugging head
    if (debug_motionProfile.checked) {
      stroke(255);
      noFill();
      ellipse(this.pos.x, this.pos.y, 10, 10);
    }

    // Adjust colour based on health - linear interpolation from red->green
    // let green = color(0, 255, 0);
    // let red = color(255, 0, 0);
    // let healthCol = lerpColor(red, green, this.health); 
    // fill(healthCol);
    // stroke(healthCol);
    // strokeWeight(1);

    // Render the body
    for (let i = 0; i < this.len; i++) {
      this.body[i].render();
    }

    var angle = this.vel.heading();
    push(); // temporary origin move
    translate(this.pos.x, this.pos.y);
    rotate(angle);

    if (debug_behaviourProfile.checked) {
      // visualise the info weighting
      fill(127, 10);

      // Food perception
      strokeWeight(1);
      stroke(0, 255, 0, 100);
      ellipse(0, 0, this.dna.foodPerception * 2);

      // Poison perception
      strokeWeight(1);
      stroke(255, 0, 0, 100);
      ellipse(0, 0, this.dna.poisonPerception * 2);

      // Food weight
      strokeWeight(2);
      stroke(0, 255, 0, 100);
      line(this.dna.foodAttraction * 20, 0, 0, 0);

      // Poison weighting
      strokeWeight(1);
      stroke(255, 0, 0, 100);
      line(this.dna.poisonAttraction * 20, 0, 0, 0);

      // Perception cone
      stroke(0, 255, 0, 150);
      var range = this.dna.foodPerception;
      arc(0, 0, range * 2, range * 2, -this.fov / 2, this.fov / 2, PIE);
    }
    pop(); // reset to original origin
  }
}