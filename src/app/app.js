import _ from 'lodash';
import angular from 'angular';

// CSS
import '../public/less/app.less';

const planttState = require('./states/planttTest');
const planttScheduler = require('./components/scheduler');
const uiBootstrap = require('angular-ui-bootstrap');

const libDependencies = [
    uiBootstrap,
];

const appDependencies = [
    planttScheduler,
    planttState,
];

const dependencies = _.concat([], libDependencies, appDependencies);

angular.module('planttTestApp', dependencies);
