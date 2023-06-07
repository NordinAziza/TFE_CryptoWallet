pragma solidity ^0.8.0;

contract Token {
    struct TokenData {
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    mapping(uint256 => TokenData) private tokens;
    mapping(uint256 => mapping(address => uint256)) private balances;
    mapping(uint256 => mapping(address => mapping(address => uint256))) private allowances;
    uint256 private tokenCount;

    event Transfer(address indexed from, address indexed to, uint256 value, uint256 tokenId);
    event Approval(address indexed owner, address indexed spender, uint256 value, uint256 tokenId);

    function createToken(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, uint256 _tokenId) public {
        require(tokens[_tokenId].totalSupply == 0, "Token ID already exists");
        tokens[_tokenId] = TokenData({
            name: _name,
            symbol: _symbol,
            decimals: _decimals,
            totalSupply: _totalSupply * (10 ** _decimals)
        });
        balances[_tokenId][msg.sender] = tokens[_tokenId].totalSupply;
        tokenCount++;
        emit Transfer(address(0), msg.sender, tokens[_tokenId].totalSupply, _tokenId);
    }

    function getTokenData(uint256 _tokenId) public view returns (string memory, string memory, uint8, uint256) {
        TokenData memory data = tokens[_tokenId];
        return (data.name, data.symbol, data.decimals, data.totalSupply);
    }

    function balanceOf(address _owner, uint256 _tokenId) public view returns (uint256) {
        return balances[_tokenId][_owner];
    }

    function allowance(address _owner, address _spender, uint256 _tokenId) public view returns (uint256) {
        return allowances[_tokenId][_owner][_spender];
    }

    function transfer(address _to, uint256 _value, uint256 _tokenId) public returns (bool success) {
        require(balances[_tokenId][msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Invalid recipient");
        balances[_tokenId][msg.sender] -= _value;
        balances[_tokenId][_to] += _value;
        emit Transfer(msg.sender, _to, _value, _tokenId);
        return true;
    }

    function approve(address _spender, uint256 _value, uint256 _tokenId) public returns (bool success) {
        require(_spender != address(0), "Invalid spender");
        allowances[_tokenId][msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value, _tokenId);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amountInWei, uint256 _tokenId) public returns (bool success) {
        // Convert _amountInWei to the actual token value
        uint256 _value = _amountInWei / (10 ** tokens[_tokenId].decimals);
        require(balances[_tokenId][_from] >= _value, "Insufficient balance");
        require(_to != address(0), "Invalid recipient");
        require(allowances[_tokenId][_from][msg.sender] >= _value, "Insufficient allowance");
        balances[_tokenId][_from] -= _value;
        balances[_tokenId][_to] += _value;
        allowances[_tokenId][_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value, _tokenId);
        return true;
    }
    
    function findTokenId(string memory _symbol) public view returns (uint256) {
        for (uint256 tokenId = 0; tokenId < tokenCount; tokenId++) {
            if (keccak256(bytes(tokens[tokenId].symbol)) == keccak256(bytes(_symbol))) {
                return tokenId;
            }
        }
        revert("Token not found");
    }
}
