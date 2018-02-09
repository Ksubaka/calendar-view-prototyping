import angular from 'angular';

const module = angular.module('states.planttTest', [])
  .controller('PlanttTestController', require('./plantt_test_controller'))
  .name;

export default module;
