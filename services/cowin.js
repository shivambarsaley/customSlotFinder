'use strict';

const {formatDate, now} = require('../utils/date');
const cowin = require('cowin-api-client');

const sleep = (timeout) => new Promise(((resolve, reject) => {
  setTimeout(resolve, timeout);
}));


const isValidSession = session => session.fee_type === 'Paid' && session.vaccine === 'COVISHIELD' &&
  session.min_age_limit > 18 && session.available_capacity_dose2 > 1

const getSessions = async (pin, date) => {
  const {sessions = []} = await cowin.findByPin(pin, date);
  return sessions.filter(isValidSession);
}


const callWithSleep = async (func, args, timeout) => {
  const result = await func(...args);
  await sleep(timeout);
  return result;
}

const slotsForPin = async (pin, dates) => {
  console.log(`Fetching Slots for PIN: ${pin}`);
  const slotsPerDay = {};
  for (let date of dates) {
    const slots = await callWithSleep(getSessions, [pin, formatDate(date), 1000]);
    if (slots.length > 0) {
      slotsPerDay[date] = slots;
    }
  }
  console.log(`Fetching Slots for PIN: ${pin} Completed`);
  return slotsPerDay;
}


const getSlots = async (pinsToSearch, dateRange) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(`Started slot checking at ${now()}`)
  const slotsPerPin = {};
  for (let pin of pinsToSearch) {
    const slotForPin = await callWithSleep(slotsForPin, [pin, dateRange], 1000);
    if (Object.keys(slotForPin).length) {
      slotsPerPin[pin] = slotForPin;
    }
  }
  return slotsPerPin;
}

module.exports = {getSlots}
