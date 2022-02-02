export declare function createVuexModule(baseURL: string, storageKey?: string): {
    namespaced: boolean;
    state: {
        loading: {
            login: boolean;
            gifts: boolean;
        };
        guest_code: any;
        guest: any;
        gifts: any[];
        gift_categories: any[];
        reservations: any[];
    };
    mutations: {
        setGuest(state: any, guest: any): void;
        setGuestCode(state: any, guest_code: any): void;
        setLoading(state: any, load: any): void;
        setGifts(state: any, { gifts, gift_categories, reservations }: {
            gifts: any;
            gift_categories: any;
            reservations: any;
        }): void;
        setFaqs(state: any, faqs: any): void;
        clear(state: any): void;
    };
    actions: {
        getGuest({ commit }: {
            commit: any;
        }, guest_code: any): Promise<any>;
        getFaqs({ commit }: {
            commit: any;
        }, faq_group_ids: any): Promise<any>;
        getGifts({ state, commit }: {
            state: any;
            commit: any;
        }, force?: boolean): Promise<void>;
        reserveGift({ state, dispatch, commit }: {
            state: any;
            dispatch: any;
            commit: any;
        }, { gift_id, quantity }: {
            gift_id: any;
            quantity: any;
        }): Promise<void>;
        unreserveGift({ state, dispatch, commit }: {
            state: any;
            dispatch: any;
            commit: any;
        }, { gift_id, quantity }: {
            gift_id: any;
            quantity: any;
        }): Promise<void>;
        login({ dispatch, commit }: {
            dispatch: any;
            commit: any;
        }, guest_code: any): Promise<void>;
    };
    getters: {
        loggedIn(state: any): boolean;
    };
};
