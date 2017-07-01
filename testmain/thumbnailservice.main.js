'use strict';

const Thumbnail = require('thumbnail');

makeThumbnailScale('file1.jpg',
        {
            photoPath : 'E:/temp/dev/mochetest/test1/photo/',
            thumbnailPath : 'E:/temp/dev/mochetest/test1/thumbnail/'
        },
        exitcode => {
            console.log(exitcode);
        });

// var thumbnail = new Thumbnail('E:/temp/dev/mochetest/thumbnail', 'E:/temp/dev/mochetest/thumbnail/dest');
// thumbnail.ensureThumbnail('testhuawei.jpg', 100, 100, function (err, filename) {
// 	// 'filename' is the name of the thumb in '/path/to/thumbnails'
// 	if (err) {
// 		console.error(err);
// 	}
// });

// thumbnail.ensureThumbnail('test2huawei.jpg', 100, 100, function (err, filename) {
// 	// 'filename' is the name of the thumb in '/path/to/thumbnails'
// 	if (err) {
// 		console.error(err);
// 	}
// });

// thumbnail.ensureThumbnail('test0001fuji.jpg', 100, 100, function (err, filename) {
// 	// 'filename' is the name of the thumb in '/path/to/thumbnails'
// 	if (err) {
// 		console.error(err);
// 	}
// });

// thumbnail.ensureThumbnail('test0002fuji.jpg', 100, 100, function (err, filename) {
// 	// 'filename' is the name of the thumb in '/path/to/thumbnails'
// 	if (err) {
// 		console.error(err);
// 	}
// });

// thumbnail.ensureThumbnail('DSCF3639.JPG', 100, 100, function (err, filename) {
// 	// 'filename' is the name of the thumb in '/path/to/thumbnails'
// 	if (err) {
// 		console.error(err);
// 	}
// });