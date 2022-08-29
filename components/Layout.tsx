import Head from "next/head"
import React, { ReactNode } from "react"
import Footer from "./Footer"
import Navbar from "./Navbar"

type LayoutProps = {
    title: string
    children: ReactNode | ReactNode[]
}

const Layout = ({ title, children }: LayoutProps) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" href="/img/head.png" />
            </Head>
            <Navbar />
            <main>
                <div>
                    <div className="px-8 md:px-24 lg:px-32 pb-3">{children}</div>
                    <Footer />
                </div>
            </main>
        </>
    )
}

export default Layout
