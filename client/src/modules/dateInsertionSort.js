const insertDate = (start, end, val, arr) => {
    if (end === -1) {
        return [val];
    }

    let checkInd = parseInt((end - start) / 2) + start;
    let valDate = new Date(val.date);
    let checkDate = new Date(arr[checkInd].date);

    if (valDate.toDateString() === checkDate.toDateString()) {
        if (valDate.toDateString() === new Date(arr[0].date).toDateString()) {
            return [val, ...arr];
        } else {
            return [...arr.slice(0, checkInd), val, ...arr.slice(checkInd)];
        }
    }

    if (checkInd === start) {
        if (valDate > checkDate) {
            return [...arr.slice(0, checkInd), val, ...arr.slice(checkInd)];
        } else if (valDate > new Date(arr[end].date)) {
            return [...arr.slice(0, end), val, ...arr.slice(end)];
        } else {
            return [...arr.slice(0, end + 1), val, ...arr.slice(end + 1)];
        }
    }

    if (checkInd === end) {
        if (valDate < checkDate) {
            return [...arr.slice(0, end + 1), val, ...arr.slice(end + 1)];
        } else if (valDate < new Date(arr[start].date)) {
            return [...arr.slice(0, end), val, ...arr.slice(end)];
        } else {
            return [...arr.slice(0, start), val, ...arr.slice(start)];
        }
    }

    if (valDate > checkDate) {
        return insertDate(start, checkInd, val, arr);
    } else {
        return insertDate(checkInd, end, val, arr);
    }
}

export default insertDate;