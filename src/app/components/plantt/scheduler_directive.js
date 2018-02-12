import templateUrl from './scheduler_directive.html';

/* @ngInject */
function SchedulerDirective() {
    return {
        restrict: 'E',
        templateUrl,
        controller: 'SchedulerDirectiveController',
    };
}

module.exports = SchedulerDirective;
