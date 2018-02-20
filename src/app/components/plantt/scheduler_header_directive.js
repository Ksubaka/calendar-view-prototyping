import css from './scheduler_header.less';

/* @ngInject */
function SchedulerHeaderDirective($document, $timeout, SchedulerHelperService) {
    return {
        restrict: 'A',
        scope: {
            viewStart: '=',
            viewEnd: '=',
            cellWidth: '=',
            renderView: '&',
        },
        link(scope, element) {
            let dragInit = false;
            let grabDeltaX = 0;

            function grabHeadMove(e) {
                if (e.buttons !== 1) { return; }
                e.preventDefault();
                e.stopPropagation();
                dragInit = true;
                grabDeltaX += e.originalEvent.movementX;
                if (Math.abs(grabDeltaX) >= scope.cellWidth) {
                    const deltaDay = Math.round(grabDeltaX / scope.cellWidth);

                    scope.viewStart = SchedulerHelperService.addDaysToDate(scope.viewStart, -deltaDay);
                    scope.viewEnd = SchedulerHelperService.addDaysToDate(scope.viewEnd, -deltaDay);
                    grabDeltaX = 0;
                    $timeout(() => {
                        scope.renderView();
                    }, 0);
                }
            }
            function grabHeadEnd(e) {
                e.preventDefault();
                e.stopPropagation();
                if (!dragInit) { return; }
                dragInit = false;
                grabDeltaX = 0;
                $document.off('mousemove', grabHeadMove);
                $document.off('mouseup', grabHeadEnd);
            }
            function grabHeadStart(e) {
                e.preventDefault();
                e.stopPropagation();
                grabDeltaX = 0;
                $document.on('mousemove', grabHeadMove);
                $document.on('mouseup', grabHeadEnd);
            }

            // Click-drag on grid header to move the view left or right
            element.on('mousedown', grabHeadStart);
        },
    };
}

module.exports = SchedulerHeaderDirective;
