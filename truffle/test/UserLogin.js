const UserLogin = artifacts.require("UserLogin");

contract("UserLogin", (accounts) => {
  let userLogin;

  before(async () => {
    userLogin = await UserLogin.deployed();
  });

  it("should add a new user and retrieve their data", async () => {
    const blockchainAddress = accounts[1];
    const blockchainKey = web3.utils.fromAscii("123");
    await userLogin.addUser("alice", "alice@example.com", "password123", blockchainAddress, blockchainKey);

    const [username, email, password, returnedAddress, returnedKey] = await userLogin.getUserByAddress(blockchainAddress);
    assert.equal(username, "alice", "Username should be alice");
    assert.equal(email, "alice@example.com", "Email should be alice@example.com");
    assert.equal(password, "password123", "Password should be password123");
    assert.equal(returnedAddress, blockchainAddress, "Blockchain address should match");
    assert.equal(web3.utils.hexToString(returnedKey), "123", "Blockchain key should match");
  });

  it("should retrieve a user by email", async () => {
    const [username, email, password, returnedAddress, returnedKey] = await userLogin.getUserByEmail("alice@example.com");
    assert.equal(username, "alice", "Username should be alice");
    assert.equal(email, "alice@example.com", "Email should be alice@example.com");
    assert.equal(password, "password123", "Password should be password123");
    assert.equal(returnedAddress, accounts[1], "Blockchain address should match");
    assert.equal(web3.utils.hexToString(returnedKey), "123", "Blockchain key should match");
  });

  it("should allow a user to log in with their email and password", async () => {
    const userAddress = await userLogin.login("alice@example.com", "password123", { from: accounts[0] });
    assert.equal(userAddress, accounts[1], "Login should succeed with correct email and password");
  });

  it("should not allow a user to log in with an incorrect password", async () => {
    let error;
    try {
      await userLogin.login("alice@example.com", "wrongpassword", { from: accounts[0] });
    } catch (e) {
      error = e;
    }
    assert.ok(error instanceof Error, "Login should fail with incorrect password");
  });

  it("should not allow a user to register with a duplicate username", async () => {
    let error;
    try {
      await userLogin.addUser("alice", "bob@example.com", "password123", accounts[2], web3.utils.fromAscii("234"));
    } catch (e) {
      error = e;
    }
    assert.ok(error instanceof Error, "Should not be able to register with duplicate username");
  });

  it("should not allow a user to register with a duplicate email", async () => {
    let error;
    try {
      await userLogin.addUser("bob", "alice@example.com", "password123", accounts[3], web3.utils.fromAscii("345"));
    } catch (e) {
      error = e;
    }
    assert.ok(error instanceof Error, "Should not be able to register with duplicate email");
  });
});
