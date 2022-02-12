var express = require('express');
var router = express.Router();
var { getHTMLFromURL } = require('../app/utils')
var { Readability } = require('@mozilla/readability')
var { JSDOM } = require('jsdom')
var TurndownService = require('turndown')

router.get('/', function(req, res, next) {
  (async (url) => {
    const result = await getHTMLFromURL(url);

    var doc = new JSDOM(result, { url: req.query.u });
    let reader = new Readability(doc.window.document);
    let {title, content, excerpt, byline} = reader.parse();

    var turndownService = new TurndownService()
    var markdown = turndownService.turndown(content)

    res.json({ title, content: markdown, excerpt, byline });
  })(req.query.u);
});

module.exports = router;
