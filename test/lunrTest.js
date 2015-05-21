var Lab = require('lab');
var lab = exports.lab = Lab.script();
var assert = require('chai').assert;
var lunr = require('lunr');

lab.experiment('lunr tests', function() {

  lab.test('simple search', function(done) {
    var idx = lunr(function() {
      this.field('title', {
        boost: 10
      });
      this.field('body');
    });

    var doc = {
      "title": "Twelfth-Night",
      "body": "If music be the food of love, play on: Give me excess of it…",
      "author": "William Shakespeare",
      "id": 375
    };

    idx.add(doc);

    var sr = idx.search("love");

    // [{
    // "ref": 1,
    // "score": 0.87533
    // }]

    console.log(sr);
    console.log('asdf asdf asdfyyyaaaa, foo');

    assert(sr.length === 1);
    assert(sr[0].ref === '375');
    assert(sr[0].score === 0.02353104026675058);

    done();
  });

});