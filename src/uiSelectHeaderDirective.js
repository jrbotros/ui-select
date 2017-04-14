import {
  getTemplate,
} from 'helpers'

export default function uiSelectHeader(uiSelectConfig){
  'ngInject';
  return {
    template: function (tElement) {
      // Needed so the uiSelect can detect the transcluded content
      tElement.addClass('ui-select-header');

      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      return getTemplate(theme, 'header');
    },
    restrict: 'EA',
    transclude: true,
    replace: true
  };
}
