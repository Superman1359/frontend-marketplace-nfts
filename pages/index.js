import styles from "../styles/Home.module.css"
import NftItem from "../components/NftItem"
import { useMoralis } from "react-moralis"

export default function Home() {
    const { isWeb3Enabled } = useMoralis()
    const {
        data,
        listedNfts,
        isFetching: fetchingListedNfts,
    } = useMoralisQuery("ActiveItem", (query) => query.limit(10).descending("tokenId"))
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading... </div>
                    ) : (
                        listedNfts.map((nft) => {
                            console.log(nft.attributes)
                            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                                nft.attributes
                            return (
                                <div>
                                    <NftItem
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}:${tokenId}`}
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
