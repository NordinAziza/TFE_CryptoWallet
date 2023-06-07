const Marketplace = artifacts.require("Marketplace");
const UserLogin= artifacts.require('Userlogin');
const Tokens = artifacts.require("Token");

module.exports = function (deployer) {
  //deployer.deploy(Marketplace);
  deployer.deploy(UserLogin);
  deployer.deploy(Tokens);


};
