const fs = require('fs');
const path = require('path');
const readFrom = path.join(__dirname, 'files');

async function copyObjects(folder) {
  await fs.promises.rm(path.join(__dirname, 'files-copy'), {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(
    path.join(__dirname, 'files-copy'),
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );
  const files = await fs.promises.readdir(folder);
  files.forEach((file) => {
    fs.stat(path.join(readFrom, file), (errStat, stats) => {
      if (errStat) throw errStat;
      if (stats.isDirectory()) {
        copyObjects(path.join(readFrom, file));
      } else {
        fs.copyFile(
          path.join(readFrom, file),
          path.join(__dirname, 'files-copy', file),
          (err) => {
            if (err) throw err;
          }
        );
      }
    });
  });
}
fs.stat(path.join(__dirname, 'files-copy'), async (err) => {
  if (!err) {
    await fs.promises.rm(path.join(__dirname, 'files-copy'), {
      recursive: true,
      force: true,
    });
  }
  await fs.promises.mkdir(
    path.join(__dirname, 'files-copy'),
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );
  await copyObjects(readFrom);
});