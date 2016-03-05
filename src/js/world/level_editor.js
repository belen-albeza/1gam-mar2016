'use strict';

const TSIZE = 16;
const CAMERA_SPEED = 4;
const PREFABS = {
    0: 'main-chara',
    1: 'goal'
};

function LevelEditor(group, keys, level) {
    this.game = group.game;
    this.level = level;
    this.keys = keys;

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
    let cursor = {
        x: this.game.input.worldX - this.game.camera.x,
        y: this.game.input.worldY - this.game.camera.y
    };

    // update tile brush cursor
    this.brushCursor.position.setTo(
        this.game.math.snapToFloor(cursor.x, TSIZE),
        this.game.math.snapToFloor(cursor.y,TSIZE));
    this.brushCursor.tint = this.game.input.activePointer.rightButton.isDown
        ? 0xff0000
        : 0xffffff;

    // paint a tile if mouse left button is pressed
    // erase a tile if mouse right button is pressed
    if (!this.isHudEnabled && this.game.input.activePointer.isDown) {
        let element = this.game.input.activePointer.leftButton.isDown
            ? this.brush.index
            : null;
        this._putInMap(element, this.game.input.worldX, this.game.input.worldY);
    }

    // scroll camera with cursor keys
    if (this.keys.left.isDown) { this.game.camera.x -= CAMERA_SPEED; }
    if (this.keys.right.isDown) { this.game.camera.x += CAMERA_SPEED; }
    if (this.keys.up.isDown) { this.game.camera.y -= CAMERA_SPEED; }
    if (this.keys.down.isDown) { this.game.camera.y += CAMERA_SPEED; }
};

LevelEditor.prototype.toggle = function (value) {
    this.isEnabled = typeof(value) === 'undefined' ?
        !this.isEnabled
        : value;
    this.rootGroup.exists = this.isEnabled;
    this.rootGroup.visible = this.isEnabled;

    this.level.togglePrefabs(this.isEnabled);
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

LevelEditor.prototype.selectPrefab = function (index) {
    this.brush = { type: 'prefabs', index: index };
    this.prefabPaletteFrame.position.x = index * TSIZE;
    this._updateBrush();
};

LevelEditor.prototype.download = function () {
    let data = JSON.stringify(this.level.serialize(), null, 2);
    // create a temp <a> tag to download the file
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
      encodeURIComponent(data));
    element.setAttribute('download', 'level.json');
    // simulate a click on the link and remove the <a>
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

    this.prefabPalette = this.hud.create(0, this.game.height, 'prefabs');
    this.prefabPalette.anchor.setTo(0, 1);
    this.prefabPaletteFrame = this.hud.create(0, 0, 'cursor');
    this.prefabPaletteFrame.anchor.setTo(0, 1);
    this.prefabPalette.addChild(this.prefabPaletteFrame);

    this.prefabPalette.inputEnabled = true;
    this.prefabPalette.events.onInputUp.add(function (sprite, pointer) {
       this.selectPrefab(
           this.game.math.snapToFloor(pointer.x, TSIZE) / TSIZE);
         this.toggleHud(false);
    }, this);

    this.downloadButton = this.game.make.button(this.game.width, this.game.height,
        'btn:download', this.download, this);
    this.downloadButton.anchor.setTo(1, 1);
    this.hud.add(this.downloadButton);
};

LevelEditor.prototype._updateBrush = function () {
    this.brushCursor.loadTexture(`${this.brush.type}:sheet`, this.brush.index);
};

LevelEditor.prototype._putInMap = function (element, x, y) {
    // TODO: support for multiple layers
    if (this.brush.type === 'tiles') {
        this.level.putTileAtXY(0, element, x, y);
    }
    else {
        this.level.putPrefabAtXY(element, x, y);
    }
};


module.exports = LevelEditor;
