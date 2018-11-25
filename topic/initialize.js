const fromBin = require('../lib/fromBin');
const fs = require('fs-extra');

module.exports = () => {
  fs.ensureDirSync(fromBin());
};
