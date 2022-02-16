import express from 'express'
let router = express.Router()

import {
  getHTMLFromURL,
  parseHTML,
  convertToMarkdown
} from '../app/utils.mjs'

router.get('/', function(req, res, next) {
  (async (url) => {
    var htmlContent = ''

    try {
      htmlContent = await getHTMLFromURL(url)
    } catch (error) {
      console.error(error)
      res.status(422).end()
      return
    }

    let { title, content, excerpt, byline } = parseHTML(htmlContent, url)

    let markdown = convertToMarkdown(content)

    res.json({ title, content: markdown, excerpt, byline });
  })(req.query.u);
});

export default router
