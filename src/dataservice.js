'use strict';

var exif = require('fast-exif');
var proc = require('child_process');

//var config = require('./config');
//console.log('service',config);

function getPhotoDate (photoFilename) {
	console.log('getting data of ', photoFilename);
	if (photoFilename.substr(-4).toLowerCase() === '.jpg') {
		var p = exif.read(photoFilename)
			.then(data => {
				var date = data && data.image && data.image.ModifyDate;
				return date;
			}).catch(function(err){
				console.error('catch of getData', err);
				Promise.resolve(null);
			});
		return p;
	} else if (photoFilename.substr(-4).toLowerCase() === '.mp4') {
		var pM = new Promise(function(resolve, reject) {
			
			var argv = [];
			argv = argv.concat(['-b']);
			argv = argv.concat(['-ModifyDate']);
			argv = argv.concat([photoFilename]);
			proc.execFile('exiftool', argv, (error, stdout, stderr) => {
				if (error) {
					console.error(error);
					resolve(-1);
				}
				var date = new Date(Date.UTC(stdout.substring(0,4),
									stdout.substring(5,7) - 1,
									stdout.substring(8,10),
									stdout.substring(11,13),
									stdout.substring(14,16),
									stdout.substring(17,19)));
				resolve(date);
			});
		});
		return pM;
	}
	// TODO récupére date du fichier si on ne peut rien faire d'autre
}

exports.getPhotoDate = getPhotoDate;