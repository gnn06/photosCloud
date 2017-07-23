'use strict';

function isJpeg(filename) {
    return filename.substr(-4).toLowerCase() === '.jpg';
}

function isMpeg(filename) {
    return filename.substr(-4).toLowerCase() === '.mp4';
}

function getThumbnailPath(filename) {
    var fileoutput = filename.replace('.mp4', '.jpg');
    return fileoutput;
}

exports.isJpeg           = isJpeg;
exports.isMpeg           = isMpeg;
exports.getThumbnailPath = getThumbnailPath;
