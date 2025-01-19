const fs = require('fs');
const path = require('path');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const newStyles = path.join(__dirname, 'project-dist', 'styles.css');
const folderForSaving = path.join(__dirname, 'project-dist');
const newFile = path.join(folderForSaving, 'index.html');
const assets = path.join(__dirname, 'assets');
const newAssets = path.join(folderForSaving, 'assets');

async function createFolder(nameFolder) {
  //   console.log(nameFolder);
  await fs.promises.rm(path.join(nameFolder), {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(path.join(nameFolder), {
    recursive: true,
  });
}

async function mergeFilesIntoOne(readFrom) {
  fs.readdir(readFrom, { withFileTypes: true }, (err, data) => {
    if (err) throw err;
    fs.promises.writeFile(newStyles, '');
    for (let file of data) {
      if (file.name.split('.')[1] == 'css' && file.isFile()) {
        const readableStream = fs.createReadStream(
          path.join(readFrom, file.name),
        );
        readableStream.on('data', (chunk) => {
          fs.promises.appendFile(newStyles, chunk);
        });
      }
    }
  });
}

async function replacingPartsFile(readFrom, newFile) {
  //   console.log(newFile);
  const files = await fs.promises.readdir(readFrom);
  let text = await fs.promises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );

  await Promise.all(
    files.map(async (file) => {
      const stats = await fs.promises.stat(path.join(readFrom, file));

      //   console.log(stats.isFile);
      if (stats.isFile) {
        let re = new RegExp(`{{${file.split('.')[0]}}}`, 'i');
        let fileContent = await fs.promises.readFile(
          path.join(readFrom, file),
          'utf-8',
        );
        // console.log(fileContent);
        text = text.replace(re, fileContent);
        // console.log(text);
      }
    }),
  );
  fs.promises.writeFile(newFile, text);
}
async function copyDirs(readFrom, writeWhere) {
  //   console.log(readFrom);
  const items = await fs.promises.readdir(readFrom);

  await Promise.all(
    items.map(async (item) => {
      //   console.log(item);
      const stats = await fs.promises.stat(path.join(readFrom, item));

      if (stats.isDirectory()) {
        // console.log(path.join(writeWhere, item));
        await createFolder(path.join(writeWhere, item));
        await copyDirs(path.join(readFrom, item));
      } else {
        console.log(writeWhere);
        await fs.promises.copyFile(
          path.join(readFrom, item),
          path.join(writeWhere, item),
        );
      }
    }),
  );
}

async function copyObjects() {
  await createFolder(folderForSaving);

  mergeFilesIntoOne(styles);
  // записываем файл в папку project-dist
  await fs.promises.writeFile(newFile, '');
  // записываем компоненты в файл index
  replacingPartsFile(components, newFile);
  await createFolder(newAssets);
  await copyDirs(assets, newAssets);
}
copyObjects();
