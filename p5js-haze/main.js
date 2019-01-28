var canvas;
var dots = [];

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.elt.style.position = 'fixed';
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');

    for (var i = 0; i < 150; i++) {
        
        let r = random(2, 40); // radius
        let x = random(0 + r, windowWidth - r); 
        let y = random(0 + r, windowHeight - r);
        let a = random(0, 180); // alpha

        dots.push(new Circle(x,y,r,a));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background('rgba(80,213,253,0.7)');

    mouseXpc = mouseX / windowWidth;
    mouseYpc = mouseY / windowHeight;

    mouseXpc = map(mouseX, 0, width, -1, 1);
    mouseYpc = map(mouseY, 0, height, -1, 1);

    for (dot of dots) {
        // dot.applyForce(); // add this for extra vectors to apply
        dot.update();
        dot.render();
    }

}

class Circle {
    constructor(x, y, radius, alpha) {
        this.pos = createVector(x, y);
        this.radius = radius;
        this.pScale = 5;
        this.alpha = alpha;

        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.drift = createVector(random(-1,1),random(-1,1));
    }

    applyForce(vector) {
        if (vector instanceof p5.Vector) {
            this.acc.add(vector);
        } else {
            console.warn("applyForce must take a p5.Vector as argument.");
        }
    }

    update() {
        // Update acceleration
        this.acc.set(0);
        this.acc.add(this.drift);
        
        // Update velocity
        this.vel.add(this.acc);
        this.vel.limit(0.1);

        // Update position
        this.pos.add(this.vel);
        // Wrap position at window edges
        if (this.pos.x > width+this.radius) {
            this.pos.x = 0-this.radius;
        }
        if (this.pos.x < 0-this.radius) {
            this.pos.x = width+this.radius;
        }
        if (this.pos.y > height + this.radius) {
            this.pos.y = 0-this.radius;
        }
        if (this.pos.y < 0 - this.radius) {
            this.pos.y = height+this.radius;
        }
    }

    render() {
        fill(color(255, 255, 255, this.alpha));
        noStroke();
        ellipse(this.pos.x + this.pScale * mouseXpc, this.pos.y + this.pScale * mouseYpc, this.radius, this.radius);
    }
}