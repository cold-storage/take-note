var lunr = require('lunr');

describe("lunr suite", function() {
  it("will do a simple search", function(done) {


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

    done();

    expect(sr.length).toBe(1);
    expect(sr[0].ref).toBe('375');
    expect(sr[0].score).toBe(0.02353104026675058);
  });
});