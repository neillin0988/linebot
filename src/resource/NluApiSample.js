var http = require('http');
var request = require('request');
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite');
var url = require('url');
var md5 = require('md5');
var urlencode = require('urlencode');

var DumpIDSData = require('./DumpIDSData.js');
var dumpIDSData = new DumpIDSData();

var apiBaseUrl = '';
var appKey = '';
var appSecret = '';

function NluApiSample() {

}

/**
 * Setup your authorization information to access OLAMI services.
 *
 * @param appKey the AppKey you got from OLAMI developer console.
 * @param appSecret the AppSecret you from OLAMI developer console.
 */
NluApiSample.prototype.setAuthorization = function (appKey, appSecret) {
	this.appKey = appKey;
	this.appSecret = appSecret;
}

/**
 * Setup localization to select service area, this is related to different
 * server URLs or languages, etc.
 *
 * @param apiBaseURL URL of the API service.
 */
NluApiSample.prototype.setLocalization = function (apiBaseURL) {
	this.apiBaseUrl = apiBaseURL;
}

/**
 * Get the NLU recognition result for your input text.
 *
 * @param apiName the API name for 'api=xxx' HTTP parameter.
 * @param inputText the text you want to recognize.
 */
NluApiSample.prototype.getRecognitionResult = function (apiName, input, resultCallback, structureCallback) {
	var dateTime = Date.now();
	var timestamp = dateTime;

	var nliApiSample = this;
	var signMsg = this.preSignMsg(apiName, timestamp);
	var url = this.preRequestUrl(input, apiName, signMsg, timestamp);

	request.get({
		url: url,
	}, function (err, res, body) {
		if (err) {
			console.log(err);
		}
	}).on('response', function (response) {
		var bufferhelper = new BufferHelper();
		response.on('data', function (chunk) {
			bufferhelper.concat(chunk);
		});

		response.on('end', function () {
			var result = iconv.decode(bufferhelper.toBuffer(), 'UTF-8');

			console.log("---------- Test NLU API, api = " + apiName + " ----------");
			// console.log("Sending 'POST' request to URL : " + url);
			console.log("Result:\n" + result);
			console.log("------------------------------------------");

			var messageType = nliApiSample.getMessageType(result);

			switch (messageType) {
				case 'cooking':
					var cookingReturn = dumpIDSData.getCookingResult(result);
					cookingReturn[0] = nliApiSample.getMessageDescObj(result);
					resultCallback(cookingReturn);
					break;

				case 'baike':
					// 如果是百科則需要回傳結構資料，以利於套用 template
					var baikeReturn = dumpIDSData.geWikiResult(result);
					baikeReturn[0] = nliApiSample.getMessageDescObj(result);
					structureCallback(baikeReturn);
					break;

				case 'joke':
					var jokeReturn = dumpIDSData.geJokeResult(result);
					jokeReturn[0] = nliApiSample.getMessageDescObj(result);
					resultCallback(jokeReturn);
					break;

				case 'poem':
					var poemReturn = dumpIDSData.gePoemResult(result);
					poemReturn[0] = nliApiSample.getMessageDescObj(result);
					resultCallback(poemReturn);
					break;

				default:
					var resultArray = new Array(nliApiSample.getMessageDescObj(result))
					resultCallback(resultArray);
			}
		});
	});
}

// 取得伺服器回傳的訊息的種類
NluApiSample.prototype.getMessageType = function (serverResponse) {
	var json = JSON.parse(serverResponse);
	var messageType = json['data']['nli'][0]['type'];
	return messageType;
}

// 取得伺服器回傳的訊息描述
NluApiSample.prototype.getMessageDescObj = function (serverResponse) {
	var json = JSON.parse(serverResponse);
	var messageDescObj = json['data']['nli'][0]['desc_obj']['result'];
	return messageDescObj;
}

// Prepare message to generate an MD5 digest.
NluApiSample.prototype.preSignMsg = function (apiName, timestamp) {
	var msg = '';
	msg += this.appSecret;
	msg += 'api=';
	msg += apiName;
	msg += 'appkey=';
	msg += this.appKey;
	msg += 'timestamp=';
	msg += timestamp;
	msg += this.appSecret;
	// Generate MD5 digest.
	return md5(msg);
}

// Request NLU service by HTTP POST
NluApiSample.prototype.preRequestUrl = function (input, apiName, signMsg, timestamp) {
	var url = '';
	url += this.apiBaseUrl + '?_from=nodejs';
	url += '&appkey=' + this.appKey;
	url += '&api=';
	url += apiName;
	url += '&timestamp=' + timestamp;
	url += '&sign=' + signMsg;
	if (apiName == 'seg')
		url += '&rq=' + urlencode(input);
	else
		url += '&rq={"data":{"input_type":1,"text":"' + urlencode(input) + '"},"data_type":"stt"}';

	return url;
}

module.exports = NluApiSample;