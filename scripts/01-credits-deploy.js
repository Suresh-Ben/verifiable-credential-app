async function main() {

    const CreditsContract = await ethers.getContractFactory("Credits");

    console.log("Deploying contract...!!!");
    const contract = await CreditsContract.deploy();

    return contract;
}

main()
    .then((contract) => {
        console.log("Contract deployed successfully...!!!");
        console.log("contract deployed at address : " + contract.address);

        process.exit(0);
    })
    .catch((err) => {
        console.error("error with dploying contract...!!!");
        console.log(err);

        process.exit(1);
    })