import { useEffect, useState } from "react"

const useScroll = (): { scroll: number; direction: "up" | "down" } => {
    const [scroll, setScroll] = useState(0)
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up")

    useEffect(() => {
        let prevScroll = window.scrollY
        const handleScroll = () => {
            const scroll = window.scrollY
            const direction = scroll > prevScroll ? "down" : "up"
            if (
                direction !== scrollDirection &&
                (scroll - prevScroll > 10 || scroll - prevScroll < -10)
            )
                setScrollDirection(direction)
            prevScroll = scroll > 0 ? scroll : 0
            setScroll(scroll)
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [scrollDirection])

    return { scroll, direction: scrollDirection }
}

export { useScroll }
