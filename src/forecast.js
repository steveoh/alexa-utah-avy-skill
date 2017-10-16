const request = require('request');
const config = require('./config');
const Entities = require('html-entities').AllHtmlEntities;


const entities = new Entities();

const formatDate = (date) => {
    let parts = date.split();
    const hasYearTimeParts = 3;
    const yearTimeIndex = 2;

    if (parts.length === hasYearTimeParts) {
        parts.splice(yearTimeIndex);
    }

    return parts.join();
};

const formatForAlexa = (data) => {
    if (data.level.toLowerCase() === 'none') {
        return `The avalanche danger is non-existant. But ${data.weather}`;
    }

    return `The advisory for ${data.date} is ${data.level}. ${data.weather}`;
};

module.exports = (region) => {
    if (!region) {
        region = 'salt-lake';
    }

    region = region.toLowerCase();
    if (region === 'salt lake') {
        region = 'salt-lake';
    }

    const options = {
        url: config.urls.advisory.replace('${region}', region),
        headers: {
            'User-Agent': config.UA
        },
        timeout: config.timeout
    };

    console.dir(options);

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error || !response || response.statusCode !== 200) {
                console.dir(error);
                reject(config.text.xhr.forecastError);
            } else {
                console.log(body);
                const data = JSON.parse(body);
                const advisories = data.advisories;

                if (!advisories && advisories.lentgh < 1) {
                    reject(config.text.xhr.forecastError);
                }

                const advisory = advisories[0].advisory;
                console.dir(advisory);

                let forecast = {
                    date: formatDate(advisory.date_issued),
                    time: advisory.date_issued_timestamp,
                    weather: entities.decode(advisory.current_conditions),
                    level: advisory.overall_danger_rating,
                    region: advisory.Region
                };

                forecast.alexa = formatForAlexa(forecast);

                resolve(forecast);
            }
        });
    });
};
