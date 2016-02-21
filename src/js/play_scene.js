'use strict';

var LevelMap = require('./world/level_map.js');
var LevelEditor = require('./world/level_editor.js');

var PlayScene = {};

PlayScene.init = function () {
    // disable context menu when right clicking in the game
    this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

    // register input from keyboard
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.keys.escape = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ESC);
    this.keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
};

PlayScene.create =  function () {
    this.game.stage.backgroundColor = '#29adff'; // TODO: use proper bg image

    this.level = new LevelMap(this.game);

    this.editorUI = this.game.add.group();
    this.levelEditor = new LevelEditor(this.editorUI, this.keys, this.level);
};

PlayScene.update = function () {
   if (this.levelEditor.isEnabled) { this.levelEditor.update(); }
};

module.exports = PlayScene;
