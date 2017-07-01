// const request    = require('supertest');
const express    = require('express');
// const sinon      = require('sinon');
// const proxyquire = require('proxyquire');

const chai     = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

var assert = chai.assert;
var expect = chai.expect;

var ws = require('../src/ws');

describe('ws for thumbnails', function() {
    var ws;
    before(function() {
        ws = require('../src/ws');
    });
    it('returns url with contextroot', function (done) {
        // request(ws.app)
        // .get('/thumbnails')
        // .expect('Content-Type', /json/)
        // .expect('Content-Length', '51393')
        // .expect(function(res) {
        //     if (res.body.length != 373) return done(new Error('body length=', res.body.length));
        //     if (res.body[0].url != '"/thumbnail/2016/DSCF2939xxx.JPG"') return done(new Error('body url'));
        //     done();
        // })
        // .expect(200)
        // .end(function(err, res) {
            // done();
        // });
        // .expect(200, done);
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

describe('ws thumbnail', function() {
//     var makeThumbnailSpy;
//     // var ws;
//     var thumbnail;

//     before(function() {
//         thumbnail = require('../src/thumbnailservice');
//         makeThumbnailSpy = sinon.spy(thumbnail, 'makeThumbnail');
//         // ws = require('../src/ws.js');
//         // ws = proxyquire('../src/ws.js', { thumbnail : { makeThumbnail : makeThumbnailSpy}});

//     })
    it('should call thumbnail and returns the generated file', function(done) {
//         request(ws.app)
//          .get('/thumbnail/2016/DSCF2749.JPG')
//          .expect('Content-Type', 'image/jpeg')
//          .expect(200)
//          .end(function(err, res) {
//             if (err) throw err;
//             console.log('called=',makeThumbnailSpy.called);
//             assert(makeThumbnailSpy.called);
//          })
        
//         // expect(makeThumbnailSpy.called, 'was called').to.be.true;
        chai.request(ws.app)
            .get('/thumbnail/2016/DSCF2749.JPG')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.header('Content-Type', 'image/jpeg');
                done();
            });
    });
});
