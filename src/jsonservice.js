'use strict';

var fs = require('fs');
const dataService = require('./dataservice');
const chemin = require('./chemin');
const config = require('./config');

function read (folder) {
	var jsonPath = config.dataPath + folder + '/folder.json';
	console.log('read json from ', jsonPath);
	if (fs.existsSync(jsonPath)) {
		let content = fs.readFileSync(jsonPath, 'utf-8');
		var currentContent = JSON.parse(content);
		return currentContent;
	} else {
		return null;
	}
}

function write (folder, currentContent) {
	let content = JSON.stringify(currentContent, null, 2);
	try {
		fs.writeFileSync(config.dataPath + folder + '/folder.json', content, 'utf-8');
		console.log('json writed');
	} catch (exception) {
		console.error('error write folder.json', config.dataPath + folder + '/folder.json', exception);
	}
}

function update (url) {
	var p = dataService.getPhotoDate(config.photoPath + url);
	p.then(date => {
		console.log('then', date);
		var folder = chemin.getFolder(url);
		var photo = chemin.getPhoto(url);
		var content = read(folder);
		if (!content) {
			content = new Array();
		}
		var found = false;
		for (let el of content) {
			if (el.url == photo) {
				el.date = date;
				console.log('data updated');
				found = true;
				break;
			}
		}
		if (!found) {
			var newEl = {
				url : photo,
				date : date
			}
			content.push(newEl);
			console.log('data created');
		}
		write(folder, content);
	});
}

exports.delete = function (url) {
	console.log('delete json');
	var folder = chemin.getFolder(url);
	var photo = chemin.getPhoto(url);
	var content = read(folder);
	if (!content) {
		return;
	}
	var found = false;
	for (var index = 0; index < content.length; index++) {
		var element = content[index];
		if (element.url == photo) {
			content.splice(index, 1);
			found = true;
			break;
		}
	}
	if (found) {
		write(folder, content);
	}
}

exports.read   = read;
exports.update = update;
