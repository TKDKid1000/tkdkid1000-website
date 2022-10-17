import { useEffect, useState } from "react"

const useScroll = () => {
    const [scroll, setScroll] = useState(0)

    const handleScroll = () => setScroll(window.scrollY)

    useEffect(() => {
        const onScroll = window.onscroll
        window.onscroll = handleScroll
        return () => {
            window.onscroll = onScroll
        }
    }, [])

    return scroll
}

export { useScroll }
