export declare function vuexModule(baseURL: string): {
    state: {
        guestCode: string;
        guest: any;
    };
    mutations: {
        setGuest(state: any, guest: any): void;
        setGuestCode(state: any, guestCode: any): void;
    };
    actions: {
        getGuest({ commit }: {
            commit: any;
        }): Promise<void>;
    };
    getters: {};
};
