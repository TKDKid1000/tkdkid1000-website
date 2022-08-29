import type { AppProps } from "next/app"
import React from "react"
import "../styles/global.scss"

const App = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />

export default App
