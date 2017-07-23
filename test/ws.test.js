'use strict';

const express    = require('express');
const sinon      = require('sinon');

const chai     = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

var assert = chai.assert;
var expect = chai.expect;

var config = require('../src/config');
config.port = 8120;

var   ws   = require('../src/ws');
const utiltest = require('./utiltest');

var sendFileStub;


describe('ws for thumbnail', function() {
    before(function() {
        sendFileStub      = sinon.spy(express.response, 'sendFile');
    });

    this.timeout(30000);
    var makeThumbnailSpy;

    before(function() {
        var thumbnail    = require('../src/thumbnailservice');
        makeThumbnailSpy = sinon.spy(thumbnail, 'makeThumbnail');
    });
    
    beforeEach(function() {
        utiltest.createJpeg(utiltest.FOLDER_TEST + 'test6/original/landscape.jpg');
        utiltest.mkdirp(utiltest.FOLDER_TEST + 'test6/thumbnail/');
        utiltest.mkdirp(utiltest.FOLDER_TEST + 'test6/data/');
        config.photoPath     = utiltest.FOLDER_TEST + "test6/original/";
        config.largePath     = utiltest.FOLDER_TEST + "test6/large/";
        config.thumbnailPath = utiltest.FOLDER_TEST + "test6/thumbnail/";
        config.dataPath      = utiltest.FOLDER_TEST + "test6/data/";
        config.port          = 8120;

        utiltest.createJpeg(utiltest.FOLDER_TEST + 'test4/original/subfolder withspace/file1.jpg');
        utiltest.mkdirp(utiltest.FOLDER_TEST + 'test4/thumbnail/subfolder withspace/')
    });

    it('when thumbnail is not available, it should call makeThumbnail and sendFile', function(done) {
        utiltest.deleteFile(utiltest.FOLDER_TEST + 'test6/thumbnail/landscape.jpg');
        console.log(config.photoPath);
        chai.request(ws.app)
            .get('/thumbnail/landscape.jpg')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.header('Content-Type', 'image/jpeg');
                expect(makeThumbnailSpy.called).to.be.true;
                expect(makeThumbnailSpy.args[0][0]).to.eq('landscape.jpg');
                expect(sendFileStub.called).to.be.true;
                expect(sendFileStub.args[0][0]).to.eq(utiltest.FOLDER_TEST + 'test6/thumbnail/landscape.jpg');
                done();
            });
    });

    it('when thumbnail is available, it should call sendFile and not call makeThumbnail', function(done) {
        utiltest.createJpegThumbnailLandscape(utiltest.FOLDER_TEST + 'test6/thumbnail/landscape.jpg');
        chai.request(ws.app)
            .get('/thumbnail/landscape.jpg')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.header('Content-Type', 'image/jpeg');
                expect(makeThumbnailSpy.called).to.be.false;
                expect(sendFileStub.called).to.be.true;
                expect(sendFileStub.args[0][0]).to.eq(utiltest.FOLDER_TEST + 'test6/thumbnail/landscape.jpg');
                done();
            });
    });

    afterEach(function() {
        makeThumbnailSpy.reset();
        sendFileStub.reset();
    });
    
    it('should decode url', function(done) {
        config.photoPath     = utiltest.FOLDER_TEST + "test4/original/";
        config.largePath     = utiltest.FOLDER_TEST + "test4/large/";
        config.thumbnailPath = utiltest.FOLDER_TEST + "test4/thumbnail/";
        config.dataPath      = utiltest.FOLDER_TEST + "test4/data/";
        config.port          = 8120;
        chai.request(ws.app)
            .get('/thumbnail/subfolder%20withspace/file1.jpg')
            .end(function(err, res) {
                expect(sendFileStub.args[0][0]).to.eq(utiltest.FOLDER_TEST + 'test4/thumbnail/' + 'subfolder withspace/file1.jpg');
                done(err);
            })
    });

    after(function() {
        sendFileStub.restore();
    })
});

describe('ws for thumbnails', function() {
    before(function() {
        sendFileStub      = sinon.spy(express.response, 'sendFile');
        config.photoPath     = utiltest.FOLDER_TEST + "/test1/photo/";
        config.largePath     = utiltest.FOLDER_TEST + "/test1/large/";
        config.thumbnailPath = utiltest.FOLDER_TEST + "/test1/thumbnail/";
        config.dataPath      = utiltest.FOLDER_TEST + "/test1/data/";
        config.port          = 8120;
    });

    this.timeout(20000);
    
    it('returns url with contextroot', function (done) {
        chai.request(ws.app)
          .get('/thumbnails')
          .end(function(err, res) {
              expect(res).to.have.status(200);
              expect(res).to.have.header('Content-Type', /json/);
            // console.log(res.body);
              expect(res.body.length).to.eq(4);
              expect(res.body[0].url).to.eq('/thumbnail/file1.jpg');
              done();
          });
    });

    after(function() {
        sendFileStub.restore();
    })
});

describe('ws for thumbnails with space', function() {
    before(function() {
        config.photoPath     = utiltest.FOLDER_TEST + "/test4/original/";
        config.largePath     = utiltest.FOLDER_TEST + "/test4/large/";
        config.thumbnailPath = utiltest.FOLDER_TEST + "/test4/thumbnail/";
        config.dataPath      = utiltest.FOLDER_TEST + "/test4/data/";
        config.port          = 8120;
    });

    this.timeout(20000);
    
    it('should returns url with contextroot with encode', function (done) {
        chai.request(ws.app)
          .get('/thumbnails')
          .end(function(err, res) {
              expect(res).to.have.status(200);
              expect(res).to.have.header('Content-Type', /json/);
            // console.log(res.body);
              expect(res.body.length).to.eq(1);
              expect(res.body[0].url).to.eq('/thumbnail/subfolder%20withspace/file1.jpg');
              done();
          });
    });

});
