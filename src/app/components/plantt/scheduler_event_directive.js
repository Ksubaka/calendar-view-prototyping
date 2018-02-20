import templateUrl from './scheduler_event_directive.html';
import css from './scheduler_event.less';

/* @ngInject */
function SchedulerEventDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl,
        scope: {
            event: '=',
            day: '=',
        },
        controller: 'SchedulerEventDirectiveController',
    };
}

module.exports = SchedulerEventDirective;
