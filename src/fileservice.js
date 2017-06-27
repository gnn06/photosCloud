'use strict';

var fs = require('fs');
var dataService = require('./dataservice');

const extensionsToRetrieve = ['jpg', 'mp4'];

exports.walk = function (folder, config) {
	var currentContent = [];
	var allSubContent = [];
	var currentContentFromCache = false;
	var flattenContent = [];

	// Récupérer ancien contenu
	if (!fs.existsSync(config.dataFolder + folder)) {
		fs.mkdirSync(config.dataFolder + folder);
	}
	if (fs.existsSync(config.dataFolder + folder + '/folder.json')) {
		let content = fs.readFileSync(config.dataFolder + folder + '/folder.json', 'utf-8');
		currentContent = JSON.parse(content);
		currentContentFromCache = currentContent.length > 0;
		if (currentContentFromCache) {
			console.log('use cache for ', folder, ' ', currentContent.length, ' items read');
		}
	}
	// parcourir pour soit créer le contenu soit récupérer les sous-contenus
	var files = fs.readdirSync (config.photoFolder + folder, 'utf-8');
	var promises = [];
	for (var i = 0; i < files.length; i++) {
		var stat = fs.statSync(config.photoFolder + folder + '/' + files[i]);
		if (stat.isDirectory()) {
			var subResult = this.walk(folder + (folder != '' ? '/' : '') + files[i], config);
			// on ne fusionne pas les sous-contenu immédiatement avec le countenu courant/
			// pour pouvoir stocker le contenu courant séparement à la fin
			promises.push(subResult);
			subResult.then(function (result) {
				allSubContent = allSubContent.concat(result);
			}).catch(function(err){
				console.error('catch of subwalk', folder, err);
			});
		} else if (!currentContentFromCache) {
			// Ne faire la récupération que si le contenu n'a pas été préalablement récupéré
			var extension = files[i].substr(-3).toLowerCase();
			if (extensionsToRetrieve.indexOf(extension) > -1) {
				let item = {};
				item.url = files[i];
				// récupération des informations annexes
				currentContent.push(item);
				var photoPath = config.photoFolder + folder + '/' + files[i];
				var p = dataService.getPhotoDate(photoPath);
				promises.push(p);
				p.then( date => {
					item.date = date;
				}).catch(function (err) {
					console.error('catch of walk of folder=', folder, err);
				});
			}
		}
	}
	// stocker le contenu du répertoire courant si on vient de le construire (et pas les sous-contenu)
	// On stocke les urls sans le chemin.
	return Promise.all(promises).then(function(){
		if (!currentContentFromCache) {
			let content = JSON.stringify(currentContent, null, 2);
			try {
				fs.writeFileSync(config.dataFolder + folder + '/folder.json', content, 'utf-8');
			} catch (exception) {
				console.error('error write folder.json', config.dataFolder + folder + '/folder.json', exception);
			}
		}
		// adapte les urls du répertoire courant pour avoir des url absolu à partir de la racine
		// qu'il soit généré maintenant ou récupéré du cache.
		// ca facilite la vie de la couche cliente
		currentContent = currentContent.map(
			item => {
				// on évite de créer // si folder est null
				item.url = (folder != '' ? '/' : '') + folder + '/' + item.url;
				return item;
			});
		// fusionne contenu courant et sous-contenus
		flattenContent = currentContent.concat(allSubContent);
		return flattenContent;
	});
};
