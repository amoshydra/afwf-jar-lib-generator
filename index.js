const runner = require('./lib/runner');
const initialize = require('./topic/initialize');
const getDependencies = require('./topic/getDependencies');
const generateHuamiWatchFaces2Folder = require('./topic/generateHuamiWatchFaces2Folder');
const generateClassesDex2jarFolder = require('./topic/generateClassesDex2jarFolder');
const generateWorkingJar = require('./topic/generateWorkingJar');

const main = async () => {
  await runner.runTopic('Starting', initialize);
  await runner.runTopic('Retrieving dependencies', getDependencies);
  await runner.runTopic('Generate HuamiWatchFaces2 folder', generateHuamiWatchFaces2Folder);
  await runner.runTopic('Generate classes-dex2jar folder', generateClassesDex2jarFolder);
  await runner.runTopic('Generate working JAR', generateWorkingJar);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
