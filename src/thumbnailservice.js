'use strict';

const proc = require('child_process');
const Thumbnail = require('thumbnail');

const VIDEO_PROG = 'avconv';

const util  = require('./util');
const photo = require('./photoservice');

module.exports = {
	makeThumbnail: makeThumbnail
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

function makeThumbnailOfJpeg (photoPath, config, cb) {
    var folder = photoPath.substring(0,photoPath.lastIndexOf('/'));
	var filename = photoPath.substr(photoPath.lastIndexOf('/') + 1);
    var thumbnail = new Thumbnail(config.photoPath + folder, config.thumbnailPath + folder);
    thumbnail.ensureThumbnail(filename, 100, 100, function (err, thumbnailPath) {
        if (err) {
            console.trace('makeThumbnailOfJpeg ', err);
            cb(-1);
        } else {
            cb(1);
        }
    });
};

function makeThumbnailOfJpegV2 (photoPath, config, cb) {
    var folder = photoPath.substring(0,photoPath.lastIndexOf('/'));
	var filename = photoPath.substr(photoPath.lastIndexOf('/') + 1);
    photo.makeThumbnail(photoPath, config, cb);
};

function makeThumbnailOfMpeg (filename, config, cb) {
    // avconv -i input.mp4 -f image2 -ss 0 -vframes 1 output.jpg
    // 

    var fileoutput = filename.replace('.mp4', '.jpg');

    var argv = [];
    argv = argv.concat(['-i', config.photoPath + filename]);
    argv = argv.concat(['-y']); // override output if exists
    argv = argv.concat(['-ss', '0']);
    argv = argv.concat(['-vframes', '1']);
    argv = argv.concat(['-s', '100x100']);
    argv = argv.concat([config.thumbnailPath + fileoutput]);

    // console.log(argv);

    // TODO la thumbnail est déformée par le 100x100.

    proc.execFile(VIDEO_PROG, argv, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            cb(-1);
        }
        console.log(stdout);
        cb(1);
    })
};
