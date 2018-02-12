
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
        const result = parseInt((date2.getTime() - date1.getTime()) / oneDay, 10);

        if (wantDiff) { return result; } return Math.abs(result);
    }

    function daysInMonth(date) {
        const r = new Date(date.getYear(), date.getMonth() + 1, 0).getDate();

        return parseInt(r, 10);
    }

    return {
        addDaysToDate,
        daysInPeriod,
        daysInMonth,
    };
}

module.exports = SchedulerHelperService;
