import { Head, Html, Main, NextScript } from "next/document"
import React from "react"

export default function Document() {
    return (
        <Html>
            <Head />
            <body className="bg-gray-200 dark:bg-zinc-900">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
