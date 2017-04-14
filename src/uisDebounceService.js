/**
 * Debounces functions
 *
 * Taken from UI Bootstrap $$debounce source code
 * See https://github.com/angular-ui/bootstrap/blob/master/src/debounce/debounce.js
 *
 */
export default function $$uisDebounce($timeout) {
  'ngInject';
  return function(callback, debounceTime) {
    var timeoutPromise;

    return function() {
      var self = this;
      var args = Array.prototype.slice.call(arguments);
      if (timeoutPromise) {
        $timeout.cancel(timeoutPromise);
      }

      timeoutPromise = $timeout(function() {
        callback.apply(self, args);
      }, debounceTime);
    };
  };
}
