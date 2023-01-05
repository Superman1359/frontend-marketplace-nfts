import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"
import React from "react"
import PropTypes from "prop-types"

UpdateListingNftModal.propTypes = {
    nftAddress: PropTypes.string.isRequired,
    tokenId: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    marketplaceAddress: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default function UpdateListingNftModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
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

    return (
        <Modal
            cancelText="Discard Changes"
            id="regular"
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
            title={<div style={{ display: "flex", gap: 10 }}>Edit Title</div>}
        >
            <div
                style={{
                    padding: "20px 0 20px 0",
                }}
            >
                <Input
                    label="Update listing Price in ETH"
                    name="New listing price"
                    type="number"
                    width="100%"
                    onChange={(event) => {
                        setPriceToUpdateListing(event.target.value)
                    }}
                />
            </div>
        </Modal>
    )
}
