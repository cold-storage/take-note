var Lab = require('lab');
var lab = exports.lab = Lab.script();
var assert = require('chai').assert;
var bcrypt = require('bcrypt');

lab.experiment('bcrypt tests', function() {

  lab.test('async encrypt', function(done) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash('R4Mm$M0mm4', salt, function(err, hash) {
        console.log('hash', hash);
        bcrypt.compare('R4Mm$M0mm4', hash, function(err, res) {
          assert(res);
          done();
        });
      });
    });
  });

  lab.test('sync encrypt', function(done) {
    var hash = bcrypt.hashSync('somepw', 13);
    // $2a$13$uc24plNwFp8UAbAErqmz6eguIfez5EHvSLpSoZCEkA5kTwZ.QBUai
    console.log('hash', hash);
    assert(bcrypt.compareSync('somepw', hash));
    assert(!bcrypt.compareSync('wrong', hash));
    done();
  });

});