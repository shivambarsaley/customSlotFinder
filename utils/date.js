'use strict';
const dateFns = require('date-fns');
const today = dateFns.startOfToday();

const dateRange = (dayLimit) => dateFns.eachDayOfInterval({
  start: today,
  end: dateFns.addDays(today, dayLimit)
})

const formatDate = date => dateFns.format(date, 'dd-MM-yyyy');
const now = (format= 'dd-MM-yyyy::HH:mm') => dateFns.format(Date.now(), format);

module.exports = {dateRange, formatDate, now};
