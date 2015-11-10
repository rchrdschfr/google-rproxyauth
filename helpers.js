module.exports = {
  isDefined: function(data) {
    return typeof data !== 'undefined';
  },
  google: {
    getEmail: function(emails) {
      if (emails.length) {
        for (var i = 0; i < emails.length; i++) {
          if (emails[i].type == 'account') {
            return emails[i].value;
          }
        }
      }
      return false;
    }
  },
  getFullDomain: function(domain, port) {
    if (typeof port == 'undefined') {
      return domain;
    }
    else {
      return domain + ":" + port;
    }
  },
  getCallbackPath: function(callbackURL, fullDomain) {
    return callbackURL.replace("http://" + fullDomain, "");
  },
  requireSettings: function(settings) {
    var key;
    var keys;
    var requiredFields = ['domain', 'google.clientID', 'google.clientSecret', 'google.callbackURL'];
    for (var i = 0; i < requiredFields.length; i++) {
      if (requiredFields[i].split('.').length > 1) {
        key = requiredFields[i].split('.')[1];
        keys = Object.keys(settings[requiredFields[i].split('.')[0]]);
      }
      else {
        key = requiredFields[i];
        keys = Object.keys(settings)
      }
      if (keys.indexOf(key) == -1) {
        throw new Error(requiredFields[i] + " is a required setting. Please set it in settings.js.");
      }
    }
  }
}