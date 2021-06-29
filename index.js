'use strict';

const dateFns = require('date-fns');
const cron = require('node-cron');

const {getSortedFiles, writeToFile} = require('./utils/file');
const {generateNotification, healthCheckAlert, crashAlert} = require('./utils/notify');
const {getCenterIdsFromSlots} = require('./utils/transformers');
const {dateRange} = require('./utils/date');
const {getSlots} = require('./services/cowin');
const  healthCheck = require('./services/healthCheck');


const {pinsToSearch, dayLimit, states, cronExpression, cronHealthCheck} = require('./config');

const arrayEquality = (arr1, arr2) => arr1.length === arr2.length && arr1.every(u => arr2.includes(u));


const newSlotAvailableSinceLastCheck = (oldFileName, newFileName) => {
  if (!oldFileName) {
    return true;
  } else {
    const oldCenterIds = getCenterIdsFromSlots(oldFileName);
    const newCenterIds = getCenterIdsFromSlots(newFileName);
    console.log('Comparing slot Ids', {oldCenterIds, newCenterIds});
    return !arrayEquality(oldCenterIds, newCenterIds);
  }
}

const notify = (oldFileName, newFileName) => {
  if (newSlotAvailableSinceLastCheck(oldFileName, newFileName)) {
    generateNotification(newFileName, states.newSlots);
  } else {
    generateNotification(newFileName, states.sameSlots)
  }
}


const getLastCreatedReport = async () => {
  const list = await getSortedFiles('results');
  return list[list.length - 1];
}

cron.schedule(cronHealthCheck, async () => {
  const res = await healthCheck();
  healthCheckAlert(res.url);
})


cron.schedule(cronExpression, () => {
  getSlots(pinsToSearch, dateRange(dayLimit)).then(async res => {
    if (Object.keys(res).length) {
      const filenameTimeStamp = dateFns.format(Date.now(), "dd-MM-yyyy::HH:mm");
      const filename = `${filenameTimeStamp}.json`
      const oldFileName = await getLastCreatedReport();
      writeToFile(filename, res);
      console.log('Comparing slots between', 'oldFile', oldFileName, 'fileName', filename);
      notify(oldFileName, filename)
    }
    console.log(`Completed slot checking at ${dateFns.format(Date.now(), "dd-MM-yyyy::HH:mm")}`);
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  }).catch(crashAlert)
});
