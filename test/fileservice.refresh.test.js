'use strict';

var chai = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);

var assert = chai.assert;
var expect = chai.expect;
var file   = chaiFiles.file;
//var dir  = chaiFiles.dir;

var proxyquire = require('proxyquire');

var service = require('../src/fileservice.js');

var fs       = require('fs');
var utiltest = require('./utiltest');
var config   = require('../src/config');

const ROOT_FOLDER     = '//RASPBERRYPI/pi/dev/photosCloud/real_sample/';
const ROOT_FOLDER_TMP = '//RASPBERRYPI/tmp/test/walk.refresh/';

// à terminer par un slash
config.photoPath     = ROOT_FOLDER_TMP + "original/";
config.largePath     = ROOT_FOLDER_TMP + "large/";
config.thumbnailPath = ROOT_FOLDER_TMP + "thumbnail/";
config.dataPath      = ROOT_FOLDER_TMP + "data/";
config.trashPath     = ROOT_FOLDER_TMP + "corbeille/";

describe('fileservice on new data', function () {
    beforeEach(function() {
        utiltest.emptydir(config.photoPath);
        utiltest.emptydir(config.largePath);
        utiltest.emptydir(config.thumbnailPath);
        utiltest.emptydir(config.dataPath);
    });

    it('should add new photo', function () {
        utiltest.createJpeg(config.photoPath + 'file.jpg');
        utiltest.createJpeg(config.photoPath + 'file2.jpg');
        utiltest.createJSON(config.dataPath + 'folder.json', [{url:"file.jpg",date:"2000-01-01T12:00:00.000Z"}])
        var p = service.walk('', config);
        return p.then(function(result) {
            expect(result[0].url).eq('/file.jpg');
            expect(result[1].url).eq('/file2.jpg');
        });
    });

    it('should update existing photo', function () {
        utiltest.createJSON(config.dataPath + 'folder.json', [{url:"file.jpg",date:"2000-01-01T12:00:00.000Z"}])
        utiltest.createJpeg(config.photoPath + 'file.jpg');
        var p = service.walk('', config);
        return p.then(function(result) {
            expect(result[0].url).eq('/file.jpg');
            expect(result[0].date).not.eq("2000-01-01T12:00:00.000Z");
        });
    });
});