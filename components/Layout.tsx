import Head from "next/head"
import { HTMLProps, ReactNode } from "react"
import Footer from "./Footer"
import Navbar from "./Navbar"

type LayoutProps = {
    title: string
    children: ReactNode | ReactNode[]
    hideNavbar?: boolean
} & HTMLProps<HTMLDivElement>

const Layout = ({ title, children, hideNavbar, ...rest }: LayoutProps) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" href="/img/head.png" />
            </Head>
            {!hideNavbar && <Navbar />}
            <main {...rest}>
                <div>{children}</div>
                <Footer />
            </main>
        </>
    )
}

export default Layout
