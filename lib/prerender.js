var request   = require('request'),
    url       = require('url');

// Constants
var BOT_REGEX = /bot|crawler|baiduspider|80legs|mediapartners-google|adsbot-google/i,
    CDN_API = 'https://localizeprerender.com/';


////
//  CREATE MIDDLEWARE
////

exports.middleware = function(options) {
  // Make sure a rootDomain is available
  if (!options.rootDomain || options.rootDomain.indexOf('http')) {
    console.error('Localize prerender error: please pass in a `rootDomain`, such as \'http://example.com\'');
    return function(req, res, next) { next(); };
  }

  // Format rootDomain
  var rootDomain = url.parse(options.rootDomain);
  if (!rootDomain.protocol || !rootDomain.host) {
    console.error('Localize prerender error: your `rootDomain` is malformed. Please enter a value such as \'http://example.com\'');
    return function(req, res, next) { next(); };
  }
  rootDomain = rootDomain.protocol + '//' + rootDomain.host;

  // Return middleware
  return function(req, res, next) {
    // Only prerender GET requests
    if (req.method !== 'GET') return next();

    // Check if URL should be prerendered
    if (!shouldPrerender(req, options.prerenderTest)) return next();

    // Get prerendered HTML
    getPrerenderedHTML(rootDomain + req.url, function(err, html) {
      // Pass request to server if error getting the prerendered HTML
      if (err || !html || !html.length) return next();

      res.status(200).send(html);
    });

  };
};


////
//  GET PRERENDERED HTML
////

var getPrerenderedHTML = exports.getPrerenderedHTML = function(url, done) {
  request({
    method: 'GET',
    url: CDN_API,
    json: true
  }, function(err, response, body) {
    if (err || !body || !body.html) return done(err || 'There was an error');
    done(null, body.html);
  });
};


////
//   SHOULD PRERENDER
////

var shouldPrerender = function(req, prerenderTest) {
  if (prerenderTest) {
    return true;
  } else {
    return BOT_REGEX.test(req.headers['user-agent'] || '') || prerenderTest;
  }
};
