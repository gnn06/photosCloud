'use strict';

var chai      = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var expect = chai.expect;
var file   = chaiFiles.file;
const util = require('./utiltest');

const sizeOf = require('image-size');

const service  = require('../src/photoservice.js');

describe('photoservice', function() {

    before(function(){
        util.deleteFile('E:/temp/dev/mochetest/test5/large/landscape.jpg');
    });

    it('should create large version of landscape', function (done) {
        service.makeLarge('landscape.jpg',
            {
                photoPath : 'E:/temp/dev/mochetest/test5/photo/',
                largePath : 'E:/temp/dev/mochetest/test5/large/'
            },
            result => {
                expect(result).eq(1);
                expect(file('E:/temp/dev/mochetest/test5/large/landscape.jpg')).to.exist;
                var dimensions = sizeOf('E:/temp/dev/mochetest/test5/large/landscape.jpg');
                expect(dimensions.width).eq(1400);
                done();
            }
        );        
    });

    before(function(){
        util.deleteFile('E:/temp/dev/mochetest/test5/large/portrait.jpg');
    });
    
    it('should create large version of portrait', function (done) {
        service.makeLarge('portrait.jpg',
            {
                photoPath : 'E:/temp/dev/mochetest/test5/photo/',
                largePath : 'E:/temp/dev/mochetest/test5/large/'
            },
            result => {
                expect(result).eq(1);
                expect(file('E:/temp/dev/mochetest/test5/large/portrait.jpg')).to.exist;
                var dimensions = sizeOf('E:/temp/dev/mochetest/test5/large/portrait.jpg');
                expect(dimensions.width).eq(933);
                done();
            }
        );        
    });
});