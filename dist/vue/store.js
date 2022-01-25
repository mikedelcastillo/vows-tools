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
exports.vuexModule = void 0;
const axios_1 = require("axios");
function vuexModule(baseURL) {
    const GUEST_CODE_KEY = "vows_guest_code";
    const backupStorage = {};
    const storage = {
        get(key) {
            try {
                return localStorage.getItem(key);
            }
            catch (e) {
                return backupStorage[key];
            }
        },
        set(key, value) {
            try {
                return localStorage.setItem(key, value);
            }
            catch (e) {
                return backupStorage[key] = value;
            }
        },
    };
    const request = axios_1.default.create({
        baseURL,
    });
    let guest_code = storage.get(GUEST_CODE_KEY);
    guest_code = (guest_code || "").trim().length == 0 ? null : guest_code;
    const vuexModule = {
        namespaced: true,
        state: {
            guest_code,
            guest: null,
        },
        mutations: {
            setGuest(state, guest) {
                state.guest = guest;
            },
            setGuestCode(state, guest_code) {
                state.guest_code = guest_code;
                storage.set(GUEST_CODE_KEY, guest_code);
            },
            clear(state) {
                state.guest_code = null;
                state.guest = null;
                storage.set(GUEST_CODE_KEY, "");
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
exports.vuexModule = vuexModule;
