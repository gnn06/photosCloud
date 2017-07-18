'use strict';

var chai      = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var expect = chai.expect;
var file   = chaiFiles.file;

const service  = require('../src/thumbnailservice.js');
const utiltest = require('./utiltest');

describe('thumbnailservice for jpeg', function() {

    this.timeout(12000);
    before(function(){
        utiltest.mkdirp(utiltest.FOLDER_TEST + 'test1/thumbnail/');
        utiltest.deleteFile(utiltest.FOLDER_TEST + 'test1/thumbnail/file1.jpg');
        utiltest.createJpeg(utiltest.FOLDER_TEST + 'test1/photo/file1.jpg');

    })
    it('should create thumbnail', function (done) {
        service.makeThumbnail('file1.jpg',
        {
            photoPath     : utiltest.FOLDER_TEST + 'test1/photo/',
            thumbnailPath : utiltest.FOLDER_TEST + 'test1/thumbnail/',
            conv_prog   : 'convert'
        },
        result => {
            expect(result).to.eq(1);
            expect(file(utiltest.FOLDER_TEST + 'test1/thumbnail/file1.jpg')).to.exist;
            done();
        })
    });
});

describe('thumbnailservice for mpeg', function() {
    this.timeout(12000);
    before(function(){
        utiltest.mkdirp(utiltest.FOLDER_TEST + 'test1/thumbnail/');
        utiltest.deleteFile(utiltest.FOLDER_TEST + 'test1/thumbnail/file4.jpg');      
        utiltest.createMpeg(utiltest.FOLDER_TEST + 'test1/photo/file4.mp4');
        utiltest.createMpeg2(utiltest.FOLDER_TEST + 'test7/photo/video2.mp4');
        utiltest.mkdirp(utiltest.FOLDER_TEST + 'test7/thumbnail/');
    })
    it('should creta thumbnail', function (done) {
        service.makeThumbnail('file4.mp4',
        {
            photoPath     : utiltest.FOLDER_TEST + 'test1/photo/',
            thumbnailPath : utiltest.FOLDER_TEST + 'test1/thumbnail/',
            video_prog : 'ffmpeg'
        },
        result => {
            expect(result).to.eq(1);
            expect(file(utiltest.FOLDER_TEST + 'test1/thumbnail/file4.jpg')).to.exist;
            done();
        })
    });
    it('should create thumbnail for mp4 smartphone', function (done) {
        service.makeThumbnail('video2.mp4',
        {
            photoPath     : utiltest.FOLDER_TEST + 'test7/photo/',
            thumbnailPath : utiltest.FOLDER_TEST + 'test7/thumbnail/',
            video_prog : 'ffmpeg'
        },
        result => {
            expect(result).to.eq(1);
            expect(file(utiltest.FOLDER_TEST + 'test7/thumbnail/video2.jpg')).to.exist;
            done();
        });
    });
});
