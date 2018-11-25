const consola = require('consola');
const path = require('path');
const dependencies = require('../lib/dependencies');
const fromBin = require('../lib/fromBin');
const runner = require('../lib/runner');
const packageJson = require('../package.json');

const APK_FILE_NAME = 'old-watchfaces';
const THIRD_PARTY_APK_MIRROR = packageJson.externalDependencies['old-watchfaces-url'];

module.exports = async () => {
  const oat2dexFilename = 'oat2dex.jar';
  await runner.executeOrSkip({
    fileCheck: fromBin(oat2dexFilename),
    fn: () => dependencies.get({
        repo: 'testwhat/SmaliEx',
        filename: oat2dexFilename,
        destination: fromBin(),
      }),
  });

  const dexToolsUnzippedFilename = 'dex-tools-2.0';
  await runner.executeOrSkip({
    fileCheck: fromBin(dexToolsUnzippedFilename),
    fn: async () => {
      const dexToolsFilename = dexToolsUnzippedFilename + '.zip';
      await runner.executeOrSkip({
        fileCheck: fromBin(dexToolsFilename),
        fn: async () => dependencies.get({
            repo: 'pxb1988/dex2jar',
            filename: dexToolsFilename,
            destination: fromBin(),
          }),
      });

      await dependencies.extractZip({
        file: fromBin(dexToolsFilename),
        destination: fromBin(dexToolsUnzippedFilename),
      });
    },
  });


  const oldWatchfacesUnzippedFilename = APK_FILE_NAME;
  await runner.executeOrSkip({
    fileCheck: fromBin(oldWatchfacesUnzippedFilename),
    fn: async () => {
      const oldWatchfacesFilename = APK_FILE_NAME + '.apk';

      await runner.executeOrSkip({
        fileCheck: fromBin(oldWatchfacesFilename),
        fn: async () => dependencies.download({
          url: THIRD_PARTY_APK_MIRROR,
          filename: oldWatchfacesFilename,
          destination: fromBin(),
        })
          .catch((error) => {
            consola.error('Failed to obtain old watchfaces APK.'),
            [
              'Please make sure the url below is still accessible.',
              `> "${THIRD_PARTY_APK_MIRROR}"`,
              'Otherwise, you may need to find another way to obtain this file and place it as',
              `> "${path.resolve(fromBin(oldWatchfacesFilename))}"`,
              ' ',
            ].forEach(x => consola.error({
              message: x,
              badge: false,
            }));
            throw new Error(error.message);
          })
        ,
      })

      await dependencies.extractZip({
        file: fromBin(oldWatchfacesFilename),
        destination: fromBin(oldWatchfacesUnzippedFilename),
      });
    },
  });
};
