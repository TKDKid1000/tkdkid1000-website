import { Metadata, Viewport } from "next"
import { ReactNode } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import favicon from "../public/img/icon.png"
import "../styles/global.scss"

export const metadata: Metadata = {
    title: "TKDKid1000",
    description: "Web developer, backend developer, filmmaker, student, photographer.",
    icons: favicon.src
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-200 dark:bg-zinc-900">
                <Navbar />
                <main>
                    {children}
                    <Footer />
                </main>
            </body>
        </html>
    )
}
