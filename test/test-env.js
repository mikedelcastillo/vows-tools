const { assert } = require('chai')
const { describe } = require('./tester')

const requiredVars = [
    "API_URL",
]

module.exports = async () => {
    await describe("Test the testing environment", ({test}) => {
        for(let variable of requiredVars){
            test(`Env variable "${variable}" exists`, () => {
                assert.typeOf(process.env[variable], "string")
            })
        }
    })
}