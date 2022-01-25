require('dotenv').config()

const requiredVars = [
    "API_TOKEN",
    "API_URL",
    "TEST_GUEST_CODE",
]

describe("Test the testing environment", () => {
    for(let variable of requiredVars){
        test(`Env variable "${variable}" exists`, () => {
            expect(typeof process.env[variable]).toBe("string")
        })
    }
})