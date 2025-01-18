const fs = require('fs');
const path = require('path');
const { stdout } = process;
const folder = path.join(__dirname, 'secret-folder');

fs.promises.readdir(folder).then((files) => {
  files.forEach((file) => {
    fs.stat(folder + '/' + file, (err, stats) => {
      if (err) throw err;
      if (!stats.isDirectory()) {
        stdout.write(
          `${file.split('.')[0]} - ${path.extname(file).slice(1)} - ${
            stats.size
          } bytes\n`,
        );
      }
    });
  });
});
