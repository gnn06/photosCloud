'use strict';

const chai         = require('chai');
const sinon        = require('sinon');
const express      = require('express');
const expect       = chai.expect;
const ws           = require('../src/ws');
const photoService = require('../src/photoservice');
const utiltest     = require('./utiltest');

describe('_sendPhoto', function () {
    var req, sendFileStub, sendFileStub, serviceMakeThumbnailSpy, serviceMakeLargeSpy;
    before(function(){
        req = sinon.stub();
        req = { url : '/thumbnail/folder/file.jpg' };
        sendFileStub = sinon.stub(express.response, 'sendFile');
        serviceMakeThumbnailSpy = sinon.spy(photoService, 'makeThumbnail');
        serviceMakeLargeSpy     = sinon.spy(photoService, 'makeLarge');
        utiltest.createJpeg(utiltest.config.photoPath + 'folder/file.jpg');
        utiltest.mkdirp(utiltest.config.thumbnailPath + 'folder/');
        utiltest.mkdirp(utiltest.config.largePath + 'folder/');
    });

    it('should return file when no exception is thrown without calling makeLarge or makeThumbnail', function () {
        // res.onFirstCall().callsArgWith(1, null);
        utiltest.createJpegThumbnailLandscape(utiltest.config.thumbnailPath + 'folder/file.jpg');
        ws._sendPhoto(req, express.response, utiltest.config, 'thumbnail');
        expect(sendFileStub.called).to.be.true;
        expect(sendFileStub.calledOnce).to.be.true;
        expect(sendFileStub.args[0][0]).to.be.eq(utiltest.config.thumbnailPath + 'folder/file.jpg');
        expect(serviceMakeThumbnailSpy.called).to.be.false;
        expect(serviceMakeLargeSpy.called).to.be.false;
    });

    it('should calls operation thumbnail when exception throws', function () {
        utiltest.deleteFile(utiltest.config.thumbnailPath + 'folder/file.jpg');
        sendFileStub.onFirstCall().callsArgWith(1, { code : 'ENOENT' } );
        ws._sendPhoto(req, express.response, utiltest.config, 'thumbnail');
        expect(serviceMakeThumbnailSpy.called).to.be.true;
        expect(serviceMakeThumbnailSpy.args[0][0]).to.be.eq('folder/file.jpg');
        expect(serviceMakeLargeSpy.called).to.be.false;
        expect(sendFileStub.args[0][0]).to.be.eq(utiltest.config.thumbnailPath + 'folder/file.jpg');
        // TODO expect sendFile called twice
    });

    it('should calls operation large when exception throws', function () {
        sendFileStub.onFirstCall().callsArgWith(1, { code : 'ENOENT' } );
        ws._sendPhoto(req, express.response, utiltest.config, 'large');
        expect(serviceMakeThumbnailSpy.called).to.be.false;
        expect(serviceMakeLargeSpy.called).to.be.true;
        expect(serviceMakeLargeSpy.args[0][0]).to.be.eq('folder/file.jpg');
        expect(sendFileStub.args[0][0]).to.be.eq(utiltest.config.largePath + 'folder/file.jpg');
        // TODO expect sendFile called twice
    });

    afterEach(function () {
        sendFileStub.reset();
        serviceMakeThumbnailSpy.reset();
        serviceMakeLargeSpy.reset();
    });

    after(function () {
        sendFileStub.restore();
    })

});