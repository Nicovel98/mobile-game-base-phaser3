import { fullScreen } from "../utils/screen.js";
import { pointerUp } from "../utils/buttons.js";
import constant from "../constant.js";

export default class Hub extends Phaser.Scene {
    // Vars
    soundBtn = null;
    music = null;
    handlerScene = null;
    constructor() {
        super("hub");
    }

    preload() {
        // Images
        this.load.image("quit", "assets/images/quit.png");
        this.load.spritesheet("fullscreen", "assets/images/fullscreen.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("sound", "assets/images/sound.png", { frameWidth: 48, frameHeight: 48 });
        //---------------------------------------------------------------------->
        this.width = this.sys.game.canvas.width;
        this.handlerScene = this.scene.get("handler");
        // Bindings
        fullScreen.call(this);
        this.pointerUp = pointerUp.bind(this);
    }

    create() {
        this.quitBtn = this.add.image(30, 30, "quit").setOrigin(.5).setDepth(1).setInteractive({ cursor: 'pointer' });
        this.pointerUp(() => {
            this.clickBackScene(this.handlerScene.sceneRunning);
        }, this.quitBtn);

        this.soundBtn = this.add.image(30, 96, "sound").setOrigin(.5).setDepth(1).setInteractive({ cursor: 'pointer' });
        this.soundBtn.isPlaying = 1;
        this.soundBtn.on('pointerup', () => {
            if (this.soundBtn.isPlaying > 0) {
                this.soundBtn.setFrame(1);
            }
            else {
                this.soundBtn.setFrame(0);
            }
            this.soundBtn.isPlaying *= -1;
        });

        this.fullscreenBtn = this.add.image(this.width - 30, 30, 'fullscreen', 0).setOrigin(.5).setDepth(1).setInteractive({ cursor: 'pointer' });

        this.fullscreenBtn.on('pointerup', () => {
            if (this.scale.isFullscreen) {
                this.fullscreenBtn.setFrame(0);
                this.scale.stopFullscreen();
            }
            else {
                this.fullscreenBtn.setFrame(1);
                this.scale.startFullscreen();
            }
        });

        this.scale.on("resize", this.resize, this);

    }

    clickBackScene(sceneTxt) {
        const scene = this.scene.get(sceneTxt);
        let gotoScene;
        let bgColorScene;
        switch (sceneTxt) {
            case 'title':
                return;
            case 'menu':
                gotoScene = 'title';
                bgColorScene = constant.color.TITLE;
                break;
        }
        scene.sceneStopped = true;
        scene.scene.stop(sceneTxt);
        this.handlerScene.cameras.main.setBackgroundColor(bgColorScene);
        this.handlerScene.launchScene(gotoScene);
    }

    resize() {
        this.fullscreenBtn.x = this.scale.gameSize.width - 30;
    }

    getZoom() {
        return this.cameras.main.zoom;
    }

}