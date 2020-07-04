import Vue from "../basis/vue.js";

const loader = require.context("./", false, /\.vue$/);
const comps = {};

loader.keys().forEach((key) => {
    let comp = loader(key).default;
    let name = comp.name.split("-").map((value) => value.length > 0 ? value[0].toUpperCase() + value.substr(1) : value).join("");
    Vue.component(comp.name, comps[name] = comp);
});

export default {
    ...comps,
};