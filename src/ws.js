#!/usr/bin/env nodejs
var express     = require('express');
var bodyParser  = require('body-parser');
var fs          = require('fs');

var   fileservice  = require('./fileservice');
var   dataService  = require('./dataservice');
var   photoService = require('./photoservice');
var   thumbnail    = require('./thumbnailservice.js')
const dispatcher   = require('./dispatcher');
var   chemin       = require('./chemin');
const util         = require('./util');

var config = require('./config');
console.log(config);

var app = express();
var jsonParser = bodyParser.json();
// var mp4box = new mp4boxModule.MP4Box();

config.photosUrl = '/thumbnails';
config.photoUrl = '/photo';
config.thumbnailUrl = '/thumbnail';

app.use(express.static('./src/app'));

app.listen(config.port, function () {
	console.log('Example app listening on port ', config.port);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
		files.forEach(item => { item.url = '/thumbnail' + encodeURI(item.url); });
		res.json(files);
		var end = new Date().getTime();
		console.log('GET /thumbnails files found count', files.length, 
		', duration : ' + (end - start), ' ms');
	});
});

function _sendPhoto (req, res, config, photoVersion) {
	var photoPath = decodeURI(req.url).replace(/^\/[^/]+\//, '');
	// angular call /large/ !
	if (photoPath == '') {
		return;
	}
	var toSendPath, toSendPhotoName, func;
	switch (photoVersion) {
		case 'large':
			func = thumbnail.makeLarge;
			toSendPath = config.largePath;
			if (util.isMpeg(photoPath)) {
				toSendPhotoName = util.getThumbnailPath(photoPath);
			} else {
				toSendPhotoName = photoPath;
			}
			break;
		case 'thumbnail':
			func = thumbnail.makeThumbnail;
			toSendPath = config.thumbnailPath;
			if (util.isMpeg(photoPath)) {
				toSendPhotoName = util.getThumbnailPath(photoPath);
			} else {
				toSendPhotoName = photoPath;
			}
			break;
		case 'original':
			toSendPath = config.photoPath;
			toSendPhotoName = photoPath;
			break;
		default :
			console.error('version photo to returns unknownw', photoVersion);
			return;
	}				  
	res.sendFile(toSendPath + toSendPhotoName, err => {
		if (func && err && err.code == 'ENOENT') {
			func(photoPath, config, result => {
				if (result == 1) {
					res.sendFile(toSendPath + toSendPhotoName);
				}
			});
		}
	});
}

app.get('/large/*', function (req, res) {
	console.log('get large of ' + req.url);
	_sendPhoto(req, res, config, 'large');
});

app.get('/thumbnail/*', function (req, res) {
	console.log('GET /thumbnail of ' + req.url);
	_sendPhoto(req, res, config, 'thumbnail');
});

/* indispensable pour les vidéo */
app.get('/photo/*', function (req, res) {
	 console.log('get /photo of ' + req.url);
	_sendPhoto(req, res, config, 'original');
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

app.delete('/photo/*', function (req, res)  {
	var photoPath = decodeURI(req.url).replace(/^\/[^/]+\//, ''); // folder/file.jpg
	console.log('DELETE ', photoPath);
	dispatcher.trashPhoto(photoPath, config);
	// file.delete(large)
	// file.delete(thumbnail)
	// file.delete(data)
	res.send('ok');
});

exports.app        = app;
exports._sendPhoto = _sendPhoto;

