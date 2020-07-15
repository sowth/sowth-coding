function isObject(value) {
    // return Object.prototype.toString.call(value) === "[object Object]";
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPlainObject(value) {
    // return Object.prototype.toString.call(value) === "[object Object]" && Object.getPrototypeOf(value) === Object.prototype;
    return typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype;
}

function isFunction(value) {
    // return Object.prototype.toString.call(value) === "[object Function]";
    return typeof value === "function";
}

function isArray(value) {
    // return Object.prototype.toString.call(value) === "[object Array]";
    return Array.isArray(value);
}

function isString(value) {
    // return Object.prototype.toString.call(value) === "[object String]";
    return typeof value === "string";
}

function isNumber(value) {
    // return Object.prototype.toString.call(value) === "[object Number]" && !Number.isNaN(value) && Number.isFinite(value);
    return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value);
}

function isBool(value) {
    // return Object.prototype.toString.call(value) === "[object Boolean]";
    return typeof value === "boolean";
}

function isInvalid(value) {
    return value === undefined || value === null;
}

function isFile(value) {
    return Object.prototype.toString.call(value) === "[object File]" && typeof value.name === "string" && typeof value.type === "string" && typeof value.size === "number";
}

function isPromise(value) {
    return value instanceof Promise;
}

function isError(value) {
    return value instanceof Error;
}

function object(value) {
    if (isObject(value)) {
        return value;
    } else if (isString(value) && /^\{[\s\S]*\}$/.test(value)) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return {};
        }
    } else {
        return {};
    }
}

function func(value) {
    return isFunction(value) ? value : function() { };
}

function array(value) {
    if (isArray(value)) {
        return value;
    } else if (isObject(value) && value.toString() === "[object Arguments]") {
        return [].slice.call(value);
    } else if (isString(value) && /^\[[\s\S]*\]$/.test(value)) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return [];
        }
    } else {
        return [];
    }
}

function string(value) {
    return isInvalid(value) ? "" : "" + value;
}

function int(value, power) {
    value = "" + (parseFloat(value) || 0);
    value = /^-?\d+(\.\d+)?$/.test(value) ? (value + ".").split(".") : ["0", "0"];
    power = isNumber(power) ? Math.min(Math.max(Math.floor(power), 0), 6) : 0;
    value = parseInt(value[0] + (value[1] + "000000").substr(0, power));
    return Number.isSafeInteger(value) ? value : 0;
}

function float(value, decimals) {
    value = "" + (parseFloat(value) || 0);
    value = /^-?\d+(\.\d+)?$/.test(value) ? (value + ".").split(".") : ["0", "0"];
    decimals = isNumber(decimals) ? Math.min(Math.max(Math.floor(decimals), 0), 6) : 6;
    value = parseFloat(value[0] + "." + (value[1] + "000000").substr(0, decimals));
    return Number.isSafeInteger(value >= 0 ? Math.ceil(value) : Math.floor(value)) ? value : 0;
}

function bool(value) {
    return !!value;
}

function promise(value) {
    if (isPromise(value)) {
        return value;
    } else if (isFunction(value)) {
        return new Promise(value);
    } else {
        return Promise.resolve(value);
    }
}

function error(value) {
    return isError(value) ? value : new Error("" + value);
}

function traverse(source, children, handler) {
    if (!isArray(source) || !isString(children) || !isFunction(handler)) return;
    let [ended, result] = [false, null];
    let traverse = (source, parent) => {
        if (!isArray(source)) return;
        for (let i = 0; i < source.length; i++) {
            if (ended) break;
            if (isInvalid(handler(source[i], i, source, parent))) {
                !isInvalid(source[i]) && traverse(source[i][children], source[i]);
            } else {
                [ended, result] = [true, source[i]];
            }
        }
    };
    return traverse(source), result;
}

function deepCopy(source, excludes) {
    let copy = (source, parents, excludes) => {
        if (isString(source) || isNumber(source) || isBool(source) || isInvalid(source)) {
            return source;
        } else if (isPlainObject(source)) {
            if (parents.includes(source)) return;
            parents.push(source);
            let temp = {};
            for (let key in source) {
                if (excludes.includes(key)) continue;
                temp[key] = copy(source[key], parents, excludes);
            }
            parents.pop();
            return temp;
        } else if (isArray(source)) {
            if (parents.includes(source)) return;
            parents.push(source);
            let temp = [];
            source.forEach((data) => temp.push(copy(data, parents, excludes)));
            parents.pop();
            return temp;
        } else {
            return null;
        }
    };
    return copy(source, [], array(excludes));
}

