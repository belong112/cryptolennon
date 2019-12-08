var Lennon = artifacts.require("./Lennon.sol");



module.exports = function(deployer) {
  deployer.deploy(Lennon);
};
