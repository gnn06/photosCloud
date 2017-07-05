'use strict';

const proc = require('child_process');

module.exports = {
	makeLarge : makeLarge
};

const GM_PROGRAM = 'gm';

function makeLarge (photoPath, config, cb) {
    var argv = [];
    
    argv = argv.concat(['convert']);
    argv = argv.concat(['-scale', '1400']);
    argv = argv.concat([config.photoPath + photoPath]);
    argv = argv.concat([config.largePath + photoPath]);

    proc.execFile(GM_PROGRAM, argv, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            cb(-1);
        }
        console.log(stdout);
        cb(1);
    })
};
