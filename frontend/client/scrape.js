const fs = require('fs');
const https = require('https');

https.get('https://react-9b5se3.onspace.build/?t=1773767539984', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('original_dom.html', data);
    console.log("Saved original_dom.html!");
  });
}).on('error', err => {
  console.log("Error: " + err.message);
});
