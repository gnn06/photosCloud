#!/usr/bin/env nodejs
var express     = require('express');
var bodyParser  = require('body-parser');
var fs          = require('fs');

var fileservice  = require('./fileservice');
var dataService  = require('./dataservice');
var photoService = require('./photoservice');
var thumbnail    = require('./thumbnailservice.js')
var chemin       = require('./chemin');

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
	folder = chemin.urlToFolder(folder);
	console.log('GET /thumbnails of folder ', config.photoPath + folder);
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
	var photoPath = decodeURI(req.url).substr(('/large/').length);
	res.sendFile(config.largePath + photoPath, err => {
		if (err && err.code == 'ENOENT') {
			photoService.makeLarge(photoPath, config, result => {
				if (result == 1) {
					res.sendFile(config.largePath + photoPath);
				}
			});
		}
	});
});

app.get('/thumbnail/*', function (req, res) {
	console.log('GET /thumbnail of ' + req.url);
	var photoPath = decodeURI(req.url.substr(('/thumbnail/').length));
	// console.log(photoPath)
	// console.log(folder)
	// console.log(photo)
	// console.log(config.photoPath + folder)
	// console.log(config.thumbnailPath + folder)
	// le module ne descend pas dans l'arbo.
	// TODO il faut créer les répertoires à l'avance

	thumbnail.makeThumbnail(photoPath, config, status => {
		if (status != -1) {
			var thumbnailPath = photoPath;
			res.sendFile(config.thumbnailPath + thumbnailPath);
		} else {
			res.status(500).send('error');
		}
	});
});

app.use(express.static('src/app'));

app.listen(config.port, function () {
	console.log('Example app listening on port ', config.port);
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