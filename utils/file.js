'use strict';

const fs = require('fs');
const path = require('path');

const getSortedFiles = async (dir) => {
  const files = await fs.promises.readdir(dir);

  return files
    .map(fileName => ({
      name: fileName,
      time: fs.statSync(`${dir}/${fileName}`).mtime.getTime(),
    }))
    .sort((a, b) => a.time - b.time)
    .map(file => file.name);
}

const getPathToResultsDir = () => path.join(__dirname, '..', 'results');

const writeToFile = (filename, data) => fs.writeFileSync(`${getPathToResultsDir()}/${filename}`, JSON.stringify(data, null, 2));

module.exports = {getSortedFiles, writeToFile, getPathToResultsDir};
