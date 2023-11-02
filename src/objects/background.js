import { gameOptions } from "../gameConfig"
import {Sprite } from "pixi.js";

class Background extends Sprite {
    constructor(texture){
        super(texture);
        this.scale.set(2);
        this.anchor.set(0.5);
        this.position.set(gameOptions.height / 2, gameOptions.width / 2);
    }
}
export default Background;