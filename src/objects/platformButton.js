import { Sprite } from "pixi.js";

class PlatformButton extends Sprite {

    cornerSpriteClickCallback

    constructor(texture, width, height,callback) {
        super(texture);

        this.cornerSpriteClickCallback = callback;
        this.anchor.set(0.5);
        this.scale.set(0.5);
        this.position.set(width / 2 - 50, -height / 2 + 55);
        this.visible = false;
        this.interactive = true; // Make the corner sprite interactive
        this.on("pointerdown", () => this.onCornerSpriteClick()); // Add a click event listener
    }

    onCornerSpriteClick() {
        this.visible = false;
        this.cornerSpriteClickCallback();
    }

    revertEventListener(){
        this.off("pointerdown");
        this.on("pointerdown", () => this.onCornerSpriteClick());
    }
}
export default PlatformButton;