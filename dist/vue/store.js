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
            loading: {
                login: false,
                gifts: false,
            },
            guest_code: storage.get('guest_code'),
            guest: null,
            gifts: [],
            gift_categories: [],
            reservations: [],
            config: {},
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
            setLoading(state, load) {
                state.loading = Object.assign(state.loading, load);
            },
            setGifts(state, { gifts, gift_categories, reservations }) {
                state.gifts = gifts;
                state.gift_categories = gift_categories;
                state.reservations = reservations;
            },
            setConfig(state, config = {}) {
                state.config = Object.assign({}, state.config, config);
            },
            setFaqs(state, faqs) {
                for (let faq of faqs) {
                    const index = state.faqs.find(f => f.faq_id == faq.faq_id);
                    if (index !== -1) {
                        state.faqs[index] = Object.assign(state.faqs[index], faq);
                    }
                    else {
                        state.faqs.push(faq);
                    }
                }
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
            getFaqs({ commit }, faq_group_ids) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { data } = yield request.get("/faqs", {
                        params: {
                            faq_group_ids: faq_group_ids instanceof Array ? faq_group_ids.join(",") : faq_group_ids,
                        },
                    });
                    return data.faqs;
                });
            },
            getGifts({ state, commit }, force = false) {
                return __awaiter(this, void 0, void 0, function* () {
                    const update = () => __awaiter(this, void 0, void 0, function* () {
                        const { data } = yield request.get("/gifts", {
                            params: {
                                guest_code: state.guest_code,
                            },
                        });
                        commit('setGifts', data);
                    });
                    if (force || state.gifts.length == 0) {
                        commit('setLoading', { gifts: true });
                        yield update();
                        commit('setLoading', { gifts: false });
                    }
                    else {
                        commit('setLoading', { gifts: false });
                    }
                });
            },
            reserveGift({ state, dispatch, commit }, { gift_id, quantity }) {
                return __awaiter(this, void 0, void 0, function* () {
                    commit('setLoading', { gifts: true });
                    const { data } = yield request.post("/gifts/reserve", {
                        guest_code: state.guest_code,
                        gift_id, quantity,
                    });
                    yield dispatch('getGifts', true);
                });
            },
            unreserveGift({ state, dispatch, commit }, { gift_id, quantity }) {
                return __awaiter(this, void 0, void 0, function* () {
                    commit('setLoading', { gifts: true });
                    const { data } = yield request.post("/gifts/unreserve", {
                        guest_code: state.guest_code,
                        gift_id, quantity,
                    });
                    yield dispatch('getGifts', true);
                });
            },
            login({ dispatch, commit }, guest_code) {
                return __awaiter(this, void 0, void 0, function* () {
                    commit('setLoading', { login: true });
                    try {
                        const data = yield dispatch('getGuest', guest_code);
                        if (typeof data.guest === "object") {
                            commit('setGuestCode', guest_code);
                            commit('setGuest', data.guest);
                            commit('setLoading', { login: false });
                        }
                        else {
                            throw new Error('Data recieved is invalid');
                        }
                    }
                    catch (e) {
                        commit('setLoading', { login: false });
                        throw e;
                    }
                });
            },
            getConfig({ state, dispatch, commit }, config_id) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (config_id in state.config)
                        return state.config[config_id];
                    commit('setLoading', { config: true });
                    const { data } = yield request.get("/config", {
                        params: {
                            guest_code: state.guest_code,
                            config_id,
                        },
                    });
                    commit('setConfig', data);
                    commit('setLoading', { config: true });
                    return state.config[config_id];
                });
            },
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
