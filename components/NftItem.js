import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftAbi from "../constants/EtherealNFTs.json"
import Image from "next/image"
import { Card } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingNftModal from "./UpdateListingNftModal"
import BuyNftModal from "./BuyNftModal"
import React from "react"
import PropTypes from "prop-types"
import ethLogo from "./assets/eth_logo.png"

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

    const { runContractFunction: tokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: { _tokenId: tokenId },
    })

    async function updateUI() {
        const nftUri = await tokenURI()

        // Not everyone got IPFS companion, so we use gateway to go to https
        if (nftUri) {
            const requestURL = nftUri.replace(
                "ipfs://",
                "https://olive-absolute-silverfish-298.mypinata.cloud/ipfs/"
            )
            const nftUriResponse = await (await fetch(requestURL)).json()
            const imageURI = nftUriResponse.image
            const imageURIURL = imageURI.replace(
                "ipfs://",
                "https://olive-absolute-silverfish-298.mypinata.cloud/ipfs/"
            )
            setImageURI(imageURIURL)
            setTokenName(nftUriResponse.name)
            setTokenDescription(nftUriResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUSer = seller == account || seller == undefined

    const formattedSellerAddress = +isOwnedByUSer
        ? " Owned by you"
        : truncateAddress(seller || "", 15)

    const handleCardClick = () => {
        setShowModal(true)
    }

    const [screenWidth, setScreenWidth] = useState(0)

    useEffect(() => {
        function handleResize() {
            setScreenWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    function formatPrice(price) {
        const priceEth = ethers.utils.formatUnits(price, "ether")
        return priceEth.substring(0, 6)
    }

    return (
        <div style={{ width: screenWidth / 5, marginRight: 15 }}>
            <div>
                {imageURI ? (
                    <div className="pr-4 pb-4 ">
                        <UpdateListingNftModal
                            isVisible={showModal && isOwnedByUSer}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                            price={price}
                            tokenName={tokenName}
                            imageURI={imageURI}
                            textButton={"Save new listing price"}
                        />
                        <BuyNftModal
                            isVisible={showModal && !isOwnedByUSer}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                            price={price}
                            tokenName={tokenName}
                            imageURI={imageURI}
                            textButton={"Confirm buy"}
                        />
                        <Card
                            onClick={handleCardClick}
                            className="bg-white border-indigo border-2 border-solid rounded-36 w-20vw "
                        >
                            <div className="flex flex-col justify-start items-center h-full ">
                                <div className="">
                                    <Image
                                        unoptimized
                                        loader={() => imageURI}
                                        src={imageURI}
                                        width={screenWidth / 5}
                                        height={200}
                                        alt="Image of the NFT"
                                        className="rounded-36 mb-3  "
                                    />
                                </div>
                                <div className="text-deepblue flex flex-col justify-center items-start w-full ">
                                    <div className="font-bold flex flex-row pb-1 pl-2">
                                        <div>#{tokenId}</div>
                                        <div className="pl-2 pb-1">{tokenName}</div>
                                    </div>
                                    <a className="text-sm pl-2">{tokenDescription}</a>
                                    <div className="flex flex-row pl-2 justify-center items-center">
                                        <div className="flex flex-row mr-8 mt-3 items-center">
                                            <Image
                                                src={ethLogo}
                                                alt="Ethereum logo"
                                                width={25}
                                                height={25}
                                                className="mr-2"
                                            />
                                            <div className="font-extrabold">
                                                {formatPrice(price)} ETH{" "}
                                            </div>
                                        </div>
                                        <div className="italic text-sm pl-2 mt-2">
                                            {formattedSellerAddress}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="text-deepblue font-semibold pr-8">Loading...</div>
                )}
            </div>
        </div>
    )
}
