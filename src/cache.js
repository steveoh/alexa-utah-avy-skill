const AWS = require('aws-sdk');
const forecast = require('./forecast');

AWS.config.loadFromPath('./config.json');

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' });

const createTimeToLive = () => {
    /* limit the number of queries, to every 15 minutes.
    After the advisory is published for the day, there's no reason to continue pinging the feed.
    Either drop back to once/hour until 11am MT or until the next morning.

    the advisories are usually published by 7/7:30am with updates as necessary.
    It's rare for any significant changes to be made to the advisory after it's published.
    If an update is required, it happens immediately.
    */
    const now = new Date();
    const minutes = now.getMinutes();
    const hour = now.getHour();
    const forecastPossibleStart = 7;
    const forecastEnd = 8;
    const definitelyDone = 11;
    const shortDuration = 5;

    if (hour < forecastPossibleStart) {
        // this will expire the value for all the early checkers
        // around when the forecast could be published
        return new Date(now.getFullYear(), now.getMonth(), now.getDay(), forecastPossibleStart).getTime();
    }

    if (hour === forecastPossibleStart) {
        // shorter expiration until new forecast is published
        return new Date(now.setMinutes(minutes + shortDuration)).getTime();
    }

    if (hour > forecastEnd) {
        // it's after 8, the forecast is probably published - update once an hour
        // for possible updates
        return new Date(now.setHours(hour + 1)).getTime();
    }

    if (hour > definitelyDone) {
        // the forecast is totally out and can persist until the next day
        return new Date(now.getFullYear(), now.getMonth(), now.getDay() + 1, forecastPossibleStart).getTime();
    }
};

const updateCacheFor = (region, data) => {
    const params = {
        Item: {
            region: region,
            bottomLine: data,
            GoodUntil: createTimeToLive()
        },
        TableName: 'ForeCache'
    };

    db.put(params, (err) => {
        if (err) {
            console.log(err, err.stack);
        }
    });
};

const checkCacheFor = (params) => {
    // promisify?

    // look for cached advisory
    db.get(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);

            return null;
        }

        return data;
    }).then((cache) => {
        // if there is no cached advisory, get it, cache it, return it
        if (!cache) {
            return forecast(params.Key.region).then((response) => {
                updateCacheFor(params.Key.region, response);

                return response;
            });
        }

        // otherwise return the cached item
        return cache;
    });
};

module.exports = (region) => {
    checkCacheFor({
        Key: {
            region: region
        },
        TableName: 'ForeCache'
    });
};
