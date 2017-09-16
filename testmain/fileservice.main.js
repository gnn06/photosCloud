'use strict';

var service = require('../src/fileservice.js');
const config  = require('../src/config.js');

const ROOT_FOLDER = '//RASPBERRYPI/pi/dev/photosCloud/real_sample/';
// const ROOT_FOLDER = '//RASPBERRYPI/home/pi/dev/photosCloud/real_sample/';

// à terminer par un slash
config.photoPath     = ROOT_FOLDER + "original/";
config.largePath     = ROOT_FOLDER + "large/";
config.thumbnailPath = ROOT_FOLDER + "thumbnail/";
config.dataPath      = ROOT_FOLDER + "data/";
config.trashPath     = ROOT_FOLDER + "corbeille/";
console.log(config);

var result = [];

result = service.walk('',
{
	photoFolder : config.photoPath,
	dataFolder :  config.dataPath
});
result.then(function(result){
	console.log(result);
});

// result = service.walk('2016',
// 	{ photoFolder : config.photoPath,
// 		dataFolder :  config.dataPath
// 	});
// result.then(function(result){
// 	console.log(result);
// });

// result = service.walk('',
// 	{ photoFolder : 'E:/temp/dev/mochetest/test1/photo/',
// 		dataFolder : 'E:/temp/dev/mochetest/test1/data/'
// 	});

// result = service.walk('',
// 	{ photoFolder : 'E:/temp/dev/mochetest/test2/',
// 		dataFolder : 'E:/temp/dev/mochetest/test2/'
// 	});

// result.then(function (result) {
// 	console.log(result);
// });