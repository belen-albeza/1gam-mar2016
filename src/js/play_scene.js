'use strict';

var LevelMap = require('./world/level_map.js');

var PlayScene = {};

PlayScene.init = function () {
    // register input from keyboard
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ESC);
};

PlayScene.create =  function () {
    this.game.stage.backgroundColor = '#29adff'; // TODO: use proper bg image

    this.level = new LevelMap(this.game);
    this.editorUI = this.game.add.group();
    PlayScene._setupEditor(this.editorUI);
};

PlayScene.toggleEditor = function (value) {
    this.isEditMode = typeof(value) === 'undefined' ?
        !this.isEditMode
        : value;
    this.editorUI.exists = this.isEditMode;
    this.editorUI.visible = this.isEditMode;
};

PlayScene._setupEditor = function (group) {
    this.keys.space.onUp.add(function () {
        this.toggleEditor();
    }, this);
    this.cursor = group.create(0, 0, 'cursor');

    // start with editor toggled off
    this.toggleEditor(false);
};

module.exports = PlayScene;
