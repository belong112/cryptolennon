const Lennon = artifacts.require("Lennon")

contract('Lennon', accounts => {
    let lennon
    
    it('should create account', () => {
        return Lennon.deployed()
        .then(instance => {
            lennon = instance
            return lennon.create_account('bitch', 1, 2, 1998, {from: accounts[0]});
        })
        .then(() => lennon.get_account.call({from: accounts[0]}))
        .then( ret => {
            console.log(ret[0])
            console.log(ret[1])
            console.log(ret[2])
            console.log(ret[3])
        } )
    })
})