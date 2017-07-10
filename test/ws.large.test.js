const express    = require('express');
const sinon      = require('sinon');

const chai     = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

var assert = chai.assert;
var expect = chai.expect;

var config = require('../src/config');
config.photoPath     = "/tmp/mochetest/test6/original/";
config.largePath     = "/tmp/mochetest/test6/large/";
config.thumbnailPath = "/tmp/mochetest/test6/thumbnail/";
config.dataPath      = "/tmp/mochetest/test6/data/";
config.port          = 8120;

var   ws   = require('../src/ws');
const util = require('./utiltest');

var sendFileStub;


describe('ws for large', function() {
    before(function() {
        sendFileStub      = sinon.stub(express.response, 'sendFile');
    });

    this.timeout(12000);

    var makeLargeSpy;

    before(function() {
        var photoSrv     = require('../src/photoservice');
        makeLargeSpy     = sinon.spy(photoSrv, 'makeLarge');
    });

    it('should call makeLarge and sendFile', function(done) {
        sendFileStub.onFirstCall().callsArgWith(1, { code : 'ENOENT'});
        sendFileStub.callThrough();
        chai.request(ws.app)
            .get('/large/landscape.jpg')
            .end(function(err, res) {
                expect(sendFileStub.args[0][0]).to.eq('/tmp/mochetest/test6/large/landscape.jpg');
                done(err);
            })
    });

    it('should call sendFile and not makeLarge', function(done) {
        sendFileStub.callThrough();
        chai.request(ws.app)
            .get('/large/landscape.jpg')
            .end(function(err, res) {
                expect(sendFileStub.args[0][0]).to.eq('/tmp/mochetest/test6/large/landscape.jpg');
                expect(!makeLargeSpy.called);
                done(err);
            })
    });
    
    afterEach(function() {
        makeLargeSpy.reset();
        sendFileStub.reset();
    });

    after(function() {
        sendFileStub.restore();
    })    
});

