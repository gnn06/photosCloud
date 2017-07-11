'use strict';

var chai      = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var expect = chai.expect;
var file   = chaiFiles.file;

const service  = require('../src/thumbnailservice.js');
const testutil = require('./utiltest');

describe('thumbnailservice for jpeg', function() {

    this.timeout(12000);
    before(function(){
        testutil.mkdirp('/tmp/mochetest/test1/thumbnail/');
        testutil.deleteFile('/tmp/mochetest/test1/thumbnail/file1.jpg');
        testutil.createJpeg('/tmp/mochetest/test1/photo/file1.jpg');

    })
    it('should create thumbnail', function (done) {
        service.makeThumbnail('file1.jpg',
        {
            photoPath     : '/tmp/mochetest/test1/photo/',
            thumbnailPath : '/tmp/mochetest/test1/thumbnail/',
            conv_prog   : 'convert'
        },
        result => {
            expect(result).to.eq(1);
            expect(file('/tmp/mochetest/test1/thumbnail/file1.jpg')).to.exist;
            done();
        })
    });
});

describe('thumbnailservice for mpeg', function() {
    this.timeout(12000);
    before(function(){
        testutil.mkdirp('/tmp/mochetest/test1/thumbnail/');
        testutil.deleteFile('/tmp/mochetest/test1/thumbnail/file4.jpg');      
        testutil.createMpeg('/tmp/mochetest/test1/photo/file4.mp4');
    })
    it('should creta thumbnail', function (done) {
        service.makeThumbnail('file4.mp4',
        {
            photoPath     : '/tmp/mochetest/test1/photo/',
            thumbnailPath : '/tmp/mochetest/test1/thumbnail/'
        },
        result => {
            expect(result).to.eq(1);
            expect(file('/tmp/mochetest/test1/thumbnail/file4.jpg')).to.exist;
            done();
        })
    });
});