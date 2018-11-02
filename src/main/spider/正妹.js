const request = require('request');
const cheerio = require('cheerio');
import {
  Msg
} from '../common/util.js'

const urls = ['https://hotptt.com/tag_beauty', 'https://hotptt.com/tag_look'];

let msg;

function 正妹(pushMessage, pushImage) {
  msg = new Msg();

  var url = urls[parseInt(Math.random() * urls.length, 10)]
  request(url, (err, res, body) => {
    let $ = cheerio.load(body);
    var length = $('div.media_name').length;
    var random = parseInt(Math.random() * length, 10);
    var atag = $('div.media_name').find('a').eq(random);
    var href = atag.prop('href');
    var title = atag.prop('title');

    pushMessage(title)

    request('https:' + href, (err, res, body) => {
      $ = cheerio.load(body);
      $('div#main-content a').each(function (index, ele) {
        var href = $(ele).prop('href');
        if (href.indexOf('.jpg') >= 0) {
          if (href.indexOf('https') == -1 && href.indexOf('http') == -1) {
            href = 'https:' + href;
          }
          if (href.indexOf('http://') >= 0) {
            href = href.replace('http', 'https');
          }

          setTimeout(function () {
            console.log(href)
            pushImage(href)
          }, 1000)
        }
      })
    })
  })
}

export {
  正妹
};