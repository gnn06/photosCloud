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
const util     = require('./utiltest');

describe('dataservice', function() {

    before(function() {
        util.createJpeg('/tmp/mochetest/test1/photo/file1.jpg');
    })

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
            var promise = service.getPhotoDate('/tmp/mochetest/test1/photo/file1.jpg');
            return promise.then(function(date) {
                expect(date).eql(new Date('Jan 01, 2001 12:02:03 Z'));
            });
        });

        after(function () {
            exif.read.restore();
        });
    });

    describe('getPhotoDate of a mpeg', function() {
        var service= require('../src/dataservice.js');
        before(function(){
            util.createMpeg('/tmp/mochetest/test1/photo/file4.mp4');
            util.createMpeg2('/tmp/mochetest/test1/photo/file5.mp4');
        });

        it('should call mp4Box  on smartphone video', function () {
           var promise = service.getPhotoDate('/tmp/mochetest/test1/photo/file5.mp4');
           return expect(promise).to.eventually.eql(new Date('June 18, 2017 14:47:52 Z'));
        });

        it('should return date of mpeg', function () {
            var promise = service.getPhotoDate('/tmp/mochetest/test1/photo/file4.mp4');
            return expect(promise).to.eventually.eql(new Date('May 25, 2017 15:48:04 Z'));
        });
    });


    describe('getPhotoDate', function() {
    
        it('should return null when exception occurs'
        //, function () {
            // var mock = sinon.mock(service);
            // mock.expects("getPhotoDate").throws();
            // var promise = service.getPhotoDate('/tmp/mochetest/test1/photo/file4.mp4');
            // return promise.catch(function(error){
            //     expect(error).exist;
            // }
        //}
        );
    });

});
