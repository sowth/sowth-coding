import Vue from "vue";
import VueRouter from "vue-router";

const match = VueRouter.prototype.match;

VueRouter.prototype.match = function(raw, ...args) {
    if (typeof raw === "string" && raw[0] !== "/") raw = {
        name: raw,
    };
    return match.call(this, raw, ...args);
};

VueRouter.prototype.title = function(raw) {
    let route = this.match(raw);
    if (route && !route.redirectedFrom) {
        if (typeof route.meta.title === "string") return route.meta.title;
        try {
            let comp = route.matched[0].components.default;
            if (typeof comp.title === "string") return comp.title;
            if (typeof comp.options.title === "string") return comp.options.title;
        } catch (error) {
            console.error(error);
        }
    }
    return "";
};

Vue.use(VueRouter);

export default VueRouter;