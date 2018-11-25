const fs = require('fs-extra');
const { compile } = require('nexe');
const packageJson = require('./package.json');

fs.ensureDirSync('./dist/')
const findArg = (name) => {
  const item = (process.argv.slice(2).find(x => x.includes(`--${name}=`)) || `--${name}=`)
  return item.split('=')[1];
}

compile({
  name: packageJson.name,
  input: './index.js',
  output: './dist/' + packageJson.name,
  target: findArg('target'),
  rc: {
    CompanyName: "amoshydra",
    PRODUCTVERSION: packageJson.version,
    FILEVERSION: packageJson.version
  },
});
