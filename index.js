var http = require('http'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({});

http.createServer(function(req, res) {
  var domain = "localhost:8000";
  var subdomain = req.headers.host.replace("." + domain, "");

  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
    proxyReq.setHeader('X-Forwarded-UserEmail', new Date());
  });
  proxy.web(req, res, { target: 'http://' + subdomain });
}).listen(8000, function() { console.log('Listening on port 8000'); });
