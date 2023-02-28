// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserLogin {
    struct User {
        string username;
        string email;
        string password;
        address blockchainAddress;
    }

    mapping(address => User) public users;
    mapping(string => address) private emailToAddress;
    mapping(string => bool) private usedUsernames;
    
    event NewUserAdded(string username, string email, address blockchainAddress);

    function addUser(string memory _username, string memory _email, string memory _password, address _blockchainAddress ) public {
        require(users[_blockchainAddress].blockchainAddress != _blockchainAddress, "User already exists"); 
        require(emailToAddress[_email] == address(0), "Email is already registered");
        require(!usedUsernames[_username], "Username is already taken");

        users[_blockchainAddress] = User(_username, _email, _password, _blockchainAddress);
        emailToAddress[_email] = _blockchainAddress;
        usedUsernames[_username] = true;
        
        emit NewUserAdded(_username, _email, _blockchainAddress);
    }

    function getUserByAddress(address _blockchainAddress) public view returns (string memory, string memory, string memory, address) {
        require(users[_blockchainAddress].blockchainAddress == _blockchainAddress, "User not found");
        User memory user = users[_blockchainAddress];
        return (user.username, user.email, user.password, user.blockchainAddress);
    }

    function getUserByEmail(string memory _email) public view returns (string memory, string memory, string memory, address) {
        address userAddress = emailToAddress[_email];
        require(userAddress != address(0), "User not found");
        User memory user = users[userAddress];
        return (user.username, user.email, user.password, user.blockchainAddress);
    }

    function login(string memory _email, string memory _password) public view returns (address) {
        address userAddress = emailToAddress[_email];
        require(userAddress != address(0), "User not found");
        User memory user = users[userAddress];
        require(keccak256(bytes(user.password)) == keccak256(bytes(_password)), "Invalid email or password");
        return userAddress;
    }

}
