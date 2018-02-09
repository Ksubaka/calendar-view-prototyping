import _ from 'lodash';
import angular from 'angular';
// CSS
import '../public/less/app.less';
import './components/plantt/plantt';

const planttState = require('./states/planttTest');


const libDependencies = [
    'plantt.module',
];

const appDependencies = [
    planttState,
];

const dependencies = _.concat([], libDependencies, appDependencies);

angular.module('planttTestApp', dependencies);
