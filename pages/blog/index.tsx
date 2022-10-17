import fs from "fs/promises"
import matter from "gray-matter"
import { GetStaticProps } from "next"
import { serialize } from "next-mdx-remote/serialize"
import path from "path"
import { useEffect } from "react"
import rehypeHighlight from "rehype-highlight"
import BlogPost, { FrontMatter, Post } from "../../components/BlogPost"
import Layout from "../../components/Layout"

const groupList = <T extends unknown>(list: T[], size: number) => {
    const lists: T[][] = []
    const listCount = Math.ceil(list.length / size)
    for (let x = 0; x < listCount; x++) {
        lists.push(list.slice(x * size, x * size + size))
    }
    return lists
}

const BlogIndex = ({ posts }: { posts: Post[] }) => {
    const filteredPosts = posts
        .sort((a, b) => a.frontMatter.created - b.frontMatter.created)
        .reverse()
        .slice(0, 50)
    const postGroups = groupList(filteredPosts, 6)
    useEffect(() => {
        console.log(postGroups)
    }, [postGroups])
    return (
        <Layout title="Blog" className="px-8 md:px-24 lg:px-32 pb-3">
            {postGroups.map((group, index) => (
                <div key={index}>
                    <div className="flex flex-col lg:flex-row">
                        <BlogPost key={group[0].slug} post={group[0]} size={"lg"} />
                        <div className="flex flex-col lg:w-5/12">
                            {group.slice(Math.max(group.length - 3, 1)).map((p) => (
                                <BlogPost key={p.slug} post={p} size={"sm"} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                        {group.slice(1, 3).map((p) => (
                            <BlogPost key={p.slug} post={p} size={"md"} />
                        ))}
                    </div>
                </div>
            ))}
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const files = await fs.readdir(path.resolve("posts"))
    const posts: Post[] = []
    for await (let name of files) {
        const md = await fs.readFile(path.resolve("posts", name), "utf-8")
        const { data: frontMatter, content } = matter(md)

        const { compiledSource: mdx } = await serialize(content, {
            mdxOptions: {
                rehypePlugins: [rehypeHighlight]
            }
        })

        const slug = name.split(".")[0].replace(/[^a-z0-9+]+/gi, "-")

        posts.push({
            frontMatter: frontMatter as FrontMatter,
            slug,
            mdx
        })
    }
    return { props: { posts }, revalidate: 300 }
}

export default BlogIndex
