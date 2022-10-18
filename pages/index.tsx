import { animated, config, useSpring, useSprings } from "@react-spring/web"
import Image from "next/image"
import BlogPost, { Post } from "../components/BlogPost"
import Layout from "../components/Layout"
import OuterSpace from "../components/OuterSpace"
import RecentActivity from "../components/RecentActivity"
import { useScroll } from "../hooks/scroll"
import { sanity } from "../lib/sanity"
import styles from "../styles/space.module.scss"

const Home = ({ posts }: { posts: Post[] }) => {
    const scroll = useScroll()

    const title = useSpring({
        from: {
            transform: "translate(0px, -60vh)",
            opacity: 0
        },
        to: {
            transform: "translate(0px, 0px)",
            opacity: 1
        },
        config: config.gentle,
        delay: 1000
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
            delay: index * 100 + 1500
        }))
    )

    return (
        <Layout title="TKDKid1000" hideNavbar>
            <div className={styles.spaceBackground}>
                <OuterSpace hidden={scroll > 500} />
            </div>
            <div className="h-screen flex justify-center items-center flex-col">
                <animated.div className="font-bold text-4xl select-none" style={title}>
                    TKDKid1000
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
            </div>
            <div className="flex flex-col lg:flex-row px-8 md:px-24 lg:px-32 pb-3">
                <div className="flex flex-col dark:text-white lg:w-7/12">
                    <div className="flex p-4 w-full h-1/3 lg:w-9/12 transition-all">
                        <Image
                            src="/img/wave.svg"
                            alt="Header image"
                            width={1000}
                            height={600}
                            className="rounded-md object-cover duration-500 hover:scale-105"
                        />
                    </div>
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
                        <BlogPost key={p.slug} post={p} size={"sm"} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row px-8 md:px-24 lg:px-32 pb-3">
                {posts.slice(0, 2).map((p) => (
                    <BlogPost key={p.slug} post={p} size={"md"} />
                ))}
            </div>
            <RecentActivity username="TKDKid1000" />
        </Layout>
    )
}

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
