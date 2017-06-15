#!/usr/bin/env nodejs
var express = require('express');
var klaw = require('klaw')
var Thumbnail = require('thumbnail');
var exif = require('fast-exif');
var mp4boxModule = require('mp4box');
var fs = require('fs');
// var ExifImage = require('exif').ExifImage;

var config = require('./config')
console.log(config)

var app = express();
var mp4box = new mp4boxModule.MP4Box();

config.photosUrl = "/thumbnails";
config.photoUrl = "/photo";
config.thumbnailUrl = "/thumbnail";

function getPhotoDate (photoFilename, promises, callback) {
  if (photoFilename.substr(-4).toLowerCase() === ".jpg") {
	  var p = exif.read(photoFilename);
	  p.then(function(data){
		  callback(data.image.ModifyDate);
	   })
	   .catch(function(data){
		   console.error(photoFilename, data);
	       callback(null)
	   });
	  promises.push(p);
  } else if (photoFilename.substr(-4).toLowerCase() === ".mp4") {
	  var mp4box = new mp4boxModule.MP4Box();
	  var pM = new Promise(function(resolve, reject) {
		  fs.readFile(photoFilename, (err, content) => {
			  console.log(typeof content)
			  if (err) reject(err);
			  var arrayBuffer = new Uint8Array(content).buffer;
			  arrayBuffer.fileStart = 0;
			  mp4box.onMoovStart = function () {
					console.log("Starting to receive File Information");
			  }
			  mp4box.onReady = function info () {
				  console.log("Received File Information");
			  };
				mp4box.onError = function (e) {
					console.log("Received Error Message "+e);
				};
			  mp4box.appendBuffer(arrayBuffer);
			  var date = mp4box.getInfo().created;
			  resolve(date);
		  });	  
	  })
	  pM.then(function(box){
		  var date = mp4box.getInfo().created;
		  callback(date);
	    })
	    .catch(function(err){
		   console.error(photoFilename, err);
	       callback(null)
	     });;
	  promises.push(pM);
  }
  // TODO récupére date du fichier si on ne peut rien faire d'autre
}

function getPhotoDateSync (photoFilename, callback) {
  try {
    var result = exif.readSync(photoFilename);
    return result.image.ModifyDate;
  } catch (ex) {
    console.error('error reading EXIF of ' + photoFilename + ' ' + ex);
    return null;
  }
}

app.get(config.photosUrl + '*', function (req, res) {
  console.log("get photos of folder " + req.url);
  var start = new Date().getTime();	
  //console.log(firstPartUrl)
  var firstPartUrl = req.protocol + '://' + req.get('host')
  var folder = req.url.substring(config.photosUrl.length);
  var items = [] // files, directories, symlinks, etc
  var promises = new Array();
  klaw(config.photosPath + folder)
  .on('data', function (item) {
    // item.path = ''\\\\RASPBERRYPI\\PiPhotos\\photos\\2016\\DSCF2749.JPG'
    var filename = item.path.substring(config.photosPath.length);
    // filename = '2016\\DSCF2749.JPG'
    if (!item.stats.isDirectory()) {
      var date = getPhotoDate(item.path, promises, function(date){
		  var obj = {}
		  obj.url = firstPartUrl + config.thumbnailUrl + '/' + filename.replace(/\\/g,'/');
		  obj.date = date;
		  // console.log(item.path + "," + date);
		  items.push(obj)
	  });
    }
  })
  .on('end', function () {
	Promise.all(promises).then(function () {
		res.header("Access-Control-Allow-Origin", "*");
		items = items.sort(function(a, b) {
		  if (a.date > b.date) {
			return -1;
		  } else if (a.date < b.date) {
			return 1;
		  } else {
			return 0;
		  }
		})
		res.json(items);
		var end = new Date().getTime();
		console.log("GET /thumbnails duration : " + (end - start));
	})
  })
});

app.get(config.photoUrl + '/*', function (req, res) {
  console.log("get photo " + req.url);
  var photoPath = req.url.substr((config.photoUrl + '/').length)
  res.sendFile(config.photosPath + '/' + photoPath)
})

app.get('/large/*', function (req, res) {
	console.log("get large of " + req.url)
	var photoPath = req.url.substr(('/large/').length)
	res.sendFile(config.largePath + '/' + photoPath)
})

app.get('/thumbnail/*', function (req, res) {
	console.log("get thumbnail of " + req.url)
	var photoPath = req.url.substr(('/thumbnail/').length)
	// console.log(photoPath)
	var folder = photoPath.substring(0,photoPath.lastIndexOf('/'))
	var photo = photoPath.substr(photoPath.lastIndexOf('/') + 1)
	// console.log(folder)
	// console.log(photo)
	// console.log(config.photosPath + folder)
	// console.log(config.thumbnailsPath + folder)
	// le module ne descend pas dans l'arbo.
	// il faut créer les répertoires à l'avance
	var thumbnail = new Thumbnail(config.photosPath + folder, config.thumbnailsPath + folder);
	// thumbnail.ensureThumbnail(photo, null, 100, function (err, filename) {
	// "filename" is the name of the thumb in '/path/to/thumbnails'
	// console.log(err, filename)
    var filename = photo
	res.sendFile(config.thumbnailsPath + folder + '/' + filename)
	// });
})

app.use(express.static('app'));

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

app.get('/data/*', function(req, res) {
	console.log("get data of " + req.url);
	var photoPath = req.url.substr(('/data/').length); // folder/image.jpg
	console.log(photoPath);
	fs.readFile(config.dataPath + photoPath + '.json', 'utf-8', (err, content) => {
		if (err) throw err;
		console.log(content)
		res.json(content)
	})
})