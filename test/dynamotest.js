const AWS = require('aws-sdk');


AWS.config.loadFromPath('./src/config.json');

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' });

const params = {
    Key: {
        region: 'salt lake'
    },
    TableName: 'ForeCache'
};

db.get(params, (err, data) => {
    if (err) {
        console.log(err, err.stack);
    }

    console.log(data);
});
