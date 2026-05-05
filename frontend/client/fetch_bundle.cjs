const https = require('https');
const fs = require('fs');

https.get('https://react-9b5se3.onspace.build/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // find script src like /assets/index-XYZ.js
    const match = data.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
    if (match && match[1]) {
      const scriptUrl = 'https://react-9b5se3.onspace.build' + match[1];
      console.log('Downloading bundle:', scriptUrl);
      https.get(scriptUrl, (res2) => {
        let scriptData = '';
        res2.on('data', chunk => scriptData += chunk);
        res2.on('end', () => {
          fs.writeFileSync('original_bundle.js', scriptData);
          console.log('Saved bundle to original_bundle.js');
        });
      });
    } else {
      console.log('No module script found in HTML');
    }
  });
});
