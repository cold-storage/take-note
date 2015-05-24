var hapi = require('hapi');
var bcrypt = require('bcrypt');
var cookie = require('hapi-auth-cookie');
var server = new hapi.Server();
var boom = require('boom');
var password = '$2a$13$uc24plNwFp8UAbAErqmz6eguIfez5EHvSLpSoZCEkA5kTwZ.QBUai';

function logInOut(request, reply) {
  bcrypt.compare(request.payload.pw, password, function(err, isValid) {
    console.error('err', err);
    if (isValid) {
      request.auth.session.set({
        ok: 'cool'
      });
      reply(null, {
        ok: 'cool'
      });
    } else {
      request.auth.session.clear();
      reply(boom.unauthorized('not cool'));
    }
  });
}

server.connection({
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
  method: 'PUT',
  path: '/loginout/',
  handler: logInOut
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
    reply('hello foo world');
  }
});

server.route({
  path: '/private/{foo*}',
  method: 'GET',
  handler: {
    directory: {
      path: 'web/private',
      listing: true
    }
  },
  config: {
    auth: 'zession',
  }
});

server.start(function() {
  console.log('hapi running at: ' + server.info.uri);
});