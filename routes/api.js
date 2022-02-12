var express = require('express');
var router = express.Router();
var getHTML = require('../app/getHTMLFromURL')
var { Readability } = require('@mozilla/readability')
var { JSDOM } = require('jsdom')
var TurndownService = require('turndown')

router.get('/', function(req, res, next) {
  (async (url) => {
    const result = await getHTML(url);

    var doc = new JSDOM(result, { url: req.query.u });
    let reader = new Readability(doc.window.document);
    let {title, content, excerpt} = reader.parse();

    var turndownService = new TurndownService()
    var markdown = turndownService.turndown(content)

    res.json({ title, content: markdown, excerpt });
  })(req.query.u);
});

module.exports = router;
