var hapi = require('hapi');
var bcrypt = require('bcrypt');
var cookie = require('hapi-auth-cookie');
var server = new hapi.Server();

var password = '$2a$13$uc24plNwFp8UAbAErqmz6eguIfez5EHvSLpSoZCEkA5kTwZ.QBUai';

function validate(un, pw, callback) {
  bcrypt.compare(pw, password, function(err, isValid) {
    callback(err, isValid, {
      name: 'John Stein'
    });
  });
};

server.connection({
  host: 'localhost',
  port: 8000
});

server.register(cookie, function(err) {
  server.auth.strategy('zession', 'cookie', {
    password: 'G00b#rBuTz',
    cookie: 'yo-cookie',
    isSecure: false
  });
});

server.route({
  method: 'GET',
  path: '/{foo*}',
  handler: {
    file: {
      path: 'web/index.html'
    }
  }
});

server.route({
  method: 'GET',
  path: '/favicon.ico',
  handler: {
    file: {
      path: 'web/img/favicon.ico'
    }
  }
});

server.route({
  method: 'GET',
  path: '/img/{foo*}',
  handler: {
    directory: {
      path: 'web/img',
      listing: true
    }
  }
});
server.route({
  method: 'GET',
  path: '/js/{foo*}',
  handler: {
    directory: {
      path: 'web/js',
      listing: true
    }
  }
});

server.ext('onPostAuth', function(request, reply) {
  console.log('request.auth.credentials', request.path, request.auth.credentials);
  reply.continue();
});

server.route({
  method: 'GET',
  path: '/api/foo',
  handler: function(request, reply) {
    console.log('request.state.session', request.state.session);
    request.auth.session.set({
      must: 'be json'
    });
    if (!request.state.session) {
      request.state.session = {
        yo: 'dude'
      };
    }
    reply('hello foo world');
  }
});

server.route({
  method: 'GET',
  path: '/private/{foo*}',
  config: {
    auth: 'zession',
    handler: {
      directory: {
        path: 'web/private',
        listing: true
      }
    }
  }
});


server.start(function() {
  console.log('hapi running at: ' + server.info.uri);
});