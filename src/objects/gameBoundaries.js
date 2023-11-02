import Matter from "matter-js";

export default class GameBoundaries {

    constructor(engine) {
               
        const leftWall = Matter.Bodies.rectangle(170, 0, 10, 1000, {
          isStatic: true,
        });
    
        const rightWall = Matter.Bodies.rectangle(620,0, 10,1000, {
          isStatic: true,
        });
    
        Matter.Composite.add(engine.world, [leftWall, rightWall]);
      }

}