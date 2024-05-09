"use client"

import { animated, config, useReducedMotion, useSpring, useSprings } from "@react-spring/web"
import Link from "next/link"
import { ReactNode, useState } from "react"
import { BsCamera, BsGrid, BsPen } from "react-icons/bs"

const HoverButton = ({
    children,
    icon,
    href
}: {
    children: string
    icon: ReactNode
    href: string
}) => {
    const [hover, setHover] = useState(false)
    const [length, setLength] = useState(0)
    const { l } = useSpring({
        l: hover ? children.length : 0,
        onChange() {
            setLength(l.get())
        },
        config: config.stiff
    })
    return (
        <Link
            href={href}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="flex flex-row gap-2 font-bold p-2 hover:bg-gray-500 hover:bg-opacity-40 rounded"
        >
            {icon}
            {children.slice(0, length)}
        </Link>
    )
}

export default function Homepage() {
    const [clicked, setClicked] = useState(false)
    const [clickCount, setClickCount] = useState(1000)

    useReducedMotion()

    const title = useSpring({
        from: {
            transform: "translate(0px, -60vh)",
            opacity: 0,
            textShadow: "0px 0px 0px #131313"
        },
        to: {
            transform: "translate(0px, 0px)",
            opacity: 1,
            textShadow: "1px 1px 2px #131313",
            scale: clicked ? 0 : 1,
            rotate: clicked ? "360deg" : "0deg"
        },
        onResolve() {
            if (!clicked) return
            setClicked(false)
            setClickCount((c) => c + 1)
        },
        config: config.gentle
    })

    const roles = ["Developer", "Photographer", "Filmmaker"]

    const roleAnimations = useSprings(
        roles.length,
        roles.map((_, index) => ({
            from: {
                transform: "translate(60vw, 0px)",
                opacity: 0
            },
            to: {
                transform: "translate(0px, 0px)",
                opacity: 1
            },
            delay: index * 100 + 250
        }))
    )

    const links = [
        {
            text: "Projects",
            icon: <BsGrid size={25} />,
            href: "#projects"
        },
        {
            text: "Portfolio",
            icon: <BsCamera size={25} />,
            href: "/portfolio"
        },
        {
            text: "Blog",
            icon: <BsPen size={25} />,
            href: "/blog"
        }
    ]

    const linkAnimations = useSprings(
        links.length,
        links.map((_, index) => ({
            from: {
                transform: "translate(-60vw, 0px)",
                opacity: 0
            },
            to: {
                transform: "translate(0px, 0px)",
                opacity: 1
            },
            delay: index * 100 + 500
        }))
    )
    return (
        <div className="h-screen flex justify-center items-center flex-col text-neutral-300">
            <animated.div
                className="font-bold text-4xl select-none"
                style={title}
                onClick={() => !clicked && setClicked(true)}
            >
                TKDKid{clickCount}
            </animated.div>
            {roleAnimations.map((style, index) => (
                <animated.button
                    key={roles[index]}
                    className="font-bold text-lg px-3 py-1 hover:bg-gray-500 hover:bg-opacity-40 rounded"
                    style={style}
                >
                    {roles[index]}
                </animated.button>
            ))}
            <div className="flex flex-row-reverse">
                {linkAnimations.map((style, index) => (
                    <animated.div key={links[index].text} style={style}>
                        <HoverButton icon={links[index].icon} href={links[index].href}>
                            {links[index].text}
                        </HoverButton>
                    </animated.div>
                ))}
            </div>
        </div>
    )
}
