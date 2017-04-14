import {
  getTemplate,
} from 'helpers'

export default function uiSelectFooter(uiSelectConfig){
  'ngInject';
  return {
    template: function (tElement) {
      // Needed so the uiSelect can detect the transcluded content
      tElement.addClass('ui-select-footer');

      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      return getTemplate(theme, 'footer');
    },
    restrict: 'EA',
    transclude: true,
    replace: true
  };
}
