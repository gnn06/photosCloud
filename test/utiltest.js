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

var config = {
	photoPath     : "e:/temp/dev/mochtest/photos/original/",
	largePath     : "e:/temp/dev/mochtest/photos/large/",
	thumbnailPath : "e:/temp/dev/mochtest/photos/thumbnail/",
	dataPath      : "e:/temp/dev/mochtest/photos/data/",
	conv_prog     : "convert",
	video_prog    : 'ffmpeg',
	port          : 8190
};

module.exports = {
	FOLDER_TEST                  : 'e:/temp/dev/mochtest/',
	deleteFile                   : deleteFile,
	createJpeg                   : createJpeg,
	createJpegPortrait           : createJpegPortrait,
	createJpegThumbnailPortrait  : createJpegThumbnailPortrait,
	createJpegThumbnailLandscape : createJpegThumbnailLandscape,
	createMpeg                   :  createMpeg,
    createMpeg2                  : createMpeg2,
	createTxt                    : createTxt,
	mkdirp                       : fsE.mkdirpSync,
	config                       : config

};
