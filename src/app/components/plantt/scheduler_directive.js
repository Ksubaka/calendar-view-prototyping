import templateUrl from './scheduler_directive.html';

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
