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

    it('should create question correctly', () => {
        return Lennon.deployed()
        .then(() => lennon.create_question('幹你娘?', {from: accounts[0]}))
        .then(() => lennon.get_question(3))
        .then(ret => {
            console.log(ret[0])
        })
    })

    it('should create reply correctly', () => {
        return Lennon.deployed()
        .then(() => lennon.create_reply(0, '我支持港警', false, 123, {from: accounts[2]}))
        .then(() => lennon.get_reply_length(0))
        .then(ret => {
            assert.equal(ret, 1)
        })
        .then(() => lennon.get_reply(0, 0))
        .then(ret => {
            console.log(ret[0])
            console.log(ret[1])
            console.log(ret[2])
            console.log(ret[3])
            console.log(ret[4])
        })
        .then(() => lennon.create_reply(1, '支持香菜英文', true, 2, {from: accounts[1]}))
        .then(() => lennon.create_reply(2, '我是鋼鐵韓粉! 氣氣氣氣', false, 3, {from: accounts[2]}))
        .then(() => lennon.create_reply(0, '維尼尼瑪八七', true, 10, {from: accounts[0]}))
        .then(() => lennon.get_reply_length(0))
        .then(ret => {
            assert.equal(ret, 2)
        })
        .then(() => lennon.get_reply_length(1))
        .then(ret => {
            assert.equal(ret, 1)
        })
        .then(() => lennon.get_reply_length(2))
        .then(ret => {
            assert.equal(ret, 1)
        })
        .then(() => lennon.get_reply_length(3))
        .then(ret => {
            assert.equal(ret, 0)
        })
        .then(() => lennon.get_reply(0, 1))
        .then(ret => {
            console.log(ret[0])
            console.log(ret[1])
            console.log(ret[2])
            console.log(ret[3])
            console.log(ret[4])
        })
        .then(() => lennon.get_reply(1, 0))
        .then(ret => {
            console.log(ret[0])
            console.log(ret[1])
            console.log(ret[2])
            console.log(ret[3])
            console.log(ret[4])
        })
        .then(() => lennon.get_reply(2, 0))
        .then(ret => {
            console.log(ret[0])
            console.log(ret[1])
            console.log(ret[2])
            console.log(ret[3])
            console.log(ret[4])
        })
    })

    /*
        q0: 你支持反送中嗎?         r: 我支持港警(a2), 維尼尼瑪八七(a0)
        q1: 你喜歡吃香菜嗎?         r: 支持香菜英文(a1)
        q2: 2020。歸。投。韓下去?   r: 我是鋼鐵韓粉! 氣氣氣氣(a2)
        q4: 幹你娘?                r: 
    */

    it('should like correctly', () => {
        return Lennon.deployed()
        .then(() => lennon.like(0, 1, {from: accounts[1]}))
        .then(() => lennon.like(0, 1, {from: accounts[2]}))
        .then(() => lennon.like(2, 0, {from: accounts[2]}))
        .then(() => lennon.get_reply(0, 1))
        .then(ret => {
            assert.equal(ret[4], 2)
        })
        .then(() => lennon.get_reply(2, 0))
        .then(ret => {
            assert.equal(ret[4], 1)
        })
        .then(() => lennon.get_reply(1, 0))
        .then(ret => {
            assert.equal(ret[4], 0)
        })
    })

    it('should get all replies of an account correctly', () => {
        return Lennon.deployed()
        .then(() => lennon.get_all_replies(-1, -1, {from: accounts[0]}))
        .then(ret => {
            assert.equal(ret[0], 0)
            assert.equal(ret[1], 1)
        })
        .then(() => lennon.get_all_replies(0, 1, {from: accounts[0]}))
        .then(ret => {
            assert.equal(ret[0], -1)
            assert.equal(ret[1], -1)
        })
        .then(() => lennon.get_all_replies(-1, -1, {from: accounts[2]}))
        .then(ret => {
            assert.equal(ret[0], 0)
            assert.equal(ret[1], 0)
        })
        .then(() => lennon.get_all_replies(0, 0, {from: accounts[2]}))
        .then(ret => {
            assert.equal(ret[0], 2)
            assert.equal(ret[1], 0)
        })
        .then(() => lennon.get_all_replies(2, 0, {from: accounts[2]}))
        .then(ret => {
            assert.equal(ret[0], -1)
            assert.equal(ret[1], -1)
        })
    })
})