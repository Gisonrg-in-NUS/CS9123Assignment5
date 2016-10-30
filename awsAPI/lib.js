function include(jsurl) {
    if (jsurl == null || typeof(jsurl) != 'string') return;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = jsurl;
    /*script.setAttribute("src",jsurl);*/
    document.head.appendChild(script);
}
include("https://sdk.amazonaws.com/js/aws-sdk-2.6.12.min.js");
var bucket;
var initFlag = 0;
function amazonInit(){
	if (initFlag) return;	
	AWS.config.update({
        accessKeyId : 'AKIAJV24DBHLQGYKG5CA',
        secretAccessKey : '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'
    });
    AWS.config.region = 'ap-southeast-1';
    bucket = new AWS.S3({params: {Bucket: 'githubvisual'}});
    initFlag = 1;
}
function updateEmailList(emailList){
	//File file = new File(filePath);
	if (initFlag == 0) amazonInit();
	var body = "";
	for (var i = 0; i< emailList.length; i++){
		body += emailList[i] +" ";
	}
	var params = {Key: 'EmailList', ContentType: "text", Body: body};
	bucket.upload(params).on('httpUploadProgress', function(evt) {
		console.log("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total)+'%');
	}).send(function(err, data) {
		console.log("File uploaded successfully.");
	});
}
function updateTime(){
	if (initFlag == 0) amazonInit();
	var body = new Date().getTime();
	body = body+"";
	var params = {Key: 'LastAccessTime', ContentType: "time", Body: body};
	bucket.upload(params).on('httpUploadProgress', function(evt) {
		console.log("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total)+'%');
	}).send(function(err, data) {
		console.log("File uploaded successfully.");
	});
}
var listPara1 = {Prefix: ""}; 
var listPara2 = 
	function (err, data) {
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            var objKeys = "";
            data.Contents.forEach(function (obj) {
                objKeys += obj.Key + "<br>";
            });
            console.log(objKeys);
        }
    };
function listObject(){
	bucket.listObjects(listPara1,listPara2);
}