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
        controller: 'SchedulerDirectiveController',
    };
}

module.exports = SchedulerDirective;
