import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/TestNft.json"
import Image from "next/image"

export default function NftItem({}) {
    const { isWeb3Enabled } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "getTokenURI",
        params: tokenId,
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        // Not everyone got IPFS companion, so we use gateway to go to https
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            <div>
                {imageURI ? (
                    <Image loader={() => imageURI} src={imageURI} height="200" width="200" />
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
