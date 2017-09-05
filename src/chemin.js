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

exports.urlToFolder = urlToFolder;
exports.getFolder = getFolder;