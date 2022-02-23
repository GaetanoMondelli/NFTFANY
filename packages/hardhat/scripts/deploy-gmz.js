const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");

console.log("\n\n 📡 Deploying...\n");
const main = async () => {
    const gmztoken = await deploy("GMZ", ["GMZ Token 3", "GMZv3", "10000000000000000000"]);
}

const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
    console.log(` 🛰  Deploying: ${contractName}`);

    const contractArgs = _args || [];
    const contractArtifacts = await ethers.getContractFactory(contractName, { libraries: libraries });
    const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
    const encoded = abiEncodeArgs(deployed, contractArgs);
    fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

    let extraGasInfo = ""
    if (deployed && deployed.deployTransaction) {
        const gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
        extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
    }

    console.log(
        " 📄",
        chalk.cyan(contractName),
        "deployed to:",
        chalk.magenta(deployed.address)
    );
    console.log(
        " ⛽",
        chalk.grey(extraGasInfo)
    );

    await tenderly.persistArtifacts({
        name: contractName,
        address: deployed.address
    });

    if (!encoded || encoded.length <= 2) return deployed;
    fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

    return deployed;
};


// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
    // not writing abi encoded args if this does not pass
    if (
        !contractArgs ||
        !deployed ||
        !R.hasPath(["interface", "deploy"], deployed)
    ) {
        return "";
    }
    const encoded = utils.defaultAbiCoder.encode(
        deployed.interface.deploy.inputs,
        contractArgs
    );
    return encoded;
};


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
