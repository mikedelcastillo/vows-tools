require('dotenv').config()

let store = null

describe("Test the store", () => {
    test('Setup store with vows module', () => {
        const { createStore } = require('vuex')
        const { vuexModule, test } = require('../dist/index')

        store = createStore({
            modules: {
                vows: vuexModule(process.env.API_URL),
            },
        })
    })

    test('Test API connection', async () => {
        const axios = require('axios')
        const { data } = await axios.get(process.env.API_URL)
        expect(data.ok).toBe(true)
    })

    test('dispatch: getGuest(WRONG_GUEST_CODE)', async () => {
        try{
            const wrongCode = Math.random()
            await store.dispatch("vows/getGuest", wrongCode)
            fail('Guest should return a 404')
        } catch(e){
            // This should fail
        }
    })

    test('dispatch: getGuest(TEST_GUEST_CODE)', async () => {
        const data = await store.dispatch("vows/getGuest", process.env.TEST_GUEST_CODE)
        expect(data.guest.guest_code).toBe(process.env.TEST_GUEST_CODE)
    })

    test('dispatch: login(TEST_GUEST_CODE', async () => {
        const data = await store.dispatch('vows/login', process.env.TEST_GUEST_CODE)
        expect(data).toBe(true)
    })

    test('getters: loggedIn', async () => {
        expect(store.getters["vows/loggedIn"]).toBe(true)
    })

    test('commit: clear', async () => {
        store.commit('vows/clear')
        expect(store.state.vows.guest_code).toBe(null)
        expect(store.state.vows.guest).toBe(null)
        expect(store.getters["vows/loggedIn"]).toBe(false)
    })
})