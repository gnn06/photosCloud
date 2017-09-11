'use strict';

const fileS = require('./fileservice');
const jsonS = require('./jsonservice');

exports.trashPhoto = function (photo, config) {
    fileS.trashPhoto(photo, config);
    jsonS.delete(photo);
}