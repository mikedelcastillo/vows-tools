/**
 * @author Mike del Castillo <hello@mikedc.io>
 */

const { ModuleKind } = require("typescript")

/**
 *  
 * @param {string} groupName Test group name
 * @param {function} tests Function of tests
 */
const describe = async (groupName, tests) => {
    const testResults = []
    /**
     * 
     * @param {string} testName Test name
     * @param {function} test 
     */
    const test = async (testName, test) => {
        const start = new Date().getTime()
        let passed = false
        let failed = false
        const log = (message) => {
            testResults.push({ 
                testName, 
                passed, 
                failed, 
                message,
                duration: (new Date().getTime() - start),
            })
        }
        /**
         * 
         * @param {string} message Message
         */
        const pass = (message) => {
            if(passed || failed) return
            passed = true
            log(message)
        }
        /**
         * 
         * @param {string|Error} message Error
         */
        const fail = (message) => {
            if(passed || failed) return
            failed = true
            log(message)
            throw (typeof message === "string" ? new Error(message) : message)
        }
        try{
            const result = await test({ pass, fail })
            pass()
        } catch(e){
            fail(e)
        }
    }
    try{
        await tests({test})
    } catch(e){
        // console.warn(e)
    }
    
    let passedCount = testResults.filter(testResult => testResult.passed).length
    let failedCount = testResults.filter(testResult => testResult.failed).length
    let totalTime = testResults.reduce((sum, testResult) => sum + testResult.duration, 0)

    const groupEmoji = failedCount > 0 ?  "❌" : "✅"

    let output = [`${groupEmoji} ${groupName} (${passedCount} passed, ${failedCount} failed, ${testResults.length} total, ${totalTime}ms)`]

    for(let i = 0; i < testResults.length; i++){
        const testResult = testResults[i]
        let line = `  ∟ `
        line += testResult.passed ? "✅" : "❌"
        line += `  ${i+1}. ${testResult.testName} (${testResult.duration}ms)`
        output.push(line)

        if(testResult.message){
            const message = testResult?.message
            output.push(`     ∟ ⚠️ ${message}`)
        }
    }

    console.log(output.join("\n"))
}

const testTheTester = async () => {
    describe("Testing the tester", async ({test}) => {
        await test("Sample test", () => {
            return "This should pass"
        })
    
        await test("This should pass", async ({pass}) => {
            const wait = () => new Promise(resolve => setTimeout(resolve, 1000))
            await wait()
            pass()
        })
    
        await test("This should also pass", ({fail, pass}) => {
            try{
                const test = 1
                test++
                fail()
            } catch(e){
                pass()
            }
        })
    
        await test("This should fail", ({fail}) => {
            fail()
        })
    })
}

// testTheTester()

module.exports = {
    describe,
}