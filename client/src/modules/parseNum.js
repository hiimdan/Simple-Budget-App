const parseNum = num => {
    if (/^\$/.test(num)) {
        num = num.substring(1);
    }

    num = parseFloat(num);
    if (isNaN(num)) {
        return false;
    }

    num = Math.round(num * 100) / 100;
    if (num <= 0) {
        return false;
    } else {
        return num;
    }
}

export default parseNum;