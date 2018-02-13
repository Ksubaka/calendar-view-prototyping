import angular from 'angular';

module.exports = angular.module('components.plantt_scheduler', [])
    .directive('scheduler', require('./scheduler_directive'))
    .controller('SchedulerDirectiveController', require('./scheduler_directive_controller'))
    .directive('scheduler-header', require('./scheduler_header_directive'))
    .directive('schedulerEvent', require('./scheduler_event_directive'))
    .controller('SchedulerEventDirectiveController', require('./scheduler_event_directive_controller'))
    .factory('SchedulerHelperService', require('./scheduler_helper_service'))
    .name;
