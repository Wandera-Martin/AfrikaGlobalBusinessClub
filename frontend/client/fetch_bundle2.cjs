const https = require('https');
const fs = require('fs');

https.get('https://react-9b5se3.onspace.build/assets/index-i2av9SA4.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('original_bundle.js', data);
    console.log('Saved to original_bundle.js');
  });
});
