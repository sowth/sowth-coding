import types from "./types.js";
const { string, int, bool, object, array, func, promise } = types;
const { isString, isNumber, isFunction, isFile } = types;

const tasks = [];

function normalizeOptions(options) {
    return {
        method: ((method) => /^(post|get)$/i.test(method) ? method.toUpperCase() : "GET")(string(options.method)),
        url: ((prefix, url, query) => {
            try {
                if (/^https?:\/\/\S+$/i.test(url)) {
                    url = new URL(url);
                } else {
                    let link = document.createElement("a");
                    link.setAttribute("href", prefix + url);
                    url = new URL(link.origin + link.pathname + link.search);
                }
                return Object.keys(query).forEach((key) => {
                    let value = key.length > 0 ? query[key] : null;
                    if (!isString(value) && !isNumber(value)) value = null;
                    if (value !== null) url.searchParams.set(key, value);
                }), url.toString();
            } catch (error) {
                console.error(error.name + ": " + error.message);
                return url;
            }
        })(string(options.prefix), string(options.url), object(options.query)),
        headers: ((headers) => {
            return Object.keys(headers).reduce((list, key) => {
                let value = key.length > 0 ? headers[key] : null;
                if (!isString(value) && !isNumber(value)) value = null;
                if (value !== null) list.push([key, value]);
                return list;
            }, []);
        })(object(options.headers)),
        credentials: bool(options.credentials),
        body: isFunction(options.body) ? options.body() : ((body, count) => {
            let form = Object.keys(body).reduce((form, key) => {
                let value = key.length > 0 ? body[key] : null;
                if (!isString(value) && !isNumber(value) && !isFile(value)) value = null;
                if (value !== null) count++, form.set(key, value);
                return form;
            }, new FormData());
            return count > 0 ? form : null;
        })(object(options.body), 0),
        progress: isFunction(options.progress) ? options.progress : null,
        responseType: string(options.responseType),
        timeout: int(options.timeout),
        callback: func(options.callback),
    };
}

function createInst(options) {
    let [inst, opts] = [new XMLHttpRequest(), normalizeOptions(options)];
    inst.open(opts.method, opts.url, true);
    opts.headers.forEach((header) => inst.setRequestHeader(...header));
    inst.withCredentials = opts.credentials;
    inst.upload.onprogress = opts.progress ? (e) => opts.progress({
        type: "upload",
        total: e.total,
        loaded: e.loaded,
        percent: Math.min(Math.floor(e.loaded / Math.max(e.total, 1) * 100), 100),
    }) : null;
    inst.responseType = opts.responseType;
    inst.timeout = opts.timeout;
    inst.onreadystatechange = () => inst.readyState === 4 && inst.status !== 0 && inst.destroy() && opts.callback({
        status: inst.status,
        statusText: inst.statusText || "服务器异常",
        data: inst.response,
    });
    inst.onabort = () => inst.destroy() && opts.callback({
        status: -1,
        statusText: "请求中断",
    });
    inst.ontimeout = () => inst.destroy() && opts.callback({
        status: 500,
        statusText: "请求超时",
    });
    inst.onerror = () => inst.destroy() && opts.callback({
        status: 500,
        statusText: "网络或服务器异常",
    });
    inst.onprogress = opts.progress ? (e) => opts.progress({
        type: "download",
        total: e.total,
        loaded: e.loaded,
        percent: Math.min(Math.floor(e.loaded / Math.max(e.total, 1) * 100), 100),
    }) : null;
    inst.destroy = () => {
        let index = tasks.indexOf(inst);
        if (index > -1) tasks.splice(index, 1);
        if (inst.readyState !== 4) inst.abort();
        return true;
    };
    inst.send(opts.body);
    tasks.push(inst);
}

export default {
    options: {},
    post(url, body, options) {
        return promise((resolve) => createInst({
            ...this.options,
            method: "POST",
            url: url,
            body: body,
            query: {},
            ...object(options),
            callback: resolve,
        }));
    },
    get(url, query, options) {
        return promise((resolve) => createInst({
            ...this.options,
            method: "GET",
            url: url,
            body: {},
            query: query,
            ...object(options),
            callback: resolve,
        }));
    },
    abort() {
        tasks.splice(0).forEach((inst) => inst.destroy());
    },
};