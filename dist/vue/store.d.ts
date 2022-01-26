export declare function createVuexModule(baseURL: string): {
    namespaced: boolean;
    state: {
        guest_code: any;
        guest: any;
    };
    mutations: {
        setGuest(state: any, guest: any): void;
        setGuestCode(state: any, guest_code: any): void;
        clear(state: any): void;
    };
    actions: {
        getGuest({ commit }: {
            commit: any;
        }, guest_code: any): Promise<any>;
        login({ dispatch, commit }: {
            dispatch: any;
            commit: any;
        }, guest_code: any): Promise<boolean>;
    };
    getters: {
        loggedIn(state: any): boolean;
    };
};
