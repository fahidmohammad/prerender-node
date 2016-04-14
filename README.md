Localize prerender Node middleware
===============

Node.js middleware that prerenders Node.js apps using [Localize](https://localizejs.com) for enhanced SEO. This middleware detects requests from search engine bots and crawlers, and replies with prerendered HTML via our hosted prerendering API.

Questions? We're happy to help. [Email us](https://localizejs.com/?intercom)!.

Installation
----------

Install via npm.

    npm install localize-prerender --save
    

Add the prerender middleware to your server:

    var prerender = require('localize-prerender');
    
    app.use(prerender.middleware({
      rootDomain: 'http://yourwebsite.com'
    }));

Include this middleware early in your application - before your application routes are created.

### API

    var prerender = require('localize-prerender');

##### localizejsSEO.middleware(options)

Creates the Localize prerender middleware. Accepted options:
 
* `rootDomain` ***Required***. The root domain of your website. For example, `http://yourwebsite.com`
* `prerenderTest` *Optional*. When true, *all* requests are prerendered, not just requests from robots. Only useful for testing and debugging - do not activate in production.

### How it works

When a request is made to your server using this middleware, here's what happens:

1. Middleware checks if request is a GET request. If not, `next()` is called and the middleware is bypassed.
2. Middleware checks if request is made from a search engine bot or crawler (like Googlebot). If not, `next()` is called and the middleware is bypassed.
3. When a GET request is made to your website by a search engine bot or crawler, the middleware makes a request to our prerendering API for the prerendered HTML of the page that was requested.
4. The prerendered HTML is received from the localizejs.com API and delivered to the search engine crawler for indexing.

This is a hosted prerendering service, meaning that the prerendering of your page and caching is offloaded to our servers.

**Performance**:

There are two built in layers of caching. We use s3 on our server to cache your prerendered HTML, and the reply is sent through the Amazon Cloudfront CDN to ensure extremely low latency response no matter where your server is.


# Contribute

Forks and pull requests welcome!


# Author

[Localize](https://localizejs.com). For support email [support@localizejs.com](mailto:support@localizejs.com)!
