const Migrations = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};