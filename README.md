# ⬇️✅ downMARK

Translates a webpage into Markdown

## Disclaimer

This is a POC.

- [x] Copypasted code from the web
- [x] Ignored security concerns
- [x] Zero automatic tests
- [x] Poor documentation
- [x] Born unmaintained
- [x] From 0 to web in 3 hours of a lazy weekend
- [x] https://downmark.herokuapp.com is not assured to be online 

If you're ok and conscious about these facts, let's read an insufficient
documentation.

## Running the webservice

This is a little web service written in node which runs over expressjs. You can deploy it wherever you want. Deploying on Heroku free tier is as easy as

```
git clone https://github.com/pioneerskies/downmark.git
cd downmark
heroku create
git push heroku main
```

> NOTE: need to have [heroku cli](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) installed

It will work also by running it locally on your machine at `https://localhost:3000`

```
git clone https://github.com/pioneerskies/downmark.git
cd downmark
yarn install
yarn start
```

> NOTE: you need node and yarn

## Using the webservice - JSON

Given the webservice running at some URL, do a GET request to `URL/api/v1` passing a URL in query string's `u` parameter, e.g.:

https://downmark.herokuapp.com/api/v1?u=https://example.com

In the JSON response you'll get

- `title`: the page title
- `content`: the main content of the webpage in markdown format
- `excerpt`: an excerpt of the content in plain text
- `byline`: maybe the author (if heuristically found in page)

```json

{

    "title": "Example Domain",
    "content": "This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)",
    "excerpt": "This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.",
    "byline": null

}
```

> NOTE: "main content" I mean the content as parsed by https://github.com/mozilla/readability

## Using the webservice - Obsidian

Make a bookmarklet into your browser with the following code: https://raw.githubusercontent.com/pioneerskies/downmark/main/bookmarklet/bookmarklet.js

> NOTE: knowing how to create a bookmarklet is up to you and and your [search engine](https://duckduckgo.com/?q=how+to+create+a+bookmarklet&ia=web)

Currently features are very limited:

- the clipping will be created under the `Clippings/` folder. Customization not implemented
- vault customization is not implemented
- the clipping will be created using Frontmatter for metadata

All these limitation would be easy to remove, but do remind the discaimer: this is a POC!

## Backstory and credits

All the credits you could imagine goes to **@kepano** who wrote [this really smart version](https://gist.github.com/kepano/90c05f162c37cf730abb8ff027987ca3) of the bookmarklet and to **@Moonbase59** for his frontmatter version.

I, as a user of that bookmarklet, experimented with this toy trying to overcome to its main (and for me the only) limitation: it doesn't work on sites with `connect-src` SCP restriction implemented. GitHub is just one example.

> NOTE: kudos to all the websites implementing such strict SCP; they're doing such for our security.

This version of the bookmarklet delegates all the work to the webservice, working around SCP restrictions (hopefully).

## Customising the bookmarklet to connect to your webservice's instance

- clone the repo
- edit `bookmarklet/bookmarklet_src.js` updating the domain from `downmark.herokuapp.com` to your
- `yarn build:bookmarklet`
- copy the resulting code from `bookmarklet/bookmarklet.js`

> NOTE: you can to this also if you're running the webservice locally

## NAQ - Never Asked Questions

**Q**: Does it work on iOS Safari?

A: Yep, it does

**Q**: Does it work on the X browser?

A: It works on FireFox for macOS and for Safari for iOS. Other combination not tested. Let's try!

