
/* @ngInject */
function SchedulerHelperService() {
    function addDaysToDate(date, days) {
        const mdate = new Date(date.getTime());

        mdate.setTime(mdate.getTime() + (days * 1000 * 60 * 60 * 24));
        mdate.setHours(12); mdate.setMinutes(0); mdate.setSeconds(0); mdate.setMilliseconds(0);
        return mdate;
    }

    function daysInPeriod(date1, date2, wantDiff) {
        const oneDay = 1000 * 60 * 60 * 24;

        date1.setHours(12); date1.setMinutes(0); date1.setSeconds(0); date1.setMilliseconds(0);
        date2.setHours(12); date2.setMinutes(0); date2.setSeconds(0); date2.setMilliseconds(0);
        const daysCount = `${(date2.getTime() - date1.getTime()) / oneDay}`;
        const result = parseInt(daysCount, 10);

        return wantDiff ? result : Math.abs(result);
    }

    function daysInMonth(date) {
        const r = new Date(date.getYear(), date.getMonth() + 1, 0).getDate();

        return parseInt(r, 10);
    }

    return {
        addDaysToDate,
        daysInPeriod,
        daysInMonth,
        isDayInMiddleOfEvent(day, event) {
            return day.date > event.startDate && day.date < event.endDate;
        },
        isDayAtStartOfEventInView(day, event, viewStart) {
            const dayAsTime = day.date.getTime();
            const eventStartTime = event.startDate.getTime();
            const eventEndTime = event.endDate.getTime();
            const viewStartTime = viewStart.getTime();
            return dayAsTime === eventStartTime
                || (dayAsTime === viewStartTime && eventStartTime <= viewStartTime && eventEndTime >= viewStartTime);
        },
        isCurrentDate(event) {
            const currentDate = new Date();
            return event.startDate.getTime() <= currentDate.getTime() && event.endDate.getTime() >= currentDate.getTime();
        },
        getEventLengthInViewInDays(event, viewStart) {
            const eventLength = daysInPeriod(event.startDate, event.endDate, false) + 1;
            if (viewStart.getTime() > event.startDate.getTime()) {
                return eventLength - daysInPeriod(viewStart, event.startDate, false);
            }
            return eventLength;
        },
    };
}

module.exports = SchedulerHelperService;
