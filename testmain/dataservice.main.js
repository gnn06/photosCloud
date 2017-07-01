'use strict';

var service = require('../src/dataservice.js');
const config  = require('../src/config.js');
console.log(config);

var result = [];

service.getPhotoDate(config.photoPath + '2017/oxford/DSCF3612.mp4')
.then(function (date) {
	console.log('DSCF3456 ', date);
	console.log(date.toLocaleString());
}, function (err) {
	console.error(err);
});

// service.getPhotoDate(config.photoPath + '2017/IMG_20170625_210202.jpg')
// .then(function (date) {
// 	console.log('IMG_20170625_210202 ', date);
// 	console.log(date.toLocaleString());
// }, function (err) {
// 	console.error(err);
// });

// service.getPhotoDate(config.photoPath + '2017/VID_20170625_210349.mp4')
// .then(function (date) {
// 	console.log('DSCF3440 ', date);
// }, function (err) {
// 	console.error(err);
// });