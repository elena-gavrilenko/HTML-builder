const fs = require('fs');
const path = require('path');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const newStyles = path.join(__dirname, 'project-dist', 'style.css');
const folderForSaving = path.join(__dirname, 'project-dist');
const newFile = path.join(folderForSaving, 'index.html');
const assets = path.join(__dirname, 'assets');
const newAssets = path.join(folderForSaving, 'assets');

async function createFolder(nameFolder) {
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
  const files = await fs.promises.readdir(readFrom);
  let text = await fs.promises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  await Promise.all(
    files.map(async (file) => {
      const stats = await fs.promises.stat(path.join(readFrom, file));
      if (stats.isFile && `${file.split('.')[1]}` === 'html') {
        let re = new RegExp(`{{${file.split('.')[0]}}}`, 'i');
        let fileContent = await fs.promises.readFile(
          path.join(readFrom, file),
          'utf-8',
        );
        text = text.replace(re, fileContent);
      }
    }),
  );
  fs.promises.writeFile(newFile, text);
}

async function copyDirs(readFrom, writeWhere) {
  const items = await fs.promises.readdir(readFrom);
  await Promise.all(
    items.map(async (item) => {
      const stats = await fs.promises.stat(path.join(readFrom, item));

      if (stats.isDirectory()) {
        await createFolder(path.join(writeWhere, item));
        await copyDirs(path.join(readFrom, item), path.join(writeWhere, item));
      } else {
        await fs.promises.copyFile(
          path.join(readFrom, item),
          path.join(writeWhere, item),
        );
      }
    }),
  );
}

async function copyObjects() {
  // создаем папку 'project-dist'
  await createFolder(folderForSaving);
  // сливаем стили  в файл style.css
  mergeFilesIntoOne(styles);
  // записываем файл index.html в папку project-dist
  await fs.promises.writeFile(newFile, '');
  // записываем компоненты в файл index
  replacingPartsFile(components, newFile);
  // создаем папку assets
  await createFolder(newAssets);
  // копируем папку assets
  await copyDirs(assets, newAssets);
}
copyObjects();
