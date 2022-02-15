const express = require('express')
const router = express.Router()

const { getHTMLFromURL, getFileName, convertDate } = require('../app/utils')
const { Readability } = require('@mozilla/readability')
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const TurndownService = require('turndown')
const turndownPluginGfm = require('turndown-plugin-gfm')
const fs = require('fs/promises');
const path = require('path');
const slugify = require('slugify')

/* Optional vault name */
const vault = "";

/* Optional folder name such as "Clippings/" */
const folder = "Clippings/";

/* Optional tags  */
var defaultTags = ["clippings"];

const today = convertDate(new Date());

router.get('/', function(req, res, next) {
  (async (url, platform, download, tags = []) => {
    var tags = [...defaultTags, ...tags].join(' ')

    var htmlContent = '';

    try {
      htmlContent = await getHTMLFromURL(url);
    } catch (error) {
      res.status(422).end()
      return
    }

    let doc = new JSDOM(htmlContent, { url });
    let reader = new Readability(doc.window.document, {
      keepClasses: true
    });
    let result = reader.parse();
    let title = result?.title || 'no title ' + require("crypto").randomBytes(8).toString('hex')
    let content = result?.content || result?.excerpt || 'Cannot parse content...'
    let byline = result?.byline || ''

    const fileName = slugify(getFileName(title, platform));

    var turndownService = new TurndownService({
      preformattedCode: true,
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    }).use(turndownPluginGfm.gfm)

    let sanitizedContent = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });

    let markdown = turndownService.turndown(sanitizedContent)

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

    if (download == 'true') {
      // ...
    } else if (download == 'local' && req.hostname == 'localhost') {
      fs.writeFile(path.join('.', folder, fileName), fileContent)
      console.log('File saved: ' + folder + fileName)
      res.status(201).end()
    } else {
      redirectTo = "obsidian://new?"
        + "name=" + encodeURIComponent(folder + fileName)
        + "&content=" + encodeURIComponent(fileContent)
        + vaultName;

      res.redirect(302, redirectTo)
    }
  })(req.query.u, req.query.platform, req.query.download, req.query.tags);
});

module.exports = router;
