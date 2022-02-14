const express = require('express')
const router = express.Router()

const { getHTMLFromURL, getFileName, convertDate } = require('../app/utils')
const { Readability } = require('@mozilla/readability')
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const TurndownService = require('turndown')
var turndownPluginGfm = require('turndown-plugin-gfm')

/* Optional vault name */
const vault = "";

/* Optional folder name such as "Clippings/" */
const folder = "Clippings/";

/* Optional tags  */
const tags = "clippings";

const today = convertDate(new Date());

router.get('/', function(req, res, next) {
  (async (url, platform) => {
    const dirty = await getHTMLFromURL(url);
    let clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });

    var doc = new JSDOM(clean, { url: req.query.u });
    let reader = new Readability(doc.window.document);
    let {title, content, excerpt, byline} = reader.parse();

    const fileName = getFileName(title, platform);

    var turndownService = new TurndownService({
      preformattedCode: true,
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    }).keep(['pre']).use(turndownPluginGfm.gfm)

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
