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
exports.createVuexModule = void 0;
const axios_1 = require("axios");
function createVuexModule(baseURL, storageKey = "vows") {
    const storage = {
        state: {
            guest_code: null,
            last_updated: 0,
        },
        restore() {
            let json = {};
            try {
                json = JSON.parse(localStorage.getItem(storageKey));
            }
            catch (e) {
                this.error(e);
            }
            this.state = Object.assign(this.state, json);
        },
        get(key) {
            return this.state[key];
        },
        set(key, value) {
            this.state[key] = value;
            try {
                localStorage.setItem(storageKey, JSON.stringify(this.state));
            }
            catch (e) {
                this.error(e);
            }
        },
        clear() {
            this.set('guest_code', null);
            this.set('last_updated', 0);
            try {
                localStorage.removeItem(storageKey);
            }
            catch (e) {
                this.error(e);
            }
        },
        error(e) {
            // console.warn(e)
        },
    };
    storage.restore();
    const request = axios_1.default.create({
        baseURL,
    });
    const vuexModule = {
        namespaced: true,
        state: {
            guest_code: storage.get('guest_code'),
            guest: null,
        },
        mutations: {
            setGuest(state, guest) {
                state.guest = guest;
            },
            setGuestCode(state, guest_code) {
                state.guest_code = guest_code;
                storage.set('guest_code', guest_code);
                storage.set('last_updated', (new Date()).getTime());
            },
            clear(state) {
                state.guest_code = null;
                state.guest = null;
                storage.clear();
            },
        },
        actions: {
            getGuest({ commit }, guest_code) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { data } = yield request.get("/guests", {
                        params: {
                            guest_code,
                        },
                    });
                    return data;
                });
            },
            login({ dispatch, commit }, guest_code) {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = yield dispatch('getGuest', guest_code);
                    if (typeof data.guest === "object") {
                        commit('setGuestCode', guest_code);
                        commit('setGuest', data.guest);
                        return true;
                    }
                    return false;
                });
            }
        },
        getters: {
            loggedIn(state) {
                return !!(state.guest && state.guest_code);
            },
        },
    };
    return vuexModule;
}
exports.createVuexModule = createVuexModule;
