'use strict';

var LevelMap = require('./world/level_map.js');

var PlayScene = {};

PlayScene.create =  function () {
    this.game.stage.backgroundColor = '#29adff';

    this.level = new LevelMap(this.game);
};

module.exports = PlayScene;
