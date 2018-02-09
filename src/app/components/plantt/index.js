import angular from 'angular';

module.exports = angular.module('components.plantt', [])
  .directive('schedule', require('./scheduler_directive'))
  .name;
