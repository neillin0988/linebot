import {
  handleEvent
} from './sample/sample_01.js'

let line = require('@line/bot-sdk');
let express = require('express');
const config = require('../resource/config.json');
const client = new line.Client(config);

const app = express();
app.listen(8080);

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(function (event) {
      if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
      }
      handleEvent(client, event);
    }))
    .then((result) => res.json(result));
});