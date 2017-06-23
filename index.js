var alexa = require('alexa-app');
var forecast = require('./forecast');

var app = new alexa.app('utahavy');

app.error = function(exception, request, response) {
  response.say("Sorry, something bad happened " + exception);
};

app.intent('GetForecast', {
    'utterances': [
        '{tell me the |what is the |}{utah |}{avy |avalanche}{ forecast|}'
    ]
},
function(request, response) {
    forecast().then((response) => {
        response.say(`The bottom line for today is ${response}`).send();
    }, (error) => {
        response.say(error.message).send();
    });

    return false;
});

app.launch((request, response) => {
    return response.say('What forecast are you interested in today?').send();
});

exports.handler = app.lambda();
module.exports = app;
