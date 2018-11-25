const shell = require('./shell');
const consola = require('consola');
const fs = require('fs');

const split = x => x.replace(/\r/g, '').split('\n');
const assert = assertions => assertions.every(condition => condition);

const runner = {
  runShellSync: (name, commands, config = {}) => {
    consola.info(name);
    shell(commands, (x) => {
      const lines = split(x);
      const ok = assert(config.assertions ? config.assertions(lines) : []);
      config.execute ? config.execute(lines) : null;
      if (!ok) {
        consola.error(`Failed: ${config.errorMessage || name}`);
      }
    });
  },

  runTopic: (title, fn, ...params) => {
    consola.info({
      message: title,
      badge: true,
    })
    return fn(...params);
  },

  executeOrSkip: async ({
    fileCheck,
    fn,
  }) => {
    if (fs.existsSync(fileCheck)) {
      consola.info(`SKIP: ${fileCheck}`);
      return;
    } else {
      await fn();
      consola.success(`CREATED: ${fileCheck}`);
    }
  },
};

module.exports = runner;
