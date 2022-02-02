require('dotenv').config()

const requiredVars = [
    "API_URL",
]

describe("Test the testing environment", () => {
    for(let variable of requiredVars){
        test(`Env variable "${variable}" exists`, () => {
            expect(typeof process.env[variable]).toBe("string")
        })
    }
})