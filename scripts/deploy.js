const hre = require("hardhat");

async function main() {
	const StoreHash = await ethers.getContractFactory("StoreHash");
	const storehash = await StoreHash.deploy();

	await storehash.waitForDeployment();

	console.log(storehash);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
