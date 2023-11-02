import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { initAssets } from "./assets";
import { gsap } from "gsap";
import { CustomEase, PixiPlugin } from "gsap/all";
import Game from "./game";
import { gameOptions } from "./gameConfig";


export const app = new Application({gameOptions});

app.ticker.stop();
gsap.ticker.add(() => {
  app.ticker.update();
});

async function init() {

  document.body.appendChild(app.view);

  let assets = await initAssets();
  console.log("assets", assets);

  gsap.registerPlugin(PixiPlugin, CustomEase);
  PixiPlugin.registerPIXI(PIXI);

  const game = new Game(app);

  app.ticker.add(() => {
    // The gameLoop method of your Game instance
    game.gameLoop();
  });
}

init();
