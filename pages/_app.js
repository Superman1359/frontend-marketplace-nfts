import "../styles/globals.css"
import Head from "next/head"
import React from "react"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import { NotificationProvider } from "web3uikit"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import PropTypes from "prop-types"

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
}

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/40329/nft-marketplace/v0.0.1",
})

export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="A decentralized NFT Marketplace" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="next-head-count" content="2" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap"
                    rel="stylesheet"
                ></link>
                <lifirefnk rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}
