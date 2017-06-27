const request = require('supertest');
const express = require('express');
 
const ws = require('../src/ws.js');

const chai = require('chai');

var assert = chai.assert;
var expect = chai.expect;

describe('ws', function() {
    it('returns url with contextroot', function () {
        request(ws.app)
        .get('/thumbnails')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '30174')
        .expect(200)
        .end(function(err, res) {
            if (err) throw err;
            assert(res.body.length, 373);
            assert(res.body[0].url, '"/thumbnail/2016/DSCF2939.JPG"');
        });
    });
});