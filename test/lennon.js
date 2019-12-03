const Lennon = artifacts.require("./Lennon.sol");

contract("Lennon", accounts => {
  // ** Below is an Example
  // it("...should store the value 89.", async () => {
  //   const simpleStorageInstance = await SimpleStorage.deployed();

  //   // Set value of 89
  //   await simpleStorageInstance.set(89, { from: accounts[0] });

  //   // Get stored value
  //   const storedData = await simpleStorageInstance.get.call();

  //   assert.equal(storedData, 89, "The value 89 was not stored.");
  // });

  it("...should create account", async () => {
    let instance = await Lennon.deployed();
    
    // Create account
    await instance.createAccount("禕仁",3,12,2019,  { from: accounts[0] });
    const result = await instance.Accounts(1);
    console.log(result)

    assert.equal(result['name'], "禕仁", "The account is not created correctly.");
  });

  it("...should create post", async () => {
    let instance = await Lennon.deployed();
    
    // Create post 
    await instance.createPost("測試", { from: accounts[0] });
    const result = await instance.Posts(0);
    console.log(result)

    assert.equal(result['post'],  "測試", "The post is not created correctly.");
  });
});
