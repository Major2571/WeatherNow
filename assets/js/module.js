'use strict';

export const weekDayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

export const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
]

/**
 * 
 * @param {number} dateUnix  Unix date in seconds
 * @param {number} timezone  Timezone shift from UTC in seconds
 * @returns {string} Date String. formate: "Sunday 10, Jan"
 */

export const getDate = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
}

/**
 * 
 * @param {number} timeUnix  Unix date in seconds
 * @param {number} timezone  Timezone shift from UTC in seconds
 * @returns  {string} Time string. formate: "HH:MM AM/PM"
 */

export const getTime = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 10 ? "PM" : "AM";

    return `${hours % 12 || 12}:${minutes} ${period}`;
}

/**
 * 
 * @param {number} timeUnix  Unix date in seconds
 * @param {number} timezone  Timezone shift from UTC in seconds
 * @returns  {string} Time string. formate: "HH AM/PM"
 */

export const getHours = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const period = hours >= 10 ? "PM" : "AM";

    return `${hours % 12 || 12} ${period}`;
}

/**
 * 
 * @param {number} mps  Metter per seconds
 * @returns {number} Km/h
 */

export const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000;
}


/**
 * 
 * @param {number} value The value of the pollutant
 * @param {number} threshold The threshold value for the pollutant
 * @returns {string} The CSS class for the pollutant
 */

export const getPollutantClass = function (value, threshold) {
    if (value <= threshold) {
        return 'aqi-1';
    } else if (value <= threshold * 2) {
        return 'aqi-2';
    } else if (value <= threshold * 3) {
        return 'aqi-3';
    } else if (value <= threshold * 4) {
        return 'aqi-4';
    } else if (value <= threshold * 5) {
        return 'aqi-5';
    } else {
        return 'aqi-5';
    }
}

export const aqiText = {
    1: {
        level: 'Good',
        message: 'Air quality is considered satisfactory, and air pollution poses little to no risk.'
    },
    2: {
        level: 'Fair',
        message: 'Air quality is acceptable. However, certain pollutants may pose a moderate health concern for a very small number of sensitive individuals.'
    },
    3: {
        level: 'Moderate',
        message: 'Sensitive individuals may experience health effects, but the general public is unlikely to be affected.'
    },
    4: {
        level: 'Poor',
        message: 'Health effects may be experienced by everyone, and sensitive individuals may experience more serious health effects.'
    },
    5: {
        level: 'Very Poor',
        message: 'Emergency conditions exist. The entire population is likely to be affected by health warnings.'
    }
};


