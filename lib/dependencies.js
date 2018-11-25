const axios = require('axios');
const fs = require('fs');
const path = require('path');
const StreamZip = require('node-stream-zip');
const archiver = require('archiver');

const githubConfig = {
  headers: {
    'User-Agent': 'Awesome-Octocat-App',
  },
};

const dependencies = {
  download: async({
    url,
    destination,
    filename,
  }) => axios.get(
    url,
    {
      ...githubConfig,
      responseType: 'stream',
    },
  )
    .then(({ data }) => {
      data.pipe(fs.createWriteStream(`${destination}${filename}`));
      return new Promise((resolve, reject) => {
        data.on('end', () => resolve());
        data.on('error', () => reject());
      });
    }),

  get: async ({
    repo,
    filename,
    destination,
  }) => {
    const downloadUrl = await axios.get(
      `https://api.github.com/repos/${repo}/releases/latest`,
      githubConfig,
    )
      .then(({ data }) => data.assets.find(({ name }) => name === filename))
      .then(({ browser_download_url }) => browser_download_url)
    ;

    return dependencies.download({
      url: downloadUrl,
      filename,
      destination,
    });
  },

  extractZip: async ({
    file,
    destination,
  }) => {
    const zip = new StreamZip({
      file,
      storeEntries: true
    });

    return new Promise((resolve, reject) => {
      zip.on('ready', () => {
        fs.mkdirSync(destination);
        zip.extract(null, destination, err => {
          if (err) {
            reject(err);
          }
          zip.close((closeErr) => {
            (!closeErr) ? resolve() : reject(closeErr);
          });
        });
      });
    })
  },

  packZip: ({
    inputDirectory,
    outputPath,
  }) => new Promise((resolve, reject) => {
    const output = fs.createWriteStream(
      path.normalize(outputPath),
    );
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(inputDirectory, false);
    archive.finalize();
  }),
};

module.exports = dependencies;