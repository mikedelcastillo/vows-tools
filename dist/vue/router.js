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
exports.routerGuard = void 0;
const routerGuard = (store, out, vuexModule = "vows", metaKey = "requiredAuth") => {
    function guard(to, from, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (to.matched.some(record => record.meta[metaKey])) {
                if (store.getters[`${vuexModule}/loggedIn`]) {
                    return next();
                }
                else if (store.state[vuexModule].guest_code) {
                    yield store.dispatch(`${vuexModule}/login`, store.state[vuexModule].guest_code);
                    return yield guard(to, from, next);
                }
                else {
                    return yield out(to, from, next);
                }
            }
            else {
                return next();
            }
        });
    }
    return guard;
};
exports.routerGuard = routerGuard;
