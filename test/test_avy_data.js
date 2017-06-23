var parser = require('../parser');
var forecast = require('../forecast');
var index = require('../index');
var expect = require('chai').expect;
var fs = require('fs');
var express = require('express');
var request = require('supertest');

describe('utahavy', function () {
    var server;

    beforeEach(function() {
        var app = express();
        index.express({
            expressApp: app,
            debug: true,
            checkCert: false
        });

        server = app.listen(3000);
    });

    afterEach(function() {
        server.close();
    });

    it('responds to invalid data', function() {
      return request(server)
        .post('/utahavy')
        .send({})
        .expect(200).then(function(response) {
          return expect(response.body).to.eql({
            version: '1.0',
            response: {
              directives: [],
              shouldEndSession: true,
              outputSpeech: {
                type: 'SSML',
                ssml: '<speak>Sorry, something bad happened INVALID_REQUEST_TYPE</speak>'
              }
            },
            sessionAttributes: {}
          });
        });
    });

    it('responds to a launch event', function() {
      return request(server)
        .post('/utahavy')
        .send({
          request: {
            type: 'LaunchRequest',
          }
        })
        .expect(200).then(function(response) {
          var ssml = response.body.response.outputSpeech.ssml;
          return expect(ssml).to.eql('<speak>What forecast are you interested in today?</speak>');
        });
    });
});

describe('parser', function () {
    it('should return the bottom line', function () {
        const html = fs.readFileSync('test/data/report.html', 'utf8');

        expect(parser(html)).to.equal('Mostly Low hazard early this morning will quickly rise to a Moderate risk of loose, wet avalanches with warm temperatures and strong sunshine. There also is a Moderate risk of both human-triggered - as well as natural - cornice falls.  Notoriously unpredictable glide avalanches are also possible in localized terrain.');
    });
});

describe('sanity', function () {
    it('forecast', function () {
        expect(forecast).not.to.be.null;
    });
    it('index', function () {
        expect(index).not.to.be.null;
    });
});
