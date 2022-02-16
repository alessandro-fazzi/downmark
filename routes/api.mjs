import express from 'express'
let router = express.Router()

import { getHTMLFromURL } from '../app/utils.mjs'
import { Readability } from '@mozilla/readability'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
let window = new JSDOM('').window;
let DOMPurify = createDOMPurify(window);
import TurndownService from 'turndown'


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

export default router
