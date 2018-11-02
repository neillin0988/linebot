import {
  curryPushMessage
} from '../common/util.js'

/**
 * 取得 user profile
 * 
 * @param {*} client 
 * @param {*} event 
 */
function handleEvent(client, event) {
  var source = event.source;
  var pushMessage = curryPushMessage(client, source);

  client.getProfile(source.userId).then(function (profile) {
    pushMessage(
      `Hello ${profile.displayName} ： ${event.message.text}`
    );
  })
}

export {
  handleEvent
};