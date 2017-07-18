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
	photoPath     : "c:/temp/dev/photos/original/",
	largePath     : "c:/temp/dev/photos/large/",
	thumbnailPath : "c:/temp/dev/photos/thumbnail/",
	dataPath      : "c:/temp/dev/photos/data/",
	conv_prog     : "convert",
	video_prog    : 'ffmpeg',
	port          : 8190
};

module.exports = {
	FOLDER_TEST        : 'e:/temp/dev/mochtest/',
	deleteFile         : deleteFile,
	createJpeg         : createJpeg,
	createJpegPortrait : createJpegPortrait,
	createMpeg         : createMpeg,
    createMpeg2        : createMpeg2,
	createTxt          : createTxt,
	mkdirp             : fsE.mkdirpSync,
	config             : config

};
