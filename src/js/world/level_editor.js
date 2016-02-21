'use strict';

const TSIZE = 16;

function LevelEditor(group, keys, level) {
    this.game = group.game;
    this.level = level;

    this.rootGroup = group;
    this.rootGroup.fixedToCamera = true;
    this.hud = this.rootGroup.add(this.game.add.group());

    this.brushCursor = group.create(0, 0, 'tiles:sheet', 0);
    this.brushCursor.alpha = 0.5;

    this._setupHud(this.hud);
    this._setupInput(keys);
    this.selectTile(0);

    // start with editor toggled off;
    this.toggle(false);
    this.toggleHud(false);
}

LevelEditor.prototype.update = function () {
    // mouse coordinates at game.input.{worldX,worldY}
    this.brushCursor.position.setTo(
        this.game.math.snapToFloor(this.game.input.worldX, TSIZE),
        this.game.math.snapToFloor(this.game.input.worldY, TSIZE)
    );

    // paint a tile if mouse left button is pressed
    if (!this.isHudEnabled && this.game.input.activePointer.isDown) {
        // TODO: support for multiple layers
        this.level.putTileAtXY(0, this.brush.index,
            this.game.input.worldX, this.game.input.worldY);
    }
};

LevelEditor.prototype.toggle = function (value) {
    this.isEnabled = typeof(value) === 'undefined' ?
        !this.isEnabled
        : value;
    this.rootGroup.exists = this.isEnabled;
    this.rootGroup.visible = this.isEnabled;
};

LevelEditor.prototype.toggleHud = function (value) {
    this.isHudEnabled = typeof(value) === 'undefined' ?
        !this.isHudEnabled
        : value;

    this.hud.visible = this.isHudEnabled;
    this.brushCursor.visible = !this.isHudEnabled;
};

LevelEditor.prototype.selectTile = function (index) {
    this.brush = { type: 'tiles', index: index };
    this.tilePaletteFrame.position.x = index * TSIZE;
    this._updateBrush();
};

//
// private methods
//

LevelEditor.prototype._setupInput = function (keys) {
    keys.escape.onUp.add(function () {
        this.toggle();
    }, this);

    keys.space.onUp.add(function () {
        if (this.isEnabled) {
            this.toggleHud();
        }
    }, this);
};

LevelEditor.prototype._setupHud = function () {
    let overlay = this.hud.create(0, 0, 'overlay');
    overlay.alpha = 0.5;

    this.tilePalette = this.hud.create(0, 0, 'tiles');
    this.tilePaletteFrame = this.hud.create(0, 0, 'cursor');
    this.tilePalette.addChild(this.tilePaletteFrame);

    this.tilePalette.inputEnabled = true;
    this.tilePalette.events.onInputUp.add(function (sprite, pointer) {
        this.selectTile(
            this.game.math.snapToFloor(pointer.x, TSIZE) / TSIZE);
        this.toggleHud(false);
    }, this);
};

LevelEditor.prototype._updateBrush = function () {
    this.brushCursor.key = this.brush.type;
    this.brushCursor.frame = this.brush.index;
};

module.exports = LevelEditor;
