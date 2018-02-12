
/* @ngInject */
function SchedulerEventDirective($document, $rootScope, $timeout, $filter) {
    return {
        restrict: 'E',
        link(scope, element, attrs) {
            // Double-click an event element to emit the custom event "eventOpen" to all other scopes
            // Useful to open a modal window containing detailed informations of the vent, for example
            element.on('dblclick', (e) => {
                e.preventDefault(); e.stopPropagation();
                const thisEvent = $filter('filter')(scope.events, { id: Number(attrs.eventId) }, true)[0];

                if (!thisEvent) {
                    return;
                }
                $rootScope.$broadcast('eventOpen', thisEvent);
            });

            // Right-click an event to emit the custom event "eventCtxMenu" to all ohter scopes
            // Useful to open a contextual menu with several event-based actions
            element.on('contextmenu', (e) => {
                e.preventDefault(); e.stopPropagation();
                const thisEvent = $filter('filter')(scope.events, { id: Number(attrs.eventId) }, true)[0];

                if (!thisEvent) {
                    return;
                }
                $rootScope.$broadcast('eventCtxMenu', thisEvent);
            });
        },
    };
}

module.exports = SchedulerEventDirective;
