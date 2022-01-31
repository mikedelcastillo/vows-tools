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
            loading: {
                login: false,
            },
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
            setLoading(state, load){
                state.loading = Object.assign(state.loading, load)
            },
            setFaqs(state, faqs){
                for(let faq of faqs){
                    const index = state.faqs.find(f => f.faq_id == faq.faq_id)
                    if(index !== -1){
                        state.faqs[index] = Object.assign(state.faqs[index], faq)
                    } else{
                        state.faqs.push(faq)
                    }
                }
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
            async getFaqs({commit}, faq_group_ids){
                const { data } = await request.get("/faqs", {
                    params: {
                        faq_group_ids: faq_group_ids instanceof Array ? faq_group_ids.join(",") : faq_group_ids,
                    },
                })

                return data
            },
            async login({dispatch, commit}, guest_code){
                commit('setLoading', { login: true })
                try{
                    const data = await dispatch('getGuest', guest_code)
                    if(typeof data.guest === "object"){
                        commit('setGuestCode', guest_code)
                        commit('setGuest', data.guest)
                        commit('setLoading', { login: false })
                    } else{
                        throw new Error('Data recieved is invalid')
                    }
                } catch(e){
                    commit('setLoading', { login: false })
                    throw e
                }
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

