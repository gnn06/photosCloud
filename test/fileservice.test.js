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

var utiltest = require('./utiltest');

describe('fileservice of basic case', function() {
  before(function() {
    utiltest.createJpeg(utiltest.FOLDER_TEST + 'test1/photo/file1.jpg');
    utiltest.createJpeg(utiltest.FOLDER_TEST + 'test1/photo/file2.JPG');
    utiltest.createTxt(utiltest.FOLDER_TEST + 'test1/photo/file3.txt');
    utiltest.createMpeg(utiltest.FOLDER_TEST + 'test1/photo/file4.mp4');
  });

	it('should returns array, only jpg, case insensitive, store into <data> Folder', function () {
		utiltest.deleteFile(utiltest.FOLDER_TEST + 'test1/data/folder.json');
		utiltest.deleteFile(utiltest.FOLDER_TEST + 'test1/photo/folder.json');
    var result = service.walk('', { photoFolder : utiltest.FOLDER_TEST + 'test1/photo/', dataFolder : utiltest.FOLDER_TEST + 'test1/data/' });
    return result.then(function(result) {
      expect(result[0].url).eq('/file1.jpg');
      expect(result[1].url).eq('/file2.JPG');
      expect(result[2].url).eq('/file4.mp4');
    });
  });

  it('should returns data', function () {
    var result = service.walk('', { photoFolder : utiltest.FOLDER_TEST + 'test1/photo/', dataFolder : utiltest.FOLDER_TEST + 'test1/data/' });
    return result.then(function(data) {
      expect(data[0].date).to.be.not.empty;
      expect(data[1].date).to.be.not.empty;
    });
  });
});

describe('fileservice, when called on subfolder', function () {
  before(function() {
    utiltest.createJpeg(utiltest.FOLDER_TEST + 'test2/parentfile.jpg');
    utiltest.createJpeg(utiltest.FOLDER_TEST + 'test2/subfolder/subfile.jpg');
  });

  it('should returns subfolder', function () {
		delete(utiltest.FOLDER_TEST + 'test2/folder.json');
		delete(utiltest.FOLDER_TEST + 'test2/subfolder/folder.json');
    var p = service.walk('', { photoFolder : utiltest.FOLDER_TEST + 'test2/', dataFolder : utiltest.FOLDER_TEST + 'test2/' });
    return p.then(function(result) {
      expect(result[0].url).eq('/parentfile.jpg');
      expect(result[1].url).eq('/subfolder/subfile.jpg');
    });
  });

	it('should returns full url even when called on subfolder', function () {
		delete(utiltest.FOLDER_TEST + 'test2/folder.json');
		delete(utiltest.FOLDER_TEST + 'test2/subfolder/folder.json');
    var promise = service.walk('subfolder', { photoFolder : utiltest.FOLDER_TEST + 'test2/', dataFolder : utiltest.FOLDER_TEST + 'test2/' });
    return promise.then(function(result){
      assert.deepEqual(result[0].url,  '/subfolder/subfile.jpg');
    });
  });

  it('should store result in current and also in subfolder, level by level', function () {
    if (fs.existsSync(utiltest.FOLDER_TEST + 'test2/folder.json')) {
        fs.unlinkSync(utiltest.FOLDER_TEST + 'test2/folder.json');
    }
    if (fs.existsSync(utiltest.FOLDER_TEST + 'test2/subfolder/folder.json')) {
        fs.unlinkSync(utiltest.FOLDER_TEST + 'test2/subfolder/folder.json');
    }
    var promise = service.walk('', { photoFolder : utiltest.FOLDER_TEST + 'test2/', dataFolder : utiltest.FOLDER_TEST + 'test2/' });
    return promise.then(function(result){
      var existPost = fs.existsSync(utiltest.FOLDER_TEST + 'test2/folder.json');
      assert.ok(existPost, 'fichier non crée après appel');
      var existPostSub = fs.existsSync(utiltest.FOLDER_TEST + 'test2/subfolder/folder.json');
      assert.ok(existPost, 'sous fichier non crée après appel');
      expect(file(utiltest.FOLDER_TEST + 'test2/folder.json')).to.contain('parentfile');
      expect(file(utiltest.FOLDER_TEST + 'test2/folder.json')).to.not.contain('subfile');
      expect(file(utiltest.FOLDER_TEST + 'test2/subfolder/folder.json')).to.not.contain('parentfile');
      expect(file(utiltest.FOLDER_TEST + 'test2/subfolder/folder.json')).to.contain('subfile');
    });
  });

  // usefull to the GET /thumbnails sinon le client doit rajouter le folder
	it('should not store absolute url', function () {
		expect(file(utiltest.FOLDER_TEST + 'test2/folder.json')).to.not.contain('E:');
		expect(file(utiltest.FOLDER_TEST + 'test2/folder.json')).to.not.contain('test2');
		expect(file(utiltest.FOLDER_TEST + 'test2/subfolder/folder.json')).to.not.contain('subfolder').to.not.contain('test2');
	});

});

describe('when data is available', function () {
  before(function() {
    utiltest.mkdirp(utiltest.FOLDER_TEST + 'test3');
    utiltest.createTxt(utiltest.FOLDER_TEST + 'test3/folder.json', '[{"url":"file.jpg"}]');
    utiltest.deleteFile(utiltest.FOLDER_TEST + 'test3/file.jpg');
  });

  it('should use stored data', function () {
    var folderExist = fs.existsSync(utiltest.FOLDER_TEST + 'test3/folder.json');
    assert.ok(folderExist);
    var fileNotExist = fs.existsSync(utiltest.FOLDER_TEST + 'test3/file.jpg');
    assert.ok(!fileNotExist, 'image should not exist');
    var promise = service.walk('', { photoFolder : utiltest.FOLDER_TEST + 'test3/', dataFolder : utiltest.FOLDER_TEST + 'test3/' });
    return promise.then(function(result){
      assert.deepEqual(result[0].url, '/file.jpg');
    });
  });

  it('should returns a new file and store it', function () {
    utiltest.createJpeg(utiltest.FOLDER_TEST + 'test3/file2.jpg');
    var promise = service.walk('', { photoFolder : utiltest.FOLDER_TEST + 'test3/', dataFolder : utiltest.FOLDER_TEST + 'test3/' });
    return promise.then(function(result) {
      assert.deepEqual(result[0].url, '/file.jpg');
      assert.deepEqual(result[1].url, '/file2.jpg');
      expect(file(utiltest.FOLDER_TEST + 'test3/folder.json')).to.contain('file2.jpg');
    });
  });
});