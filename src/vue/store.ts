import { CompilerDeprecationTypes } from '@vue/compiler-core'
import axios from 'axios'

export function createVuexModule(baseURL: string){
    const GUEST_CODE_KEY = "vows_guest_code"

    const backupStorage = {}
    const storage = {
        get(key: string){
            try{
                return localStorage.getItem(key)
            } catch(e){
                return backupStorage[key]
            }
        },
        set(key: string, value: any){
            try{
                return localStorage.setItem(key, value)
            } catch(e){
                return backupStorage[key] = value
            }
        },
    }
    
    const request = axios.create({
        baseURL,
    })

    let guest_code = storage.get(GUEST_CODE_KEY)
    guest_code = (guest_code || "").trim().length == 0 ? null : guest_code

    const vuexModule = {
        namespaced: true,
        state: {
            guest_code,
            guest: null,
        },
        mutations: {
            setGuest(state, guest){
                state.guest = guest
            },
            setGuestCode(state, guest_code){
                state.guest_code = guest_code
                storage.set(GUEST_CODE_KEY, guest_code)
            },
            clear(state){
                state.guest_code = null
                state.guest = null
                storage.set(GUEST_CODE_KEY, "")
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

