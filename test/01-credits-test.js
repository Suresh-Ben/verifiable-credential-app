const { expect } = require('chai');

describe("Credits", () => {
    beforeEach(async () => {
        CreditContract = await ethers.getContractFactory("Credits");
        [owner, user1, user2, user3, ...users] = await ethers.getSigners();

        instance = await CreditContract.deploy();
    });

    describe("deploy and owner tests", () => {
        it("deploy test", async ()=> {
            let presentOwner = await instance.getOwner();
            expect(presentOwner).to.equal(owner.address);
        });

        it("change ownerShip test", async () => {
            await instance.transferOwnerShip(user1.address);
            await instance.connect(user1).acceptOwnerShip();
    
            let newOwner = await instance.getOwner();
            expect(newOwner).to.equal(user1.address);
        });
    });

    describe("status tests", () => {
        it("status for user not in record", async () => {
            let userId = await instance.connect(user1).getUserId();
            let status = await instance.getStatus("xxxxxxxxx");
            expect(userId).to.equal("");
            expect(status).to.equal(0); //not found
        });

        it("status test for users in record", async () => {
            let data_types = ["name", "age"];
            let data = ["user1", "25"];
            await instance.connect(user1).updateCredits(data_types, data);
            let user1Id = await instance.connect(user1).getUserId();
            let user1Status = await instance.getStatus(user1Id);
            expect(user1Id).to.not.equal("");
            expect(user1Status).to.equal(1); //pending
    
            data_types = ["name", "age"];
            data = ["user2", "20"];
            await instance.connect(user2).updateCredits(data_types, data);
            let user2Id = await instance.connect(user2).getUserId();
            let user2Status = await instance.getStatus(user2Id);
            expect(user2Id).to.not.equal("");
            expect(user1Id).to.not.equal(user2Id);
            expect(user2Status).to.equal(1); //pending
    
            await instance.updateStatus(user1Id, false);
            await instance.updateStatus(user2Id, true);
    
            user1Status = await instance.getStatus(user1Id);
            user2Status = await instance.getStatus(user2Id);
            expect(user1Status).to.equal(3); //rejected
            expect(user2Status).to.equal(2); //approved
        });
    });

    describe("upload tests", () => {
        it("upload test", async () => {
            let data_types = ["name", "age"];
            let data = ["user1", "25"];
            await instance.connect(user1).updateCredits(data_types, data);
            let user1Id = await instance.connect(user1).getUserId();

            let myData = await instance.connect(user1).getCredits(user1Id, "name");
            expect(myData).to.equal("user1");
        });
    });

    describe("consent tests", () => {
        it("give consent test", async () => {
            let data_types = ["name", "age"];
            let data = ["user1", "25"];
            await instance.connect(user1).updateCredits(data_types, data);
            let user1Id = await instance.connect(user1).getUserId();

            let accesStatus = await instance.check_consent(user1Id, "name", user3.address);
            await expect(instance.connect(user3).getCredits(user1Id, "name")).to.be.revertedWith('NoAccessToData');
            expect(accesStatus).to.equal(false);

            await instance.connect(user1).give_consent(user1Id, "name", user3.address);
            accesStatus = await instance.check_consent(user1Id, "name", user3.address);
            let dataObtained = await instance.connect(user3).getCredits(user1Id, "name");
            expect(dataObtained).to.equal("user1");
            expect(accesStatus).to.equal(true);
        });

        it("revoke consent test", async () => {
            let data_types = ["name", "age"];
            let data = ["user1", "25"];
            await instance.connect(user1).updateCredits(data_types, data);
            let user1Id = await instance.connect(user1).getUserId();

            await instance.connect(user1).give_consent(user1Id, "name", user3.address);
            let accesStatus = await instance.check_consent(user1Id, "name", user3.address);
            expect(accesStatus).to.equal(true);

            await instance.connect(user1).revoke_consent(user1Id, "name", user3.address);
            accesStatus = await instance.check_consent(user1Id, "name", user3.address);
            expect(accesStatus).to.equal(false);
        });
    });
});