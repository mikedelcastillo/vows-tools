const { describe } = require('./tester')

const axios = require('axios')
const { assert } = require('chai')

const { createStore } = require('vuex')
const { createVuexModule } = require('../dist/index')
const { createVueRouterGuard } = require('../dist/index')

let store = null
const TEST_KEY = "TEST"

const mockRoute = meta => ({
    matched: [ {meta}, {meta}, {meta} ],
})
const mockRoutes = {
    public: mockRoute({}),
    requiresAuth: mockRoute({ requiresAuth: true }),
    requiresUnauth: mockRoute({ requiresUnauth: true }),
}

module.exports = async () => {
    await describe("Test the store", async ({test}) => {
        await test('Setup store with vows module', () => {
            store = createStore({
                modules: {
                    vows: createVuexModule(process.env.API_URL),
                },
            })
        })

        await test('Test API connection', async () => {
            const { data } = await axios.get(process.env.API_URL)
        })

        await test('dispatch: getGuest(WRONG_GUEST_CODE)', async ({fail}) => {
            try{
                await store.dispatch("vows/getGuest", Math.random())
                fail('Guest should return a 404')
            } catch(e){

            }
        })

        await test('dispatch: getGuest(TEST_GUEST_CODE)', async () => {
            const data = await store.dispatch("vows/getGuest", TEST_KEY)
            assert.equal(data.guest.guest_code, TEST_KEY)
        })

        await test('dispatch: login(TEST_GUEST_CODE)', async () => {
            await store.dispatch('vows/login', TEST_KEY)
        })

        await test('getters: loggedIn', async () => {
            await assert.equal(store.getters["vows/loggedIn"], true)
        })

        await test('dispatch: getGifts()', async () => {
            await store.dispatch('vows/getGifts')
        })
    })

    await describe('Test router guard authenticated', async ({test}) => {
        await test('Create route guard', async () => {
            const guard = createVueRouterGuard(store)
        })
        
        await test('Allow access to protected route', async ({fail}) => {
            const guard = createVueRouterGuard(store, () => {
                fail("User should not be redirected to keep in")
            }, () => {
                fail("User logged in but not allowed to access protected route")
            })
            await guard(mockRoutes.requiresAuth, mockRoutes.public, () => {
                // Pass
            })
        })

        await test('Allow access to unprotected route', async ({fail}) => {
            const guard = createVueRouterGuard(store, () => {
                fail("User should not be redirected to keep in")
            }, () => {
                fail("User logged in but not allowed to access unprotected route")
            })
            await guard(mockRoutes.public, mockRoutes.public, () => {
                // Pass
            })
        })

        await test('Block access to public only route', async ({fail}) => {  
            const guard = createVueRouterGuard(store, () => {
                // Pass
            }, () => {
                fail("User logged in but not allowed to access unprotected route")
            })
            await guard(mockRoutes.requiresUnauth, mockRoutes.public, () => {
                fail("User should be kept in")
            })
        })

        await test('Simulate auto re-login', async ({fail}) => {
            store.commit('vows/setGuest', null)
            await assert.isNull(store.state.vows.guest)
            await assert.typeOf(store.state.vows.guest_code, "string")
            await assert.isFalse(store.getters['vows/loggedIn'])
            
            const guard = createVueRouterGuard(store, () => {
                fail("User should not be redirected to keep in")
            }, () => {
                fail("User logged in but not allowed to access unprotected route")
            })
            await guard(mockRoutes.requiresAuth, mockRoutes.public, () => {
                // Pass
            })
            await assert.typeOf(store.state.vows.guest, "object")
        })
    })

    await describe('Test gift reservations', async ({test}) => {
        await test('Cannot reserve more than available quantity', async ({fail}) => {
            try{
                await store.dispatch('vows/reserveGift', {
                    quantity: 5,
                    gift_id: TEST_KEY,
                })
                fail("Should not be able to reserve more than available")
            } catch(e){

            }
        })

        await test('Reserve the test gift', async () => {
            await store.dispatch('vows/reserveGift', {
                quantity: 2,
                gift_id: TEST_KEY,
            })
        })

        await test('Cannot reserve more than available quantity', async ({fail}) => {
            try{
                await store.dispatch('vows/reserveGift', {
                    quantity: 2,
                    gift_id: TEST_KEY,
                })
                fail("Should not be able to reserve more than available")
            } catch(e){

            }
        })

        await test('Reserve the test gift', async () => {  
            await store.dispatch('vows/reserveGift', {
                quantity: 1,
                gift_id: TEST_KEY,
            })
        })

        await test('Cannot reserve more than available quantity', async ({fail}) => {
            try{
                await store.dispatch('vows/reserveGift', {
                    quantity: 2,
                    gift_id: TEST_KEY,
                })
                fail("Should not be able to reserve more than available")
            } catch(e){

            }
        })

        await test('Should have only 3 reserved', async () => {
            await store.dispatch('vows/getGifts')
            const quantity = store.state.vows.reservations.map(a=>a.quantity).reduce((a,b)=>a+b,0)
            await assert.equal(quantity, 3)
        })

        await test('Can unreserve gift', async () => {
            await store.dispatch('vows/unreserveGift', {
                gift_id: TEST_KEY,
            })
            const quantity = store.state.vows.reservations.map(a=>a.quantity).reduce((a,b)=>a+b,0)
            await assert.equal(quantity, 0)
        })
    })

    await describe('Clear the store', async ({test}) => {
        await test('commit: clear', async () => {
            store.commit('vows/clear')
            await assert.isNull(store.state.vows.guest_code)
            await assert.isNull(store.state.vows.guest)
            await assert.isFalse(store.getters["vows/loggedIn"])
        })

        // Should not be able to do guest things
    })

    await describe('Test router guard unauthenticated', async ({test}) => {
        await test('Block access to protected route', async ({fail}) => {
            const guard = createVueRouterGuard(store, () => {
                fail("User should not be redirected to keep in")
            }, () => {
                // Pass
            })
            await guard(mockRoutes.requiresAuth, mockRoutes.public, () => {
                fail("User logged out but not allowed to access protected route")
            })
            
        })

        await test('Allow access to unprotected route', async ({fail}) => {
            const guard = createVueRouterGuard(store, () => {
                fail("User should not be redirected to keep in")
            }, () => {
                fail("User logged out but not allowed to access unprotected route")
            })
            await guard(mockRoutes.public, mockRoutes.public, () => {
                // Pass
            })
            
        })

        await test('Allow access to public only route', async ({fail}) => {
            const guard = createVueRouterGuard(store, () => {
                fail("User should not be redirected to keep in")
            }, () => {
                fail("User logged in but not allowed to access unprotected route")
            })
            await guard(mockRoutes.requiresUnauth, mockRoutes.public, () => {
                // Pass
            })
        })
    })

    await describe('Test API', async ({test}) => {
        await test('Get test FAQs', async () => {
            const faqs = await store.dispatch('vows/getFaqs', 'test')
            await assert.instanceOf(faqs, Array)
        })
        await test('Get stories', async () => {
            await store.dispatch('vows/getStories')
        })
    })
}