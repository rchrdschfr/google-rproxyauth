How to use:

`npm install`
`node index.js`

Then go to domainYouWantToProxy.localhost:8000

I have a WP site deployed to Digital Ocean, IP = 159.203.132.145.

So, you can proxy it by going to

159.203.132.145.localhost:8000

On the Wordpress site I have a plugin enabled that checks if the incoming
request has been proxied (via an x-forwarded-host header), and changes the value
of WP_HOME and WP_SITEURL to modify the generated URLs of th WP app to reflect
the proxy. The plugin will also allow you to store lists of user Google account
information and check them against other x-forwarded header information that are
set by the proxy.