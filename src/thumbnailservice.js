'use strict';

const proc = require('child_process');

const util  = require('./util');
const photo = require('./photoservice');

module.exports = {
    makeThumbnail: makeThumbnail,
    makeLarge:     makeLarge
};

function makeThumbnail (filename, config, cb) {
    var func;
    if (util.isJpeg(filename)) {
        func = makeThumbnailOfJpegV2;
    } else if (util.isMpeg(filename)) {
        func = makeThumbnailOfMpeg;
    }
    func(filename, config, cb);
};

function makeLarge (filename, config, cb) {
    var func;
    if (util.isJpeg(filename)) {
        func = makeLargeOfJpeg;
    } else if (util.isMpeg(filename)) {
        func = makeLargeOfMpeg;
    }
    func(filename, config, cb);
};

function makeThumbnailOfJpegV2 (photoPath, config, cb) {
    var folder = photoPath.substring(0,photoPath.lastIndexOf('/'));
	var filename = photoPath.substr(photoPath.lastIndexOf('/') + 1);
    photo.makeThumbnail(photoPath, config, cb);
};

function makeLargeOfJpeg (photoPath, config, cb) {
    var folder = photoPath.substring(0,photoPath.lastIndexOf('/'));
	var filename = photoPath.substr(photoPath.lastIndexOf('/') + 1);
    photo.makeLarge(photoPath, config, cb);
};



function makeThumbnailOfMpeg (filename, config, cb) {
    _makePhotoOfMpeg(filename, 'thumbnail', config, cb);
}

function makeLargeOfMpeg (filename, config, cb) {
    _makePhotoOfMpeg(filename, 'large', config, cb);
}
function _makePhotoOfMpeg (filename, size, config, cb) {
    // avconv -i input.mp4 -f image2 -ss 0 -vframes 1 output.jpg
    // console.log('_makePhotoOfMpeg', filename, size);

    var outputPath =  size == 'large' ? config.largePath : config.thumbnailPath;
    var fileoutput = util.getThumbnailPath(filename);
    var realSize   = size == 'large' ? '800x800' : '100x100';
    // console.log(outputPath, fileoutput, realSize);

    var argv = [];
    argv = argv.concat(['-i', config.photoPath + filename]);
    argv = argv.concat(['-y']); // override output if exists
    argv = argv.concat(['-ss', '0']);
    argv = argv.concat(['-vframes', '1']);
    argv = argv.concat(['-s', realSize]);
    argv = argv.concat([outputPath + fileoutput]);
    // console.log(argv);

    // TODO la thumbnail est déformée par le 100x100.

    proc.execFile(config.video_prog, argv, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            cb(-1);
        }
        console.log(stdout);
        cb(1);
    })
};
