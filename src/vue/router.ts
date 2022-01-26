export interface RouterGuardOptions {
    vuexModule?: string,
    keepInKey?: string,
    keepOutKey?: string,
}

export const routerGuard = (store, keepIn: Function, keepOut: Function, options: RouterGuardOptions = {}) => {
    options = Object.assign({
        vuexModule: "vows",
        keepOutKey: "requiresAuth",
        keepInKey: "requiresUnauth",
    }, options)

    async function guard(to, from, next){
        // Automatic login first
        const loggedIn = store.getters[`${options.vuexModule}/loggedIn`]
        const { guest_code } = store.state[options.vuexModule]
        
        if(!loggedIn && guest_code){
            await store.dispatch(`${options.vuexModule}/login`, guest_code)
            return await guard(to, from, next)
        }

        if(to.matched.some(record => record.meta[options.keepOutKey])){
            if(loggedIn){
                return next()
            } else{
                return await keepOut(to, from, next)
            }
        } else if(to.matched.some(record => record.meta[options.keepInKey])){
            if(loggedIn){
                return await keepIn(to, from, next)
            } else{
                return next()
            }
        } else {
            return next()
        }
    }

    return guard
}