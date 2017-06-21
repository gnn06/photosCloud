'use strict';

var service = require('../fileservice.js');
var fs = require('fs');
var assert = require('assert');

describe('fileservice', function() {
  describe('read', function () {
    it('sould returns array, only jpg, case insensitive', function () {
      var result = service.walk('E:/temp/dev/mochetest/test1', '');
      var expected = [
        { url : '/file1.jpg' },
        { url : '/file2.JPG' },
        { url : '/file4.mp4'}
      ];
      assert.deepEqual(result, expected);
    });

    it('should returns subfolder', function () {
      var result = service.walk('E:/temp/dev/mochetest/test2', '');
      var expected = [
        { url : '/parentfile.jpg'},
        { url : '/subfolder/subfile.jpg' }
      ];
      assert.deepEqual(result, expected);
    });

    it('should store result', function () {
      if (fs.existsSync('E:/temp/dev/mochetest/test2/folder.json')) {
          fs.unlinkSync('E:/temp/dev/mochetest/test2/folder.json');
      }
      if (fs.existsSync('E:/temp/dev/mochetest/test2/subfolder/folder.json')) {
          fs.unlinkSync('E:/temp/dev/mochetest/test2/subfolder/folder.json');
      }
      var result = service.walk('E:/temp/dev/mochetest/test2', '');
      var existPost = fs.existsSync('E:/temp/dev/mochetest/test2/folder.json');
      assert.ok(existPost, 'fichier non crée après appel');
	  var existPostSub = fs.existsSync('E:/temp/dev/mochetest/test2/subfolder/folder.json');
	  assert.ok(existPost, 'sous fichier non crée après appel');
    });

    it('should use stored data', function () {
      var folderExist = fs.existsSync('E:/temp/dev/mochetest/test3/folder.json');
      assert.ok(folderExist);
      var fileNotExist = fs.existsSync('E:/temp/dev/mochetest/test3/file.jpg');
      assert.ok(!fileNotExist);
      var result = [];
      result = service.walk('E:/temp/dev/mochetest/test3', '');
      assert.deepEqual(result, [{url:'file.jpg'}]);
    });
  })
})

// var result = service.walk('//RASPBERRYPI/PiPhotos/photos');
// console.log(result);
