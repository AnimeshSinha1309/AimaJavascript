/**
 * object deep copy
 * @param {Object} obj
 */
function copyObject(obj) {
    var o2 = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            o2[i] = obj[i];
        }
    }

    return o2;
}

/**
 * array deep copy
 * @param {Array} arr
 */
function copyArray(arr) {
    var a2 = arr.slice(0);
    for (var i = 0, len = a2.length, x; i < len; i++) {
        x = a2[i];
        if (Array.isArray(x)) a2[i] = copyArray(x);
        else if (typeof x == "object" && x != null) a2[i] = copyObject(x);
    }
    return a2;
}
