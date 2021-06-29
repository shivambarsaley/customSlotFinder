'use strict';

const TelegramBot = require('node-telegram-bot-api');
const {convertSlotsToFlatList} = require('./transformers')
const {stateToMessageTitleMap} = require('../config')
const {exec} = require('child_process');

const {chatId, token, env} = process.env;
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  if (msg.text.toString().toLowerCase() === 'test') {
    console.log(msg.chat.id);
    bot.sendMessage(msg.chat.id, "Hello dear user");
  }
});


const formatMessage = (slot) => ['date', 'pincode', 'name', 'available_capacity_dose2', 'min_age_limit', 'address']
  .reduce((agg, prop) => `${agg}<b>${prop.toUpperCase()}</b>:: ${slot[prop]} \n`, '');

const generateNotification = (slotsFilename, state) => {
  if (env === 'local') {
    exec(`osascript -e 'display notification \"Check for file ${slotsFilename}\" with title \"${stateToMessageTitleMap[state]}\"'`);
  } else if (state === 'newSlots') {
    const slots = convertSlotsToFlatList(slotsFilename);
    const message = slots.reduce((agg, slot) => `${agg} ${formatMessage(slot)}\n`, '')
    bot.sendMessage(chatId, message, {parse_mode: "HTML"});
  } else {
    console.log('Not generating notification for', {slotsFilename, state, env: process.env.env});
  }
}

const healthCheckAlert = (url) => bot.sendPhoto(chatId, url);

const crashAlert = (err) => bot.sendMessage(chatId, err.toString());

module.exports = {generateNotification, healthCheckAlert, crashAlert}
