/**
 * Converts unix time to string form "YYYY-MM-DD hh:mm:ss A"
 * @param {number} unixTime Time in unix time form
 */
export const unixToString = unixTime => {
    let time = new Date(unixTime);

    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();

    return `${day}-${month}-${year} ${hour > 12 ? hour - 12 :  hour == 0 ? 12 :hour}:${
        minute < 10 ? "0" + minute : minute
    }:${second < 10 ? "0" + second : second} ${hour >= 12 ? "PM" : "AM"}`;
};

export const unixToStringNoSecond = unixTime => {
    let time = new Date(unixTime);

    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();

    return `${day}-${month}-${year} ${hour > 12 ? hour - 12 : hour}:${
        minute < 10 ? "0" + minute : minute
    } ${hour >= 12 ? "PM" : "AM"}`;
};
