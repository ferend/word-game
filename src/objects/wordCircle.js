import { Sprite, Text, TextStyle } from "pixi.js";
import Matter from "matter-js";
import { gameOptions } from "../gameConfig";
import gsap from "gsap";

class WordCircle extends Sprite {

  constructor(texture, engine, onCircleClick) {
    super(texture);

    this.engine = engine;
    this.isClicked = false;
    this.anchor.set(0.5); 

    const scaleFactor = this.getRandomScale();
    this.scale.set(scaleFactor);
    this.createRigidBody(scaleFactor);
    this.createText();
    this.addInteractiveEvents(onCircleClick);
    this.originalScaleX = this.scale.x;
    this.originalScaleY = this.scale.y;
  }

  getRandomScale() {
    const { bigCircleSize, smallcircleSize } = gameOptions;
    return Math.random() * (bigCircleSize - smallcircleSize) + smallcircleSize;
  }

  createRigidBody(scaleFactor) {
    const x = Math.max(
      Math.min(Math.random() * 900, gameOptions.width - 40),
      200
    );
    const y = Math.max(Math.min(-30, gameOptions.height - 50), 0);

    this.rigidBody = Matter.Bodies.circle(x, y, 170 * scaleFactor, {
      friction: 0.000001,
      restitution: 0.5,
      density: 0.001,
      label: "Circle",
    });

    Matter.Composite.add(this.engine.world, this.rigidBody);
  }

  createText() {
    this.letter = this.getRandomLetter();
    this.text = new Text(this.letter, {
      fontFamily: "sniglet",
      fontSize: 120,
      fill: "orange",
      fontWeight: "bold",
    });

    this.text.anchor.set(0.5);
    this.text.position.set(this.position.x, this.position.y);

    this.addChild(this.text);
  }

  toggleTextColor() {
    if (this.isClicked) {
      // Change text color back to the original color (orange)
      this.text.style.fill = "white";
    } else {
      // Change text color to white
      this.text.style.fill = "orange";
    }
  }

  addInteractiveEvents(onCircleClick) {
    this.interactive = true;
    this.on("pointerdown", () => {
      
      gsap.to(this.scale, {
        x: 0.5, 
        y: 0.5, 
        duration: 0.1, 
        yoyo: true, 
        repeat: 1, 
        ease: "power2.inOut",
        onComplete: ()=> {
          onCircleClick.call(this);
          this.toggleTextColor();
          // Prevent the bug from spamming the circle
          this.scale.x = this.originalScaleX;
          this.scale.y = this.originalScaleY;
        }
      });

    });

  }
  

  getRandomLetter() {
    const vowels = ["A", "E", "I", "O", "U"];
    const consonants = "BCDFGHJKLMNPQRSTVWXYZ".split("");
    const isVowel = Math.random() < 0.5;

    // at least have 1 or more vowel to enhance gameplay.
    if (isVowel) {
      return vowels[Math.floor(Math.random() * vowels.length)];
    } else {
      return consonants[Math.floor(Math.random() * consonants.length)];
    }
  }

  destroyCircle(callback) {
    
    gsap.to(this, {
      alpha: 0, 
      duration: 0.2,
      onComplete: () => {
        callback();
        Matter.Composite.remove(this.engine.world, this.rigidBody);   
      },
    });

  }

  update() {
    this.position.set(this.rigidBody.position.x, this.rigidBody.position.y);
    this.rotation = this.rigidBody.angle;
  }
}

export default WordCircle;
