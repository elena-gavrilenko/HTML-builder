const fs = require('fs');
const path = require('path');
const { stdin } = process;
const newFile = path.join(__dirname, 'text.txt');
function submitAnswer(answer) {
  if (answer.toString().trim() == 'exit') {
    console.log('Leaving already? Bye-bye.');
    process.exit();
  } else {
    console.log('Will you write anything else?');
    return answer;
  }
}
async function addFile() {
  await fs.promises.writeFile(newFile, '');
}

console.log('Hey, please enter some text.');
addFile();
stdin.on('data', (data) => {
  fs.appendFile(
    path.join(__dirname, 'text.txt'),
    submitAnswer(data),
    (error) => {
      if (error) throw error;
    },
  );
});
process.on('SIGINT', () => {
  console.log('Leaving already? Bye-bye.');
  process.exit();
});
