import angular from 'angular';

module.exports = angular.module('states.planttTest', [])
  .controller('PlanttTestController', require('./plantt_test_controller'))
  .name;
