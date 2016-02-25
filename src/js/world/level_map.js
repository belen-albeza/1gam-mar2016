'use strict';

//
// consts and other settings
//

const TSIZE = 16;

//
// private functions
//

function fillLayerData(layer, layerData) {
    layerData.forEach(function (row, rowIndex) {
        row.forEach(function (tile, colIndex) {
            layer.map.putTile(tile, colIndex, rowIndex, layer);
        });
    });
}

//
// LevelMap class
//

function LevelMap(game, data) {
    data = data || {
        width: 2 * (game.width / TSIZE),
        height: game.height / TSIZE,
        layers: [[], []]
    };

    this.map = game.add.tilemap(null, TSIZE, TSIZE, data.width, data.height);
    this.map.addTilesetImage('main', 'tiles', TSIZE, TSIZE, 0, 0, 0);
    // TODO: don't harcode the gid (2)!
    this.map.addTilesetImage('prefabs', 'prefabs', TSIZE, TSIZE, 0, 0, 2);

    let tileLayers = data.layers.slice(0, data.layers.length - 1);
    this.layers = tileLayers.map(function (layerData) {
        // TODO: add the layer to a group? (last optional param)
        let layer = this.map.createBlankLayer(
            'main', data.width, data.height, TSIZE, TSIZE);
        fillLayerData(layer, layerData);
        return layer;
    }.bind(this));

    let prefabLayer = this.map.createBlankLayer(
        'prefabs', data.width, data.height, TSIZE, TSIZE);
    fillLayerData(prefabLayer, data.layers[data.layers.length - 1]);
    this.layers.push(prefabLayer);
    prefabLayer.alpha = 0.5;
    prefabLayer.visible = false;

    this.layer().resizeWorld();
}

LevelMap.prototype.layer = function () {
    return this.layers[0]; // TODO: support multiple layers
};

LevelMap.prototype.prefabsLayer = function () {
    return this.layers[this.layers.length - 1];
};

LevelMap.prototype.putTileAtXY = function (layer, tile, x, y) {
    this.map.putTileWorldXY(tile, x, y, TSIZE, TSIZE, this.layers[layer]);
};

LevelMap.prototype.putPrefabAtXY = function (prefab, x, y) {
    this.map.putTileWorldXY(
        prefab !== null ? prefab + 2 : null,
        x, y, TSIZE, TSIZE, this.prefabsLayer());
};

LevelMap.prototype.togglePrefabs = function (value) {
    if (typeof(value) === 'undefined') {
        value = !this.prefabsLayer().visible;
    }
    this.prefabsLayer().visible = value;
};

module.exports = LevelMap;
