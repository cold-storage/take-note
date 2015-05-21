var hapi = require('hapi');
var bcrypt = require('bcrypt');
var basic = require('hapi-auth-basic');
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

server.route({
  method: 'GET',
  path: '/api/foo',
  handler: function(request, reply) {
    console.log('SESSION', request.state.session);
    if (!request.state.session) {
      request.state.session = {
        yo: 'dude'
      };
    }
    reply('hello foo world');
  }
});

server.register(basic, function(err) {
  server.auth.strategy('simple', 'basic', {
    validateFunc: validate
  });
  server.route({
    method: 'GET',
    path: '/private/{foo*}',
    config: {
      auth: 'simple',
      handler: {
        directory: {
          path: 'web/private',
          listing: true
        }
      }
    }
  });

});

server.start(function() {
  console.log('hapi running at: ' + server.info.uri);
});