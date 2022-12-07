export var Language;
(function (Language) {
    Language[Language["eng"] = 0] = "eng";
    Language[Language["rus"] = 1] = "rus";
})(Language || (Language = {}));
export var HttpMethod;
(function (HttpMethod) {
    HttpMethod[HttpMethod["get"] = 0] = "get";
    HttpMethod[HttpMethod["post"] = 1] = "post";
    HttpMethod[HttpMethod["put"] = 2] = "put";
    HttpMethod[HttpMethod["delete"] = 3] = "delete";
})(HttpMethod || (HttpMethod = {}));
class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
export class CommonHelper {
    static mapToArray(map) {
        let list = [];
        map.forEach((value, key) => list.push(new KeyValuePair(key, value)));
        return list;
    }
    static arrayToMap(array) {
        let map = new Map();
        array.forEach(a => map.set(a.key, a.value));
        return map;
    }
    static fetch(url, method = HttpMethod.get, body = null) {
        let request = null;
        if (method != HttpMethod.get) {
            request = {
                method: HttpMethod[method],
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            };
            if (body) {
                let params = [];
                for (let kvp of CommonHelper.mapToArray(body)) {
                    if (typeof (kvp.value) == "string")
                        params.push(kvp.key + "=" + encodeURIComponent(kvp.value));
                    else {
                        for (let value of kvp.value) {
                            params.push(kvp.key + "=" + encodeURIComponent(value));
                        }
                    }
                }
                request.body = params.join("&");
            }
        }
        return fetch(url, request).then((res) => res.ok ? res.json() : new Error());
    }
    static createGuid() {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    static convertDate(date, withTime = false) {
        let newDate = "";
        if (date) {
            let parts = date.split("T");
            let dateParts = parts[0].split("-");
            let add = "";
            if (withTime) {
                let timeParts = parts[1].split(":");
                add = timeParts[0] + ":" + timeParts[1];
            }
            newDate = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0] + (add ? " " + add : "");
        }
        return newDate;
    }
}
//# sourceMappingURL=CommonHelper.js.map