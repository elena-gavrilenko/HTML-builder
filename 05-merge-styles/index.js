const fs = require('fs');
const path = require('path');
const fromRead = path.join(__dirname, 'styles');
const newStyles = path.join(__dirname, 'project-dist', 'bundle.css');

async function makeFolder() {
  fs.readdir(fromRead, { withFileTypes: true }, (err, data) => {
    if (err) throw err;
    fs.promises.writeFile(newStyles, '');
    for (let file of data) {
      if (file.name.split('.')[1] == 'css' && file.isFile()) {
        const readableStream = fs.createReadStream(
          path.join(fromRead, file.name),
        );
        readableStream.on('data', (chunk) => {
          fs.promises.appendFile(newStyles, chunk);
        });
      }
    }
  });
}

makeFolder();
