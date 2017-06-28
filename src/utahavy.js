const alexa = require('alexa-app');
const forecast = require('./forecast');

const app = new alexa.app('utahavy'); // eslint-disable-line new-cap

app.error = function (exception, request, response) {
    return response.say('Sorry, something bad happened ' + exception);
};

app.intent('GetForecast', {
    utterances: ['{tell me the |what is the |}{utah |}{avy |avalanche}{ forecast|}']
},
function (request, response) {
    forecast().then((r) => {
        return response.say(`The bottom line for today is ${r}`).send();
    }, (error) => {
        return response.say(error.message).send();
    });

    return false;
});

app.launch((request, response) => {
    return forecast().then((report) => {
        response.say(`The bottom line for today is, ${report}`).send();
    }, (error) => {
        response.say(error.message).send();
    });
});

module.exports = app;
