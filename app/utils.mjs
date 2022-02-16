import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http'
import https from 'https'

const getHTMLFromURL = (url) => {
  return new Promise((resolve, reject) => {

    let client = http;

    if (url.toString().indexOf("https") === 0) {
      client = https;
    }

    client.get(url, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data);
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
};

const getFileName = (fileName, platform) => {
  let windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']

  if (windowsPlatforms.indexOf(platform) !== -1) {
    fileName = fileName.replace(':', '').replace(/[/\\?%*|"<>]/g, '-')
  } else {
    fileName = fileName.replace(':', '').replace(/\//g, '-').replace(/\\/g, '-')
  }
  return fileName.slice(0, 100) + '.md'
}

const convertDate = (date) => {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth() + 1).toString();
  var dd = date.getDate().toString();
  var mmChars = mm.split('');
  var ddChars = dd.split('');
  return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { getHTMLFromURL, getFileName, convertDate, __filename, __dirname };
