const parser = require('../src/parser');
const forecast = require('../src/forecast');
const utahavy = require('../src/utahavy');
const expect = require('chai').expect;
const fs = require('fs');
const express = require('express');
const request = require('supertest');

describe('utahavy', function () {
    let server;

    beforeEach(function () {
        var app = express();
        utahavy.express({
            expressApp: app,
            debug: true,
            checkCert: false
        });

        const port = 3000;
        server = app.listen(port);
    });

    afterEach(function () {
        server.close();
    });

    it('responds to invalid data', function () {
        return request(server)
            .post('/utahavy')
            .send({})
            .expect(200).then(function (response) {
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

    it('responds to a launch event', function () {
        return request(server)
            .post('/utahavy')
            .send({
                request: {
                    type: 'LaunchRequest'
                }
            })
            .expect(200).then(function (response) {
                var ssml = response.body.response.outputSpeech.ssml;

                return expect(ssml).to.eql('<speak>This will change to be the real output</speak>');
            });
    });
});

describe('parser', function () {
    it('should return the bottom line', function () {
        const html = fs.readFileSync('test/data/report.html', 'utf8');

        expect(parser(html)).to.equal('The bottom line for today is, Mostly Low hazard early this morning will ' +
        'quickly rise to a Moderate risk of ' +
        'loose, wet avalanches with warm temperatures and strong sunshine. There also is a Moderate risk of both ' +
        'human-triggered - as well as natural - cornice falls.  Notoriously unpredictable glide avalanches are also ' +
        'possible in localized terrain.');
    });
});

describe('sanity', function () {
    it('forecast', function () {
        expect(forecast).not.to.be.null; // eslint-disable-line no-unused-expressions
    });
    it('utahavy', function () {
        expect(utahavy).not.to.be.null; // eslint-disable-line no-unused-expressions
    });
});
