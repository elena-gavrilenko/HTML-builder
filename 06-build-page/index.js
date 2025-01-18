const fs = require('fs');
const path = require('path');
const readFrom = path.join(__dirname, 'components');

async function copyObjects() {
  await fs.promises.rm(path.join(__dirname, 'project-dist'), {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(
    path.join(__dirname, 'project-dist'),
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );

  // записываем файл в папку project-dist
  const folderForSaving = path.join(__dirname, 'project-dist');
  fs.stat(path.join(__dirname), (errStat, stats) => {
    // console.log(stats);
    if (errStat) throw errStat;
    if (stats.isFile) {
      fs.copyFile(
        path.join(__dirname, 'template.html'),
        path.join(folderForSaving, 'index.html'),
        (err) => {
          if (err) throw err;
        }
      );
    }
  });

  // читаем template.html
  const text = await fs.promises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8'
  );
  console.log(text);
  // записываем компоненты в файл index
  const files = await fs.promises.readdir(readFrom);

  files.forEach((file) => {
    fs.stat(path.join(readFrom, file), (errStat, stats) => {
      if (errStat) throw errStat;
      if (stats.isFile) {
        let re = new RegExp(`{{${file.split('.')[0]}}}`, 'i');
        let fileContent = fs.promises.readFile(
          path.join(readFrom, file),
          'utf-8'
        );
        console.log(fileContent);
        text.replace(re, fileContent);
      }
    });
  });
}
copyObjects();