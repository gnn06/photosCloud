'use strict';

var service = require('../fileservice.js');
var fs = require('fs');
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);

var assert = chai.assert;
var expect = chai.expect;
var file = chaiFiles.file;
var dir = chaiFiles.dir;

function deleteFile (filename) {
	if (fs.existsSync(filename)) {
			fs.unlinkSync(filename);
	}
}

describe('fileservice', function() {
  describe('read', function () {
    it('should returns array, only jpg, case insensitive, store into <data> Folder', function () {
			deleteFile('E:/temp/dev/mochetest/test1/data/folder.json');
			deleteFile('E:/temp/dev/mochetest/test1/photo/folder.json');
      var result = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test1/photo', dataFolder : 'E:/temp/dev/mochetest/test1/data' });
      var expected = [
        { url : 'file1.jpg' },
        { url : 'file2.JPG' },
        { url : 'file4.mp4'}
      ];
      assert.deepEqual(result, expected);
			expect(file('E:/temp/dev/mochetest/test1/photo/folder.json')).to.not.exist;
			expect(file('E:/temp/dev/mochetest/test1/data/folder.json')).to.exist;
    });

    it('should returns subfolder', function () {
			delete('E:/temp/dev/mochetest/test2/folder.json');
			delete('E:/temp/dev/mochetest/test2/subfolder/folder.json');
      var result = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test2', dataFolder : 'E:/temp/dev/mochetest/test2' });
      var expected = [
        { url : 'parentfile.jpg'},
        { url : 'subfolder/subfile.jpg' }
      ];
      assert.deepEqual(result, expected);
    });

    it('should store result in current and also in subfolder, level by level', function () {
      if (fs.existsSync('E:/temp/dev/mochetest/test2/folder.json')) {
          fs.unlinkSync('E:/temp/dev/mochetest/test2/folder.json');
      }
      if (fs.existsSync('E:/temp/dev/mochetest/test2/subfolder/folder.json')) {
          fs.unlinkSync('E:/temp/dev/mochetest/test2/subfolder/folder.json');
      }

      var result = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test2', dataFolder : 'E:/temp/dev/mochetest/test2' });

      var existPost = fs.existsSync('E:/temp/dev/mochetest/test2/folder.json');
      assert.ok(existPost, 'fichier non crée après appel');
			var existPostSub = fs.existsSync('E:/temp/dev/mochetest/test2/subfolder/folder.json');
  	  assert.ok(existPost, 'sous fichier non crée après appel');
      expect(file('E:/temp/dev/mochetest/test2/folder.json')).to.contain('parentfile');
      expect(file('E:/temp/dev/mochetest/test2/folder.json')).to.not.contain('subfile');
  	  expect(file('E:/temp/dev/mochetest/test2/subfolder/folder.json')).to.not.contain('parentfile');

			expect(file('E:/temp/dev/mochetest/test2/subfolder/folder.json')).to.contain('subfile');
    });

    it('should use stored data', function () {
      var folderExist = fs.existsSync('E:/temp/dev/mochetest/test3/folder.json');
      assert.ok(folderExist);
      var fileNotExist = fs.existsSync('E:/temp/dev/mochetest/test3/file.jpg');
      assert.ok(!fileNotExist);
      var result = [];
      result = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test3', dataFolder : 'E:/temp/dev/mochetest/test3' });
      assert.deepEqual(result, [{url:'file.jpg'}]);
    });

		it('should not store absolute url', function () {
			expect(file('E:/temp/dev/mochetest/test2/folder.json')).to.not.contain('E:');
			expect(file('E:/temp/dev/mochetest/test2/folder.json')).to.not.contain('test2');
			expect(file('E:/temp/dev/mochetest/test2/subfolder/folder.json')).to.not.contain('subfolder');
		});
  })
})

// var result = service.walk('//RASPBERRYPI/PiPhotos/photos');
// console.log(result);
