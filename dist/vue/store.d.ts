export declare function createVuexModule(baseURL: string, storageKey?: string): {
    namespaced: boolean;
    state: {
        loading: {
            login: boolean;
        };
        guest_code: any;
        guest: any;
    };
    mutations: {
        setGuest(state: any, guest: any): void;
        setGuestCode(state: any, guest_code: any): void;
        setLoading(state: any, load: any): void;
        clear(state: any): void;
    };
    actions: {
        getGuest({ commit }: {
            commit: any;
        }, guest_code: any): Promise<any>;
        login({ dispatch, commit }: {
            dispatch: any;
            commit: any;
        }, guest_code: any): Promise<void>;
    };
    getters: {
        loggedIn(state: any): boolean;
    };
};
