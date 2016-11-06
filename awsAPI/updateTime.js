var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = function(event, context) {
    //console.log(JSON.stringify(event, null, 2));  
    var timestamp = event.timestamp;
    console.log(timestamp);
    var body = "";
    body += event.timestamp;
    var s3 = new AWS.S3();
    var param = {Bucket: 'githubvisual', Key: 'Timestamp', Body: body};
    console.log("s3");
    s3.upload(param, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response

        console.log('actually done!');
        var result = {};
        result['result'] = 0;
        result['message'] = 'succeed!'
        context.succeed(result);
    });
    return("Updated Successfully");

    console.log('done?');
    //context.done();
};