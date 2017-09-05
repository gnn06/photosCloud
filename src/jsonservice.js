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
			} catch (exception) {
				console.error('error write folder.json', config.dataPath + folder + '/folder.json', exception);
			}
}

function update (url) {
	var p = dataService.getPhotoDate(config.photoPath + url);
	p.then(date => {
		console.log('then', date);
		var folder = chemin.getFolder(url);
		var content = read(folder);
		if (!content) {
			content = new Array();
		}
		var found = false;
		for (let el of content) {
			if (el.url == url) {
				el.date = date;
				found = true;
				break;
			}
		}
		if (!found) {
			var newEl = {
				url : url,
				date : date
			}
			content.push(newEl);
		}
		write(folder, content);
	});
}

exports.read   = read;
exports.update = update;