import { Sprite, Text, TextStyle, Texture } from "pixi.js";
import Matter from "matter-js";
import PlatformButton from "./platformButton";

class Platform extends Sprite {
  constructor(texture, engine, callback) {
    super(texture);

    this.setupRigidBody(engine);
    this.anchor.set(0.5);

    this.text = this.createText();
    this.clickedLetters = [];
    this.button = this.createPlatformButton(callback);
  }

  setupRigidBody(engine) {
    this.rigidBody = Matter.Bodies.rectangle(400, 480, 900, 110, {
      isStatic: true,
      label: "Platform",
    });
    Matter.Composite.add(engine.world, this.rigidBody);
    this.updateSprite();
  }

  createText() {
    const text = new Text(
      "",
      new TextStyle({
        fontFamily: "sniglet",
        fontSize: 50,
        fill: "white",
      })
    );

    text.position.set(this.position.x / 2 - 400, this.position.y / 2 - 300);
    this.addChild(text);

    return text;
  }

  createPlatformButton(callback) {
    const button = new PlatformButton(
      Texture.from("cross"),
      this.width,
      this.height,
      () => {
        callback();
        this.clearText();
        this.updateSpritesBasedOnText();
      }
    );

    this.addChild(button);

    return button;
  }

  clearText() {
    this.text.text = "";
    this.clickedLetters = [];
    this.fitTextInsideSprite();
  }

  addLetterToText(letter) {
    this.text.text += letter;
    this.clickedLetters.push(letter);
    this.fitTextInsideSprite();
  }

  fitTextInsideSprite() {
    const spriteWidth = this.width;
    const spriteHeight = this.height;
    const maxSize = Math.min(spriteWidth / this.text.text.length, spriteHeight);
    const minSize = 20;
    this.text.style.fontSize = Math.max(minSize, maxSize + 10);
  }


  removeLetterFromText(letter) {
    const currentText = this.text.text;
    const indexInArray = this.clickedLetters.lastIndexOf(letter); // Use lastIndexOf to find the last occurrence
  
    if (indexInArray !== -1) {
      const indexOfLetter = currentText.lastIndexOf(letter, indexInArray); // Find the last occurrence in the text before the last clicked letter
  
      if (indexOfLetter !== -1) {
        this.text.text =
          currentText.slice(0, indexOfLetter) +
          currentText.slice(indexOfLetter + 1);
  
        this.clickedLetters.splice(indexInArray, 1);
        this.fitTextInsideSprite();
      }
    }
  }
  

  updateSpritesBasedOnText() {
    if (this.text.text.length > 0) {
      this.texture = Texture.from("gp");
      this.button.visible = true;
    } else {
      this.texture = Texture.from("op");
      this.button.visible = false;
    }
    this.button.texture = Texture.from("cross");
  }

  updateSprite() {
    this.x = this.rigidBody.position.x;
    this.y = this.rigidBody.position.y;
  }
}

export default Platform;
