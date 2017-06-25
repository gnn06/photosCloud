'use strict';

var exif = require('fast-exif');
var mp4boxModule = require('mp4box');
var fs = require('fs');

//var config = require('./config');
//console.log('service',config);

function getData(files, config) {
	var promises = [];
    files.forEach(function(element) {
        var photoPath = config.photosPath + element.url;
        var promise = getPhotoDate(photoPath);
		promise.then(date => {
			element.date = date;
		});
		promises.push(promise);
    }, this);
	return promises;
}

function getPhotoDate (photoFilename, config) {
	if (photoFilename.substr(-4).toLowerCase() === '.jpg') {
		var p = exif.read(photoFilename)
        .then(data => {
			var date = data && data.image && data.image.ModifyDate;
            return date;
        });
        return p;
	} else if (photoFilename.substr(-4).toLowerCase() === '.mp4') {
		var mp4box = new mp4boxModule.MP4Box();
		var pM = new Promise(function(resolve, reject) {
			fs.readFile(photoFilename, (err, content) => {
				if (err) reject(err);
				var arrayBuffer = new Uint8Array(content).buffer;
				arrayBuffer.fileStart = 0;
				mp4box.onMoovStart = function () {
					//console.log('Starting to receive File Information');
				};
				mp4box.onReady = function info () {
					//console.log('Received File Information');
				};
				mp4box.onError = function (e) {
					//console.log('Received Error Message '+e);
				};
				mp4box.appendBuffer(arrayBuffer);
				var date = mp4box.getInfo().created;
				resolve(date);
			});
		});
		return pM;
	}
	// TODO récupére date du fichier si on ne peut rien faire d'autre
}

// function getPhotoDateSync (photoFilename, callback) {
//	 try {
//		 var result = exif.readSync(photoFilename);
//		 return result.image.ModifyDate;
//	 } catch (ex) {
//		 console.error('error reading EXIF of ' + photoFilename + ' ' + ex);
//		 return null;
//	 }
// }

exports.getData = getData;
exports.getPhotoDate = getPhotoDate;