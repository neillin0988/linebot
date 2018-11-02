import {
  curryPushMessage,
  curryPushImage
} from '../common/util.js'

import {
  天氣
} from '../spider/天氣.js'
import {
  正妹
} from '../spider/正妹.js'

/**
 * 關鍵字指令
 * 
 * @param {*} client 
 * @param {*} event 
 */
function handleEvent(client, event) {
  var source = event.source;
  var pushMessage = curryPushMessage(client, source);
  var pushImage = curryPushImage(client, source);
  var inputMsg = event.message.text;
  
  switch (inputMsg) {
    case '-h':
    case '-help':
      pushMessage(help());
      break;
    case '抽':
      正妹(pushMessage, pushImage);
      break;
  }
  if (inputMsg.indexOf('天氣') > -1) {
    var target = inputMsg.replace('天氣', '').trim();
    天氣(pushMessage, target);
  }
}

function help() {
  return `
關鍵字
天氣 : ex : 台北天氣
抽 :
  `
}

export {
  handleEvent
};