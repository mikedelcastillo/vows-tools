"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouterGuard = void 0;
const createRouterGuard = (store, keepIn, keepOut, options = {}) => {
    options = Object.assign({
        vuexModule: "vows",
        keepOutKey: "requiresAuth",
        keepInKey: "requiresUnauth",
    }, options);
    function guard(to, from, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Automatic login first
            const loggedIn = store.getters[`${options.vuexModule}/loggedIn`];
            const { guest_code } = store.state[options.vuexModule];
            if (!loggedIn && guest_code) {
                yield store.dispatch(`${options.vuexModule}/login`, guest_code);
                return yield guard(to, from, next);
            }
            if (to.matched.some(record => record.meta[options.keepOutKey])) {
                if (loggedIn) {
                    return next();
                }
                else {
                    return yield keepOut(to, from, next);
                }
            }
            else if (to.matched.some(record => record.meta[options.keepInKey])) {
                if (loggedIn) {
                    return yield keepIn(to, from, next);
                }
                else {
                    return next();
                }
            }
            else {
                return next();
            }
        });
    }
    return guard;
};
exports.createRouterGuard = createRouterGuard;
