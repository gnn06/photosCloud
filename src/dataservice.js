'use strict';

var exif = require('fast-exif');
var mp4boxModule = require('mp4box');
var fs = require('fs');

//var config = require('./config');
//console.log('service',config);

function getPhotoDate (photoFilename) {
	// console.log('getting data of ', photoFilename);
	if (photoFilename.substr(-4).toLowerCase() === '.jpg') {
		var p = exif.read(photoFilename)
        .then(data => {
			var date = data && data.image && data.image.ModifyDate;
            return date;
        }).catch(function(err){
			console.error('catch of getData', err);
			resolve(null);
		});
        return p;
	} else if (photoFilename.substr(-4).toLowerCase() === '.mp4') {
		var mp4box = new mp4boxModule.MP4Box();
		var pM = new Promise(function(resolve, reject) {
			fs.readFile(photoFilename, (err, content) => {
				if (err) reject(err);
				try {
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
				} catch (exception) {
					console.error('error reading mpeg date of ', photoFilename, exception);
					resolve(null);
				}
			});
		});
		return pM;
	}
	// TODO récupére date du fichier si on ne peut rien faire d'autre
}

exports.getPhotoDate = getPhotoDate;