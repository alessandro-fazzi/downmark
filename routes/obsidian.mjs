import express from 'express'
let router = express.Router()

import {
  getHTMLFromURL,
  getFileName,
  convertDate,
  parseHTML,
  convertToMarkdown,
  buildMarkdownWithFrontmatter,
  buildObsidianURL
} from '../app/utils.mjs'

router.get('/', function(req, res, next) {
  if (req.query.download == 'local' && req.hostname != 'localhost') {
    let error = new Error('Local download supported only running the webservice locally.');
    console.error(error)
    res.status(422).end()
    next(error)
  }

  (async (url, platform, download, tags = []) => {
    var htmlContent = ''

    try {
      htmlContent = await getHTMLFromURL(url)
    } catch (error) {
      console.error(error)
      res.status(422).end()
      return
    }

    let { title, content, byline } = parseHTML(htmlContent, url)

    const fileName = getFileName(title, platform)

    let markdown = convertToMarkdown(content)

    const fileContent = buildMarkdownWithFrontmatter({markdown, tags, url, byline})

    if (download == 'true') {
      // ...
    } else if (download == 'local' && req.hostname == 'localhost') {
      fs.writeFile(path.join('.', folder, fileName), fileContent)
      console.log('File saved: ' + folder + fileName)
      res.status(201).end()
    } else {
      let redirectToURL = buildObsidianURL({ fileName, fileContent })
      res.set('Location', redirectToURL)
      res.redirect(302, redirectToURL)
    }
  })(req.query.u, req.query.platform, req.query.download, req.query.tags);
});

export default router
