
/* @ngInject */
function SchedulerEventDirectiveController(
    $scope,
    dateFilter,
    $compile,
    $sce,
    SchedulerHelperService,
) {
    function getTooltipHtml(event) {
        const html = `<div style="text-align: left">
            <h4>${event.name}</h4>
            <p>${dateFilter(event.startDate, $scope.formatDayLong)} - ${dateFilter(event.endDate, $scope.formatDayLong)}</p>
            <p style="text-transform: capitalize">${event.status}</p>
        </div>`;
        return $sce.trustAsHtml(html);
    }

    $scope.$watch('event', (newVal) => {
        $scope.tooltipHtml = getTooltipHtml(newVal);
    });

    $scope.getEventLengthInViewInDays = SchedulerHelperService.getEventLengthInViewInDays;
    $scope.isCurrentDate = SchedulerHelperService.isCurrentDate;
}

module.exports = SchedulerEventDirectiveController;
