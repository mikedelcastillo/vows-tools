require('dotenv').config()
console.clear()

let tests = [
    require('./test-env.js'),
    require('./test-vue.js'),
]

async function run(){
    for(let test of tests){
        await test()
    }
}

run()