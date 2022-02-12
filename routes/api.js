const express = require('express');
const router = express.Router();

const { getHTMLFromURL } = require('../app/utils')
const { Readability } = require('@mozilla/readability')
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const TurndownService = require('turndown')


router.get('/', function(req, res, next) {
  (async (url) => {
    const dirty = await getHTMLFromURL(url);
    let clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });

    var doc = new JSDOM(clean, { url: req.query.u });
    let reader = new Readability(doc.window.document);
    let {title, content, excerpt, byline} = reader.parse();

    var turndownService = new TurndownService()
    var markdown = turndownService.turndown(content)

    res.json({ title, content: markdown, excerpt, byline });
  })(req.query.u);
});

module.exports = router;
