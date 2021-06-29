'use strict';

const {getPathToResultsDir} = require('./file');

const convertSlotsToFlatList = (fileName) => {
  const data = require(`${getPathToResultsDir()}/${fileName}`);
  const slots = Object.values(data).reduce((agg, current) => {
    agg.push(...Object.values(current));
    return agg;
  }, []);
  return slots.flat(10);
}


const getCenterIdsFromSlots = (fileName) => {
  const slots = convertSlotsToFlatList(fileName);
  return slots.map(({center_id}) => center_id);
}

module.exports = {convertSlotsToFlatList, getCenterIdsFromSlots}
