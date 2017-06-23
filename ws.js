#!/usr/bin/env nodejs
var express = require('express');
var fileservice = require('./fileservice');
// var Thumbnail = require('thumbnail');
var exif = require('fast-exif');
var mp4boxModule = require('mp4box');
var fs = require('fs');
var bodyParser = require('body-parser');
// var ExifImage = require('exif').ExifImage;

var config = require('./config');
console.log(config);

var app = express();
var jsonParser = bodyParser.json();
// var mp4box = new mp4boxModule.MP4Box();

config.photosUrl = '/thumbnails';
config.photoUrl = '/photo';
config.thumbnailUrl = '/thumbnail';

function getPhotoDate (photoFilename, promises, callback) {
	if (photoFilename.substr(-4).toLowerCase() === '.jpg') {
		var p = exif.read(photoFilename);
		p.then(function(data){
			var date = data && data.image && data.image.ModifyDate;
			callback(date);
		})
			.catch(function(data){
				console.error(photoFilename, data);
				callback(null);
			});
		promises.push(p);
	} else if (photoFilename.substr(-4).toLowerCase() === '.mp4') {
		var mp4box = new mp4boxModule.MP4Box();
		var pM = new Promise(function(resolve, reject) {
			fs.readFile(photoFilename, (err, content) => {
				console.log('read : ' + content.length);
				if (err) reject(err);
				var arrayBuffer = new Uint8Array(content).buffer;
				arrayBuffer.fileStart = 0;
				mp4box.onMoovStart = function () {
					console.log('Starting to receive File Information');
				};
				mp4box.onReady = function info () {
					console.log('Received File Information');
				};
				mp4box.onError = function (e) {
					console.log('Received Error Message '+e);
				};
				mp4box.appendBuffer(arrayBuffer);
				var date = mp4box.getInfo().created;
				resolve(date);
			});
		});
		pM.then(function(){
			var date = mp4box.getInfo().created;
			callback(date);
		})
			.catch(function(err){
				console.error(photoFilename, err);
				callback(null);
			});
		promises.push(pM);
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

app.get('/thumbnails*', function (req, res) {
	console.log('get photos of folder ' + req.url);
	var start = new Date().getTime();

	// var firstPartUrl = req.protocol + '://' + req.get('host')
	//console.log(firstPartUrl)
	var folder = req.url.substring('/thumbnails'.length);
	if (folder[0] == '/') {
		folder = folder.substring(1);
	}
	console.log('folder=', folder);
	var files = fileservice.walk(folder, { photoFolder : config.photosPath, dataFolder : config.dataPath});
	res.json(files);

	var end = new Date().getTime();
	console.log('GET /thumbnails duration : ' + (end - start));
});

// app.get(config.photoUrl + '/*', function (req, res) {
//	 console.log('get photo ' + req.url);
//	 var photoPath = req.url.substr((config.photoUrl + '/').length)
//	 res.sendFile(config.photosPath + '/' + photoPath)
// })

app.get('/large/*', function (req, res) {
	console.log('get large of ' + req.url);
	var photoPath = req.url.substr(('/large/').length);
	res.sendFile(config.largePath + '/' + photoPath);
});

app.get('/thumbnail/*', function (req, res) {
	console.log('get thumbnail of ' + req.url);
	var photoPath = req.url.substr(('/thumbnail/').length);
	// console.log(photoPath)
	var folder = photoPath.substring(0,photoPath.lastIndexOf('/'));
	var photo = photoPath.substr(photoPath.lastIndexOf('/') + 1);
	// console.log(folder)
	// console.log(photo)
	// console.log(config.photosPath + folder)
	// console.log(config.thumbnailsPath + folder)
	// le module ne descend pas dans l'arbo.
	// il faut créer les répertoires à l'avance
	// var thumbnail = new Thumbnail(config.photosPath + folder, config.thumbnailsPath + folder);
	// thumbnail.ensureThumbnail(photo, null, 100, function (err, filename) {
	// 'filename' is the name of the thumb in '/path/to/thumbnails'
	// console.log(err, filename)
	var filename = photo;
	res.sendFile(config.thumbnailsPath + folder + '/' + filename);
	// });
});

app.use(express.static('app'));

app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
});

app.get('/data/*', function(req, res) {
	console.log('get data of ' + req.url);
	var photoPath = req.url.substr(('/data/').length); // folder/image.jpg
	//console.log(photoPath);
	fs.readFile(config.dataPath + photoPath + '.json', 'utf-8', (err, content) => {
		if (err) {
			res.json({star:''});
		} else {
			var object = JSON.parse(content);
			res.json(object);
		}
	});
});

app.post('/data/*', jsonParser, function(req, res) {
	console.log('post data of ' + req.url);
	var photoPath = req.url.substr(('/data/').length); // folder/image.jpg
	console.log(photoPath);
	console.log(req.body);
	var content = JSON.stringify(req.body, null, 2);
	fs.writeFile(config.dataPath + photoPath + '.json', content, 'utf-8', (err) => {
		if (err) throw err;
		console.log('write ok');
		res.send('ok');
	});
});
