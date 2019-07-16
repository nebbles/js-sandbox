class Ball {
    constructor(x, y, radius, mass) {
        let r_ = 50;
        if (radius) this.r = radius;
        else this.r = r_;

        let x_;
        let y_;
        if (x && y) {
            x_ = x;
            y_ = y;
        } else {
            x_ = random(0 + this.r, width - this.r);
            y_ = random(0 + this.r, height - this.r);
        }
        this.pos = createVector(x_, y_);
        this.vel = createVector();
        this.acc = createVector();
        if (mass) this.m = mass;
        else this.m = 1;

        this.maxspeed = 100; // terminal velocity
        this.maxforce = 0.1;

        this.collidingList = [];
    }

    isColliding(ball) {
        return (this.pos.dist(ball.pos) < this.r + ball.r);
    }

    reactionForceFrom(ball) {
        // Vector from current (A) to other (B), normalised
        let AB = p5.Vector.sub(ball.pos, this.pos).normalize();

        // Calculate the 
        // console.log("acc", this.acc);
        let mag = p5.Vector.dot(this.acc.copy(), AB);
        let R = AB.mult(-mag);

        // console.log(R);
        arrow(this.pos, R.copy().mult(30), color(0,0,255));
        
        return R;
    }

    checkCollision(ball) {
        if (this.isColliding(ball)) {
            let e = .5;
            let v1 = this.postCollisionVel(ball, e);
            let v2 = ball.postCollisionVel(this, e);
            this.vel = v1;
            ball.vel = v2;

            // Need to apply reaction forces to each body
            // For each body, the component of the force that is applied in 
            // direction to other body, needs to have equal and opposite force applied
            let R = createVector();
            R = this.reactionForceFrom(ball);
            // this.applyForce(R);
            R = ball.reactionForceFrom(this);
            ball.applyForce(R);

        }


        // if (this.isColliding(ball)) {
        //     // if ball isnt recognised as in a current collision
        //     if (this.collidingList.indexOf(ball) == -1) {
        //         this.collidingList.push(ball); // add to the colliding list

        //         let e = .9;
        //         let v1 = this.postCollisionVel(ball, e);
        //         let v2 = ball.postCollisionVel(this, e);
        //         this.vel = v1;
        //         ball.vel = v2;


        //         // Need to apply reaction forces to each body
        //         // For each body, the component of the force that is applied in 
        //         // direction to other body, needs to have equal and opposite force applied
        //         let R = createVector();
        //         R = this.reactionForceFrom(ball);
        //         // this.applyForce(R);
        //         R = ball.reactionForceFrom(this);
        //         ball.applyForce(R);
        //     }
        // } else {
        //     let index = this.collidingList.indexOf(ball);
        //     this.collidingList.splice(index, 1);
        // }
    }

    postCollisionVel(ball, e) {
        // Computation for n-dimensional collision using vectors
        // https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional
        
        
        let dx = p5.Vector.sub(this.pos, ball.pos); // position delta vector
        let u1 = this.vel.copy();
        let du = p5.Vector.sub(u1, ball.vel.copy());
        return p5.Vector.sub(u1,
            dx.mult(
                p5.Vector.dot(du, dx) / (dx.mag() ** 2) // fraction
            ).mult(
                (e+1) * ball.m / (this.m + ball.m) // scalar
            ));

        // Also see https://www.euclideanspace.com/physics/dynamics/collision/twod/index.htm

        // v = u-J/m
        // let p1 = e*2*(this.m*ball.m / (this.m+ball.m)); // scalar
        // let p2 = p5.Vector.dot(du, dx) * (p1); // scalar
        // let J = dx.mult(p2);
        // return p5.Vector.sub(u1, J.div(this.m));
        
    }

    applyForce(force) {
        this.acc.add(force);
    }

    applyBorderCollisions() {
        let efficiency = 1.0;

        if (this.pos.x >= width - this.r) {
            this.vel.x = -abs(this.vel.x) * efficiency;
        } else if (this.pos.x <= this.r) {
            this.vel.x = abs(this.vel.x) * efficiency;
        }
        if (this.pos.y >= height - this.r) {
            this.vel.y = -abs(this.vel.y) * efficiency;
        } else if (this.pos.y <= this.r) {
            this.vel.y = abs(this.vel.y) * efficiency;
        }
    }

    update() {
        this.vel.add(this.acc); // update speed
        this.vel.limit(this.maxspeed); // limit the speed
        this.pos.add(this.vel); // update the position
        this.applyBorderCollisions();
        this.pos.x = constrain(this.pos.x, 0 + this.r, width - this.r);
        this.pos.y = constrain(this.pos.y, 0 + this.r, height - this.r);

        if (true) {
            {
                arrow(this.pos, this.vel.copy().mult(5), color(255))
                // push();
                // translate(this.pos.x, this.pos.y);
                // let an = this.vel.heading();
                // rotate(an);
                // stroke(0, 255, 255);
                // line(0, 0, this.vel.mag() * 20, 0);
                // pop();
            } {
                arrow(this.pos, this.acc.copy().mult(10), color(255, 0, 0))
                // push();
                // translate(this.pos.x, this.pos.y);
                // let an = this.acc.heading();
                // rotate(an);
                // strokeWeight(5);
                // stroke(255, 0, 255);
                // line(0, 0, this.acc.mag() * 50, 0);
                // pop();
            }
        }

        this.acc.mult(0); // reset acceleration
    }

    render() {
        strokeWeight(2);
        stroke(255);
        noFill();
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
}