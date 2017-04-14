export default function uiSelectNoChoice(uiSelectConfig) {
        'ngInject';
        return {
            restrict: 'EA',
            require: '^uiSelect',
            replace: true,
            transclude: true,
            template: function (tElement) {
                // Needed so the uiSelect can detect the transcluded content
                tElement.addClass('ui-select-no-choice');

                // Gets theme attribute from parent (ui-select)
                var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
                return getTemplate(theme, 'no-choice');
            }
        };
    }
