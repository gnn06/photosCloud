#!/usr/bin/env nodejs
var express = require('express');
var bodyParser = require('body-parser');
var fileservice = require('./fileservice');
var dataService = require('./dataservice');
var thumbnail   = require('./thumbnailservice.js')
var fs = require('fs');
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
	var files = fileservice.walk(folder, { photoFolder : config.photoPath, dataFolder : config.dataPath});
	
	files.then(function(files){
		files.forEach(item => { item.url = '/thumbnail' + item.url; });
		res.json(files);
		var end = new Date().getTime();
		console.log('GET /thumbnails files found count', files.length, 
		', duration : ' + (end - start), ' ms');
	});
});

/* indispensable pour les vidéo */
app.get(config.photoUrl + '/*', function (req, res) {
	 console.log('get photo ' + req.url);
	 var photoPath = req.url.substr((config.photoUrl + '/').length)
	 res.sendFile(config.photoPath + '/' + photoPath)
})

app.get('/large/*', function (req, res) {
	console.log('get large of ' + req.url);
	var photoPath = req.url.substr(('/large/').length);
	res.sendFile(config.largePath + '/' + photoPath);
});

app.get('/thumbnail/*', function (req, res) {
	console.log('get thumbnail of ' + req.url);
	var photoPath = req.url.substr(('/thumbnail/').length);
	// console.log(photoPath)
	// console.log(folder)
	// console.log(photo)
	// console.log(config.photoPath + folder)
	// console.log(config.thumbnailPath + folder)
	// le module ne descend pas dans l'arbo.
	// TODO il faut créer les répertoires à l'avance

	thumbnail.makeThumbnail(photoPath, config, status => {
		if (status != -1) {
			var thumbnailPath = photoPath.replace('.jpg', '-100x100.jpg').replace('.JPG', '-100x100.JPG');;
			res.sendFile(config.thumbnailPath + thumbnailPath);
		} else {
			res.status(500).send('error');
		}
	});
	// res.sendFile('//RASPBERRYPI/PiPhotos/thumbnail/2016/DSCF2939-100x100.JPG');
});

app.use(express.static('src/app'));

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

exports.app = app;