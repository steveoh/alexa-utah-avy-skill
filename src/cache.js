const AWS = require('aws-sdk');
const forecast = require('./forecast');

AWS.config.loadFromPath('./config.json');

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' });

const checkCacheFor = (params) => {
    // promisify?
    db.get(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);

            return null;
        }

        return data;
    });
};

const updateCacheFor = (region, data) => {
    /* limit the number of queries, to every 15 minutes.
    After the advisory is published for the day, there's no reason to continue pinging the feed.
    Either drop back to once/hour until 11am MT or until the next morning.

    the advisories are usually published by 7/7:30am with updates as necessary.
    It's rare for any significant changes to be made to the advisory after it's published.
    If an update is required, it happens immediately.
    */
    const now = new Date();
    const minutes = now.getMinutes();

    const params = {
        Item: {
            region: region,
            bottomLine: data,
            GoodUntil: new Date(now.setMinutes(minutes + 1)).getTime()
        },
        TableName: 'ForeCache'
    };

    db.put(params, (err) => {
        if (err) {
            console.log(err, err.stack);
        }
    });
};

module.exports = (region) => {
    checkCacheFor({
        Key: {
            region: region
        },
        TableName: 'ForeCache'
    }).then((cacheData) => {
        if (cacheData) {
            return cacheData;
        }

        return forecast(region).then(
            (response) => {
                updateCacheFor(region, response);

                return response;
            },
            (err) => {
                console.log(err);
            }
        );
    });
};
