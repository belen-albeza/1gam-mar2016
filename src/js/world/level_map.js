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
        width: game.width / TSIZE,
        height: game.height / TSIZE,
        layers: [[[0, 1, 1]]]
    };

    this.map = game.add.tilemap(null, TSIZE, TSIZE, data.width, data.height);
    this.map.addTilesetImage('main', 'tiles', TSIZE, TSIZE);
    this.layers = data.layers.map(function (layerData) {
        // TODO: add the layer to a group? (last optional param)
        let layer = this.map.createBlankLayer(
            'main', data.width, data.height, TSIZE, TSIZE);
        fillLayerData(layer, layerData);
        return layer;
    }.bind(this));
}

LevelMap.prototype.layer = function () {
    return this.layers[0]; // TODO: support multiple layers
};

module.exports = LevelMap;
