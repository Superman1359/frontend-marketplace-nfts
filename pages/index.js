import { React } from "react"
import Link from "next/link"
import Image from "next/image"
import ImgLandingPage from "../components/assets/Illustration.png"

export default function LandingPage() {
    return (
        <div id="container_landing_page" className="flex flex-row justify-start">
            <div className="w-[59%] pl-28 flex flex-col justify-center items-center h-full mr-12 responsive-lp-left">
                <div className="rp-sm-ali-it-cent">
                    <div className="font-extrabold text-deepblue text-[3em] mb-6 rp-mb-3">
                        <h1>
                            Explore the Boundaries of{" "}
                            <span className="text-flashgreen">Digital Art</span> and{" "}
                            <span className="text-flashgreen">Collectibility</span>
                        </h1>
                    </div>
                    <p className="text-[#5F5CE8] font-medium text-[1.25em] mb-10">
                        Discover and collect the art of the future at our NFT marketplace. Explore
                        a wide range of digital art and collectibles from talented artists and
                        creators. Find your next favorite piece or trade with other collectors to
                        build a great place. Join the community of NFT fans and get in on the
                        action today!
                    </p>
                    <Link
                        href="/explore"
                        className="font-semibold px-8 py-2  mr-[15%]  text-white button_lp"
                    >
                        Explore
                    </Link>
                    <Link
                        href="https://github.com/julienbrs/nft-marketplace"
                        className="font-semibold px-8 py-2 text-deepblue button_lp_op"
                    >
                        Check code
                    </Link>
                </div>
            </div>
            <div className="flex flex-col justify-end items-end w-[70%] mb-[5%] image-rp">
                <Image src={ImgLandingPage} alt="Image of the NFT" />
            </div>
        </div>
    )
}
