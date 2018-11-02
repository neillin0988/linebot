var curry = require('lodash').curry;

function Msg() {
  var result = '';
  this.toString = function () {
    return result;
  }

  this.append = function (text) {
    result += text;
    return this;
  }
  this.newLine = function (text) {
    result += '\r\n';
    return this;
  }
}


/**
 * 
 * @param {*} source 
 */
function getSourceTypeId(source) {
  let targetId;
  switch (source.type) {
    case 'user':
      targetId = source.userId;
      break;
    case 'room':
      targetId = source.roomId;
      break;
    case 'group':
      targetId = source.groupId;
      break;
  }

  return targetId;
}

var curryPushImage = curry(function (client, source, imgUrl) {
  client.pushMessage(getSourceTypeId(source), {
    type: 'image',
    "originalContentUrl": imgUrl,
    "previewImageUrl": imgUrl
  });
});

var curryPushMessage = curry(function (client, source, text) {
  client.pushMessage(getSourceTypeId(source), {
    type: 'text',
    text: text
  });
});

export {
  getSourceTypeId,
  curryPushMessage,
  curryPushImage,
  Msg
};