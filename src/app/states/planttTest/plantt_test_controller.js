import _ from 'lodash';

/* @ngInject */
function PlanttTestController($scope, $timeout, SchedulerHelperService) {
    // Basic settings (optional)
    $scope.eventHeight = 40; // Height of events elements in pixels
    $scope.eventMargin = 10; // Margin above events elements for spacing
    // $scope.nbLines = 6; // Maximum number of lines we can draw in timeline
    $scope.formatDayLong = 'EEEE dd MMMM'; // The JS date format for the long display of dates
    $scope.formatDayShort = 'dd/MM/yyyy'; // The JS date format for the short display of dates
    $scope.formatMonth = 'MMMM yyyy'; // The JS date format for the month display in header

    // FOR DEMO : using today as a reference to create events, for them to be allways visible
    const now = new Date();

    // Create the events list (don't use it like this, it's relative for DEMO)
    $scope.events = [
        {
            id: 1,
            title: 'Hello World',
            type: 'normal',
            startDate: SchedulerHelperService.addDaysToDate(now, -30),
            endDate: SchedulerHelperService.addDaysToDate(now, -22),
        },
        {
            id: 2,
            title: 'OK Junior, bend over',
            type: 'normal',
            startDate: SchedulerHelperService.addDaysToDate(now, -24),
            endDate: SchedulerHelperService.addDaysToDate(now, -21),
        },
        {
            id: 3,
            title: 'Running in the mountain',
            type: 'urgent',
            startDate: SchedulerHelperService.addDaysToDate(now, -17),
            endDate: SchedulerHelperService.addDaysToDate(now, -15),
        },
        {
            id: 4,
            title: 'July Ruby',
            type: 'urgent',
            startDate: SchedulerHelperService.addDaysToDate(now, -12),
            endDate: SchedulerHelperService.addDaysToDate(now, -10),
        },
        {
            id: 5,
            title: 'Old one',
            type: 'urgent',
            startDate: SchedulerHelperService.addDaysToDate(now, -18),
            endDate: SchedulerHelperService.addDaysToDate(now, -6),
        },
        {
            id: 6,
            title: 'Outdated event',
            type: 'urgent',
            startDate: SchedulerHelperService.addDaysToDate(now, -4),
            endDate: SchedulerHelperService.addDaysToDate(now, -2),
        },
        {
            id: 7,
            title: 'In progress, low priority',
            type: 'normal',
            startDate: SchedulerHelperService.addDaysToDate(now, -2),
            endDate: SchedulerHelperService.addDaysToDate(now, 2),
        },
        {
            id: 8,
            title: 'Full Week Holidays',
            type: 'normal',
            startDate: SchedulerHelperService.addDaysToDate(now, 4),
            endDate: SchedulerHelperService.addDaysToDate(now, 10),
        },
        {
            id: 9,
            title: 'Something to do soon',
            type: 'normal',
            startDate: SchedulerHelperService.addDaysToDate(now, 2),
            endDate: SchedulerHelperService.addDaysToDate(now, 6),
        },
        {
            id: 10,
            title: 'In progress, hi-priority',
            type: 'urgent',
            startDate: SchedulerHelperService.addDaysToDate(now, 0),
            endDate: SchedulerHelperService.addDaysToDate(now, 4),
        },
        {
            id: 11,
            title: 'Fiesta on the beach',
            type: 'urgent',
            startDate: SchedulerHelperService.addDaysToDate(now, 12),
            endDate: SchedulerHelperService.addDaysToDate(now, 20),
        },
        {
            id: 12,
            title: '1 day',
            type: 'normal',
            startDate: SchedulerHelperService.addDaysToDate(now, 13),
            endDate: SchedulerHelperService.addDaysToDate(now, 13),
        },
        {
            id: 13,
            title: 'Testing',
            lock: true,
            type: 'urgent',
            startDate: SchedulerHelperService.addDaysToDate(now, 8),
            endDate: SchedulerHelperService.addDaysToDate(now, 9),
        },
        {
            id: 14,
            title: 'Near future event',
            type: 'normal',
            startDate: SchedulerHelperService.addDaysToDate(now, 30),
            endDate: SchedulerHelperService.addDaysToDate(now, 35),
        },
        {
            id: 15,
            title: 'Far future event',
            type: 'normal',
            startDate: SchedulerHelperService.addDaysToDate(now, 92),
            endDate: SchedulerHelperService.addDaysToDate(now, 98),
        },
    ];

    $scope.events = _.sortBy($scope.events, ['startDate']);

    // Listen to the "planttError" DOM event, to do something when an error occurs
    $scope.$on('planttError', () => {
        // console.log(`Plantt ${err.levelName} (${err.level}):`, err.message);
    });

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
