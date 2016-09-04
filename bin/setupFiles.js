var path = require('path');
var fs = require('fs');

function copyPaste(input, output) {
  fs.createReadStream(input)
    .pipe(
      fs.createWriteStream(output)
    );
}

export default function(output, outputPath) {
  fs.writeFile(
    path.join(outputPath, 'state.json'),
    JSON.stringify(output, null, 2),
    function (err) {
      console.error(err);
    }
  );

  copyPaste(
    path.join(__dirname, '../src/index.html'),
    path.join(outputPath, 'index.html')
  );
  copyPaste(
    path.join(__dirname, '../src/tilfordTree.js'),
    path.join(outputPath, 'tilfordTree.js')
  );
  copyPaste(
    path.join(__dirname, '../src/style.css'),
    path.join(outputPath, 'style.css')
  );
}