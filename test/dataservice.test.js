'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var expect = chai.expect;

const service = require('../src/dataservice');

describe('dataservice', function() {

    describe('getPhotoDate', function() {
        it('should return date of jpeg', function(){
            var promise = service.getPhotoDate('E:/temp/dev/mochetest/test1/photo/file1.jpg');
            return expect(promise).to.eventually.eql(new Date('Aug 20, 2016 12:00:44 Z'));
        });

        it('should return date of mpeg', function () {
            var promise = service.getPhotoDate('E:/temp/dev/mochetest/test1/photo/file4.mp4');
            return expect(promise).to.eventually.eql(new Date('May 25, 2017 14:48:04 Z'));
        });
    });

    describe('getData', function() {
        it('should add date to items', function () {
            var config = {
                photosPath : 'E:/temp/dev/mochetest/test1/photo/'
            };
            const FILE1 = "file1.jpg";
            const FILE2 = "file2.JPG";
            var files = [{
                url : FILE1
            },
            {
                url : FILE2
            }];
            var expected = [{
                url  : FILE1,
                date : new Date('Aug 20, 2016 12:00:44 Z')
            },
            {
                url : FILE2,
                date : new Date('Sep 11, 2016 15:43:00 Z')
            }];

            var promises = service.getData(files, config);
            return Promise.all(promises).then(function(){
                expect(files).eql(expected);
            });
        });
    });

});