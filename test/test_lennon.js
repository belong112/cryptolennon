const Lennon = artifacts.require("Lennon")

contract('Lennon', accounts => {
    let lennon
    
    it('should create account correctly', () => {
        return Lennon.deployed()
        .then(instance => {
            lennon = instance
            return lennon.create_account('bitch', 1, 2, 1998, {from: accounts[0]});
        })
        .then(() => lennon.create_account('hello', 3, 10, 1998, {from: accounts[1]}))
        .then(() => lennon.create_account('做愛', 8, 26, 1996, {from: accounts[2]}))
        .then(() => lennon.get_account.call({from: accounts[0]}))
        .then( ret => {
            console.log(ret[0])
            console.log(ret[1])
            console.log(ret[2])
            console.log(ret[3])
        } )
        .then(() => lennon.get_account.call({from: accounts[1]}))
        .then( ret => {
            console.log(ret[0])
            console.log(ret[1])
            console.log(ret[2])
            console.log(ret[3])
        } )
        .then(() => lennon.get_account.call({from: accounts[2]}))
        .then( ret => {
            console.log(ret[0])
            console.log(ret[1])
            console.log(ret[2])
            console.log(ret[3])
        } )
    })
    it('should get question correctly', () => {
        return Lennon.deployed()
        .then(() => lennon.get_question_length.call())
        .then(ret => {
            assert.equal(ret, 3)
        })
        .then(() => lennon.get_question(0))
        .then(ret => {
            console.log(ret[0])
        })
        .then(() => lennon.get_question(1))
        .then(ret => {
            console.log(ret[0])
        })
        .then(() => lennon.get_question(2))
        .then(ret => {
            console.log(ret[0])
        })
    })
})