function delInvalidProp(value) {
    return isObject(value) && Object.keys(value).forEach((key) => {
        if (isInvalid(value[key])) delete value[key];
    }), value;
}

function erase(value) {
    if (isObject(value)) {
        Object.keys(value).forEach((key) => value[key] = erase(value[key]));
    } else if (isArray(value)) {
        value.splice(0);
    } else if (isString(value)) {
        value = "";
    } else if (isNumber(value) || typeof value === "number") {
        value = 0;
    } else if (isBool(value)) {
        value = false;
    } else {
        value = null;
    }
    return value;
}

function hook(fn, handler) {
    return isFunction(fn) && isFunction(handler) ? function(...args) {
        return handler.call(this, args, (args) => fn.apply(this, array(args)));
    } : func(fn);
}

function randomInt(min, max) {
    let limit = Number.MAX_SAFE_INTEGER;
    min = isNumber(min) ? Math.min(Math.max(min, 0), limit) : 0;
    max = isNumber(max) ? Math.min(Math.max(max, min), limit) : limit;
    return Math.floor((max - min + 1) * Math.random()) + min;
}

function replaceEmoji(value, replacer) {
    return string(value).replace(/[\uD800-\uDFFF]/g, string(replacer));
}

function offsetDate(date, type, value) {
    if (!(date instanceof Date)) return;
    let index = Math.max(["millisecond", "second", "minute", "hour", "day", "month", "year"].indexOf(type), 0);
    let names = ["Milliseconds", "Seconds", "Minutes", "Hours", "Date", "Month", "FullYear"];
    date = new Date(date.getTime());
    date["set" + names[index]](date["get" + names[index]]() + int(value));
    if (isNumber(date.getTime())) return date;
}

function toTimeString(value, template) {
    let date = new Date(value);
    let keys = ["YYYY", "Y", "MM", "M", "DD", "D", "hh", "h", "mm", "m", "ss", "s", "nn", "n", "W"];
    let pad = (value, length) => string(value).padStart(length, "0");
    let values = [pad(date.getFullYear(), 4), date.getFullYear(), pad(date.getMonth() + 1, 2), date.getMonth() + 1, pad(date.getDate(), 2), date.getDate(), pad(date.getHours(), 2), date.getHours(), pad(date.getMinutes(), 2), date.getMinutes(), pad(date.getSeconds(), 2), date.getSeconds(), pad(date.getMilliseconds(), 3), date.getMilliseconds(), ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]];
    return isNumber(date.getTime()) && date.getTime() > 0 ? keys.reduce((result, key, index) => result.replace(new RegExp(key, "g"), values[index]), string(template)) : "";
}

function toMoneyString(value, thousands, prefix) {
    let number = float(value);
    value = (Math.abs(number) + ".").split(".");
    value[0] = isString(thousands) && thousands ? value[0].split("").reverse().reduce((arr, data, i, list) => {
        arr.push(data);
        i % 3 === 2 && i + 1 !== list.length && arr.push(thousands);
        return arr;
    }, []).reverse().join("") : value[0];
    value[1] = "." + (value[1] + "00").substr(0, 2);
    return (number >= 0 ? "" : "-") + string(prefix) + value[0] + value[1];
}

function toMagicImgURL(value, width, height) {
    let service, prefix, query;
    value = string(value).split("#")[0];
    width = Math.max(int(width) || 200, 20);
    height = Math.max(int(height) || 200, 20);
    service = /\.aliyuncs\.com\//i.test(value) ? "aliyun" : "qcloud";
    prefix = value.split("?")[0];
    if (service === "aliyun") {
        query = ["x-oss-process=image/format,jpg/auto-orient,1/resize,w_" + width + ",h_" + height];
        string(value.split("?")[1]).split("&").forEach((data) => data.length > 0 && data.indexOf("x-oss-process") !== 0 && query.push(data));
    } else {
        query = [/\.gif$/i.test(prefix) ? "imageMogr2/cgif/1" : "imageMogr2/format/jpg/thumbnail/" + width + "x" + height];
        string(value.split("?")[1]).split("&").forEach((data) => data.length > 0 && data.indexOf("imageMogr2") !== 0 && query.push(data));
    }
    return value && prefix + "?" + query.join("&");
}

export default {
    isObject,
    isPlainObject,
    isFunction,
    isArray,
    isString,
    isNumber,
    isBool,
    isInvalid,
    isFile,
    isPromise,
    isError,
    object,
    func,
    array,
    string,
    int,
    float,
    bool,
    promise,
    error,
    traverse,
    deepCopy,
    delInvalidProp,
    erase,
    hook,
    randomInt,
    replaceEmoji,
    offsetDate,
    toTimeString,
    toMoneyString,
    toMagicImgURL,
};