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
const utiltest     = require('./utiltest');

describe('dataservice', function() {

    before(function() {
        utiltest.createJpeg(utiltest.FOLDER_TEST + 'test1/photo/file1.jpg');
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
            var promise = service.getPhotoDate(utiltest.FOLDER_TEST + 'test1/photo/file1.jpg');
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
            utiltest.createMpeg(utiltest.FOLDER_TEST + 'test1/photo/file4.mp4');
            utiltest.createMpeg2(utiltest.FOLDER_TEST + 'test1/photo/file5.mp4');
        });

        it('should call mp4Box  on smartphone video', function () {
           var promise = service.getPhotoDate(utiltest.FOLDER_TEST + 'test1/photo/file5.mp4');
           return expect(promise).to.eventually.eql(new Date('June 18, 2017 16:47:52 GMT+2'));
        });

        it('should return date of mpeg', function () {
            var promise = service.getPhotoDate(utiltest.FOLDER_TEST + 'test1/photo/file4.mp4');
            return expect(promise).to.eventually.eql(new Date('May 25, 2017 17:48:04 GMT+2'));
        });
    });


    describe('getPhotoDate', function() {
    
        it('should return null when exception occurs'
        //, function () {
            // var mock = sinon.mock(service);
            // mock.expects("getPhotoDate").throws();
            // var promise = service.getPhotoDate(utiltest.FOLDER_TEST + 'test1/photo/file4.mp4');
            // return promise.catch(function(error){
            //     expect(error).exist;
            // }
        //}
        );
    });

});
