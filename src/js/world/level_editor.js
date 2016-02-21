'use strict';

function LevelEditor(group, keys, level) {
    this.group = group;
    this.level = level;

    keys.escape.onUp.add(function () {
        this.toggle();
    }, this);

    keys.space.onUp.add(function () {
        if (this.isEnabled) { } // TODO: toggle palette
    }, this);

    this.cursor = group.create(0, 0, 'cursor');

    // start with editor toggled off
    this.toggle(false);
}

LevelEditor.prototype.toggle = function (value) {
    this.isEnabled = typeof(value) === 'undefined' ?
        !this.isEnabled
        : value;
    this.group.exists = this.isEnabled;
    this.group.visible = this.isEnabled;
};

module.exports = LevelEditor;
