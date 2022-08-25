import { format, addMinutes, set, subMinutes } from "date-fns";

const convertZonedToUTC = (date) => {
    const formated = format(addMinutes(date, date.getTimezoneOffset()), "yyyy-MM-dd'T'HH:mm:ss");
    return formated
}

const convertUTCToZoned = (date) => {
    const formated = format(subMinutes(date, date.getTimezoneOffset()), "yyyy-MM-dd'T'HH:mm:ss");
    return formated
}

export { convertZonedToUTC, convertUTCToZoned }