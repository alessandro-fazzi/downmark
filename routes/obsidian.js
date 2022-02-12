const express = require('express')
const router = express.Router()

const { getHTMLFromURL, getFileName, convertDate } = require('../app/utils')
const { Readability } = require('@mozilla/readability')
const { JSDOM } = require('jsdom')
const TurndownService = require('turndown')

/* Optional vault name */
const vault = "";

/* Optional folder name such as "Clippings/" */
const folder = "Clippings/";

/* Optional tags  */
const tags = "clippings";

const today = convertDate(new Date());

router.get('/', function(req, res, next) {
  (async (url, platform) => {
    const result = await getHTMLFromURL(url);

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

    res.redirect(302, redirectTo)
  })(req.query.u, req.query.platform);
});

module.exports = router;
