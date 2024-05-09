import dynamic from "next/dynamic"
import BlogPost, { Post } from "../components/BlogPost"
import FadeIn from "../components/FadeIn"
import Homepage from "../components/Homepage"
import { sanity } from "../lib/sanity"
import styles from "../styles/space.module.scss"

const OuterSpace = dynamic(() => import("../components/OuterSpace"))
const RecentActivity = dynamic(() => import("../components/RecentActivity"))

async function getData() {
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
    return posts
}

export default async function Home() {
    const posts = await getData()
    return (
        <div>
            <div className={styles.spaceBackground}>
                <OuterSpace hiddenThreshold={500} />
            </div>
            <Homepage />
            <div className="flex flex-col lg:flex-row px-6 xl:px-32 pb-3">
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
            <div className="flex flex-col sm:flex-row px-8 pb-3">
                {posts.slice(0, 2).map((p, i) => (
                    <FadeIn key={p.slug} delay={i * 100}>
                        <BlogPost post={p} size={"md"} />
                    </FadeIn>
                ))}
            </div>
            <RecentActivity username="TKDKid1000" />
        </div>
    )
}
