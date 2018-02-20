import angular from 'angular';
import _ from 'lodash';

/* @ngInject */
function SchedulerDirectiveController(
    $scope,
    $window,
    $document,
    $timeout,
    dateFilter,
    SchedulerHelperService,
) {
    const eventHeight = 40;
    const eventMargin = 10;
    $scope.leftColumnWidth = 200;
    $scope.formatDayLong = 'EEEE dd MMMM'; // The JS date format for the long display of dates
    $scope.formatDayShort = 'dd/MM/yyyy'; // The JS date format for the short display of dates
    $scope.formatMonth = 'MMMM yyyy'; // The JS date format for the month display in header
    $scope.events = $scope.events || [];
    const currDate = SchedulerHelperService.addDaysToDate(new Date(), 0);

    $scope.viewStart = $scope.viewStart || SchedulerHelperService.addDaysToDate(currDate, -7);
    $scope.viewEnd = $scope.viewEnd || SchedulerHelperService.addDaysToDate(currDate, 14);
    $scope.formatDayLong = $scope.formatDayLong || 'EEEE MMMM dd';
    $scope.formatDayShort = $scope.formatDayShort || 'yyyy-MM-dd';
    $scope.formatMonth = $scope.formatMonth || 'MMMM yyyy';

    $scope.renderView = function () {
        $scope.enumDays = []; // List of objects describing all days within the view.
        $scope.enumMonths = []; // List of objects describing all months within the view.
        $scope.viewPeriod = SchedulerHelperService.daysInPeriod($scope.viewStart, $scope.viewEnd, false); // Number of days in period of the view
        $scope.cellWidth = $scope.getGridWidth() / ($scope.viewPeriod + 1); // Width of the days cells of the grid
        $scope.rowHeight = (eventHeight + (eventMargin * 2));
        $scope.gridHeight = $scope.rowHeight * $scope.events.length;
        // First Loop: on all view's days, to define the grid
        let lastMonth = -1;
        let monthNumDays = 1;
        let nbMonths = 0;

        for (let d = 0; d <= $scope.viewPeriod; d++) {
            const dayDate = SchedulerHelperService.addDaysToDate($scope.viewStart, d);
            const today = currDate.getTime() === dayDate.getTime();
            const isLastOfMonth = SchedulerHelperService.daysInMonth(dayDate) === dayDate.getDate();

            // Populate the list of all days
            $scope.enumDays.push({
                num: dateFilter(dayDate, 'dd'),
                offset: d,
                date: dayDate,
                time: dayDate.getTime(),
                title: dateFilter(dayDate, $scope.formatDayLong),
                nbEvents: 0,
                today,
                isLastOfMonth,
            });
            // Populate the list of all months
            monthNumDays += 1;
            if (lastMonth !== dayDate.getMonth()) {
                $scope.enumMonths.push({
                    num: dayDate.getMonth(),
                    name: dateFilter(dayDate, $scope.formatMonth),
                });
                lastMonth = dayDate.getMonth();
                monthNumDays = 1;
                nbMonths += 1;
            }
            if ($scope.enumMonths[nbMonths - 1]) {
                $scope.enumMonths[nbMonths - 1].numDays = monthNumDays;
            }
        }
    };

    $scope.isDayInMiddleOfEvent = SchedulerHelperService.isDayInMiddleOfEvent;
    $scope.isDayAtStartOfEvent = SchedulerHelperService.isDayAtStartOfEvent;
    $scope.isDayAtEndOfEvent = SchedulerHelperService.isDayAtEndOfEvent;
    $scope.isEventDay = SchedulerHelperService.isEventDay;
    $scope.isCurrent = SchedulerHelperService.isCurrent;

    $scope.prevDay = function () {
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, -1);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, -1);
        $scope.renderView();
    };

    $scope.prevCustom = function (days) {
        let daysToUse = days;
        if (typeof daysToUse === 'undefined') {
            daysToUse = 15;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, -daysToUse);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, -daysToUse);
        $scope.renderView();
    };

    $scope.setStartView = function (year, month, day) {
        const date = SchedulerHelperService.addDaysToDate(new Date(year, month - 1, day), 0);

        if (date.getTime() >= $scope.viewEnd.getTime()) {
            return;
        }
        $scope.viewStart = date;
        $scope.renderView();
    };

    $scope.zoomIn = function (step) {
        if (SchedulerHelperService.daysInPeriod($scope.viewStart, $scope.viewEnd) <= 2) {
            return;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, Number(step));
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, -step);
        $scope.renderView();
    };

    $scope.zoomOut = function (step) {
        if (SchedulerHelperService.daysInPeriod($scope.viewStart, $scope.viewEnd) >= 365) {
            return;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, -step);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, Number(step));
        $scope.renderView();
    };

    $scope.centerView = function () {
        const currentDaysInView = SchedulerHelperService.daysInPeriod($scope.viewStart, $scope.viewEnd);
        const daysBeforeToUse = Math.floor(currentDaysInView / 2);
        const daysAfterToUse = Math.ceil(currentDaysInView / 2);
        $scope.viewStart = SchedulerHelperService.addDaysToDate(new Date(), -daysBeforeToUse);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate(new Date(), daysAfterToUse);
        $scope.renderView();
    };

    $scope.nextDay = function () {
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, 1);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, 1);
        $scope.renderView();
    };

    $scope.nextCustom = function (days) {
        let daysToUse = days;
        if (typeof days === 'undefined') {
            daysToUse = 15;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, daysToUse);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, daysToUse);
        $scope.renderView();
    };

    $scope.setEndView = function (year, month, day) {
        const date = SchedulerHelperService.addDaysToDate(new Date(year, month - 1, day), 0);

        if (date.getTime() <= $scope.viewStart.getTime()) {
            return;
        }
        $scope.viewEnd = date;
        $scope.renderView();
    };

    $scope.isWeekend = function (day) {
        return day.date.getDay() === 0 || day.date.getDay() === 6;
    };

    $timeout(() => {
        $scope.renderView();
    });

    angular.element($window).bind('resize', () => {
        $timeout(() => {
            $scope.renderView();
        }, 100);
    });
}

module.exports = SchedulerDirectiveController;
