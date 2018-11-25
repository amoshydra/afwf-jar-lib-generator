const { spawnSync } = require('child_process');
const consola = require('consola')

module.exports = (
  params = ['java'],
  stdoutFn = x => consola.log(x),
  stderrFn = x => consola.error(x)
) => {
  const { stdout, stderr, status } = spawnSync(params[0], params.slice(1), {
    encoding: 'utf8',
    shell: true,
  });

  if (stdout) {
    stdoutFn(stdout);
  }
  if (stderr) {
    stderrFn(stderr);
  }

  if (status > 0) {
    throw new Error(`child process exited with code ${status}`);
  }
}
