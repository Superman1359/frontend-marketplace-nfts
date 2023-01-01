import styles from "../styles/Home.module.css"
import NftItem from "../components/NftItem"

export default function Home() {
    const {
        data,
        listedNfts,
        isFetching: fetchingListedNfts,
    } = useMoralisQuery("ActiveItem", (query) => query.limit(10).descending("tokenId"))
    return (
        <div className={styles.container}>
            {fetchingListedNfts ? (
                <div>Loading... </div>
            ) : (
                listedNfts.map((nft) => {
                    console.log(nft.attributes)
                    const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                        nft.attributes
                    return (
                        <div>
                            Price: {price}, nftAddress: {nftAddress}, tokenId: {tokenId},
                            marketplaceAddress: {marketplaceAddress}, seller: {seller}
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
            )}
        </div>
    )
}
