var alexa = require('alexa-app');
var forecast = require('forecast');

var app = new alexa.app('utahavy');

app.launch((req, res) => {
    return forecast().then((response) => {
        res.say(`The bottom line for today is ${response}`);
    }, (error) => {
        res.say(error.message);
    });
});

exports.handler = app.lambda();
