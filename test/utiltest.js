var fs = require('fs');
var fsE = require('fs-extra');
const path = require('path');

function deleteFile (filename) {
	if (fs.existsSync(filename)) {
		fs.unlinkSync(filename);
	}
}

function createJpeg (filename) {
	_copy('./test/media/landscape.jpg', filename);
}

function createJpegPortrait (filename) {
	_copy('./test/media/portrait.jpg', filename);
}

function createJpegThumbnailPortrait (filename) {
	_copy('./test/media/portrait.thumbnail.jpg', filename);
}

function createJpegThumbnailLandscape (filename) {
	_copy('./test/media/landscape.thumbnail.jpg', filename);
}

function createMpeg (filename) {
	_copy('./test/media/video.mp4', filename);
}

function createMpeg2 (filename) {
        _copy('./test/media/video-smartphone.mp4', filename);
}

function _copy (source, dest) {
	if (!fs.existsSync(dest)) {
		fsE.mkdirpSync(path.dirname(dest));
		fsE.copySync(source, dest);
	}
}

function createTxt (filename, content) {
	var fd = fs.openSync(filename, 'w');
	fs.writeSync(fd, content);
	fs.closeSync(fd);
}

function createJSON (filename, content) {
	var fd = fs.openSync(filename, 'w');
	var contentS = JSON.stringify(content);
	fs.writeSync(fd, contentS);
	fs.closeSync(fd);
}

const ROOT_FOLDER_TEST = 'c:/temp/dev/mochtest/';

var config = {
	photoPath     : ROOT_FOLDER_TEST + "photos/original/",
	largePath     : ROOT_FOLDER_TEST + "photos/large/",
	thumbnailPath : ROOT_FOLDER_TEST + "photos/thumbnail/",
	dataPath      : ROOT_FOLDER_TEST + "photos/data/",
	conv_prog     : "convert",
	video_prog    : 'ffmpeg',
	port          : 8090
};

module.exports = {
	ROOT_FOLDER_TEST                  : ROOT_FOLDER_TEST,
	ROOT_FOLDER_TEST             : ROOT_FOLDER_TEST,
	deleteFile                   : deleteFile,
	createJpeg                   : createJpeg,
	createJpegPortrait           : createJpegPortrait,
	createJpegThumbnailPortrait  : createJpegThumbnailPortrait,
	createJpegThumbnailLandscape : createJpegThumbnailLandscape,
	createMpeg                   :  createMpeg,
    createMpeg2                  : createMpeg2,
	createTxt                    : createTxt,
	createJSON                   : createJSON,
	mkdirp                       : fsE.mkdirpSync,
	emptydir                     : fsE.emptyDirSync,
	config                       : config

};
