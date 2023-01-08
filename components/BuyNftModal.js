import { Modal, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import { useState, useEffect } from "react"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import React from "react"
import { ethers } from "ethers"
import Image from "next/image"
import ethLogo from "./assets/eth_logo.png"
import PropTypes from "prop-types"

BuyNftModal.propTypes = {
    nftAddress: PropTypes.string.isRequired,
    tokenId: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    marketplaceAddress: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    imageURI: PropTypes.string.isRequired,
    tokenName: PropTypes.string.isRequired,
}

export default function BuyNftModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
    price,
    imageURI,
    tokenName,
}) {
    const dispatch = useNotification()

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

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Buy Order",
            title: "Transaction to buy sent",
            position: "topR",
        })
    }

    return (
        <Modal
            cancelText="Cancel"
            id="modalNft"
            isVisible={isVisible}
            onOk={() => {
                buyItem({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: () => {
                        handleBuyItemSuccess()
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
                <div className="flex flex-row  items-center text-deepblue mb-7 mt-2">
                    <Image
                        src={ethLogo}
                        alt="Ethereum logo"
                        width={25}
                        height={25}
                        className="mr-2"
                    />
                    <div className="font-extrabold">
                        {ethers.utils.formatUnits(price, "ether")} ETH{" "}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
