require('dotenv').config()

const flushPromises = require('flush-promises')
const axios = require('axios')

const { createStore } = require('vuex')
const { createVuexModule } = require('../dist/index')
const { createVueRouterGuard } = require('../dist/index')

let store = null

const mockRoute = meta => ({
    matched: [ {meta}, {meta}, {meta} ],
})
const mockRoutes = {
    public: mockRoute({}),
    requiresAuth: mockRoute({ requiresAuth: true }),
    requiresUnauth: mockRoute({ requiresUnauth: true }),
}

describe("Test the store", () => {
    test('Setup store with vows module', () => {
        store = createStore({
            modules: {
                vows: createVuexModule(process.env.API_URL),
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
        await store.dispatch('vows/login', process.env.TEST_GUEST_CODE)
        await flushPromises()
    })

    test('getters: loggedIn', async () => {
        expect(store.getters["vows/loggedIn"]).toBe(true)
    })
})

describe('Test router guard authenticated', () => {
    test('Create route guard', async () => {
        const guard = createVueRouterGuard(store)
    })
    
    test('Allow access to protected route', async () => {
        const guard = createVueRouterGuard(store, () => {
            fail("User should not be redirected to keep in")
        }, () => {
            fail("User logged in but not allowed to access protected route")
        })
        await guard(mockRoutes.requiresAuth, mockRoutes.public, () => {
            // Pass
        })
        await flushPromises()
    })

    test('Allow access to unprotected route', async () => {
        const guard = createVueRouterGuard(store, () => {
            fail("User should not be redirected to keep in")
        }, () => {
            fail("User logged in but not allowed to access unprotected route")
        })
        await guard(mockRoutes.public, mockRoutes.public, () => {
            // Pass
        })
        await flushPromises()
    })

    test('Block access to public only route', async () => {
        const guard = createVueRouterGuard(store, () => {
            // Pass
        }, () => {
            fail("User logged in but not allowed to access unprotected route")
        })
        await guard(mockRoutes.requiresUnauth, mockRoutes.public, () => {
            fail("User should be kept in")
        })
        await flushPromises()
    })

    test('Simulate auto re-login', async () => {
        store.commit('vows/setGuest', null)
        expect(store.state.vows.guest).toBeNull()
        expect(store.state.vows.guest_code).not.toBeNull()
        expect(store.getters['vows/loggedIn']).toBe(false)
        
        const guard = createVueRouterGuard(store, () => {
            fail("User should not be redirected to keep in")
        }, () => {
            fail("User logged in but not allowed to access unprotected route")
        })
        await guard(mockRoutes.requiresAuth, mockRoutes.public, () => {
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
        const guard = createVueRouterGuard(store, () => {
            fail("User should not be redirected to keep in")
        }, () => {
            // Pass
        })
        await guard(mockRoutes.requiresAuth, mockRoutes.public, () => {
            fail("User logged out but not allowed to access protected route")
        })
        await flushPromises()
    })

    test('Allow access to unprotected route', async () => {
        const guard = createVueRouterGuard(store, () => {
            fail("User should not be redirected to keep in")
        }, () => {
            fail("User logged out but not allowed to access unprotected route")
        })
        await guard(mockRoutes.public, mockRoutes.public, () => {
            // Pass
        })
        await flushPromises()
    })

    test('Allow access to public only route', async () => {
        const guard = createVueRouterGuard(store, () => {
            fail("User should not be redirected to keep in")
        }, () => {
            fail("User logged in but not allowed to access unprotected route")
        })
        await guard(mockRoutes.requiresUnauth, mockRoutes.public, () => {
            // Pass
        })
        await flushPromises()
    })
})

describe('Test FAQs', () => {
    test('Get test FAQs', async () => {
        const faqs = await store.dispatch('vows/getFaqs', 'test')
        await flushPromises()
        expect(faqs instanceof Array).toBe(true)
    })
})