"use client"

import { cloneElement, CSSProperties, ReactElement, useEffect, useRef, useState } from "react"

type FadeInProps = {
    children: ReactElement
    delay?: number
}

const FadeIn = ({ children, delay }: FadeInProps) => {
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const element = ref.current
        if (!element) return
        const observer = new IntersectionObserver((entries) =>
            entries.forEach(
                (entry) =>
                    !visible && setTimeout(() => setVisible(entry.isIntersecting), delay || 0)
            )
        )
        observer.observe(element)
        return () => observer.unobserve(element)
    }, [ref, visible, delay])

    return cloneElement(children, {
        ref,
        style: {
            transition: "all ease-in-out 0.5s",
            opacity: visible ? 1 : 0,
            translate: visible ? "0 0" : "0 10%"
        } as CSSProperties
    })
    // return (
    //     <div
    //         className={`opacity-0 -translate-y-1/2 invisible transition-all duration-1000 ease-out ${
    //             visible && "opacity-100 -translate-y-0 visible"
    //         } ${className}`}
    //         ref={ref}
    //         {...rest}
    //     >
    //         {children}
    //     </div>
    // )
}

export default FadeIn
