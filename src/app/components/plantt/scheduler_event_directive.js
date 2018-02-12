import angular from 'angular';

/* @ngInject */
function SchedulerEventDirective($document, $rootScope, $timeout, $filter, ScheduleHelperService) {
    return {
        restrict: 'E',
        link(scope, element, attrs) {
        // Double-click an event element to emit the custom event "eventOpen" to all other scopes
        // Useful to open a modal window containing detailed informations of the vent, for example
            element.on('dblclick', (e) => {
                e.preventDefault(); e.stopPropagation();
                const thisEvent = $filter('filter')(scope.events, { id: Number(attrs.eventId) }, true)[0];

                if (!thisEvent) {
                    scope.throwError(1, `Event with ID ${attrs.eventId} not found!`);
                    return;
                }
                $rootScope.$broadcast('eventOpen', thisEvent);
                scope.throwError(3, "The DOM event 'eventOpen' was emitted in rootScope.");
            });

        // Right-click an event to emit the custom event "eventCtxMenu" to all ohter scopes
        // Usefull to open a contextual menu with several event-based actions
            element.on('contextmenu', (e) => {
                e.preventDefault(); e.stopPropagation();
                const thisEvent = $filter('filter')(scope.events, { id: Number(attrs.eventId) }, true)[0];

                if (!thisEvent) {
                    scope.throwError(1, `Event with ID ${attrs.eventId} not found!`);
                    return;
                }
                $rootScope.$broadcast('eventCtxMenu', thisEvent);
                scope.throwError(3, "The DOM event 'eventCtxMenu' was emitted in rootScope.");
            });

        /*
                 * EVERYTHING following will only be accessible if the event is NOT LOCKED
                 * (if "event.lock" is not = true)
                 */
            const thisRenderedEvent = $filter('filter')(scope.renderedEvents, { id: Number(attrs.eventId) }, true)[0];

            if (thisRenderedEvent.lock && thisRenderedEvent.lock === true) { return; }

        // Click-Drag an event to change its dates
        // (emits the DOM event "eventMove" to all other scopes)
            let dragInit = false;
            let grabDeltaX = 0;
            let offsetDay = 0;
            let offsetLeft = 0;
            let offsetTop = 0;
            let elemWidth = 0;
            let newStartDate = thisRenderedEvent.startDate;
            let newEndDate = thisRenderedEvent.endDate;
            let newStartHour = thisRenderedEvent.startDate.getHours();
            let newEndHour = thisRenderedEvent.endDate.getHours();

            function grabEventMove(e) {
                if (e.buttons !== 1) { return; }
                e.preventDefault(); e.stopPropagation();
                dragInit = true;
                grabDeltaX += e.movementX;
                offsetDay = Math.round(grabDeltaX / scope.cellWidth);
                offsetLeft += e.movementX;
                offsetTop += e.movementY;
                element.css({ left: `${offsetLeft}px`, top: `${offsetTop}px` });
            }
            function grabEventEnd(e) {
                element.css({ opacity: 1 });
                if (!dragInit) { return; }
                e.preventDefault(); e.stopPropagation();
                if (scope.useHours) {
                    const newStartPos = Math.round(offsetLeft / scope.HcellWidth);
                    const newEndPos = Math.round((offsetLeft + elemWidth) / scope.HcellWidth);
                    const dayStartInGrid = Math.floor(newStartPos / scope.nbHours);
                    const dayEndInGrid = Math.floor(newEndPos / scope.nbHours);

                    newStartDate = ScheduleHelperService.addDaysToDate(angular.copy(scope.viewStart), dayStartInGrid);
                    newEndDate = ScheduleHelperService.addDaysToDate(angular.copy(scope.viewStart), dayEndInGrid);
                    newStartHour = (scope.dayStartHour + newStartPos) - (scope.nbHours * dayStartInGrid);
                    newEndHour = (scope.dayStartHour + newEndPos) - (scope.nbHours * dayEndInGrid);
            // When placing the event's end on the last hour of day, make sure that
            // its date corresponds (and not set before the first hour of next day)
                    if (newEndHour === scope.dayStartHour) {
                        newEndHour = scope.dayEndHour + 1;
                        newEndDate = ScheduleHelperService.addDaysToDate(newEndDate, -1);
                    }
                } else {
                    newStartDate = ScheduleHelperService.addDaysToDate(newStartDate, offsetDay);
                    newEndDate = ScheduleHelperService.addDaysToDate(newEndDate, offsetDay);
                }
                const thisEvent = $filter('filter')(scope.events, { id: Number(attrs.eventId) }, true)[0];

                if (thisEvent) {
                    $rootScope.$broadcast('eventMove', thisEvent, newStartDate, newEndDate, newStartHour, newEndHour);
                    scope.throwError(3, "The DOM event 'eventMove' was emitted in rootScope.");
                } else { scope.throwError(0, `The event with id #${attrs.eventId} was not found!`); }
                dragInit = false;
                grabDeltaX = 0;
                $document.off('mousemove', grabEventMove);
                $document.off('mouseup', grabEventEnd);
            }
            function grabEventStart(e) {
                e.preventDefault(); e.stopPropagation();
                grabDeltaX = 0;
                offsetLeft = parseInt(element.css('left'), 10);
                offsetTop = parseInt(element.css('top'), 10);
                elemWidth = parseInt(element.css('width'), 10);
                element.css({ opacity: 0.5, 'z-index': 1000 });
                $document.on('mousemove', grabEventMove);
                $document.on('mouseup', grabEventEnd);
            }

            element.on('mousedown', grabEventStart);
        },
    };
}

module.exports = SchedulerEventDirective;
