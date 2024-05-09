"use client"

import { useEffect, useState } from "react"

const useDarkMode = () => {
    const [dark, setDark] = useState(false)
    useEffect(() => {
        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)")
        setDark(matchMedia.matches)
        matchMedia.addEventListener("change", (e) => {
            setDark(e.matches)
        })
    }, [])
    return dark
}

export { useDarkMode }
