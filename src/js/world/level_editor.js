'use strict';

function LevelEditor(group, keys, level) {
    let game = group.game;
    this.level = level;

    this.rootGroup = group;

    this.hud = this.rootGroup.add(game.add.group());
    let overlay = game.add.image(0, 0, 'overlay');
    overlay.alpha = 0.5;
    this.hud.add(overlay);

    this.cursor = group.create(0, 0, 'cursor');


    this._setupInput(keys);

    // start with editor toggled off;
    this.toggle(false);
    this.toggleHud(false);
}

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

module.exports = LevelEditor;
