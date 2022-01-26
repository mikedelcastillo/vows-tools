import axios from 'axios'

export function createVuexModule(baseURL: string, storageKey: string = "vows"){
    const storage = {
        state: {
            guest_code: null,
            last_updated: 0,
        },
        restore(){
            let json = {}
            try{
                json = JSON.parse(localStorage.getItem(storageKey))
            } catch(e){
                this.error(e)
            }
            this.state = Object.assign(this.state, json)
        },
        get(key: string){
            return this.state[key]
        },
        set(key: string, value: any){
            this.state[key] = value
            try{
                localStorage.setItem(storageKey, JSON.stringify(this.state))
            } catch(e){
                this.error(e)
            }
        },
        clear(){
            this.set('guest_code', null)
            this.set('last_updated', 0)
            try{
                localStorage.removeItem(storageKey)
            } catch(e){
                this.error(e)
            }
        },
        error(e){
            // console.warn(e)
        },
    }

    storage.restore()
    
    const request = axios.create({
        baseURL,
    })

    const vuexModule = {
        namespaced: true,
        state: {
            guest_code: storage.get('guest_code'),
            guest: null,
        },
        mutations: {
            setGuest(state, guest){
                state.guest = guest
            },
            setGuestCode(state, guest_code){
                state.guest_code = guest_code
                storage.set('guest_code', guest_code)
                storage.set('last_updated', (new Date()).getTime())
            },
            clear(state){
                state.guest_code = null
                state.guest = null
                storage.clear()
            },
        },
        actions: {
            async getGuest({commit}, guest_code){
                const { data } = await request.get("/guests", {
                    params: {
                        guest_code,
                    },
                })

                return data
            },
            async login({dispatch, commit}, guest_code){
                const data = await dispatch('getGuest', guest_code)
                if(typeof data.guest === "object"){
                    commit('setGuestCode', guest_code)
                    commit('setGuest', data.guest)
                    return true
                }
                return false
            }
        },
        getters: {
            loggedIn(state){
                return !!(state.guest && state.guest_code)
            },
        },
    }

    return vuexModule
}

