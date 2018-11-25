const path = require('path');
const dependencies = require('../lib/dependencies');
const fromBin = require('../lib/fromBin');
const runner = require('../lib/runner');

module.exports = () => {
  runner.executeOrSkip({
    fileCheck: fromBin('classes-dex2jar'),
    fn() {
      runner.runShellSync(
        'Convert the dex to jar',
        [
          path.normalize(fromBin('dex-tools-2.0/dex2jar-2.0/d2j-dex2jar')),
          fromBin('old-watchfaces/classes.dex'),
          '-o',
          fromBin('classes-dex2jar.jar'),
        ],
      );

      return dependencies.extractZip({
        file: fromBin('classes-dex2jar.jar'),
        destination: fromBin('classes-dex2jar'),
      });
    },
  })
}