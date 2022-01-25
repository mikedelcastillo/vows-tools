import axios from 'axios'

export function vuexModule(baseURL: string){
    const GUEST_CODE_KEY = "vows_guest_code"

    const backupStorage = {}
    const storage = {
        get(key){
            try{
                return localStorage.getItem(key)
            } catch(e){
                return backupStorage[key]
            }
        },
        set(key, value){
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

    const vuexModule = {
        state: {
            guestCode: storage.get(GUEST_CODE_KEY),
            guest: null,
        },
        mutations: {
            setGuest(state, guest){
                state.guest = guest
            },
            setGuestCode(state, guestCode){
                state.guestCode = guestCode
                storage.set(GUEST_CODE_KEY, guestCode)
            },
        },
        actions: {
            async getGuest({commit}){
                
            },
        },
        getters: {

        },
    }

    return vuexModule
}

