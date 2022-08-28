export const formulateDate = (date) => {
    return (
        toAMPMFormat(new Date(date).getHours(), new Date(date).getMinutes()) +
        " | " +
        new Date(date).getDate() +
        " " +
        toMonthName(new Date(date).getMonth() + 1)
    );
};

const toAMPMFormat = (hour, seconds) => {
    var suffix = hour >= 12 ? "PM" : "AM";
    return ((hour + 11) % 12) + 1 + ":" + seconds + " " + suffix;
};

const toMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", {
        month: "long",
    });
};
