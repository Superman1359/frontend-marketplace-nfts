import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/TestNft.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingNftModal from "./UpdateListingNftModal"
import React from "react"
import PropTypes from "prop-types"
import { ethLogo } from "./assets/eth_logo.png"

NftItem.propTypes = {
    nftAddress: PropTypes.string.isRequired,
    tokenId: PropTypes.string.isRequired,
    marketplaceAddress: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    seller: PropTypes.string.isRequired,
}

const truncateAddress = (fullAddress, length) => {
    if (fullAddress.length <= length) {
        return fullAddress
    }
    const separator = "..."
    const finalAddressLength = length - separator.length
    const frontFinalAddress = Math.ceil(finalAddressLength / 2)
    const backFinalAddress = Math.floor(finalAddressLength / 2)
    return (
        fullAddress.substring(0, frontFinalAddress) +
        separator +
        fullAddress.substring(fullAddress.length - backFinalAddress)
    )
}

export default function NftItem({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [imageURI, setImageURI] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "getTokenURI",
        params: { tokenId: tokenId },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
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
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUSer = seller == account || seller == undefined

    const formattedSellerAddress = isOwnedByUSer ? "you" : truncateAddress(seller || "", 15)

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item bought",
            title: "Item bought",
            position: "topR",
        })
    }

    const handleCardClick = () => {
        isOwnedByUSer
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => {
                      console.log(error)
                  },
                  onSuccess: () => {
                      handleBuyItemSuccess()
                  },
              })
    }
    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingNftModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <Card
                            onClick={handleCardClick}
                            className="bg-white border-indigo border-2 border-solid"
                        >
                            <div className="flex flex-col justify-center items-center ">
                                <Image
                                    loader={() => imageURI}
                                    src={imageURI}
                                    height="200"
                                    width="200"
                                    alt="Image of the NFT"
                                />
                                <div className="text-deepblue flex flex-col justify-center items-start w-full">
                                    <div className="font-bold flex flex-row">
                                        <div>#{tokenId}</div>
                                        <div className="pl-2">{tokenName}</div>
                                    </div>
                                    <a className="text-sm">{tokenDescription}</a>
                                    <div className="flex flex-row justify-between">
                                        <div className="font-extrabold">
                                            {ethers.utils.formatUnits(price, "ether")} ETH{" "}
                                        </div>
                                        <div className="italic text-sm pl-2">
                                            Owned by {formattedSellerAddress}
                                        </div>
                                        <img src={ethLogo} alt="eth logo" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
