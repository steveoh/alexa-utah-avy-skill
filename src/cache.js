const AWS = require('aws-sdk');
const forecast = require('./forecast');
const moment = require('moment-timezone');


const db = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

const createTimeToLive = () => {
    /* limit the number of queries, to every 15 minutes.
    After the advisory is published for the day, there's no reason to continue pinging the feed.
    Either drop back to once/hour until 11am MT or until the next morning.

    the advisories are usually published by 7/7:30am with updates as necessary.
    It's rare for any significant changes to be made to the advisory after it's published.
    If an update is required, it happens immediately.
    */
    const now = moment().tz('America/Denver');
    const hour = now.hours();
    const forecastStart = 7;
    const forecastEnd = 8;
    const definitelyDone = 11;
    const shortDuration = 5;

    if (hour < forecastStart) {
        console.log('early checker. caching until 7am.');

        // this will expire the value for all the early checkers
        // around when the forecast could be published
        return now.hour(forecastStart).startOf('hour').unix();
    }

    if (hour === forecastStart) {
        console.log(`forecast time, adding ${shortDuration} mintues`);

        // shorter expiration until new forecast is published
        return now.add(shortDuration, 'minutes').unix();
    }

    if (hour > definitelyDone) {
        console.log('afternoon checker, caching until the next day.');

        // the forecast is totally out and can persist until the next day
        return now.add(1, 'days').hour(forecastStart).startOf('hour').unix();
    }

    if (hour > forecastEnd) {
        console.log('late checker, adding one hour in case of updates');

        // it's after 8, the forecast is probably published - update once an hour
        // for possible updates
        return now.add(1, 'hours').unix();
    }
};

const updateCacheFor = (region, data) => {
    const params = {
        Item: {
            region: {
                S: region
            },
            bottomLine: {
                S: data
            },
            GoodUntil: {
                N: createTimeToLive().toString()
            }
        },
        TableName: 'ForeCache'
    };

    console.log(`updating cache for ${region}`);
    console.dir(params);

    return db.putItem(params).promise();
};

const checkCacheFor = (params) => {
    // look for cached advisory
    return new Promise((resolve, reject) => {
        try {
            db.getItem(params).promise().then((cache) => {
                // if there is no cached advisory, get it, cache it, return it
                if (!cache || Object.keys(cache).length < 1) {
                    console.log('record did not exists. TTL removed. ' +
                        'fetching data from source');

                    forecast(params.Key.region.S).then((response) => {
                        console.log('forecast received from source.');
                        updateCacheFor(params.Key.region.S, response).then(() => {
                            console.log('db updated');

                            resolve(response);
                        });
                    });
                } else {
                    // otherwise return the cached item
                    console.log('cache hit. returning');
                    console.dir(cache);

                    resolve(cache.Item.bottomLine.S);
                }
            });
        } catch (error) {
            console.log('rejecting promise');
            console.error(error);

            reject(error);
        }
    });
};

module.exports = (region) => {
    return checkCacheFor({
        Key: {
            region: {
                S: region
            }
        },
        TableName: 'ForeCache'
    });
};
