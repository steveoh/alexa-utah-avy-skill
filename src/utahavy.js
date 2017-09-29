const alexa = require('alexa-app');
const forecast = require('./forecast');

const app = new alexa.app('utahavy'); // eslint-disable-line new-cap
module.exports = app;

app.error = (exception, request, response) => {
    response.say('Sorry, something bad happened ' + exception);
    response.shouldEndSession(true);
    response.send();
};

app.customSlot('region', ['logan', 'ogden', 'salt lake', 'provo', 'skyline', 'moab']);

app.intent('GetForecast', {
    utterances: ['{i am going to |}{tell me the |what is the |}{forecast for |}{-|region}']
}, (request, response) => {
    const region = request.slot('region');

    return forecast(region).then((r) => {
        response.say(r).send();
    }, (error) => {
        response.say(error.message).send();
    });
});

app.launch((request, response) => {
    response.say('This is the Utah Avalanche Center. ' +
        'Where will you be rekreating today?');
    response.shouldEndSession(false);
    response.send();
});

app.intent('AMAZON.HelpIntent', {
    utterances: ['help']
}, (request, response) => {
    response.say('This skill reads the avalanche forecast for the six regions the UAC monitors. ' +
          'Tell me where you are going. Choose from logan, ogden, salt lake, provo, skyline, or moab.');
    response.shouldEndSession(false);
    response.send();
});

app.intent('AMAZON.StopIntent', {
    utterances: ['stop']
}, (request, response) => {
    response.say('Laters');
    response.shouldEndSession(true);
    response.send();
});

app.intent('AMAZON.CancelIntent', {
    utterances: ['cancel']
}, (request, response) => {
    response.say('Laters');
    response.shouldEndSession(true);
    response.send();
});
