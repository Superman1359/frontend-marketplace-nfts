import { Modal, Input, useNotification } from "web3uikit"
import { useState, useEffect } from "react"
import ethLogo from "./assets/eth_logo.png"
import { ethers } from "ethers"
import Image from "next/image"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import React from "react"
import PropTypes from "prop-types"

UpdateListingNftModal.propTypes = {
    nftAddress: PropTypes.string.isRequired,
    tokenId: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    marketplaceAddress: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    price: PropTypes.string.isRequired,
    tokenName: PropTypes.string.isRequired,
    imageURI: PropTypes.string.isRequired,
}

export default function UpdateListingNftModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
    price,
    tokenName,
    imageURI,
}) {
    const dispatch = useNotification()
    const [PriceToUpdateListing, setPriceToUpdateListing] = useState(0)
    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(PriceToUpdateListing || "0"),
        },
    })

    const handleUpdateListingSuccess = () => {
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Transaction to update listing sent",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListing("0")
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

    return (
        <Modal
            cancelText="Cancel"
            id="modalNft"
            isVisible={isVisible}
            onOk={() => {
                updateListing({
                    onError: (error) => console.log(error),
                    onSuccess: () => {
                        handleUpdateListingSuccess()
                    },
                })
            }}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
        >
            <div className="flex flex-col items-center justify-start contentModalCard">
                <Image
                    unoptimized
                    src={imageURI}
                    width={screenWidth / 4}
                    height={200}
                    alt="Image of the NFT"
                    className="rounded-14 mb-3  "
                />
                <div className="text-deepblue font-semibold	">
                    #{tokenId} {tokenName}
                </div>
                <div className="flex flex-row  items-center text-deepblue mb-14 mt-2 text-[1.4em]">
                    <Image
                        src={ethLogo}
                        alt="Ethereum logo"
                        width={25}
                        height={25}
                        className="mr-3"
                    />
                    <div className="font-extrabold">
                        {ethers.utils.formatUnits(price, "ether")} ETH{" "}
                    </div>
                </div>
                <Input
                    id="inputUpdateListingNftModal"
                    label="Update listing price in L1 Currency (ETH...)"
                    name="New listing price"
                    type="number"
                    width="55%"
                    onChange={(event) => {
                        setPriceToUpdateListing(event.target.value)
                    }}
                />

                {/* <div className="text-[#7f7ce8]">or</div>

                <button className="cancelList">Cancel Listing</button> */}
            </div>
        </Modal>
    )
}
