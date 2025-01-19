const fs = require('fs');
const path = require('path');
const readFrom = path.join(__dirname, 'files');

async function copyObjects(folder) {
  await fs.promises.rm(path.join(__dirname, 'files-copy'), {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(path.join(__dirname, 'files-copy'), {
    recursive: true,
  });
  const files = await fs.promises.readdir(folder);
  await Promise.all(
    files.map(async (file) => {
      const stats = await fs.promises.stat(path.join(readFrom, file));
      if (stats.isDirectory()) {
        await copyObjects(path.join(readFrom, file));
      } else {
        fs.promises.copyFile(
          path.join(readFrom, file),
          path.join(__dirname, 'files-copy', file),
        );
      }
    }),
  );
}

copyObjects(readFrom);
