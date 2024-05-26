const moment = require('moment');

// To format date in a human readable form eg:- Posted 2 days, ago
export const dateFormatHumanized = (date) => {
	const updatedAt = moment(date);
	const now = moment();
	const timeDifference = now.diff(updatedAt, "seconds");
	const formattedTimeDifference = moment
		.duration(timeDifference, "seconds")
		.humanize();
		
	return formattedTimeDifference;
};

// to check a date is today or not
export const isToday = (date) => {
	const createdAt = moment(date);
	const today = moment().startOf("day");

	const todayOrNot = createdAt.isSame(today, "day");
	return todayOrNot;
};

// to get time form a data field eg:- 8:45 AM
export const getTime = (date) =>{
    const createdAt = moment(date);

    // Get the time component from createdAt
    const time = createdAt.format('h:mm A');
    return time
}

export const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString();
};