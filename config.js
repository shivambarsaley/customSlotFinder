const states = {
  newSlots: 'newSlots',
  sameSlots: 'sameSlots'
}

module.exports = {
  cronExpression: '*/10 8-23,0-1 * * *',
  cronHealthCheck: '*/30 8-23,0-1 * * *',
  waitBetweenAPICalls: 1000,
  states,
  stateToMessageTitleMap: {
    [states.newSlots]: 'Newer Slots available since last check',
    [states.sameSlots]: 'Slots still available'
  },
  pinsToSearch:['560066', '560037', '560048', '560103', '560087'],
  dayLimit: 6
}
