import { animated, config, useReducedMotion, useSpring, useSprings } from "@react-spring/web"
import { NextPage } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ForwardedRef, forwardRef, HTMLProps, ReactNode, useState } from "react"
import { BsGrid, BsLightbulb, BsPen } from "react-icons/bs"
import BlogPost, { Post } from "../components/BlogPost"
import FadeIn from "../components/FadeIn"
import Layout from "../components/Layout"
import { useScroll } from "../hooks/scroll"
import { sanity } from "../lib/sanity"
import styles from "../styles/space.module.scss"

const DynamicOuterSpace = dynamic(() => import("../components/OuterSpace"))

const DynamicRecentActivity = dynamic(() => import("../components/RecentActivity"))

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
        <Link href={href}>
            <a
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="flex flex-row gap-2 font-bold p-2 hover:bg-gray-500 hover:bg-opacity-40 rounded"
            >
                {icon}
                {children.slice(0, length)}
            </a>
        </Link>
    )
}

type HomeProps = {
    posts: Post[]
}

const Home: NextPage<HomeProps> = ({ posts }) => {
    const { scroll } = useScroll()
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

    const roles = ["Web developer", "Backend developer", "Filmmaker"]

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
            text: "Learn",
            icon: <BsLightbulb size={25} />,
            href: "/learn"
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
        <Layout title="TKDKid1000" hideNavbar>
            <div className={styles.spaceBackground}>
                <DynamicOuterSpace hidden={scroll > 500} />
            </div>
            <div className="h-screen flex justify-center items-center flex-col">
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
            <div className="flex flex-col lg:flex-row px-8 md:px-24 lg:px-32 pb-3">
                <div className="flex flex-col dark:text-white lg:w-7/12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Hewo!</h1>
                        <p>
                            My name is TKDKid1000. Well, that&apos;s just an alias, but I go by that
                            online.
                        </p>
                        <br />
                        <p>
                            I wouldn&apos;t call myself a professional, but I&apos;m no ameteur
                            developer.
                        </p>
                        <br />
                        <p>
                            I&apos;m trained mostly on frontend web development. I primarily use
                            React for ui development, but have also dabbled in Vue and Svelte.
                        </p>
                        <br />
                        <p>
                            My other skills and hobbies include solo filmmaking, and backpacking. I
                            also enjoy distance running.
                        </p>
                    </div>
                    <div className="flex items-center py-5">
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                </div>
                <div className="flex flex-col lg:w-5/12">
                    {posts.slice(Math.max(posts.length - 3, 1)).map((p) => (
                        <FadeIn key={p.slug}>
                            <BlogPost post={p} size={"sm"} />
                        </FadeIn>
                    ))}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row px-8 md:px-24 lg:px-32 pb-3">
                {posts.slice(0, 2).map((p, i) => (
                    <FadeIn key={p.slug} delay={i * 100}>
                        <BlogPost post={p} size={"md"} />
                    </FadeIn>
                ))}
            </div>
            <DynamicRecentActivity username="TKDKid1000" />
        </Layout>
    )
}

const P = forwardRef(function P(
    props: HTMLProps<HTMLParagraphElement>,
    ref: ForwardedRef<HTMLParagraphElement>
) {
    return (
        <p className="text-white" ref={ref} {...props}>
            awdad
        </p>
    )
})

export const getStaticProps = async () => {
    const query = `
    *[_type == "post" && !(_id in path("drafts.**"))] | order(_updatedAt desc) {
        title, description,
        "imageUrl": image.asset->url,
        author->{
          name, description,
          "imageUrl": image.asset->url
        }
        ,
        tags, _updatedAt,
        "slug": slug.current
      }[0..6]`
    const posts: Post[] = await sanity.fetch(query)
    return { props: { posts }, revalidate: 300 }
}

export default Home
