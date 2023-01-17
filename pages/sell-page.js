import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { ethers, utils } from "ethers"
import nftAbi from "../constants/EtherealNFTs.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState, React } from "react"

export default function SellPage() {
    const { chainId, account, isWeb3Enabled } = useMoralis() // here it is in 0x...
    const chainIdDecimal = chainId ? parseInt(chainId).toString() : null
    const marketplaceAddress = chainId ? networkMapping[chainIdDecimal].NftMarketplace[0] : null

    const [nftAddress, setNftAddress] = useState("")
    const [tokenId, setTokenId] = useState("")
    const [priceListing, setPriceListing] = useState("")

    const [proceeds, setProceeds] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    const handleChangeNftAddress = (e) => {
        setNftAddress(e.target.value)
    }

    const handleChangePriceListing = (e) => {
        setPriceListing(e.target.value)
    }

    const handleChangeTokenId = (e) => {
        setTokenId(e.target.value)
    }

    const isValidNumber = (value) => value !== "" && !isNaN(value) && parseFloat(value) > 0
    const isValid = (value) => value !== "" && !isNaN(value)

    function handleSubmitClick() {
        if (!isWeb3Enabled) {
            dispatch({
                type: "error",
                title: "Web3 Connection failed",
                message: "Please connect to Web3 to interact",
                position: "topR",
            })
        } else if (isValid(nftAddress) && isValidNumber(tokenId) && isValidNumber(priceListing)) {
            approveAndList()
        } else if (dispatch) {
            console.log("We doing shitty stuff")
            dispatch({
                type: "warning",
                title: "Listing failed",
                message: "All fields are required and should be a positive number.",
                position: "topR",
            })
        }
    }

    async function approveAndList() {
        const price = ethers.utils.parseUnits(priceListing, "ether").toString()

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
        if (isWeb3Enabled) {
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
    }

    useEffect(() => {
        setupUI()
    }, [isWeb3Enabled])

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
            <h1>
                {isWeb3Enabled ? (
                    <a></a>
                ) : (
                    <div className="text-[#EF4444] font-extrabold mt-[-50px]">
                        Please connect to Web3
                    </div>
                )}{" "}
            </h1>
            <h1 className="text-[#312dcf] font-bold text-2xl">Sell your NFT</h1>
            <form className="sellForm">
                <label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter NFT Address..."
                        className="sellInput"
                        onChange={handleChangeNftAddress}
                    />
                </label>
                <label>
                    <input
                        type="number"
                        name="name"
                        placeholder="NFT Token ID"
                        className="sellInput"
                        onChange={handleChangeTokenId}
                    />
                </label>
                <label>
                    <input
                        type="number"
                        name="name"
                        placeholder="Price (ETH)"
                        className="sellInput"
                        onChange={handleChangePriceListing}
                    />
                </label>
            </form>

            <Button
                onClick={() => {
                    handleSubmitClick()
                }}
                text="List NFT"
                type="button"
                className="mb-[5%]"
            />
            {proceeds != "0.0" ? (
                <div className="flex flex-col items-center">
                    <div className="text-[#312DCF] font-semibold mb-5">
                        Withdraw {proceeds} ETH proceeds
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
                <div className=" font-medium text-[#94A3B8]">
                    No withdrawable proceeds detected
                </div>
            )}
        </div>
    )
}
