'use strict';

var proxyquire = require('proxyquire');

var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);

var assert = chai.assert;
var expect = chai.expect;
var file = chaiFiles.file;
//var dir = chaiFiles.dir;

var service = require('../src/fileservice.js');
var fs = require('fs');

function deleteFile (filename) {
	if (fs.existsSync(filename)) {
		fs.unlinkSync(filename);
	}
}


describe('fileservice', function() {

	it('should returns array, only jpg, case insensitive, store into <data> Folder', function () {
		deleteFile('E:/temp/dev/mochetest/test1/data/folder.json');
		deleteFile('E:/temp/dev/mochetest/test1/photo/folder.json');
    var result = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test1/photo/', dataFolder : 'E:/temp/dev/mochetest/test1/data/' });
    return result.then(function(result) {
      expect(result[0].url).eq('/file1.jpg');
      expect(result[1].url).eq('/file2.JPG');
      expect(result[2].url).eq('/file4.mp4');
    });
  });

  it('should returns data', function () {
    var result = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test1/photo/', dataFolder : 'E:/temp/dev/mochetest/test1/data/' });
    return result.then(function(data) {
      expect(data[0].date).to.be.not.empty;
      expect(data[1].date).to.be.not.empty;
    });
  });

  it('should returns subfolder', function () {
		delete('E:/temp/dev/mochetest/test2/folder.json');
		delete('E:/temp/dev/mochetest/test2/subfolder/folder.json');
    var p = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test2/', dataFolder : 'E:/temp/dev/mochetest/test2/' });
    return p.then(function(result) {
      expect(result[0].url).eq('/parentfile.jpg');
      expect(result[1].url).eq('/subfolder/subfile.jpg');
    });
  });

	it('should returns full url even when called on subfolder', function () {
		delete('E:/temp/dev/mochetest/test2/folder.json');
		delete('E:/temp/dev/mochetest/test2/subfolder/folder.json');
    var promise = service.walk('subfolder', { photoFolder : 'E:/temp/dev/mochetest/test2/', dataFolder : 'E:/temp/dev/mochetest/test2/' });
    return promise.then(function(result){
      assert.deepEqual(result[0].url,  '/subfolder/subfile.jpg');
    });
  });


	it('should store result in current and also in subfolder, level by level', function () {
    if (fs.existsSync('E:/temp/dev/mochetest/test2/folder.json')) {
        fs.unlinkSync('E:/temp/dev/mochetest/test2/folder.json');
    }
    if (fs.existsSync('E:/temp/dev/mochetest/test2/subfolder/folder.json')) {
        fs.unlinkSync('E:/temp/dev/mochetest/test2/subfolder/folder.json');
    }
    var promise = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test2/', dataFolder : 'E:/temp/dev/mochetest/test2/' });
    return promise.then(function(result){
      var existPost = fs.existsSync('E:/temp/dev/mochetest/test2/folder.json');
      assert.ok(existPost, 'fichier non crée après appel');
      var existPostSub = fs.existsSync('E:/temp/dev/mochetest/test2/subfolder/folder.json');
      assert.ok(existPost, 'sous fichier non crée après appel');
      expect(file('E:/temp/dev/mochetest/test2/folder.json')).to.contain('parentfile');
      expect(file('E:/temp/dev/mochetest/test2/folder.json')).to.not.contain('subfile');
      expect(file('E:/temp/dev/mochetest/test2/subfolder/folder.json')).to.not.contain('parentfile');
      expect(file('E:/temp/dev/mochetest/test2/subfolder/folder.json')).to.contain('subfile');
    });
  });

  it('should use stored data', function () {
    var folderExist = fs.existsSync('E:/temp/dev/mochetest/test3/folder.json');
    assert.ok(folderExist);
    var fileNotExist = fs.existsSync('E:/temp/dev/mochetest/test3/file.jpg');
    assert.ok(!fileNotExist);
    var promise = service.walk('', { photoFolder : 'E:/temp/dev/mochetest/test3/', dataFolder : 'E:/temp/dev/mochetest/test3/' });
    return promise.then(function(result){
      assert.deepEqual(result[0].url, '/file.jpg');
    });
  });

	// usefull to the GET /thumbnails sinon le client doit rajouter le folder
	it('should not store absolute url', function () {
		expect(file('E:/temp/dev/mochetest/test2/folder.json')).to.not.contain('E:');
		expect(file('E:/temp/dev/mochetest/test2/folder.json')).to.not.contain('test2');
		expect(file('E:/temp/dev/mochetest/test2/subfolder/folder.json')).to.not.contain('subfolder').to.not.contain('test2');
	});

})

// var result = service.walk('//RASPBERRYPI/PiPhotos/photos');
// console.log(result);
