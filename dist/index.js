"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVueRouterGuard = exports.createVuexModule = exports.test = void 0;
function test() {
    return "hello world!";
}
exports.test = test;
var store_1 = require("./vue/store");
Object.defineProperty(exports, "createVuexModule", { enumerable: true, get: function () { return store_1.createVuexModule; } });
var router_1 = require("./vue/router");
Object.defineProperty(exports, "createVueRouterGuard", { enumerable: true, get: function () { return router_1.createVueRouterGuard; } });
