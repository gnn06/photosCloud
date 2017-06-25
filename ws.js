#!/usr/bin/env nodejs
var express = require('express');
var bodyParser = require('body-parser');
var fileservice = require('./fileservice');
var dataService = require('./dataservice');
var fs = require('fs');
// var Thumbnail = require('thumbnail');
// var ExifImage = require('exif').ExifImage;

var config = require('./config');
console.log(config);

var app = express();
var jsonParser = bodyParser.json();
// var mp4box = new mp4boxModule.MP4Box();

config.photosUrl = '/thumbnails';
config.photoUrl = '/photo';
config.thumbnailUrl = '/thumbnail';

app.get('/thumbnails*', function (req, res) {
	var start = new Date().getTime();

	// var firstPartUrl = req.protocol + '://' + req.get('host')
	//console.log(firstPartUrl)
	var folder = req.url.substring('/thumbnails'.length);
	if (folder[0] == '/') {
		folder = folder.substring(1);
	}
	console.log('GET /thumbnails of folder ' + folder);
	var files = fileservice.walk(folder, { photoFolder : config.photosPath, dataFolder : config.dataPath});
	Promise.all(dataService.getData(files)).then(res.json(files));

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
