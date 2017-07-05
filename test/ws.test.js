const express    = require('express');
const sinon      = require('sinon');

const chai     = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

var assert = chai.assert;
var expect = chai.expect;

var   ws   = require('../src/ws');
const util = require('./utiltest');

var sendFileSpy;

before(function() {
    sendFileSpy      = sinon.spy(express.response, 'sendFile');
});

describe('ws for thumbnails', function() {
    
    it('returns url with contextroot', function (done) {
        chai.request(ws.app)
          .get('/thumbnails')
          .end(function(err, res) {
              expect(res).to.have.status(200);
              expect(res).to.have.header('Content-Type', /json/);
              expect(res).to.have.header('Content-Length', '55837');
              expect(res.body.length).to.eq(598);
              expect(res.body[0].url).to.eq('/thumbnail/2016/DSCF2939.JPG');
              done();
          });
    });
});

describe('ws for thumbnail', function() {
    var makeThumbnailSpy;

    before(function() {
        var thumbnail    = require('../src/thumbnailservice');
        makeThumbnailSpy = sinon.spy(thumbnail, 'makeThumbnail');
    });
    
    beforeEach(function() {
        util.deleteFile('E:/temp/dev/mochetest/test4/thumbnail/subfolder\ withspace/file1-100x100.jpg');
    });

    it('should call makeThumbnail and sendFile', function(done) {
        chai.request(ws.app)
            .get('/thumbnail/2016/DSCF2749.JPG')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.header('Content-Type', 'image/jpeg');
                expect(makeThumbnailSpy.called).to.be.true;
                expect(makeThumbnailSpy.args[0][0]).to.eq('2016/DSCF2749.JPG');
                expect(sendFileSpy.called).to.be.true;
                expect(sendFileSpy.args[0][0]).to.eq('//RASPBERRYPI/PiPhotos/thumbnail/2016/DSCF2749-100x100.JPG');
                done();
            });
    });

    afterEach(function() {
        makeThumbnailSpy.reset();
        sendFileSpy.reset();
    });
    
    it('should decode url', function(done) {
        chai.request(ws.app)
            .get('/thumbnail/upload/HUAWEI%20HUAWEI%20CAN-L11/Camera/IMG_20170629_140551.jpg')
            .end(function(err, res) {
                expect(makeThumbnailSpy.args[0][0]).to.eq('upload/HUAWEI HUAWEI CAN-L11/Camera/IMG_20170629_140551.jpg');
                done(err);
            })
    });
});


describe('ws for large', function() {

    var makeLargeSpy;

    before(function() {
        var photoSrv     = require('../src/photoservice');
        makeLargeSpy     = sinon.spy(photoSrv, 'makeLarge');
    });

    it('should call makeLarge and sendFile', function(done) {
        chai.request(ws.app)
            .get('/large/upload/HUAWEI%20HUAWEI%20CAN-L11/Camera/IMG_20170629_140551.jpg')
            .end(function(err, res) {
                expect(sendFileSpy.args[0][0]).to.eq('//RASPBERRYPI/PiPhotos/large/upload/HUAWEI HUAWEI CAN-L11/Camera/IMG_20170629_140551.jpg');
                done(err);
            })
    });

    afterEach(function() {
        makeLargeSpy.reset();
        sendFileSpy.reset();
    });
    
});