const Moralis = require("moralis/node")
require("dotenv").config()

const contractAddresses = require("./constants/networkMapping.json")

let chainId = process.env.chainId || 31337

const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

async function main() {}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
