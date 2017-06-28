const request = require('request');
const parser = require('./parser');

const forecaseUrl = 'https://utahavalanchecenter.org/advisory/salt-lake';

module.exports = function () {
    return new Promise((resolve, reject) => {
        request(forecaseUrl, { timeout: 1500 }, (error, response, body) => {
            if (error || !response || response.statusCode !== 200) {
                reject(Error('There is an error with the Utah Avy website. Please try again later'));
            } else {
                var bottomLine = parser(body);

                resolve(bottomLine);
            }
        });
    });
};
