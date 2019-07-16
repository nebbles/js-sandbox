# Evo Snakes

[![](https://img.shields.io/static/v1.svg?label=View&message=demo&color=f7df1f&style=for-the-badge&logo=javascript)](https://nebbles.github.io/js-sandbox/p5js-evo-snakes)

Evo Snakes is a original work created on the 14 July 2019. It uses the [p5.js](https://p5js.org) framework, a wrapper to HTML5 canvas functionality. 

The idea came to merge two earlier projects, Evo Bugs & Inverse Kinematics, into a singlular simulation. The inspiration for this work came from examples made by D.Shiffman (The Coding Train on YouTube). The majority of this implementation however, is original work.

Using the settings button in the bottom left, you can turn on debugging view. There is a motion profile, which shows the velocity and acceleration of the snake head. There is also the behaviour profile, which shows how the snakes determine which item of food to go for. 

### Motion Profile

The motion profile shows the velocity and acceleration of the snake. Currently the three snakes are created by manually specifiying their DNA. The larger the snake, generally speaking the larger the perception field, and a higher maximum speed, but a lower maximum force that can be applied (less manoeuvrable).

### Behaviour Profile

The full circle is the general perception field of the snake, it knows about the food in this area (hence the lines). The cone is its field of view (also seen by the antennae on its head - *antennae? why not*). The snake will aim to go for the nearest item of food in its field of view first, but if there is nothing in its field of view, then it relies on its general perception and will go for the closest item in that field.

What really starts to demonstrate more realistic behaviour is that the field of view of the snake is tied to its velocity; as it speeds up, the field of view narrows. This is why you'll tend to see larger faster snakes charging across screen only making small adjustments to its route. Whereas the smaller snake which cant go as fast tends to spend more time nipping around one spot.

### Future work

Currently there is support for snake 'cloning', although the probability is set to zero. This is because I had not reimplemented the health system from the previous Evo Bugs simulation. Without this, there is a runaway population, as there is nothing to keep it contained (and the cloning probability stacks up).

When reimplementing this, I would like to add other features such as the snakes length growing as it eats more and the maximum force/speed being updated dynamically to suit.

When cloning does occur, DNA is correctly passed (and mutated slightly) from parent to child. All this is expanded work on the Evo Bugs simulation.

*To manually enable cloning for snake `i=0/1/2`, assign a probabilty `p=0→1` through the browser console:*
```
snakes[i].dna.cloneProb = p
```

### EE

*Try interacting with the snakes via clicking/tapping or dragging...*

## License

This project inherits the [repository license](../README.md#license).
