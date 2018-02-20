import angular from 'angular';

module.exports = angular.module('components.plantt_scheduler', [])
    .directive('scheduler', require('./scheduler_directive'))
    .controller('SchedulerDirectiveController', require('./scheduler_directive_controller'))
    .directive('schedulerEvent', require('./scheduler_event_directive'))
    .controller('SchedulerEventDirectiveController', require('./scheduler_event_directive_controller'))
    .directive('schedulerHeader', require('./scheduler_header_directive'))
    .factory('SchedulerHelperService', require('./scheduler_helper_service'))
    .name;
