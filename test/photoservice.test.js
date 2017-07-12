'use strict';

var chai      = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var expect = chai.expect;
var file   = chaiFiles.file;
const util = require('./utiltest');

const sizeOf = require('image-size');

const service  = require('../src/photoservice.js');

describe('photoservice', function() {
   this.timeout(12000);

    before(function(){
        util.deleteFile('/tmp/mochetest/test5/large/landscape.jpg');
        util.deleteFile('/tmp/mochetest/test5/large/portrait.jpg');

        util.createJpeg('/tmp/mochetest/test5/photo/landscape.jpg');
        util.createJpegPortrait('/tmp/mochetest/test5/photo/portrait.jpg');
        util.mkdirp('/tmp/mochetest/test5/large/');
    });

    it('should create large version of landscape', function (done) {
        service.makeLarge('landscape.jpg',
            {
                photoPath : '/tmp/mochetest/test5/photo/',
                largePath : '/tmp/mochetest/test5/large/',
                conv_prog : 'convert'
            },
            result => {
                expect(result).eq(1);
                expect(file('/tmp/mochetest/test5/large/landscape.jpg')).to.exist;
                var dimensions = sizeOf('/tmp/mochetest/test5/large/landscape.jpg');
                expect(dimensions.width).eq(800);
                done();
            }
        );        
    });

    it('should create large version of portrait', function (done) {
        service.makeLarge('portrait.jpg',
            {
                photoPath : '/tmp/mochetest/test5/photo/',
                largePath : '/tmp/mochetest/test5/large/',
                conv_prog : 'convert'
            },
            result => {
                expect(result).eq(1);
                expect(file('/tmp/mochetest/test5/large/portrait.jpg')).to.exist;
                var dimensions = sizeOf('/tmp/mochetest/test5/large/portrait.jpg');
                expect(dimensions.width).eq(533);
                done();
            }
        );        
    });
});

describe('makeThumbnail', function () {
     this.timeout(12000);

    before(function(){
        util.deleteFile('/tmp/mochetest/test5/thumbnail/landscape.jpg');
        util.deleteFile('/tmp/mochetest/test5/thumbnail/portrait.jpg');

        util.createJpeg('/tmp/mochetest/test5/photo/landscape.jpg');
        util.createJpegPortrait('/tmp/mochetest/test5/photo/portrait.jpg');
        util.mkdirp('/tmp/mochetest/test5/thumbnail/');
    });

    it('should create thumbnail version of landscape', function (done) {
        service.makeThumbnail('landscape.jpg',
            {
                photoPath     : '/tmp/mochetest/test5/photo/',
                thumbnailPath : '/tmp/mochetest/test5/thumbnail/',
                conv_prog     : 'convert'
            },
            result => {
                expect(result).eq(1);
                expect(file('/tmp/mochetest/test5/large/landscape.jpg')).to.exist;
                var dimensions = sizeOf('/tmp/mochetest/test5/thumbnail/landscape.jpg');
                expect(dimensions.width).eq(100);
                expect(dimensions.height).eq(100);
                done();
            }
        );        
    });

    it('should create thumbnail version of portrait', function (done) {
        service.makeThumbnail('portrait.jpg',
            {
                photoPath     : '/tmp/mochetest/test5/photo/',
                thumbnailPath : '/tmp/mochetest/test5/thumbnail/',
                conv_prog     : 'convert'
            },
            result => {
                expect(result).eq(1);
                expect(file('/tmp/mochetest/test5/large/portrait.jpg')).to.exist;
                var dimensions = sizeOf('/tmp/mochetest/test5/thumbnail/portrait.jpg');
                expect(dimensions.width).eq(100);
                expect(dimensions.height).eq(100);
                done();
            }
        );        
    });
});
