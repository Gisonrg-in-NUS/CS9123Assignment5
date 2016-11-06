'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

const FILE_SUBSCRIPTION = {
  Bucket: 'cs3219.gitguard',
  Key: 'subscription.json'
};

const FILE_SYNC_TIME = {
  Bucket: 'cs3219.gitguard',
  Key: 'time.json'
};

function createErrorResponse() {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Sorry, and error has occured."
    }),
  };
}

function createInvalidResponse() {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Please check your request format.'
    }),
  };
}

module.exports.updateTime = (event, context, callback) => {
  if (!event.body) {
    callback(null, createInvalidResponse());
    return;
  }
  var requestData = JSON.parse(event.body);
  if (!('repo' in requestData) || !('timestamp' in requestData)) {
    callback(null, createInvalidResponse());
    return;
  }
  let repo = requestData['repo'];
  let time = requestData['timestamp'];

  s3.getObject(FILE_SYNC_TIME, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(null, createErrorResponse());
    } else {
      var timeMapping = JSON.parse(data.Body.toString());
      timeMapping[repo] = time;
      s3.putObject({
        Bucket: 'cs3219.gitguard',
        Key: 'time.json',
        Body: JSON.stringify(timeMapping)
      }, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          callback(null, createErrorResponse());
        } else {
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              message: 'Success'
            }),
          });
        }
      });
    }
  });
};

module.exports.getSyncTime = (event, context, callback) => {
  s3.getObject(FILE_SYNC_TIME, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(null, createErrorResponse());
    } else {
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({
          message: 'Success',
          data: data.Body.toString()
        }),
      });
    }
  });
};

module.exports.getSubscription = (event, context, callback) => {
  s3.getObject(FILE_SUBSCRIPTION, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(null, createErrorResponse());
    } else {
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({
          message: 'Success',
          data: data.Body.toString()
        }),
      });
    }
  });
};

module.exports.subscribeEmails = (event, context, callback) => {
  if (!event.body) {
    callback(null, createInvalidResponse());
    return;
  }
  var requestData = JSON.parse(event.body);
  if (!('repo' in requestData) || !('emails' in requestData)) {
    callback(null, createInvalidResponse());
    return;
  }

  var repo = requestData['repo'];
  var emails = requestData['emails'];

  s3.getObject(FILE_SUBSCRIPTION, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(null, createErrorResponse());
    } else {
      var subscriptions = JSON.parse(data.Body.toString());
      subscriptions[repo] = emails;
      s3.putObject({
        Bucket: 'cs3219.gitguard',
        Key: 'subscription.json',
        Body: JSON.stringify(subscriptions)
      }, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          callback(null, createErrorResponse());
        } else {
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              message: 'Success'
            }),
          });
        }
      });
    }
  });
};