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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createVuexModule = void 0;
var axios_1 = require("axios");
function createVuexModule(baseURL, storageKey) {
    if (storageKey === void 0) { storageKey = "vows"; }
    var storage = {
        state: {
            guest_code: null,
            last_updated: 0
        },
        restore: function () {
            var json = {};
            try {
                json = JSON.parse(localStorage.getItem(storageKey));
            }
            catch (e) {
                this.error(e);
            }
            this.state = Object.assign(this.state, json);
        },
        get: function (key) {
            return this.state[key];
        },
        set: function (key, value) {
            this.state[key] = value;
            try {
                localStorage.setItem(storageKey, JSON.stringify(this.state));
            }
            catch (e) {
                this.error(e);
            }
        },
        clear: function () {
            this.set('guest_code', null);
            this.set('last_updated', 0);
            try {
                localStorage.removeItem(storageKey);
            }
            catch (e) {
                this.error(e);
            }
        },
        error: function (e) {
            // console.warn(e)
        }
    };
    storage.restore();
    var request = axios_1["default"].create({
        baseURL: baseURL
    });
    var vuexModule = {
        namespaced: true,
        state: {
            loading: {
                login: false
            },
            guest_code: storage.get('guest_code'),
            guest: null
        },
        mutations: {
            setGuest: function (state, guest) {
                state.guest = guest;
            },
            setGuestCode: function (state, guest_code) {
                state.guest_code = guest_code;
                storage.set('guest_code', guest_code);
                storage.set('last_updated', (new Date()).getTime());
            },
            setLoading: function (state, load) {
                state.loading = Object.assign(state.loading, load);
            },
            clear: function (state) {
                state.guest_code = null;
                state.guest = null;
                storage.clear();
            }
        },
        actions: {
            getGuest: function (_a, guest_code) {
                var commit = _a.commit;
                return __awaiter(this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, request.get("/guests", {
                                    params: {
                                        guest_code: guest_code
                                    }
                                })];
                            case 1:
                                data = (_b.sent()).data;
                                return [2 /*return*/, data];
                        }
                    });
                });
            },
            login: function (_a, guest_code) {
                var dispatch = _a.dispatch, commit = _a.commit;
                return __awaiter(this, void 0, void 0, function () {
                    var data, e_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                commit('setLoading', { login: true });
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, dispatch('getGuest', guest_code)];
                            case 2:
                                data = _b.sent();
                                if (typeof data.guest === "object") {
                                    commit('setGuestCode', guest_code);
                                    commit('setGuest', data.guest);
                                    commit('setLoading', { login: false });
                                }
                                else {
                                    throw new Error('Data recieved is invalid');
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _b.sent();
                                commit('setLoading', { login: false });
                                throw e_1;
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        getters: {
            loggedIn: function (state) {
                return !!(state.guest && state.guest_code);
            }
        }
    };
    return vuexModule;
}
exports.createVuexModule = createVuexModule;
