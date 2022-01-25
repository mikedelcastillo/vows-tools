require('dotenv').config()

const flushPromises = require('flush-promises')
const axios = require('axios')

const { createStore } = require('vuex')
const { vuexModule } = require('../dist/index')
const { routerGuard } = require('../dist/index')

let store = null

const authRoute = {
    matched: {
        some: () => true,
    },
}

const noAuthRoute = {
    matched: {
        some: () => false,
    },
}

describe("Test the store", () => {
    test('Setup store with vows module', () => {

        store = createStore({
            modules: {
                vows: vuexModule(process.env.API_URL),
            },
        })
    })

    test('Test API connection', async () => {
        const { data } = await axios.get(process.env.API_URL)
        await flushPromises()
        expect(data.ok).toBe(true)
    })

    test('dispatch: getGuest(WRONG_GUEST_CODE)', async () => {
        try{
            await store.dispatch("vows/getGuest", Math.random())
            fail('Guest should return a 404')
        } catch(e){

        }
        await flushPromises()
    })

    test('dispatch: getGuest(TEST_GUEST_CODE)', async () => {
        const data = await store.dispatch("vows/getGuest", process.env.TEST_GUEST_CODE)
        await flushPromises()
        expect(data.guest.guest_code).toBe(process.env.TEST_GUEST_CODE)
    })

    test('dispatch: login(TEST_GUEST_CODE', async () => {
        const data = await store.dispatch('vows/login', process.env.TEST_GUEST_CODE)
        await flushPromises()
        expect(data).toBe(true)
        
    })

    test('getters: loggedIn', async () => {
        expect(store.getters["vows/loggedIn"]).toBe(true)
    })
})

describe('Test router guard authenticated', () => {
    test('Create route guard', async () => {
        const guard = routerGuard(store)
    })
    
    test('Allow access to protected route', async () => {
        const guard = routerGuard(store, () => {
            fail("User logged in but not allowed to access protected route")
        })
        await guard(authRoute, noAuthRoute, () => {
            // Pass
        })
        await flushPromises()
    })

    test('Allow access to unprotected route', async () => {
        const guard = routerGuard(store, () => {
            fail("User logged in but not allowed to access unprotected route")
        })
        await guard(noAuthRoute, noAuthRoute, () => {
            // Pass
        })
        await flushPromises()
    })

    test('Simulate guest_code only cached', async () => {
        store.commit('vows/setGuest', null)
        expect(store.state.vows.guest).toBeNull()
        expect(store.state.vows.guest_code).not.toBeNull()
        expect(store.getters['vows/loggedIn']).toBe(false)
        
        const guard = routerGuard(store, () => {
            fail("User logged in but not allowed to access unprotected route")
        })
        await guard(authRoute, noAuthRoute, () => {
            // Pass
        })
        await flushPromises()
        expect(store.state.vows.guest).not.toBeNull()
    })
})

describe('Clear the store', () => {
    
    test('commit: clear', async () => {
        store.commit('vows/clear')
        expect(store.state.vows.guest_code).toBeNull()
        expect(store.state.vows.guest).toBeNull()
        expect(store.getters["vows/loggedIn"]).toBe(false)
    })

    // Should not be able to do guest things
})

describe('Test router guard unauthenticated', () => {
    test('Block access to protected route', async () => {
        const guard = routerGuard(store, () => {
            // Pass
        })
        await guard(authRoute, noAuthRoute, () => {
            fail("User logged out but not allowed to access protected route")
        })
        await flushPromises()
    })

    test('Allow access to unprotected route', async () => {
        const guard = routerGuard(store, () => {
            fail("User logged out but not allowed to access unprotected route")
        })
        await guard(noAuthRoute, noAuthRoute, () => {
            // Pass
        })
        await flushPromises()
    })
})