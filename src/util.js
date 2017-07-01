'use strict';

function isJpeg(filename) {
    return filename.substr(-4).toLowerCase() === '.jpg';
}

function isMpeg(filename) {
    return filename.substr(-4).toLowerCase() === '.mp4';
}

exports.isJpeg = isJpeg;
exports.isMpeg = isMpeg;
