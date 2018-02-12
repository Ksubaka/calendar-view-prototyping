import _ from 'lodash';

/* @ngInject */
function PlanttTestController($scope, $timeout, SchedulerHelperService) {
    // FOR DEMO : using today as a reference to create events, for them to be allways visible
    const now = new Date();

    // Create the events list (don't use it like this, it's relative for DEMO)
    $scope.campaigns = [
        {
            id: 1,
            name: 'Miramar',
            status: 'live',
            startDate: SchedulerHelperService.addDaysToDate(now, -30),
            endDate: SchedulerHelperService.addDaysToDate(now, -22),
        },
        {
            id: 2,
            name: 'Topshop S',
            status: 'paused',
            startDate: SchedulerHelperService.addDaysToDate(now, -24),
            endDate: SchedulerHelperService.addDaysToDate(now, -21),
        },
        {
            id: 3,
            name: 'Magnum Tap Them Tiles',
            status: 'ready',
            startDate: SchedulerHelperService.addDaysToDate(now, -17),
            endDate: SchedulerHelperService.addDaysToDate(now, -15),
        },
        {
            id: 4,
            name: 'July Ruby',
            status: 'urgent',
            startDate: SchedulerHelperService.addDaysToDate(now, -12),
            endDate: SchedulerHelperService.addDaysToDate(now, -10),
        },
        {
            id: 5,
            name: 'Old one',
            status: 'completed',
            startDate: SchedulerHelperService.addDaysToDate(now, -18),
            endDate: SchedulerHelperService.addDaysToDate(now, -6),
        },
        {
            id: 6,
            name: 'Outdated event',
            status: 'completed',
            startDate: SchedulerHelperService.addDaysToDate(now, -4),
            endDate: SchedulerHelperService.addDaysToDate(now, -2),
        },
        {
            id: 7,
            name: 'DemoCampaign',
            status: 'paused',
            startDate: SchedulerHelperService.addDaysToDate(now, -2),
            endDate: SchedulerHelperService.addDaysToDate(now, 2),
        },
        {
            id: 8,
            name: 'Alex Bowling Campaign',
            status: 'live',
            startDate: SchedulerHelperService.addDaysToDate(now, 4),
            endDate: SchedulerHelperService.addDaysToDate(now, 10),
        },
        {
            id: 9,
            name: 'Milka',
            status: 'paused',
            startDate: SchedulerHelperService.addDaysToDate(now, 2),
            endDate: SchedulerHelperService.addDaysToDate(now, 6),
        },
        {
            id: 10,
            name: 'Library-XWalk',
            status: 'problem',
            startDate: SchedulerHelperService.addDaysToDate(now, 0),
            endDate: SchedulerHelperService.addDaysToDate(now, 4),
        },
        {
            id: 11,
            name: 'SurveyLauncher',
            status: 'paused',
            startDate: SchedulerHelperService.addDaysToDate(now, 12),
            endDate: SchedulerHelperService.addDaysToDate(now, 20),
        },
        {
            id: 12,
            name: 'Henrik\'s test survey',
            status: 'live',
            startDate: SchedulerHelperService.addDaysToDate(now, 13),
            endDate: SchedulerHelperService.addDaysToDate(now, 13),
        },
        {
            id: 13,
            name: 'Topshop Battle Survey',
            status: 'paused',
            startDate: SchedulerHelperService.addDaysToDate(now, 8),
            endDate: SchedulerHelperService.addDaysToDate(now, 9),
        },
        {
            id: 14,
            name: 'Another campaign',
            status: 'problem',
            startDate: SchedulerHelperService.addDaysToDate(now, 30),
            endDate: SchedulerHelperService.addDaysToDate(now, 35),
        },
    ];

    $scope.campaigns = _.sortBy($scope.campaigns, ['startDate']);

    // Listen to the "eventScale" DOM event, to store the new positions of the event limits in time
    $scope.$on('eventScale', (e, event, side, newDate, newHour) => {
        newDate.setHours(newHour);
        if (side === 'left') { event.startDate = newDate; } else if (side === 'right') { event.endDate = newDate; }
        $timeout(() => {
            $scope.renderView();
        }, 0);
    });
}

module.exports = PlanttTestController;
