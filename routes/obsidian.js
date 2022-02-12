var express = require('express');
var router = express.Router();
var getHTML = require('../app/getHTMLFromURL')
var { Readability } = require('@mozilla/readability')
var { JSDOM } = require('jsdom')
var TurndownService = require('turndown')

/* Optional vault name */
const vault = "";

/* Optional folder name such as "Clippings/" */
const folder = "Clippings/";

/* Optional tags  */
const tags = "clippings";

function getFileName(fileName, platform) {
  windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

  if (windowsPlatforms.indexOf(platform) !== -1) {
    fileName = fileName.replace(':', '').replace(/[/\\?%*|"<>]/g, '-');
  } else {
    fileName = fileName.replace(':', '').replace(/\//g, '-').replace(/\\/g, '-');
  }
  return fileName;
}

async function fetchAsync(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

router.get('/', function(req, res, next) {
  (async (url, platform) => {
    const result = await getHTML(url);

    var doc = new JSDOM(result, { url: req.query.u });
    let reader = new Readability(doc.window.document);
    let {title, content, excerpt, byline} = reader.parse();

    const fileName = getFileName(title, platform);

    var turndownService = new TurndownService()
    let markdown = turndownService.turndown(content)

    if (vault) {
      var vaultName = '&vault=' + encodeURIComponent(`${vault}`);
    } else {
      var vaultName = '';
    }

    var date = new Date();

    function convertDate(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth() + 1).toString();
      var dd = date.getDate().toString();
      var mmChars = mm.split('');
      var ddChars = dd.split('');
      return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
    }

    const today = convertDate(date);

    const fileContent = "---\n"
      + "date: " + today + "\n"
      + "tags: [" + tags + "]\n"
      + "source: " + url + "\n"
      + "author: " + byline + "\n"
      + "---\n\n"
      + markdown;

    redirectTo = "obsidian://new?"
      + "name=" + encodeURIComponent(folder + fileName)
      + "&content=" + encodeURIComponent(fileContent)
      + vaultName;

    // res.json({ title, content: markdown, excerpt, byline });
    res.redirect(302, redirectTo)
  })(req.query.u, req.query.platform);
});

module.exports = router;
