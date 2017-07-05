'use strict';

var chai      = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var expect = chai.expect;
var file   = chaiFiles.file;

const service  = require('../src/thumbnailservice.js');
const testutil = require('./utiltest');

describe('thumbnailservice for jpeg', function() {
    before(function(){
        testutil.deleteFile('E:/temp/dev/mochetest/test1/thumbnail/file1-100x100.jpg');
    })
    it('should create thumbnail', function (done) {
        service.makeThumbnail('file1.jpg',
        {
            photoPath     : 'E:/temp/dev/mochetest/test1/photo/',
            thumbnailPath : 'E:/temp/dev/mochetest/test1/thumbnail/'
        },
        result => {
            expect(result).to.eq(1);
            expect(file('E:/temp/dev/mochetest/test1/thumbnail/file1-100x100.jpg')).to.exist;
            done();
        })
    });
});

describe('thumbnailservice for mpeg', function() {
    before(function(){
        testutil.deleteFile('E:/temp/dev/mochetest/test1/thumbnail/file4-100x100.jpg');
    })
    it('should creta thumbnail', function (done) {
        service.makeThumbnail('file4.mp4',
        {
            photoPath     : 'E:/temp/dev/mochetest/test1/photo/',
            thumbnailPath : 'E:/temp/dev/mochetest/test1/thumbnail/'
        },
        result => {
            expect(result).to.eq(1);
            expect(file('E:/temp/dev/mochetest/test1/thumbnail/file4-100x100.jpg')).to.exist;
            done();
        })
    });
});