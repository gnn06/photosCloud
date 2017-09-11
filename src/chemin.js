'use strict';

const config = require('./config');

function urlToFolder(folder) {
    return folder.replace('%20', ' ');
}

function getFolder (photoPath) {
	var folder = photoPath.substring(0,photoPath.lastIndexOf('/'));
	folder = folder.replace(config.photoPath, '');
	return folder;
}

// returns filename without starting slash
function getPhoto (photoPath) {
	var photo = photoPath.substring(photoPath.lastIndexOf('/') + 1);
	return photo;
}

exports.urlToFolder = urlToFolder;
exports.getFolder = getFolder;
exports.getPhoto  = getPhoto;

