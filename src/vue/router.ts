export const routerGuard = (store, out, vuexModule="vows", metaKey="requiredAuth") => {
    async function guard(to, from, next){
        if(to.matched.some(record => record.meta[metaKey])){
            if(store.getters[`${vuexModule}/loggedIn`]){
                return next()
            } else if(store.state[vuexModule].guest_code){
                await store.dispatch(`${vuexModule}/login`, store.state[vuexModule].guest_code)
                return await guard(to, from, next)
            } else{
                return await out(to, from, next)
            }
        } else{
            return next()
        }
    }

    return guard
}