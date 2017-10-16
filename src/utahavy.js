const alexa = require('alexa-app');
const cache = require('./cache');
const config = require('./config');


const app = new alexa.app('utahavy'); // eslint-disable-line new-cap
module.exports = app;

app.customSlot('region', ['logan', 'ogden', 'salt lake', 'provo', 'skyline', 'moab']);

app.launch((request, response) => {
    response.say(config.text.welcome);
    response.shouldEndSession(false);
    response.send();
});

app.intent('GetForecast', {
    utterances: ['{i am going to |}{tell me the |what is the |}{forecast for |}{-|region}']
}, (request, response) => {
    const region = request.slot('region');

    if (!region) {
        response.say('What did you say?' + config.text.help);
        response.shouldEndSession(false);

        return response.send();
    }

    return cache(region).then((r) => {
        console.log(`saying ${r.alexa}`);

        response.say(r.alexa);
        response.card({
            type: 'Simple',
            content: r.alexa
        });
        response.send();
    }, (error) => {
        response.say(error);
        response.send();
    });
});

app.intent('AMAZON.HelpIntent', {
    utterances: ['help']
}, (request, response) => {
    response.say(config.text.help);
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

app.error = (exception, request, response) => {
    response.say('Sorry, something bad happened ' + exception);
    response.shouldEndSession(true);
    response.send();
};
