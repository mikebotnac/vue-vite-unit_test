import moment from "moment"

const convertDateToType = (date, type) => {
    return moment(date).format(type);
}

export default convertDateToType
