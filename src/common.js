import angular from 'angular';

import $$uisDebounce from 'uisDebounceService';
import uiSelect from 'uiSelectDirective';
import uiSelectChoices from 'uiSelectChoicesDirective';
import uiSelectFooter from 'uiSelectFooterDirective';
import uiSelectHeader from 'uiSelectHeaderDirective';
import uiSelectMatch from 'uiSelectMatchDirective';
import uiSelectMultiple from 'uiSelectMultipleDirective';
import uiSelectNoChoice from 'uiSelectNoChoiceDirective';
import uiSelectSingle from 'uiSelectSingleDirective';
import uiSelectSort from 'uiSelectSortDirective';
import uisOpenClose from 'uisOpenCloseDirective';
import uisRepeatParser from 'uisRepeatParserService';
import uiSelectController from 'uiSelectController';

import 'common.css';

/**
 * Add querySelectorAll() to jqLite.
 *
 * jqLite find() is limited to lookups by tag name.
 * TODO This will change with future versions of AngularJS, to be removed when this happens
 *
 * See jqLite.find - why not use querySelectorAll? https://github.com/angular/angular.js/issues/3586
 * See feat(jqLite): use querySelectorAll instead of getElementsByTagName in jqLite.find https://github.com/angular/angular.js/pull/3598
 */
if (angular.element.prototype.querySelectorAll === undefined) {
  angular.element.prototype.querySelectorAll = function querySelectorAll(selector) {
    return angular.element(this[0].querySelectorAll(selector));
  };
}

/**
 * Add closest() to jqLite.
 */
if (angular.element.prototype.closest === undefined) {
  angular.element.prototype.closest = function closest(selector) {
    let elem = this[0];
    const matchesSelector = (
      elem.matches ||
      elem.webkitMatchesSelector ||
      elem.mozMatchesSelector ||
      elem.msMatchesSelector);

    while (elem) {
      if (matchesSelector.bind(elem)(selector)) {
        return elem;
      }
      elem = elem.parentElement;
    }
    return false;
  };
}

let latestId = 0;

const moduleName = 'ui.select';
export default moduleName;
angular.module(moduleName, [])
.constant('uiSelectConfig', {
  theme: 'bootstrap',
  searchEnabled: true,
  sortable: false,
  placeholder: '', // Empty by default, like HTML tag <select>
  refreshDelay: 1000, // In milliseconds
  closeOnSelect: true,
  skipFocusser: false,
  dropdownPosition: 'auto',
  removeSelected: true,
  resetSearchInput: true,
  generateId() {
    latestId += 1;
    return latestId;
  },
  appendToBody: false,
  spinnerEnabled: false,
  spinnerClass: 'glyphicon glyphicon-refresh ui-select-spin',
  backspaceReset: true,
})

// See Rename minErr and make it accessible from outside https://github.com/angular/angular.js/issues/6913
.service('uiSelectMinErr', () => {
  const minErr = angular.$$minErr('ui.select');
  return function parseError(...args) {
    const error = minErr.apply(this, args);
    const message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
    return new Error(message);
  };
})

// Recreates old behavior of ng-transclude. Used internally.
.directive('uisTranscludeAppend', () => ({
  link(scope, element, attrs, ctrl, transclude) {
    transclude(scope, (clone) => {
      element.append(clone);
    });
  },
}))

/**
 * Highlights text that matches $select.search.
 *
 * Taken from AngularUI Bootstrap Typeahead
 * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
 */
.filter('highlight', () => {
  function escapeRegexp(queryToEscape) {
    return (`${queryToEscape}`).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }

  return (matchItem, query) => (
    query && matchItem ? (`${matchItem}`).replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem);
})

/**
 * A read-only equivalent of jQuery's offset function: http://api.jquery.com/offset/
 *
 * Taken from AngularUI Bootstrap Position:
 * See https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js#L70
 */
.factory('uisOffset',
  ['$document', '$window',
    ($document, $window) => (element) => {
      const boundingClientRect = element[0].getBoundingClientRect();
      return {
        width: boundingClientRect.width || element.prop('offsetWidth'),
        height: boundingClientRect.height || element.prop('offsetHeight'),
        top: boundingClientRect.top + (
          $window.pageYOffset || $document[0].documentElement.scrollTop),
        left: boundingClientRect.left + (
          $window.pageXOffset || $document[0].documentElement.scrollLeft),
      };
    },
  ])

.factory('$$uisDebounce', $$uisDebounce)
.directive('uiSelect', uiSelect)
.directive('uiSelectChoices', uiSelectChoices)
.directive('uiSelectFooter', uiSelectFooter)
.directive('uiSelectHeader', uiSelectHeader)
.directive('uiSelectMatch', uiSelectMatch)
.directive('uiSelectMultiple', uiSelectMultiple)
.directive('uiSelectNoChoice', uiSelectNoChoice)
.directive('uiSelectSingle', uiSelectSingle)
.directive('uiSelectSort', uiSelectSort)
.directive('uisOpenClose', uisOpenClose)
.service('uisRepeatParser', uisRepeatParser)

// TODO: Code should inject `uisRepeatParser` everywhere
.service('RepeatParser', uisRepeatParser)

.controller('uiSelectCtrl', uiSelectController);
