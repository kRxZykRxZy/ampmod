/**
 * Webpack shim module
 *
 * Uses webpack imports-loader and exports-loader to provide the vertical and
 * vertical flavors of Blockly.  All of the other files in this directory shim
 * Blockly and goog between blockly_compressed_* and blocks_compressed*.
 *
 * Vertical export Blockly out of
 *     blockly_compressed_vertical +
 *     blocks_compressed +
 *     blocks_compressed_vertical +
 *     msg/messages
 **/
module.exports = {
    // Horizontal: require('./horizontal'),
    Vertical: require("./vertical"),
};
