'use strict';

const util = require('./utiltest');
const ws   = require('../src/ws');

util.mkdirp(util.ROOT_FOLDER_TEST + 'sendable/' + 'original/');
util.mkdirp(util.ROOT_FOLDER_TEST + 'sendable/' + 'thumbnail/');

util.deleteFile(util.ROOT_FOLDER_TEST + 'sendable/' + 'original/' + 'file.jpg');
util.deleteFile(util.ROOT_FOLDER_TEST + 'sendable/' + 'thumbnail/' + 'file.jpg');

// util.createJpeg                  (util.ROOT_FOLDER_TEST + 'sendable/' + 'original/'  + 'file.jpg');
//util.createJpegThumbnailLandscape(util.ROOT_FOLDER_TEST + 'sendable/' + 'thumbnail/' + 'file.jpg');

var result = ws.childSendable
    (util.ROOT_FOLDER_TEST + 'sendable/' + 'original/'  + 'file.jpg',
     util.ROOT_FOLDER_TEST + 'sendable/' + 'thumbnail/' + 'file.jpg');

console.log(result);

