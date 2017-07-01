'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

chai.use(chaiAsPromised);

var expect = chai.expect;

// const service = require('../src/dataservice');
var proxyquire = require('proxyquire');
var exif       = require('fast-exif');
var fs         = require('fs');
var mp4box     = require('mp4box');


describe('dataservice', function() {

    describe('getPhotoDate of a jpeg', function() {
        var service;

        before(function () {
            var result = { image :
                { ModifyDate : new Date('Jan 01, 2001 12:02:03 Z') }
            };
            var exifStub = sinon.stub(exif, 'read');
            var p = Promise.resolve(result);
            exifStub.returns(p);
            service = require('../src/dataservice');
            // service = proxyquire('../src/dataservice', { 'fast-exif' : { read : exifStub } });
        });

        it('should return a date', function() {            
            var promise = service.getPhotoDate('E:/temp/dev/mochetest/test1/photo/file1.jpg');
            return promise.then(function(date) {
                expect(date).eql(new Date('Jan 01, 2001 12:02:03 Z'));
            });
        });

        after(function () {
            exif.read.restore();
        });
    });

    describe('getPhotoDate', function() {
        it('should return date of mpeg', function () {
            var fsStub = {
                readFile : function (photoFilename, cb) {
                    cb(null, 'content');
                }
            };
            // var fsReadFileStub = sinon.stub(fs, 'readFile');
            // fsReadFileStub.callArgWith(1, null, 'content');
            var mp4boxStub = {
                MP4Box : function () {
                    return {
                        appendBuffer : function () {},
                        getInfo : function() {
                            return { created : new Date('May 01, 2017 14:48:04 Z') };
                        }
                    };
                }
            };
            var service = proxyquire('../src/dataservice', { 'mp4box': mp4boxStub, 'fs' : fsStub });

            var promise = service.getPhotoDate('E:/temp/dev/mochetest/test1/photo/file4.mp4');
            return expect(promise).to.eventually.eql(new Date('May 01, 2017 14:48:04 Z'));
        });
    });

    describe('getPhotoDate', function() {
    
        it('should return null when exception occurs', function () {
            // var mock = sinon.mock(service);
            // mock.expects("getPhotoDate").throws();
            // var promise = service.getPhotoDate('E:/temp/dev/mochetest/test1/photo/file4.mp4');
            // return promise.catch(function(error){
            //     expect(error).exist;
            // }
        });
    });

});