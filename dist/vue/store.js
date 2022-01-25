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
    const request = axios_1.default.create({
        baseURL,
    });
    const vuexModule = {
        state: {
            guestCode: localStorage.getItem(GUEST_CODE_KEY),
            guest: null,
        },
        mutations: {
            setGuest(state, guest) {
                state.guest = guest;
            },
            setGuestCode(state, guestCode) {
                state.guestCode = guestCode;
                localStorage.setItem(GUEST_CODE_KEY, guestCode);
            },
        },
        actions: {
            getGuest({ commit }) {
                return __awaiter(this, void 0, void 0, function* () {
                });
            },
        },
        getters: {},
    };
    return vuexModule;
}
exports.vuexModule = vuexModule;
