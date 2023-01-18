import { useNotification } from "web3uikit"
import Image from "next/image"
import EtherealSplash from "../components/assets/splash_ethereal.png"
import etherealNftAbi from "../constants/EtherealNFTs.json"
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState, React } from "react"

export default function SellPage() {
    const { chainId, isWeb3Enabled } = useMoralis() // here it is in 0x...
    const chainIdDecimal = chainId ? parseInt(chainId).toString() : null
    let etherealAddress
    const dispatch = useNotification()
    useEffect(() => {
        if (chainIdDecimal in networkMapping) {
            etherealAddress = chainId ? networkMapping[chainIdDecimal].EtherealNFTs[0] : null
        }
    }, [chainIdDecimal, networkMapping])

    const [isNftMinted, setIsNftMinted] = useState(false)
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [imageURI, setImageURI] = useState("")

    const [tokenIdMinted, setTokenIdMinted] = useState(0)

    const { runContractFunction } = useWeb3Contract()

    const { runContractFunction: tokenURI } = useWeb3Contract({
        abi: etherealNftAbi,
        contractAddress: etherealAddress,
        functionName: "tokenURI",
        params: { _tokenId: tokenIdMinted },
    })

    useEffect(() => {
        if (tokenIdMinted !== 0) {
            getNftInformation()
        }
    }, [tokenIdMinted])

    async function handleSubmitClick() {
        if (isWeb3Enabled && chainIdDecimal in networkMapping) {
            const mintOptions = {
                abi: etherealNftAbi,
                contractAddress: etherealAddress,
                functionName: "mintNFT",
                msgValue: "10000000000000000",
            }
            await runContractFunction({
                params: mintOptions,
                onSuccess: (tx) => handleMintSuccess(tx),
                onError: (error) => {
                    console.log(error)
                    dispatch({
                        type: "error",
                        title: "Minting Failed",
                        message: "Please check console for error",
                        position: "topR",
                    })
                },
            })
        } else {
            dispatch({
                type: "error",
                message: "Please connect to Goerli testnet",
                title: "Web3 Not Connected",
                position: "topR",
            })
        }
    }

    async function handleMintSuccess(tx) {
        const mintTxReceipt = await tx.wait(1)
        dispatch({
            type: "success",
            message: "NFT Minted!",
            title: "Your Ethereal has been minted",
            position: "topR",
        })
        const tokenId = Number(mintTxReceipt.events[0].args.tokenId)
        if (!isNaN(tokenId)) {
            setTokenIdMinted(tokenId)
            await getNftInformation()
            setIsNftMinted(false)
        } else {
            console.log("error")
        }
    }

    async function getNftInformation() {
        const nftUri = await tokenURI()
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
        <div className="flex px-24 pl-28 mt-[5%] justify-between items-start h-full">
            <div className="w-[40%] ">
                <h1 className="font-extrabold  text-[#312dcf] text-3xl mb-[5%]">
                    Unlock the Fantasy of the Ethereal Collection
                </h1>
                <p className="text-[#5e6ca1] font-medium mb-[3%]">
                    Introducing the Ethereal collection - a series of one-of-a-kind NFTs created
                    with the help of Midjourney. Each Ethereal NFT is a unique blend of gradient
                    colors, shades, and smoky aspects that evoke a sense of fantasy and mystery.
                </p>
                <p className="text-[#5e6ca1] font-medium mb-[5%]">
                    Please note that the Ethereal NFT collection is for educational and testing
                    purposes only, and is not intended for any commercial use. The collection
                    serves as a demonstration of the capabilities of the marketplace, and I hope
                    that it will inspire and excite you about the possibilities of NFTs and digital
                    art.
                </p>
                <p className="text-[#312dcf] font-semibold text-lg	mb-[5%]">
                    Mint your very own Ethereal NFT for 0.01 ETH and interact with the marketplace
                    !
                </p>
                {!imageURI ? (
                    <div className="flex flex-row justify-center mb-[10%]">
                        <button
                            className="font-bold text-xl flex  justify-center "
                            id="buy_button_modal"
                            onClick={handleSubmitClick}
                        >
                            <a className="px-[20px] py-[2px]">Mint</a>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-row justify-center mb-[10%]">
                        <button className="font-bold text-xl flex button_minted pointer-events-none justify-center ">
                            <a className="px-[20px] py-[2px]">Minted</a>
                        </button>
                    </div>
                )}
                {!imageURI ? (
                    <div className="flex flex-col items-center ">
                        <div className="text-[#312dcf] font-medium">
                            Your NFT information will appear here after the mint
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="text-deepblue flex flex-col justify-center items-center w-full ">
                            <div className="font-bold flex flex-row pb-1 pl-2 text-2xl mb-[1.5%]">
                                <div>#{tokenIdMinted}</div>
                                <div className="pl-2 pb-1">{tokenName}</div>
                            </div>
                            <h2 className=" pl-2 text-2lg font-medium mb-[1.5%]">
                                <span className="font-semibold">{tokenDescription}</span>
                            </h2>
                            <h2 className=" pl-2 text-2lg font-medium mb-[1.5%]">
                                TokenId: <span className="font-semibold">#{tokenIdMinted}</span>
                            </h2>
                            <h2 className=" pl-2 text-2lg font-medium mb-[1.5%]">
                                Address: <span className="font-semibold">{etherealAddress}</span>
                            </h2>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-1/2 flex items-end justify-center ">
                <div className="w-[80%] ">
                    {imageURI ? (
                        <div className="flex flex-col justify-center items-center">
                            <Image
                                className="rounded-[49px] mb-[4%]"
                                unoptimized
                                loader={() => imageURI}
                                src={imageURI}
                                width={screenWidth}
                                height={200}
                                alt="Image of the NFT"
                            />
                            <h1 className="font-extrabold  text-[#312dcf] text-3xl mb-[5%]">
                                Your Ethereal
                            </h1>
                        </div>
                    ) : (
                        <Image className="rounded-[49px]" src={EtherealSplash} alt="Nft minted" />
                    )}
                </div>
            </div>
        </div>
    )
}
