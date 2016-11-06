'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var nodemailer = require("nodemailer");
var moment = require("moment");
var smtpTransport = require('nodemailer-smtp-transport');

const FILE_REPO_DETAIL = {
  Bucket: 'cs3219.gitguard',
  Key: 'repo.json'
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

  s3.getObject(FILE_REPO_DETAIL, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(null, createErrorResponse());
    } else {
      var timeMapping = JSON.parse(data.Body.toString());
      timeMapping[repo] = timeMapping[repo] || {time: Math.floor(Date.now() / 1000), emails: []};
      timeMapping[repo]['time'] = time;
      s3.putObject({
        Bucket: 'cs3219.gitguard',
        Key: 'repo.json',
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

module.exports.getRepoDetail = (event, context, callback) => {
  s3.getObject(FILE_REPO_DETAIL, function(err, data) {
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

  var repo = requestData.repo;
  var emails = requestData.emails;

  s3.getObject(FILE_REPO_DETAIL, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(null, createErrorResponse());
    } else {
      var subscriptions = JSON.parse(data.Body.toString());
      subscriptions[repo] = subscriptions[repo] || {time: Math.floor(Date.now() / 1000), emails: []};
      subscriptions[repo].emails = emails;
      s3.putObject({
        Bucket: 'cs3219.gitguard',
        Key: 'repo.json',
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


function getMessage(since, repo) {
  var start = moment(since * 1000);
  var end = moment();
  var diff = start.diff(end);
  var o = moment.duration(diff);
  var duration = Math.floor(o.asHours()) + 'h ' + o.minutes() + 'm ' + o.seconds() + 's';
  return 'Hi there,\n\n' +
    'This is a friendly notification from Shōki.\nIt has been ' + o.humanize() + ' (' + duration + ') since your last visit on ' + start.format('llll') + '(UTC) for Github repo ' + repo +
    '.\nPlease come back and check it out.\n\nShōki Team';
}

function send(emails, repoName, lastVisit) {
  var transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
      user: 'shouki@railgun.sshz.org',
      pass: '<Password>'
    }
  }));

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"Shōki App" <shouki@railgun.sshz.org>', // sender address
    bcc: emails,
    subject: 'Message from Shōki', // Subject line
    text: getMessage(lastVisit, repoName)
  };

  // send mail with defined transport object
  transport.sendMail(mailOptions, function(error, info){
    if(error){
      console.error(error);
      return;
    }
    console.log('Message sent: ' + info.response);
  });
}

module.exports.sendEmail = (event, context, callback) => {
  s3.getObject(FILE_REPO_DETAIL, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      var mapping = JSON.parse(data.Body.toString());
      Object.keys(mapping).forEach(function(repoName) {
        var repoData = mapping[repoName];
        let time = repoData.time;
        let emails = repoData.emails;
        send(emails, repoName, time);
      });

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
};


