## Installation

```
npm install
```

## Configuration

Create a file `settings.js` and export a configuration object in it like so

######settings.js
```
modules.exports = {
  domain: // the top-level domain this app is running on (can we get this automaticaly?)
  port: // the you would like this app to listen on. default 3000
  http: // the protocol that should be used. default 'http://'
  sessionSecret: // secret to use when storing session data. default 'keyboard cat'
  google: {
    clientID: // your Google app clientID
    clientSecret: // your Google app clientSecret
    callbackURL: // full callback URL for this app
  }
}
```

## Useage

```
node index.js
```

Then go to `<domain-you-want-to-proxy>.<your-domain>:<your-port-number>`

For example, if you are running this on localhost, port 3000, and you want to proxy mygreatsite.com. Go to

`mygreatsite.com.localhost:3000`

Upon authentication, the proxy will set an `X-Forwarded-UserEmail` header that is equal to the user's Google account email.
It is up to the site being proxied to decide how to control access from there.

####Notes
- If you are running on localhost, you will have to update your `hosts` file to reflect any subdomain you wish to use.