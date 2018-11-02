import {
  curryPushMessage
} from '../common/util.js'
const config = require('../../resource/config.json');

var olamiLocalizationUrl = 'https://tw.olami.ai/cloudservice/api';
var olamiAppKey = config.olamiAppKey;
var olamiAppSecret = config.olamiAppSecret;

var NLUApiSample = require('../../resource/NluApiSample.js');
var nluApi = new NLUApiSample();
nluApi.setLocalization(olamiLocalizationUrl);
nluApi.setAuthorization(olamiAppKey, olamiAppSecret);

/**
 * 串 OLAMI API
 * 
 * @param {*} client 
 * @param {*} event 
 */
function handleEvent(client, event) {
  var source = event.source;
  var pushMessage = curryPushMessage(client, source);

  var $received = $receivedUserTypeMessage(event.message.text);

  $received.then(pushMessage);
}

function $receivedUserTypeMessage(userTypeMessage) {

  return new Promise(function (resolve, reject) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the template example. Otherwise, just echo the text we received.
    // 判斷使用者輸入的文字是否為關鍵字
    switch (userTypeMessage) {
      // case 'generic':
      //   sendGenericMessage(senderID);
      //   break;

      default:


        // 將使用者輸入的資訊導入 OLAMI NLU API 當中
        nluApi.getRecognitionResult("nli", userTypeMessage,
          function (resultArray) {
            var sendMessage = "";

            console.log(resultArray)
            resultArray.forEach(function (result, index, arr) {
              sendMessage += result + "\n";
            });

            resolve(sendMessage)
          },
          function (baikeArray) { // 回傳值是百科內容，需要套用template去顯示 
            var subtitle = "";
            baikeArray[1].forEach(function (item, index, arr) {
              subtitle += item + " : " + baikeArray[2][index] + "\n";
            });
            console.log("subtitle = " + subtitle)

          });
    }
  });
}

export {
  handleEvent
};