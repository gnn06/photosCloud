'use strict';

var service = require('../fileservice.js');
const config  = require('../config.js');
console.log(config);

var result = [];

result = service.walk('',
{ photoFolder : config.photosPath,
	dataFolder :  config.dataPath
});
result.then(function(result){
	console.log(result);
});

// result = service.walk('2016',
// 	{ photoFolder : config.photosPath,
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