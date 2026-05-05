const https = require('https');
const fs = require('fs');

https.get('https://react-9b5se3.onspace.build/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('original_live.html', data);
    console.log('Saved to original_live.html');
  });
});
