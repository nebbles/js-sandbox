# Bounce

Bounce is a original work which began life on the 15 July 2019. It uses the p5js framework, a wrapper to HTML5 canvas functionality. The game engine is custom built.

I was interested in modelling simple spheres with a custom 2D physics engine. In the first day I mainly focused on trying to get the dynamics correct for a 2D plane. It was surprisingly hard to find the equations needed for implementation, especially then adapting the perfectly elastic conditioned equation to handle inelastic (and inbetween) collisions too by utilising the [coefficient of restitution](https://en.wikipedia.org/wiki/Coefficient_of_restitution). Finally, the true information heroes emerged, a mixture of [Wikipedia](https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional) which had surprisingly no clear reference to the derivation, and [Euclidean Space](https://www.euclideanspace.com/physics/dynamics/collision/twod/index.htm) which helped me work out the correct equation to compute the final velocity of the circle (bear in mind no rotation/friction was taken into account!):

```
v1 = u1 - (e+1) * m2 / (m1+m2) * (u1-u2)·(x1-x2) / mag(x1-x2)**2 * (x1-x2)

where,
    1 → for variables referring to this body
    2 → for variables referring to the other body
    v → final velocity
    u → initial velocity
    e → coefficient of restitution (1=elastic → 0=inelastic)
    m → mass
    x → position

    · → dot product
mag() → magnitude (i.e. length) of vector
   ** → power
```

After an especially long evening/night I believe I am close to being able to implement the initial idea for this code. 

There are still some further engine bugs to improve/fix before I'm happy its mature enough as a simple engine.

All original work, with a heck of a lot of research.

*Try viewing on mobile, and tilting/moving the phone...*

## License

This project inherits the [repository license](../README.md#license).
