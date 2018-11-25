const consola = require('consola');
const fs = require('fs-extra');
const fromBin = require('../lib/fromBin');
const dependencies = require('../lib/dependencies');

const fromOutput = (filePath = '') => './output/' + filePath;

const packageName = 'HuamiWatchFaces2';

module.exports = async () => {
  consola.info('Cloning HuamiWatchFaces2 folder to /bin/output');
  await fs.copy(
    fromBin(packageName),
    fromOutput(packageName),
  );

  consola.info('Replacing HardwareList.class');
  await fs.copy(
    fromBin('classes-dex2jar/com/ingenic/iwds/HardwareList.class'),
    fromOutput('HuamiWatchFaces2/com/ingenic/iwds/HardwareList.class'),
  );

  consola.info('Deleting LowPowerClock.class');
  await fs.unlink(
    fromOutput('HuamiWatchFaces2/com/huami/watch/watchface/slpt/Lock/LowPowerClock.class')
  );

  consola.info('Packing HuamiWatchFaces2.jar');
  await dependencies.packZip({
    inputDirectory: fromOutput(packageName),
    outputPath: fromOutput(packageName + '.jar'),
  });
}
