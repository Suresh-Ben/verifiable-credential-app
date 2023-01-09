// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";

error DataMisMatch(uint NoOfTypes, uint NoOfData);
error NoAccessToData();
error AccessOnlyToOwner();
error NewOwnerCanOnlyRequest();
error AccessCanOnlyBeSharedByOwnerOfTheId();

contract Credits {

    enum Status {
        EStatus_notfound,
        EStatus_pending,
        EStatus_verified,
        EStatus_rejected
    }
  
    mapping (address => string) id;                                                     //mapping (userAdd => userId);
    mapping (string => bool) validId;                                                   //mapping (userId => inDAtaBase)
    mapping (string => mapping (string => string)) credits;                             //mapping (userdId => mapping(data_type, data))
    mapping (string => mapping (address => mapping(string => bool))) access;             //mapping (userId => recipentId => dataType => acess)
    mapping (string => Status) idStatus;                                                //mapping (userId => verificationStatus)
    string[] userids;

    address owner;                                                                      //setting owner of this contract -- owner is the issuer
    address newOwner = address(0);

    constructor() {
        owner = msg.sender;
    }

    function getOwner() external view returns(address) {
        return owner;
    }

    modifier onlyOwner() {
        if(msg.sender != owner) revert AccessOnlyToOwner();
        _;
    }

    function transferOwnerShip(address _newOwner) external onlyOwner {
        newOwner = _newOwner;
    }

    function acceptOwnerShip() external {
        if(msg.sender != newOwner) revert NewOwnerCanOnlyRequest();
        owner = newOwner;
        newOwner = address(0);
    }

    function getAllUserIds() external view onlyOwner returns(string[] memory) {
        return userids;
    }

    function getUserId() external view returns(string memory) {
        return id[msg.sender];
    }

    function getStatus(string calldata userId) external view returns(Status) {
        return idStatus[userId];
    }

    function updateCredits(string[] calldata data_type, string[] memory data) external {
        if(data_type.length != data.length) revert DataMisMatch(data_type.length, data.length);

        string memory userId = id[msg.sender];
        if(bytes(userId).length == 0) {
            id[msg.sender] = generateUserId(msg.sender);
            userId = id[msg.sender];
            userids.push(userId);
        }

        uint length = data_type.length;

        for(uint i = 0; i < length; i++)
            credits[userId][ data_type[i] ] = data[i];

        idStatus[userId] = Status.EStatus_pending;
    }

    function generateUserId(address user) private view returns(string memory) {        
        return Strings.toHexString(uint256(keccak256( abi.encodePacked(user, block.timestamp, block.difficulty))));
    }

    function getCredits(string memory userId, string calldata data_type) external view returns(string memory) {
        string memory senderId = id[msg.sender];
        bool isUser = (keccak256(abi.encodePacked(senderId)) == keccak256(abi.encodePacked(userId)));

        if(isUser || access[userId][msg.sender][data_type] || msg.sender == owner)
            return credits[userId][data_type];
        else 
            revert NoAccessToData();
    }

    function updateStatus(string calldata userid, bool verificationStatus) external onlyOwner {
        /**
         * @dev
         * false - rejected
         * true - verified
         */

        if(verificationStatus)
            idStatus[userid] = Status.EStatus_verified;
        else
            idStatus[userid] = Status.EStatus_rejected;
    }

    /** ACCESS FUNCTIONS */

    function give_consent(string memory user_id, string memory data_type, address recipient) external {
        string memory senderId = id[msg.sender];
        bool isUser = (keccak256(abi.encodePacked(senderId)) == keccak256(abi.encodePacked(user_id)));
        if(!isUser) revert AccessCanOnlyBeSharedByOwnerOfTheId();

        access[user_id][recipient][data_type] = true;
    }

    function revoke_consent(string memory user_id, string memory data_type, address recipient) external {
        string memory senderId = id[msg.sender];
        bool isUser = (keccak256(abi.encodePacked(senderId)) == keccak256(abi.encodePacked(user_id)));
        if(!isUser) revert AccessCanOnlyBeSharedByOwnerOfTheId();

        access[user_id][recipient][data_type] = false;
    }

    function check_consent(string memory user_id, string memory data_type, address recipient) external view returns(bool) {
        return access[user_id][recipient][data_type];
    }
}