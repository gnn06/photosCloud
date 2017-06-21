'use strict';

var fs = require('fs');

const extensionsToRetrieve = ['jpg', 'mp4'];

exports.walk = function (folder, options) {
	var currentContent = [];
	var allSubContent = [];
	var currentContentFromCache = false;
	var flattenContent = [];

	// Récupérer ancien contenu
	if (fs.existsSync(options.photoFolder + '/' + folder + '/folder.json')) {
		let content = fs.readFileSync(options.photoFolder + '/' + folder + '/folder.json', 'utf-8');
		currentContent = JSON.parse(content);
		currentContentFromCache = currentContent.length > 0;
	}
	// parcourir pour soit créer le contenu soit récupérer les sous-contenus
	// On isole le contenu courant des sous-contenu pour pouvoir stocker le contenu courant tout seul.
	var files = fs.readdirSync (options.photoFolder + '/' + folder, 'utf-8');
	for (var i = 0; i < files.length; i++) {
		var stat = fs.statSync(options.photoFolder + '/' + folder + '/' + files[i]);
		if (stat.isDirectory()) {
			var subResult = this.walk(folder + '/' + files[i], options);
			// adapte les urls des sous-contenus
			allSubContent = allSubContent.concat(
				subResult.map(item => {
					item.url = files[i] + '/' + item.url;
					return item;
				}));
		} else if (!currentContentFromCache) {
			// Ne faire la récupération que si le contenu n'a pas été préalablement récupéré
			var extension = files[i].substr(-3).toLowerCase();
			if (extensionsToRetrieve.indexOf(extension) > -1) {
				var item = {};
				item.url = files[i];
				currentContent.push(item);
			}
		}
	}
	// stocker le contenu du répertoire courant si on vient de le construire (et pas les sous-contenu)
	if (!currentContentFromCache) {
		let content = JSON.stringify(currentContent);
		fs.writeFileSync(options.dataFolder + '/' + folder + '/folder.json', content, 'utf-8');
	}
	// fusionne contenu courant et sous-contenus
	flattenContent = currentContent.concat(allSubContent);
	// console.log('current=',currentContent.length,' allSubContent=',allSubContent.length,'flattenContent=',flattenContent.length);
	return flattenContent;
};
