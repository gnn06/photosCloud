'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

chai.use(chaiAsPromised);

var expect = chai.expect;

// const service = require('../src/dataservice');
var proxyquire = require('proxyquire');

describe('dataservice', function() {

    describe('getPhotoDate', function() {
        it('should return date of jpeg', function() {            
            var exifStub = 
            {
                read : function (photoFilename) {                    
                    var result =
                            { image :
                                { ModifyDate : new Date('Jan 01, 2001 12:02:03 Z') }
                            
                        };
                    return Promise.resolve(result);
                }
            };
            var service = proxyquire('../src/dataservice', { 'fast-exif' : exifStub });
            var promise = service.getPhotoDate('E:/temp/dev/mochetest/test1/photo/file1.jpg');
            return promise.then(function(date) {
                expect(date).eql(new Date('Jan 01, 2001 12:02:03 Z'));
            });
        });

        it('should return date of mpeg', function () {
            var fsStub = {
                readFile : function (photoFilename, cb) {
                    cb(null, 'content');
                }
            };
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