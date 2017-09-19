'use strict';

var chai = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);

var assert = chai.assert;
var expect = chai.expect;
var file   = chaiFiles.file;

var fs       = require('fs');
var utiltest = require('./utiltest');
var config   = require('../src/config');
var jsonS    = require('../src/jsonservice');

var service  = require('../src/fileservice.js');

// const ROOT_FOLDER_TMP = '//RASPBERRYPI/tmp/test/fileservice.trashPhoto/';
// const ROOT_FOLDER_TMP = '/tmp/test/fileservice.trashPhoto/';
const ROOT_FOLDER_TMPTRASH = 'e:/temp/test/fileservice.trashPhoto/';

// à terminer par un slash
config.photoPath     = ROOT_FOLDER_TMPTRASH + "original/";
config.largePath     = ROOT_FOLDER_TMPTRASH + "large/";
config.thumbnailPath = ROOT_FOLDER_TMPTRASH + "thumbnail/";
config.dataPath      = ROOT_FOLDER_TMPTRASH + "data/";
config.trashPath     = ROOT_FOLDER_TMPTRASH + "corbeille/";

describe.only('fileservice.trashPhoto', function () {
    beforeEach(function() {
        utiltest.emptydir(config.photoPath);
        utiltest.emptydir(config.largePath);
        utiltest.emptydir(config.thumbnailPath);
        utiltest.emptydir(config.dataPath);
    });

    it('should add new photo', function () {
        utiltest.createJpeg(config.photoPath + 'file.jpg');
        utiltest.createJSON(config.dataPath + 'folder.json', [{url:"file.jpg",date:"2000-01-01T12:00:00.000Z"}]);
        service.trashPhoto('file.jpg', config);
        var content = jsonS.read('');
        expect(content.length).eq(0);
    });

});