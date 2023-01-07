import { ConnectButton } from "web3uikit"
import Link from "next/link"
import React from "react"

export default function Header() {
    return (
        <nav className="flex flex-row px-24 pl-28 justify-between items-center	">
            <h1 className="py-4 text-5xl text-deepblue tracking-tighter font-medium">
                {" "}
                <a className="font-extrabold">NFT</a>Marketplace
            </h1>
            <div className="flex flex-row font-semibold	items-center text-deepblue text-xl ">
                <Link href="/" className="mr-4 p-6">
                    Explore
                </Link>
                <div className="mr-4 w-full bg-gradient-to-r from-deepblue to-springgreen rounded-full p-1">
                    <Link
                        href="/sell-page"
                        className="flex h-full w-full items-center justify-center bg-white rounded-full back px-3 py-1.5"
                    >
                        Sell NFTs
                    </Link>
                </div>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
