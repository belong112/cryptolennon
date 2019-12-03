var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Lennon = artifacts.require("./Lennon.sol");



module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Lennon);
};
