const parser = require('../src/parser');
const forecast = require('../src/forecast');
const utahavy = require('../src/utahavy');
const expect = require('chai').expect;
const fs = require('fs');
const express = require('express');
const request = require('supertest');

describe('utahavy', () => {
    let server;

    beforeEach(() => {
        var app = express();
        utahavy.express({
            expressApp: app,
            debug: true,
            checkCert: false
        });

        const port = 3000;
        server = app.listen(port);
    });

    afterEach(() => {
        server.close();
    });

    it('responds to invalid data', () => {
        return request(server)
            .post('/utahavy')
            .send({})
            .expect(200).then((response) => {
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

    it('responds to a launch event', () => {
        return request(server)
            .post('/utahavy')
            .send({
                request: {
                    type: 'LaunchRequest'
                }
            })
            .expect(200).then((response) => {
                var ssml = response.body.response.outputSpeech.ssml;

                return expect(ssml).to.eql('<speak>This is the Utah Avalanche Center. ' +
                    'Where will you be <phoneme alphabet="ipa" ph="\'rɛk\'ri.eɪtɪŋ">recreate</phoneme> today?</speak>');
            });
    });

    it('response to GetForecast Intent', () => {
        return request(server)
            .post('/utahavy')
            .send({
                request: {
                    type: 'IntentRequest',
                    intent: {
                        name: 'GetForecast',
                        slots: {
                            region: {
                                name: 'region',
                                value: 'Salt Lake'
                            }
                        }
                    }
                }
            })
            .expect(200).then((response) => {
                var ssml = response.body.response.outputSpeech.ssml;

                return expect(ssml).to.eql('<speak>The bottom line for salt-lake is, I can\'t find a bottom line. ' +
                    'If there is snow, you\'ll have to check the website, otherwise it\'s summer time!</speak>');
            });
    });
});

describe('parser', () => {
    it('should return the bottom line', () => {
        const html = fs.readFileSync('test/data/report.html', 'utf8');

        expect(parser(html)).to.equal('Mostly Low hazard early this morning will ' +
        'quickly rise to a Moderate risk of ' +
        'loose, wet avalanches with warm temperatures and strong sunshine. There also is a Moderate risk of both ' +
        'human-triggered - as well as natural - cornice falls.  Notoriously unpredictable glide avalanches are also ' +
        'possible in localized terrain.');
    });
});

describe('sanity', () => {
    it('forecast', () => {
        expect(forecast).not.to.be.null; // eslint-disable-line no-unused-expressions
    });
    it('utahavy', () => {
        expect(utahavy).not.to.be.null; // eslint-disable-line no-unused-expressions
    });
});
