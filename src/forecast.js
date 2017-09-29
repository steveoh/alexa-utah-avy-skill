const request = require('request');
const parser = require('./parser');
const config = require('./config');


module.exports = (region) => {
    if (!region) {
        region = 'salt-lake';
    }

    region = region.toLowerCase();
    if (region === 'salt lake') {
        region = 'salt-lake';
    }

    const options = {
        url: config.urls.forecast + region,
        headers: {
            'User-Agent': config.UA
        },
        timeout: config.timeout
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error || !response || response.statusCode !== 200) {
                reject(Error('There was an error with the Utah Avy website. Please try again later.'));
            } else {
                var bottomLine = parser(body);

                resolve(`The bottom line for ${region} is, ${bottomLine}`);
            }
        });
    });
};
