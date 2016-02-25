'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
    init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale(4, 4);
    },

    preload: function () {
        // load here assets required for the loading screen
        this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    },

    create: function () {
        this.game.state.start('preloader');
    }
};


var PreloaderScene = {
    preload: function () {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.load.image('tiles', 'images/tileset.png');
        this.load.image('prefabs', 'images/prefabs.png');
        this.load.image('cursor', 'images/editor_cursor.png');
        this.load.image('overlay', 'images/black_overlay.png');

        this.load.spritesheet('tiles:sheet', 'images/tileset.png', 16, 16);
        this.load.spritesheet('prefabs:sheet', 'images/prefabs.png', 16, 16);
    },

    create: function () {
        this.game.state.start('play');
    }
};


window.onload = function () {
    var game = new Phaser.Game(256, 192, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);

    game.state.start('boot');
};
