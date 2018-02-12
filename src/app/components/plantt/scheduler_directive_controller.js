import _ from 'lodash';
import angular from 'angular';

/* @ngInject */
function SchedulerDirectiveController($scope, $window, $document, $timeout, dateFilter, SchedulerHelperService) {
    // Create the list of events variable, if not present in the app controller
    if (!$scope.events) {
        $scope.events = [];
    }
    // Today's date
    $scope.currDate = SchedulerHelperService.addDaysToDate(new Date(), 0);

    /*
     * OPTIONS VALUES
     * Can be overwritten in app controller
     */
    $scope.viewStart = $scope.viewStart || SchedulerHelperService.addDaysToDate($scope.currDate, -7);
    $scope.viewEnd = $scope.viewEnd || SchedulerHelperService.addDaysToDate($scope.currDate, 14);
    $scope.eventHeight = $scope.eventHeight || 50;
    $scope.eventMargin = $scope.eventMargin || 10;
    $scope.leftColumnWidth = $scope.leftColumnWidth || 200;
    $scope.useLock = true;
    $scope.lock = true;
    // Number of days between today and the start date of events for the automatic lock to be effective
    $scope.formatDayLong = $scope.formatDayLong || 'EEEE MMMM dd';
    // The JS date format for the long display of dates (see https://docs.angularjs.org/api/ng/filter/date)
    $scope.formatDayShort = $scope.formatDayShort || 'yyyy-MM-dd';
    // The JS date format for the short display of dates
    $scope.formatMonth = $scope.formatMonth || 'MMMM yyyy';

    $scope.renderView = function () {
        const currTime = $scope.currDate.getTime();
        $scope.enumDays = []; // List of objects describing all days within the view.
        $scope.enumMonths = []; // List of objects describing all months within the view.
        $scope.gridWidth = $document.find('tbody').prop('offsetWidth') - $scope.leftColumnWidth; // Width of the rendered grid
        $scope.viewPeriod = SchedulerHelperService.daysInPeriod($scope.viewStart, $scope.viewEnd, false); // Number of days in period of the view
        $scope.cellWidth = $scope.gridWidth / ($scope.viewPeriod + 1); // Width of the days cells of the grid
        $scope.linesFill = {}; // Empty the lines filling map
        $scope.renderedEvents = []; // Empty the rendered events list

        // First Loop: on all view's days, to define the grid
        let lastMonth = -1;
        let monthNumDays = 1;
        let nbMonths = 0;
        $scope.nbLines = $scope.events.length + 1;

        for (let d = 0; d <= $scope.viewPeriod; d++) {
            const dayDate = SchedulerHelperService.addDaysToDate($scope.viewStart, d);
            const today = $scope.currDate.getTime() === dayDate.getTime();
            const isLastOfMonth = SchedulerHelperService.daysInMonth(dayDate) === dayDate.getDate();

            // Populate the lines filling map
            for (let l = 1; l <= $scope.nbLines; l++) {
                $scope.linesFill[l] = [];
                for (let ld = 0; ld <= $scope.viewPeriod; ld++) {
                    $scope.linesFill[l].push(false);
                }
            }

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

        $scope.rowHeight = ($scope.eventHeight + ($scope.eventMargin * 2));

        // Second loop: Filter and calculate the placement of all events to be rendered
        _.forEach($scope.events, (event) => {
            const evt = angular.copy(event);
            const eStart = evt.startDate.getTime();
            const eEnd = evt.endDate.getTime();
            const viewRealStart = new Date($scope.viewStart.getTime());
            const viewRealEnd = new Date($scope.viewEnd.getTime());

            viewRealStart.setHours(0);
            viewRealStart.setMinutes(0);
            viewRealStart.setSeconds(0);
            viewRealEnd.setHours(23);
            viewRealEnd.setMinutes(59);
            viewRealEnd.setSeconds(59);
            const vStart = viewRealStart.getTime();
            const vEnd = viewRealEnd.getTime();

            if (eStart < vStart && eEnd < vStart) { // Do not render event if it's totally BEFORE the view's period
                return true;
            }
            if (eStart > vEnd) { // Do not render event if it's AFTER the view's period
                return true;
            }

            // Calculate the left and width offsets for the event's element
            const offsetDays = -SchedulerHelperService.daysInPeriod(angular.copy(evt.startDate), $scope.viewStart, true);
            const eventLength = SchedulerHelperService.daysInPeriod(angular.copy(evt.endDate), angular.copy(evt.startDate), false) + 1;
            const eventWidth = eventLength * $scope.cellWidth;
            let offsetLeft = Math.floor(offsetDays * $scope.cellWidth);

            let daysExceed = 0;
            let extraClass = `${evt.type} `;
            // If the event's START date is BEFORE the current displayed view
            if (offsetDays < 0) {
                offsetLeft = 0; // to stick the element to extreme left
                daysExceed = -offsetDays; // to trim the total element's width
                extraClass += 'over-left '; // to decorate the element's left boundary
            }
            // If the event's END date is AFTER the current displayed view
            if (eEnd > vEnd) {
                daysExceed = SchedulerHelperService.daysInPeriod($scope.viewEnd, angular.copy(evt.endDate), false);
                extraClass += 'over-right '; // to decorate the element's right boundary
            }
            // If the event's END date is BEFORE TODAY (to illustrate the fact it's in the past)
            if (eEnd < currTime) {
                extraClass += 'past ';
            }

            evt.lock = true;

            // If the event is CURRENTLY active (over today)
            if (eStart <= currTime && eEnd >= currTime) {
                extraClass += 'current '; // to illustrate the fact it's currently active
            }
            // Add some classes to the element
            evt.extraClasses = extraClass;

            // Place and scale the event's element in DOM
            evt.positioningAttributes = {
                left: `${Math.floor(offsetLeft) + $scope.leftColumnWidth}px`,
                width: `${eventWidth - (daysExceed * $scope.cellWidth)}px`,
                top: `${$scope.renderedEvents.length * $scope.rowHeight}px`,
                height: `${$scope.eventHeight}px`,
            };

            // Actually RENDER the event on the timeline
            $scope.renderedEvents.push(evt);
            return null;
        });
        // Compute the view's height to fit all elements (with margins)
    };

    // Call the renderer for the first time
    $scope.renderView();

    // Call the renderer when window is resized
    angular.element($window).bind('resize', () => {
        $timeout(() => {
            $scope.renderView();
        }, 100);
    });

    /*
     * Offset view to previous day
     */
    $scope.prevDay = function () {
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, -1);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, -1);
        $scope.renderView();
    };

    /*
     * Offset view to previous X days
     */
    $scope.prevCustom = function (days) {
        let daysToUse = days;
        if (typeof daysToUse === 'undefined') {
            daysToUse = 15;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, -daysToUse);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, -daysToUse);
        $scope.renderView();
    };

    /*
     * Set the start date for view
     */
    $scope.setStartView = function (year, month, day) {
        const date = SchedulerHelperService.addDaysToDate(new Date(year, month - 1, day), 0);

        if (date.getTime() >= $scope.viewEnd.getTime()) {
            return;
        }
        $scope.viewStart = date;
        $scope.renderView();
    };

    /*
     * Zoom IN view (-1 day on each side)
     */
    $scope.zoomIn = function (step) {
        if (SchedulerHelperService.daysInPeriod($scope.viewStart, $scope.viewEnd) <= 2) {
            return;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, Number(step));
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, -step);
        $scope.renderView();
    };

    /*
     * Zoom OUT view (+1 day on each side)
     */
    $scope.zoomOut = function (step) {
        if (SchedulerHelperService.daysInPeriod($scope.viewStart, $scope.viewEnd) >= 365) {
            return;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, -step);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, Number(step));
        $scope.renderView();
    };

    /*
     * Center view to current day (defaults -7, +14 days)
     */
    $scope.centerView = function (daysBefore, daysAfter) {
        let daysBeforeToUse = daysBefore;
        let daysAfterToUse = daysAfter;
        if (typeof daysBefore === 'undefined') {
            daysBeforeToUse = 7;
        }
        if (typeof daysAfter === 'undefined') {
            daysAfterToUse = 14;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate(new Date(), -daysBeforeToUse);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate(new Date(), daysAfterToUse);
        $scope.renderView();
    };

    /*
     * Offset view to next day
     */
    $scope.nextDay = function () {
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, 1);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, 1);
        $scope.renderView();
    };

    /*
     * Offset view to next X days
     */
    $scope.nextCustom = function (days) {
        let daysToUse = days;
        if (typeof days === 'undefined') {
            daysToUse = 15;
        }
        $scope.viewStart = SchedulerHelperService.addDaysToDate($scope.viewStart, daysToUse);
        $scope.viewEnd = SchedulerHelperService.addDaysToDate($scope.viewEnd, daysToUse);
        $scope.renderView();
    };

    /*
     * Set the end date for view
     */
    $scope.setEndView = function (year, month, day) {
        const date = SchedulerHelperService.addDaysToDate(new Date(year, month - 1, day), 0);

        if (date.getTime() <= $scope.viewStart.getTime()) {
            return;
        }
        $scope.viewEnd = date;
        $scope.renderView();
    };
}

module.exports = SchedulerDirectiveController;