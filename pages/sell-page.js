import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { ethers, utils } from "ethers"
import nftAbi from "../constants/TestNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState, React } from "react"

export default function SellPage() {
    const { chainId, account, isWeb3Enabled } = useMoralis() // here it is in 0x...
    const chainIdDecimal = chainId ? parseInt(chainId).toString() : null
    const marketplaceAddress = chainId ? networkMapping[chainIdDecimal].NftMarketplace[0] : null

    const [proceeds, setProceeds] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }
        await runContractFunction({
            params: approveOptions,
            onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            const ethAmount = utils.formatEther(returnedProceeds)
            setProceeds(ethAmount)
        }
    }

    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

    async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
        await tx.wait()
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess,
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
    }

    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    return (
        <div className={`${styles.container} flex flex-col items-center mt-[17vh]	`}>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "Enter NFT Address...",
                        type: "text",
                        value: "",
                        key: "nftAddress",
                        required: true,
                    },
                    {
                        name: "NFT Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                        required: true,
                    },
                    {
                        name: "Price (ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                        required: true,
                    },
                ]}
                title="Sell your NFt"
                id="Main_form"
                className="$ flex flex-col items-center mb-[10vh]"
            />

            {proceeds != "0.0" ? (
                <div className="flex flex-col items-center">
                    <div className="text-[#312DCF] font-semibold mb-5">
                        Withdraw {proceeds}ETH proceeds
                    </div>
                    <Button
                        onClick={() => {
                            runContractFunction({
                                params: {
                                    abi: nftMarketplaceAbi,
                                    contractAddress: marketplaceAddress,
                                    functionName: "withdrawProceeds",
                                    params: {},
                                },
                                onError: (error) => console.log(error),
                                onSuccess: () => handleWithdrawSuccess,
                            })
                        }}
                        text="Withdraw"
                        type="button"
                    />
                </div>
            ) : (
                <div className="text-deepblue font-medium text-[#94A3B8]">
                    No withdrawable proceeds detected
                </div>
            )}
        </div>
    )
}
