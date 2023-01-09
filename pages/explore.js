import NftItem from "../components/NftItem"
import React from "react"
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainIdDecimal = chainId ? parseInt(chainId).toString() : null
    const marketplaceAddress = chainId ? networkMapping[chainIdDecimal].NftMarketplace[0] : null

    const { loading, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="pt-2 h-full px-24 pl-28">
            <h1 className="pt-10 pb-5 font-bold text-2xl text-deepblue">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div className="text-deepblue font-extrabold pr-8">Loading... </div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <div key={`${nftAddress}:${tokenId}`}>
                                    <NftItem
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}:${tokenId}:`}
                                    ></NftItem>
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 not connected </div>
                )}
            </div>
        </div>
    )
}
