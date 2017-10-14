const alexa = require('alexa-app');
const cache = require('./cache');


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

    if (!region) {
        response.say('You can say logan, ogden, salt lake, provo, ' +
        '<phoneme alphabet="ipa" ph="ˈskaɪlaɪn">skyline</phoneme>, or ' +
        '<phoneme alphabet="ipa" ph="moʊæb">moab</phoneme>?');
        response.shouldEndSession(false);

        return response.send();
    }

    return cache(region).then((r) => {
        console.log(`saying ${r}`);

        response.say(r);
        response.card({
            type: 'Simple',
            content: r
        });
        response.send();
    }, (error) => {
        response.say(error.message).send();
    });
});

app.launch((request, response) => {
    response.say('This is the Utah Avalanche Center. ' +
        'Where will you be <phoneme alphabet="ipa" ph="\'rɛk\'ri.eɪtɪŋ">recreate</phoneme> today?');
    response.shouldEndSession(false);
    response.send();
});

app.intent('AMAZON.HelpIntent', {
    utterances: ['help']
}, (request, response) => {
    response.say('This skill reads the avalanche forecast for the six regions the UAC monitors. ' +
          'Tell me where you are going. You can say logan, ogden, salt lake, provo, ' +
          '<phoneme alphabet="ipa" ph="ˈskaɪlaɪn">skyline</phoneme>, or ' +
          '<phoneme alphabet="ipa" ph="moʊæb">moab</phoneme>?');
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
