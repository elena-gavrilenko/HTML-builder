const fs = require('fs');
const path = require('path');
const readFrom = path.join(__dirname, 'files');
const writeWhere = path.join(__dirname, 'files-copy');

async function copyObjects(folder) {
  await fs.promises.rm(writeWhere, {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(writeWhere, {
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
          path.join(writeWhere, file),
        );
      }
    }),
  );
}

copyObjects(readFrom);
