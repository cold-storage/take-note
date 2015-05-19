/*global window: false */
/*global CustomEvent: false */

var APP = (function APP() {
  window.addEventListener('foo', function(e) {
    console.log('some custom evt here', e);
  }, true);
  var app = {
    load: function load() {
      app.info();
      window.dispatchEvent(new CustomEvent('foo', {detail:'stoof'}));
      window.dispatchEvent(new CustomEvent('foo', {detail:'what???'}));
    },
    info: function info() {
      console.log(JSON.stringify(window.location, null, 2));
    }
  };
  return app;
}());

window.onload = APP.load;