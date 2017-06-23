var request = require('request');
var parser = require('./parser');


var forecase_url = 'https://utahavalanchecenter.org/advisory/salt-lake';

module.exports = function () {
    return new Promise((resolve, reject) => {
        request(forecase_url, {timeout: 1500}, (error, response, body) => {
            if (error || !response || response.statusCode !== 200) {
                reject(Error('There is an error with the Utah Avy website. Please try again later'));
            } else {
                var bottom_line = parser(body);

                resolve(bottom_line);
            }
        });
    });
};
