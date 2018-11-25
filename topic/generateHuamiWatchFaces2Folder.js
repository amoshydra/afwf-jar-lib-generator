const path = require('path');
const dependencies = require('../lib/dependencies');
const fromBin = require('../lib/fromBin');
const runner = require('../lib/runner');

const extractOdexFromWatch = () => {
  runner.runShellSync(
    'Checking for connected devices',
    ['adb', 'devices'],
    {
      assertions: (lines) => [
        lines[0] === 'List of devices attached',
        lines.slice(1).some(x => (x !== '')),
      ],
      errorMessage: 'No ADB devices found. Please connect your device.'
    }
  );
  const getFilePath = (append = '') => `/system/app/HuamiWatchFaces${append}/mips/HuamiWatchFaces${append}.odex`
  const outputOdexFilePath = fromBin('HuamiWatchFaces2.odex');

  runner.runShellSync(
    'Check if HuamiWatchFaces odex file exist',
    ['adb', 'shell', 'ls', getFilePath()],
    {
      execute: (lines) => {
        if (lines[0] === getFilePath()) {
          runner.runShellSync(
            'Extract HuamiWatchFaces odex file',
            ['adb', 'pull', getFilePath(), outputOdexFilePath],
          );
        }
      },
    }
  );
  runner.runShellSync(
    'Check if HuamiWatchFaces2 odex file exist',
    ['adb', 'shell', 'ls', getFilePath(2)],
    {
      execute: (lines) => {
        if (lines[0] === getFilePath(2)) {
          runner.runShellSync(
            'Extract HuamiWatchFaces2 odex file',
            ['adb', 'pull', getFilePath(2), outputOdexFilePath],
          );
        }
      },
    }
  );
};

const getJarFromOdex = () => {
  runner.runShellSync(
    'Convert the odex to dex',
    [
      'java',
      '-jar', fromBin('oat2dex.jar'),
      '-a', '22',
      '-o', fromBin(),
      'odex', fromBin('HuamiWatchFaces2.odex')
    ],
  );
  runner.runShellSync(
    'Convert the dex to jar',
    [
      path.normalize(fromBin('dex-tools-2.0/dex2jar-2.0/d2j-dex2jar')),
      fromBin('HuamiWatchFaces2.dex'),
      '-o',
      fromBin('HuamiWatchFaces2.jar'),
    ],
  );
};

module.exports = () => runner.executeOrSkip({
    fileCheck: fromBin('HuamiWatchFaces2'),
    fn: async () => {
      await runner.executeOrSkip({
        fileCheck: fromBin('HuamiWatchFaces2.odex'),
        fn: () => extractOdexFromWatch(),
      });

      await runner.executeOrSkip({
        fileCheck: fromBin('HuamiWatchFaces2.jar'),
        fn: () => getJarFromOdex(),
      });

      await dependencies.extractZip({
        file: fromBin('HuamiWatchFaces2.jar'),
        destination: fromBin('HuamiWatchFaces2'),
      });
    },
  });
