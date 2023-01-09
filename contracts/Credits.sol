// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error DataMisMatch(uint NoOfTypes, uint NoOfData);
error NoAccessToData();
error AccessOnlyToOwner();
error NewOwnerCanOnlyRequest();

contract Credits {

    enum Status {
        EStatus_pending,
        EStatus_verified,
        EStatus_rejected
    }
  
    mapping (address => string) id;                                                     //mapping (userAdd => userId);
    mapping (string => bool) validId;                                                   //mapping (userId => inDAtaBase)
    mapping (string => mapping (string => string)) credits;                             //mapping (userdId => mapping(data_type, data))
    mapping (string => mapping (string => mapping(string => bool))) access;             //mapping (userId => recipentId => dataType => acess)
    mapping (string => Status) idStatus;                                                //mapping (userId => verificationStatus)
    string[] userids;

    address owner;                                                                      //setting owner of this contract -- owner is the issuer
    address newOwner = address(0);

    constructor() {
        owner = msg.sender;
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
        bytes32 hash = keccak256( abi.encodePacked(user, block.timestamp, block.difficulty));
        return string(abi.encodePacked(hash));
    }

    function getCredits(string memory userId, string calldata data_type) external view returns(string memory) {
        string memory senderId = id[msg.sender];
        if( keccak256(abi.encodePacked(senderId)) != keccak256(abi.encodePacked(userId)) || !access[userId][senderId][data_type] || msg.sender != owner) revert NoAccessToData();

        return credits[userId][data_type];
    }

    function updateStatus(string calldata userid, uint verificationStatus) external onlyOwner {
        /**
         * @dev
         * 0 - rejected
         * 1 - verified
         * 2 or else - pending
         */

        if(verificationStatus == 0)
            idStatus[userid] = Status.EStatus_rejected;
        if(verificationStatus == 1)
            idStatus[userid] = Status.EStatus_verified;
        else
            idStatus[userid] = Status.EStatus_pending;
    }

    function getAllUserIds() external view onlyOwner returns(string[] memory) {
        return userids;
    }
}