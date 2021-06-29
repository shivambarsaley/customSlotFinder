const got = require('got');

const performHealthCheck = async () => {
  return got('https://meme-api.herokuapp.com/gimme').json();
}

module.exports = performHealthCheck;
