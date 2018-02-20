import templateUrl from './scheduler_directive.html';
import css from './scheduler.less';

/* @ngInject */
function SchedulerDirective() {
    return {
        restrict: 'E',
        templateUrl,
        scope: {
            events: '=',
            viewStart: '=?',
            viewEnd: '=?',
        },
        link: (scope, elem) => {
            scope.getGridWidth = function () {
                return elem.find('.events-table').prop('offsetWidth') - scope.leftColumnWidth;
            };
        },
        controller: 'SchedulerDirectiveController',
    };
}

module.exports = SchedulerDirective;
