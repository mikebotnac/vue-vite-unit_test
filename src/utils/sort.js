const sortByAZ = (array, column) => {
    return array.sort(function (a, b) {
        if (a[column] === b[column]) {
            return 0
        }
        if (isNumber(a[column])) {
            return (+a[column] < +b[column]) ? -1 : 1;
        }
        return (a[column] < b[column]) ? -1 : 1;
    })
}

const sortByZA = (array, column) => {
    return array.sort(function (a, b) {
        if (a[column] === b[column]) {
            return 0
        }
        if (isNumber(a[column])) {
            return (+b[column] < +a[column]) ? -1 : 1;
        }
        return (b[column] < a[column]) ? -1 : 1;
    })
}

const isNumber = (input) => {
    return input.toString().match("[0-9]+")
}

export { sortByAZ, sortByZA }