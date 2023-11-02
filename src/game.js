import gsap from "gsap";
import { Container, Texture } from "pixi.js";
import { gameOptions } from "./gameConfig";
import Matter from "matter-js";
import Platform from "./objects/platform";
import WordCircle from "./objects/wordCircle";
import GameBoundaries from "./objects/gameBoundaries";
import Background from "./objects/background";
import WordChecker from "./actions/wordChecker";

class Game {
  constructor(app) {
    this.app = app;
    this.circleCount = gameOptions.circleCount;
    this.correctWordCount = 0;
    this.wordChecker = new WordChecker();
    this.container = new Container();
    this.engine = Matter.Engine.create();
    this.wordPlatform = null;
    this.gameObjects = [];
    
    this.background = new Background(Texture.from("bg"));
    this.app.stage.addChild(this.background);

    new GameBoundaries(this.engine);
    this.createWordPlatform();
    this.createWordCircles(this.circleCount);
  }

  
  createWordPlatform() {
    this.wordPlatform = new Platform(Texture.from("op"), this.engine, () => {
      this.clearSelectedCircles();
    });
    this.app.stage.addChild(this.wordPlatform);
  }

  createWordCircles(numCircles) {
    const circleTexture = Texture.from("circle");

    for (let i = 0; i < numCircles; i++) {
      gsap.to(
        {},
        {
          delay: i * 0.4,
          onComplete: () => {
            const circle = new WordCircle(circleTexture, this.engine, () =>
              this.circleClickCallback(circle)
            );
            this.app.stage.addChild(circle);
            this.gameObjects.push(circle);
          },
        }
      );
    }
  }

  async checkWord(word) {
    try {
      const isValid = await this.wordChecker.isWordValid(word);
      if (isValid && word.length > 2) {
        this.approveWord(word.length);
      } else {
        this.wordPlatform.button.revertEventListener();
      }
    } catch (error) {
      console.error("ERR:", error);
    }
  }

  approveWord(letterCount) {
    this.wordPlatform.texture = Texture.from("grp");
    this.wordPlatform.button.texture = Texture.from("tick");
    this.wordPlatform.button.off("pointerdown");
    this.wordPlatform.button.on("pointerdown", () =>
      this.progressOnGame(letterCount)
    );
  }

  progressOnGame(letterCount) {
    this.wordPlatform.button.revertEventListener();
    this.wordPlatform.text.text = "";
    this.wordPlatform.updateSpritesBasedOnText();
    this.wordPlatform.button.visible = false;
    this.correctWordCount += 1;
    this.destroySelectedCircles();

    if (this.winStatus() === true) {
      for (const circle of this.gameObjects) {
        circle.destroyCircle(() => this.app.stage.removeChild(circle));
      }

      this.gameObjects = [];
      this.wordPlatform.visible = false;
      console.log("you won!");

    } else {
      this.createWordCircles(letterCount);
    }
  }

  winStatus() {
    if (this.correctWordCount === gameOptions.numToWinGame) {
      return true;
    }
    return false;
  }

  circleClickCallback(circle) {
    const letter = circle.letter;

    if (!circle.isClicked) {
      this.wordPlatform.addLetterToText(letter);
      circle.isClicked = true;
      circle.texture = Texture.from("circleClicked");
      this.checkWord(this.wordPlatform.text.text);
    } else {
      this.wordPlatform.removeLetterFromText(letter);
      circle.isClicked = false;
      circle.texture = Texture.from("circle");
      this.wordPlatform.button.revertEventListener();
    }

    this.wordPlatform.updateSpritesBasedOnText();
  }

  clearSelectedCircles() {
    for (const element of this.gameObjects) {
      element.isClicked = false;
      element.texture = Texture.from("circle");
      element.toggleTextColor();
    }
  }

  destroySelectedCircles() {
    const clickedCircles = this.gameObjects.filter(
      (circle) => circle.isClicked
    );

    for (const circle of clickedCircles) {
      circle.destroyCircle(() => this.app.stage.removeChild(circle));
    }

    this.gameObjects = this.gameObjects.filter((circle) => !circle.isClicked);
  }

  gameLoop() {
    Matter.Engine.update(this.engine, 1000 / 60);

    for (const gameObject of this.gameObjects) {
      gameObject.update();
    }
  }
}

export default Game;