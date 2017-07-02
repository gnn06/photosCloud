const express    = require('express');
const sinon      = require('sinon');

const chai     = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

var assert = chai.assert;
var expect = chai.expect;

var ws = require('../src/ws');

describe('ws for thumbnails', function() {
    before(function() {
    });
    it('returns url with contextroot', function (done) {
        chai.request(ws.app)
          .get('/thumbnails')
          .end(function(err, res) {
              expect(res).to.have.status(200);
              expect(res).to.have.header('Content-Type', /json/);
              expect(res).to.have.header('Content-Length', '51393');
              expect(res.body.length).to.eq(585);
              expect(res.body[0].url).to.eq('/thumbnail/2016/DSCF2939.JPG');
              done();
          });
    });
});

describe('ws for thumbnail', function() {
    var makeThumbnailSpy,
        sendFileSpy;

    before(function() {
        var thumbnail = require('../src/thumbnailservice');
        makeThumbnailSpy = sinon.spy(thumbnail, 'makeThumbnail');
        sendFileSpy      = sinon.spy(express.response, 'sendFile');
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
});
