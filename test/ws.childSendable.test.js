'use strict';

var assert = require('assert');

const util   = require('./utiltest');
const ws     = require('../src/fileservice');
const config = require('../src/config');

const ROOT_FOLDER_TEST = 'e:/temp/dev/mochtest/';

describe('childSendable', function() {
    before(function() {
        config.photoPath     = ROOT_FOLDER_TEST + "/sendable/original/";
        config.largePath     = ROOT_FOLDER_TEST + "/sendable/large/";
        config.thumbnailPath = ROOT_FOLDER_TEST + "/sendable/thumbnail/";
        config.dataPath      = ROOT_FOLDER_TEST + "/sendable/data/";
        config.trashPath     = ROOT_FOLDER_TEST + "/sendable/corbeille/";
        
        util.mkdirp(config.photoPath);
        util.mkdirp(config.thumbnailPath);
    });

    beforeEach(function() {
        util.deleteFile(config.photoPath + 'file.jpg');
        util.deleteFile(config.thumbnailPath + 'file.jpg');
    });

    it('should', function() {
        util.createJpeg                  (config.photoPath  + 'file.jpg');
        
        var result = ws.childSendable
            (config.photoPath  + 'file.jpg',
            config.thumbnailPath + 'file.jpg');
        assert(!result);
    });

    it('should', function() {
        util.createJpegThumbnailLandscape(config.thumbnailPath + 'file.jpg');
        util.createJpeg                  (config.photoPath  + 'file.jpg');
        
        var result = ws.childSendable
            (config.photoPath  + 'file.jpg',
            config.thumbnailPath + 'file.jpg');
        assert(!result);
    });

    it('should', function() {
        util.createJpeg                  (config.photoPath  + 'file.jpg');
        util.createJpegThumbnailLandscape(config.thumbnailPath + 'file.jpg');

        var result = ws.childSendable
            (config.photoPath  + 'file.jpg',
            config.thumbnailPath + 'file.jpg');
        assert(result);
    });

});