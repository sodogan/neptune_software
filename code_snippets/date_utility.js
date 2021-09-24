class Date_Utility {
    static formatDate(dataDateTime) {
        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance();
        return oDateFormat.format(new Date(dataDateTime));
    };
    static getCalenderWeek() {
        //set the prototype
        Date.prototype.getWeek = function () {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
        };

        const calenderWeek = new Date().getWeek();
        return calenderWeek;
    };
}



