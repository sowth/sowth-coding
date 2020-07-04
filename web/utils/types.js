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
    return isFunction(value) ? value : function() {};
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
};