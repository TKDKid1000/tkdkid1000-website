import fs from "fs/promises"
import matter from "gray-matter"
import { GetStaticPaths, GetStaticProps } from "next"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Image from "next/image"
import path from "path"
import { ReactNode, useState } from "react"
import rehypeHighlight from "rehype-highlight"
import BlogPost, { FrontMatter, Post } from "../../components/BlogPost"
import Comments from "../../components/Comments"
import Layout from "../../components/Layout"

const Spoiler = ({ children }: { children: ReactNode | ReactNode[] }) => {
    const [visible, setVisible] = useState(false)
    return (
        <span
            onClick={() => setVisible(true)}
            className={`bg-gray-300 dark:bg-gray-700 cursor-pointer ${
                !visible && "text-transparent"
            }`}
        >
            {children}
        </span>
    )
}

const PostPage = ({ post, relatedPosts }: { post: Post; relatedPosts: Post[] }) => {
    return (
        <Layout title={post.frontMatter.title}>
            <div className="flex flex-col lg:px-24">
                <div className="mt-12 md:mt-24">
                    {post.frontMatter.tags.map((tag) => (
                        <span
                            key={tag}
                            className="w-min font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400 mr-4"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="my-5">
                    <h1 className="text-5xl font-bold text-black dark:text-white">
                        {post.frontMatter.title}
                    </h1>
                </div>
                <div className="text-gray-400 mb-16">{post.frontMatter.description}</div>
                <div className="w-full mb-4">
                    <Image
                        src={"/" + post.frontMatter.image}
                        alt="Blog post image"
                        layout="responsive"
                        height={100}
                        width={200}
                        className="rounded-md object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="font-thin font-mono text-sm text-slate-500">Author</div>
                    <div className="flex flex-row justify-between items-center">
                        <div className="text-black dark:text-white font-bold text-,d">
                            {post.frontMatter.author}
                        </div>
                        <div className="font-thin font-mono text-slate-400 text-sm p-1 pl-6 border-l-[0.25px] border-slate-400 border-solid">
                            {new Date(post.frontMatter.created).toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </div>
                    </div>
                    <div className="flex items-center py-5">
                        <div className="flex-grow border-t border-blue-400"></div>
                    </div>
                </div>
                <div className="markup whitespace-pre-wrap break-words">
                    <MDXRemote
                        compiledSource={post.mdx}
                        components={{
                            Spoiler
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col mt-12 lg:mt-24">
                <h2 className="flex-col text-black dark:text-white text-2xl font-bold">
                    Related Posts
                </h2>
                <div className="flex items-center py-5">
                    <div className="flex-grow border-t-2 border-gray-400"></div>
                </div>
                <div className="flex flex-col lg:flex-row justify-evenly">
                    {relatedPosts.map((p) => (
                        <div key={p.slug} className="lg:w-1/3">
                            <BlogPost post={p} size={"xs"} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="py-5">
                <Comments postId={post.slug} />
            </div>
        </Layout>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const files = await fs.readdir(path.resolve("posts"))
    const posts: string[] = []
    for await (let name of files) {
        const slug = name.split(".")[0].replace(/[^a-z0-9+]+/gi, "-")
        posts.push(slug)
    }
    return {
        paths: posts.map((slug) => ({
            params: {
                post: slug
            }
        })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const files = await fs.readdir(path.resolve("posts"))
    let post: Post | null = null
    let relatedPosts: Post[] = []
    const postSlug = ctx.params ? (ctx.params.post as string) : undefined

    if (!postSlug) {
        return {
            notFound: true
        }
    }

    for await (let name of files) {
        const md = await fs.readFile(path.resolve("posts", name), "utf-8")
        const { data, content } = matter(md)
        const frontMatter = data as FrontMatter

        const { compiledSource: mdx } = await serialize(content, {
            mdxOptions: {
                rehypePlugins: [rehypeHighlight]
            }
        })

        const slug = name.split(".")[0].replace(/[^a-z0-9+]+/gi, "-")

        relatedPosts.push({
            frontMatter,
            slug,
            mdx
        })

        if (slug !== postSlug) continue

        post = {
            frontMatter,
            slug,
            mdx
        }
    }

    relatedPosts = relatedPosts.filter((p) => post.frontMatter.related.includes(p.slug))

    if (!post) {
        return {
            notFound: true
        }
    }

    return { props: { post, relatedPosts } }
}

export default PostPage
