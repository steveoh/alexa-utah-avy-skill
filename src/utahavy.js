const alexa = require('alexa-app');
const forecast = require('./forecast');

const app = new alexa.app('utahavy'); // eslint-disable-line new-cap

app.error = function (exception, request, response) {
    response.say('Sorry, something bad happened ' + exception).send();
};

app.intent('GetForecast', {
    utterances: ['{tell me the |what is the |}{utah |}{avy |avalanche}{ forecast|}']
},
function (request, response) {
    return forecast().then((r) => {
        response.say(`The bottom line for today is ${r}`).send();
    }, (error) => {
        response.say(error.message).send();
    });
});

app.launch((request, response) => {
    return forecast().then((report) => {
        response.say(`The bottom line for today is, ${report}`).send();
    }, (error) => {
        response.say(error.message).send();
    });
});

module.exports = app;
