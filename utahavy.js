var alexa = require('alexa-app');
var forecast = require('./forecast');

var app = new alexa.app('utahavy');

app.error = function(exception, request, response) {
  response.say("Sorry, something bad happened " + exception);
};

app.launch((request, response) => {
    return forecast().then((report) => {
        response.say(`The bottom line for today is, ${report}`).send();
    }, (error) => {
        response.say(error.message).send();
    });
});

module.exports = app;
