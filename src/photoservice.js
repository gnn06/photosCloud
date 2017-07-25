'use strict';

const proc = require('child_process');

module.exports = {
	makeLarge     : makeLarge,
    makeThumbnail : makeThumbnail
};

function makeLarge (photoPath, config, cb) {
    console.log('create large of ', config.photoPath + photoPath);

    var argv = [];
    
    argv = argv.concat(['-size', '800x800']);
    argv = argv.concat(['-thumbnail', '800x800']);
    var inputfile  = (config.photoPath + photoPath).replace(/\//g,'\\');
    var outputfile = (config.largePath + photoPath).replace(/\//g,'\\');
    argv = argv.concat([inputfile]);
    argv = argv.concat([outputfile]);

    proc.execFile(config.conv_prog, argv, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            cb(-1);
        }
        cb(1);
    })
};

function makeThumbnail (photoPath, config, cb) {
    console.log('create thumbnail of ', config.photoPath + photoPath);
    var argv = [];
    
    argv = argv.concat(['-size', '100x100']);
    argv = argv.concat(['-thumbnail', '100x100^']);
    argv = argv.concat(['-gravity', 'center']);
    argv = argv.concat(['-extent', '100x100']);

    argv = argv.concat([config.photoPath + photoPath]);
    argv = argv.concat([config.thumbnailPath + photoPath]);

    proc.execFile(config.conv_prog, argv, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            cb(-1);
        }
        cb(1);
    })
};

function preparePhoto (photoPath, config, cb) {
    console.log('preparing photo ', config.photoPath + photoPath);
    var argv = [];
    
    argv = argv.concat(['-auto-orient']);

    argv = argv.concat([config.photoPath + photoPath]);
    argv = argv.concat([config.thumbnailPath + photoPath]);

    proc.execFile(config.conv_prog, argv, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            cb(-1);
        }
        cb(1);
    })
};
