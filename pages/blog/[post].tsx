import fs from "fs/promises"
import matter from "gray-matter"
import { GetStaticPaths, GetStaticProps } from "next"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Image from "next/image"
import path from "path"
import React from "react"
import rehypeHighlight from "rehype-highlight"
import { FrontMatter, Post } from "."
import Layout from "../../components/Layout"

const PostPage = ({ post }: { post: Post }) => {
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
                <div className="markup">
                    <MDXRemote compiledSource={post.mdx} />
                </div>
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
    const postSlug = ctx.params ? (ctx.params.post as string) : undefined

    if (!postSlug) {
        return {
            notFound: true
        }
    }

    for await (let name of files) {
        const md = await fs.readFile(path.resolve("posts", name), "utf-8")
        const { data: frontMatter, content } = matter(md)

        const { compiledSource: mdx } = await serialize(content, {
            mdxOptions: {
                rehypePlugins: [rehypeHighlight]
            }
        })

        const slug = name.split(".")[0].replace(/[^a-z0-9+]+/gi, "-")

        if (slug !== postSlug) continue

        post = {
            frontMatter: frontMatter as FrontMatter,
            slug,
            mdx
        }
    }

    if (!post) {
        return {
            notFound: true
        }
    }

    return { props: { post } }
}

export default PostPage
