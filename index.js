// load libraries
var http = require('http')
var httpProxy = require('http-proxy');
var express = require('express');
var session = require('express-session');
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

// load modules
var settings = require('./settings');
var helpers = require('./helpers');
helpers.requireSettings(settings);

// set globals
var fullDomain = helpers.getFullDomain(settings.domain, settings.port);
var callbackPath = helpers.getCallbackPath(settings.google.callbackURL, fullDomain);
var protocol = settings.protocol || 'http://';
var port = settings.port || 3000;
var sessionSecret = settings.sessionSecret || 'keyboard cat';
  

// set up passport to do the authenication
passport.use(new GoogleStrategy({
    clientID: settings.google.clientID,
    clientSecret: settings.google.clientSecret,
    callbackURL: settings.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, {
      id: profile.id,
      email: helpers.google.getEmail(profile.emails)
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// set up the app
var app = express();

// define our sessions
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null,
    domain: '.' + settings.domain,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// define routes
app.get(callbackPath,
  passport.authenticate('google'),
  function(req, res) {
    console.log("Returned from callback, redirecting to proper URL");
    console.log(req.session);
    res.redirect(
      protocol + req.session.target.domain + "."
      + fullDomain
      + req.session.target.path
    );
  }
);

var pattern = new RegExp('(?!' + callbackPath + ')'); // match everything but the callback path
app.all(pattern, function(req, res, next) {
  console.log("Host is: " + req.get('host'));
  console.log("Path is: " + req.path);
  
  if(typeof req.user !== 'undefined') { // user has been authenticated, send to proxy
    console.log('User is properly authenticated, sending them to the proxy');

    var target = req.get('host').replace("." + fullDomain, ""); // get the target domain
    if (target !== fullDomain) {
      // send the user to the proxy
      proxy.web(req, res, { target: protocol + target});
    }
    else {
      res.send('No subdomain specified.')
    }
  }
  else { // user has not been authenticated, send to oauth
    console.log('User has not been authenticated yet.');
    
    // save the destination in session so we can return to it after we are authenticated
    req.session.target = {
      domain: req.headers.host.replace("." + fullDomain, ""),
      path: req.path
    }
    next();
  }
}, passport.authenticate('google', { scope: 'email'}));

// start our proxy server
var proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
  proxyReq.setHeader('X-Forwarded-UserEmail', req.user.email);
});

// listen for requests
app.listen(port, function() { console.log("\nListening on port 3000") });