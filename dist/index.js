"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vuexModule = exports.test = void 0;
function test() {
    return "hello world!";
}
exports.test = test;
var store_1 = require("./vue/store");
Object.defineProperty(exports, "vuexModule", { enumerable: true, get: function () { return store_1.vuexModule; } });
