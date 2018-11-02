import {
  curryPushMessage
} from '../common/util.js'

/**
 * 回覆訊息
 * 
 * @param {*} client 
 * @param {*} event 
 */
function handleEvent(client, event) {
  var source = event.source;
  var pushMessage = curryPushMessage(client, source);

  pushMessage(event.message.text);
}

export {
  handleEvent
};