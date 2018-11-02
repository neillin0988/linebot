const request = require('request');
const cheerio = require('cheerio');
import {
  curryPushMessage,
} from '../common/util.js'
import {
  Msg
} from '../common/util.js'

// const url = 'http://www.cwb.gov.tw/V7/forecast/taiwan/Taipei_City.htm'
const urlMapping = {
  '新北/台北縣/臺北縣': 'https://www.cwb.gov.tw/V7/forecast/taiwan/New_Taipei_City.htm',
  '台北/臺北': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Taipei_City.htm',
  '桃園': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Taoyuan_City.htm',
  '台中/臺中': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Taichung_City.htm',
  '台南/臺南': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Tainan_City.htm',
  '高雄': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Kaohsiung_City.htm',
  '基隆': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Keelung_City.htm',
  '新竹縣': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Hsinchu_County.htm',
  '新竹': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Hsinchu_City.htm',
  '苗栗': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Miaoli_County.htm',
  '彰化': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Changhua_County.htm',
  '南投': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Nantou_County.htm',
  '雲林': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Yunlin_County.htm',
  '嘉義縣': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Chiayi_County.htm',
  '嘉義': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Chiayi_City.htm',
  '屏東': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Pingtung_County.htm',
  '宜蘭': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Yilan_County.htm',
  '花蓮': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Hualien_County.htm',
  '台東/臺東': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Taitung_County.htm',
  '澎湖': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Penghu_County.htm',
  '金門': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Kinmen_County.htm',
  '連江/馬祖': 'https://www.cwb.gov.tw/V7/forecast/taiwan/Lienchiang_County.htm',
}

let msg;

function _findKey(target) {
  return Object.keys(urlMapping).filter(k => {
    return k.split('/').filter(k2 => {
      return target.indexOf(k2) >= 0;
    }).length > 0;
  })[0];
}

function 天氣(pushMessage, target) {
  msg = new Msg();
  var key = _findKey(target);
  var url = urlMapping[key];
  if (!url) {
    return;
  }

  msg.append(key).newLine()
    .append(url).newLine();

  request(url, (err, res, body) => {
    const $ = cheerio.load(body)
    $('#box8 .FcstBoxTable01 tbody tr').each(function (i, elem) {
      msg.append($(this).find('th').eq(0).text()).newLine()
        .append('溫度 : ' + $(this).find('td').eq(0).text()).newLine()
        .append('天氣 : ' + $(this).find('img').prop('title')).newLine()
        .append('舒適度 : ' + $(this).find('td').eq(2).text()).newLine()
        .append('降雨機率 : ' + $(this).find('td').eq(3).text()).newLine()
        .newLine();
    })


    pushMessage(msg.toString())
  })
}

export {
  天氣
};