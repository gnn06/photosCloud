'use strict';

const fs          = require('fs');
const dataService = require('./dataservice');
const chemin      = require('./chemin');
const jsonS       = require('./jsonservice');
const timer       = require('minimal-timer');
const time = timer() ;

const extensionsToRetrieve = ['jpg', 'mp4'];

exports.walk = function (folder, config) {
	time.start();
	var currentContent = [];
	var allSubContent = [];
	var previousCacheCount;
	var dateCurrentContent;
	var needWrite = false;
	var flattenContent = [];

	if (!fs.existsSync(config.largePath + folder)) {
		console.log('create folder ', config.largePath + folder);
		fs.mkdirSync(config.largePath + folder);
	}
	if (!fs.existsSync(config.thumbnailPath + folder)) {
		console.log('create folder ', config.thumbnailPath + folder);
		fs.mkdirSync(config.thumbnailPath + folder);
	}
	if (!fs.existsSync(config.dataPath + folder)) {
		console.log('create folder ', config.dataPath + folder);
		fs.mkdirSync(config.dataPath + folder);
	}
	// Récupérer ancien contenu
	if (fs.existsSync(config.dataPath + folder + '/folder.json')) {
		let content = fs.readFileSync(config.dataPath + folder + '/folder.json', 'utf-8');
		currentContent = JSON.parse(content);
		previousCacheCount = currentContent.length;
		if (previousCacheCount > 0) {
			console.log('use cache for ', folder, ' ', currentContent.length, ' items read');
		}
		dateCurrentContent = fs.statSync(config.dataPath + folder + '/folder.json').mtime;
	}
	
	// parcourir pour soit créer le contenu soit récupérer les sous-contenus
	var files = fs.readdirSync (config.photoPath + folder, 'utf-8');
	var promises = [];
	for (var i = 0; i < files.length; i++) {
		var photoPath = config.photoPath + folder + '/' + files[i];
		var stat = fs.statSync(photoPath);
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
		} else {
			var dataFile = stat.mtime;
			var extension = files[i].substr(-3).toLowerCase();
			if (extensionsToRetrieve.indexOf(extension) > -1) {
				var alreadyKnownIndex = currentContent ? currentContent.map(function(item) {return item.url;}).indexOf(files[i]) : -1;
				let item;
				if (alreadyKnownIndex == -1) {
					item = {};
					item.url = files[i];
					currentContent.push(item);
				} else if (dateCurrentContent && dataFile > dateCurrentContent) {
					item = currentContent[alreadyKnownIndex];
				}
				// Ne faire la récupération que si la photo est nouvelle (pas présente dans le folder.json)
				// ou que le fichier Photo est plus récent que le fichier folder.json
				if (item) {
					// récupération des informations annexes
					var p = dataService.getPhotoDate(photoPath);
					promises.push(p);
					needWrite = true;
					p.then( date => {
						item.date = date;
					}).catch(function (err) {
						console.error('catch of walk of folder=', folder, err);
					});
				}
			}
		}
	}
	
	// stocker le contenu du répertoire courant si on vient de le construire (et pas les sous-contenu)
	// On stocke les urls sans le chemin.
	return Promise.all(promises).then(function() {
		if (needWrite) {
			let content = JSON.stringify(currentContent, null, 2);
			try {
				fs.writeFileSync(config.dataPath + folder + '/folder.json', content, 'utf-8');
				console.log('write folder.json of ', config.dataPath + folder);
			} catch (exception) {
				console.error('error write folder.json', config.dataPath + folder + '/folder.json', exception);
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
		var delay = time.stop();
		console.log('walk duration', delay) ;
		return flattenContent;
	});
};

exports.trashPhoto = function (photo, config) {
	var folder = chemin.getFolder(photo);
	if (!fs.existsSync(config.trashPath + folder)) {
		fs.mkdirSync(config.trashPath + folder);
	}
	fs.renameSync(config.photoPath + photo, config.trashPath + photo);
	try {
		fs.unlinkSync(config.thumbnailPath + photo);
		fs.unlinkSync(config.largePath + photo);
	} catch (ex) {
		// large and thumbnail doesn't exist
		// do nothing
	}
	jsonS.delete(photo);
}

exports.childSendable = function childSendable (fullPathOriginal, fullPathChild) {
	const fdOrig = fs.openSync(fullPathOriginal, 'r');
	var result = false;
	try {
		const fdChild = fs.openSync(fullPathChild, 'r');
		if (fdChild != -1) {
			var statOrig = fs.fstatSync(fdOrig);
			var dateOriginal = statOrig.mtime;
			var statChild = fs.fstatSync(fdChild);
			var dateChild = statChild.mtime;
			result = dateOriginal <= dateChild;
		} else {
			result = false;
		}
		fs.closeSync(fdChild);
	} catch (ex) {
		result = false;
	}
	fs.closeSync(fdOrig);
	return result;
};
