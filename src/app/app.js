import _ from 'lodash';
import angular from 'angular';
import plantt from './components/plantt/plantt';
import planttState from './states/planttTest';

const libDependencies = [
    plantt,
];

const appDependencies = [
    planttState,
];

const dependencies = _.concat([], libDependencies, appDependencies);

angular.module('planttTest', dependencies);
