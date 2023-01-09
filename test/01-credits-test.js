const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Credits", () => {
    beforeEach(async () => {
        CreditContract = await ethers.getContractFactory("Credits");
    })
});