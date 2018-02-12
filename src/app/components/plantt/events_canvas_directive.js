import angular from 'angular';

/* @ngInject */
function EventsCanvasDirective($document, $rootScope, $timeout, SchedulerHelperService) {
    return {
        restrict: 'A',
        link(scope, element) {
        // Click-drag on canvas emits the event "periodSelect" to all other scopes
        // Useful to add events on the timeline
            const eventHelper = $document.find('eventhelper');
            let dragInit = false;
            let startWidth = 0;
            let selStart = null;
            let selEnd = null;

            function grabGridMove(e) {
                if (e.buttons === 1) {
                    e.preventDefault(); e.stopPropagation();
                    dragInit = true;
                    startWidth += e.movementX;
                    if (startWidth <= 0) { return; }
                    eventHelper.css({ width: `${startWidth - 2}px` });
                }
            }

            function grabGridEnd(e) {
                startWidth = 0;
                eventHelper.css({ width: '0px', display: 'none' });
                $document.off('mousemove', grabGridMove);
                $document.off('mouseup', grabGridEnd);
                if (!dragInit) { return; }
                if (!selStart) { return; }
                e.preventDefault(); e.stopPropagation();
                const dayInView = Math.floor(e.layerX / scope.cellWidth);

                selEnd = SchedulerHelperService.addDaysToDate(scope.viewStart, dayInView);
                if (scope.useHours) {
                    const endPos = Math.round(e.layerX / scope.HcellWidth);
                    const dayInGrid = Math.floor(endPos / scope.nbHours);

                    selEnd = SchedulerHelperService.addDaysToDate(angular.copy(scope.viewStart), dayInGrid);
                    const newHour = (scope.dayStartHour + endPos) - (scope.nbHours * dayInGrid);

                    selEnd.setHours(newHour);
                }
                if (selStart.getTime() < selEnd.getTime()) {
                    $rootScope.$broadcast('periodSelect', { start: selStart, end: selEnd });
                    scope.throwError(3, "The DOM event 'periodSelect' was emitted in rootScope.");
                }
                dragInit = false;
            }

            function grabGridStart(e) {
                e.preventDefault(); e.stopPropagation();
                const startDay = Math.floor(e.layerX / scope.cellWidth);

                selStart = SchedulerHelperService.addDaysToDate(scope.viewStart, startDay);
                if (scope.useHours) {
                    const startPos = Math.round(e.layerX / scope.HcellWidth);
                    const dayInGrid = Math.floor(startPos / scope.nbHours);

                    selStart = SchedulerHelperService.addDaysToDate(angular.copy(scope.viewStart), dayInGrid);
                    const newHour = (scope.dayStartHour + startPos) - (scope.nbHours * dayInGrid);

                    selStart.setHours(newHour);
                }
                eventHelper.css({ top: `${e.layerY - 25}px`, left: `${e.layerX + 1}px` });
                eventHelper.css({ display: 'block' });
                $document.on('mousemove', grabGridMove);
                $document.on('mouseup', grabGridEnd);
                return false;
            }


        // Calculate the margin-top offset to avoid overlapping the grid's headers
            $timeout(() => {
                const theadHeight = parseInt($document.find('thead').prop('offsetHeight'), 10);
                const headerHeight = parseInt($document.find('header').prop('offsetHeight'), 10);
                const headHeight = `${theadHeight + headerHeight + scope.eventMargin}px`;
                const gridHeight = parseInt($document.find('tbody').prop('offsetHeight'), 10);

                element.css({ top: headHeight });
                element.css({ height: `${gridHeight - scope.eventMargin}px` });
            }, 0);

        // Double-click on the canvas emits the event "dayselect" to all other scopes
        // Useful to add an event on a specific day of the timeline
            element.on('dblclick', (e) => {
                e.preventDefault(); e.stopPropagation();
                const dayInView = Math.floor(e.layerX / scope.cellWidth);
                const selectedDate = SchedulerHelperService.addDaysToDate(scope.viewStart, dayInView);

                if (scope.useHours) { selectedDate.setHours(scope.dayStartHour); }
                $rootScope.$broadcast('daySelect', selectedDate);
                scope.throwError(3, "The DOM event 'daySelect' was emitted in rootScope.");
            });

            element.on('mousedown', grabGridStart);
        },
    };
}

module.exports = EventsCanvasDirective;
