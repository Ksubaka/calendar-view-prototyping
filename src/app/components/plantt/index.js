import angular from 'angular';

import css from './scheduler.less';

module.exports = angular.module('components.plantt_scheduler', [])
    .directive('scheduler', require('./scheduler_directive'))
    .controller('SchedulerDirectiveController', require('./scheduler_directive_controller'))
    .directive('scheduler-header', require('./scheduler_header_directive'))
    .directive('events-canvas', require('./events_canvas_directive'))
    .directive('scheduler-event', require('./scheduler_event_directive'))
    .factory('SchedulerHelperService', require('./scheduler_helper_service'))
    .name;
