const Marketplace = artifacts.require("Marketplace");
const UserLogin= artifacts.require('Userlogin');

module.exports = function (deployer) {
  deployer.deploy(Marketplace);
  deployer.deploy(UserLogin);
};
