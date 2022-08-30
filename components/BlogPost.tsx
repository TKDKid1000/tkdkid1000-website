import Image from "next/image"
import Link from "next/link"
import React from "react"

type Post = {
    frontMatter: {
        title: string
        author: string
        created: number
        description: string
        image: string
        tags: string[]
    }
    slug: string
    mdx: string
}

type BlogPostProps = {
    size: "sm" | "md" | "lg"
    post: Post
}

const BlogPost = ({ post, size }: BlogPostProps) => {
    switch (size) {
        case "lg": {
            return (
                <div className="flex flex-col dark:text-white lg:w-7/12">
                    <div className="flex py-4 w-full h-2/3 lg:w-9/12 transition-all">
                        <Link href={`/blog/${post.slug}`}>
                            <a className="flex">
                                <Image
                                    src={post.frontMatter.image}
                                    alt="Blog post image"
                                    width={1000}
                                    height={600}
                                    className="rounded-md object-cover duration-500 hover:scale-105"
                                />
                            </a>
                        </Link>
                    </div>
                    <div>
                        <span className="w-max font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400">
                            {post.frontMatter.tags[0] || ""}
                        </span>
                        <h1 className="text-5xl font-bold mb-2">
                            <Link href={`/blog/${post.slug}`}>
                                <a className="hover:text-blue-400">{post.frontMatter.title}</a>
                            </Link>
                        </h1>
                        <p className="font-light text-lg my-2 text-gray-400">
                            {post.frontMatter.description}
                        </p>
                        <div className="flex flex-row items-center">
                            <div className="font-semibold text-sm mr-2 dark:text-white">
                                {post.frontMatter.author}
                            </div>
                            <div className="font-thin font-mono text-slate-500 text-xs">
                                {new Date(post.frontMatter.created).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center py-5">
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                </div>
            )
        }
        case "md": {
            return (
                <div className="flex flex-col p-3 sm:w-1/2">
                    <div className="flex flex-col">
                        <div className="mr-3">
                            <Link href={`/blog/${post.slug}`}>
                                <a>
                                    <Image
                                        src={post.frontMatter.image}
                                        alt="Blog post image"
                                        width={600}
                                        height={300}
                                        className="rounded-md object-cover duration-500 hover:scale-105"
                                    />
                                </a>
                            </Link>
                        </div>
                        <div className="flex flex-col w-3/4">
                            <span className="w-max font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400">
                                {post.frontMatter.tags[0] || ""}
                            </span>
                            <h1 className="text-xl font-semibold dark:text-white">
                                <Link href={`/blog/${post.slug}`}>
                                    <a className="hover:text-blue-400">{post.frontMatter.title}</a>
                                </Link>
                            </h1>
                            <p className="font-light text-sm my-2 text-gray-400">
                                {post.frontMatter.description}
                            </p>
                            <div className="font-semibold text-sm mb-0.5 dark:text-white">
                                {post.frontMatter.author}
                            </div>
                            <div className="font-thin font-mono text-slate-500 text-xs">
                                {new Date(post.frontMatter.created).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center py-5">
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                </div>
            )
        }
        case "sm": {
            return (
                <div className="flex flex-col p-3">
                    <div className="flex flex-row">
                        <div className="mr-3">
                            <Link href={`/blog/${post.slug}`}>
                                <a>
                                    <Image
                                        src={post.frontMatter.image}
                                        alt="Blog post image"
                                        width={168}
                                        height={176}
                                        className="rounded-md object-cover duration-500 hover:scale-105"
                                    />
                                </a>
                            </Link>
                        </div>
                        <div className="flex flex-col w-3/4">
                            <span className="w-max font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400">
                                {post.frontMatter.tags[0] || ""}
                            </span>
                            <h1 className="text-xl font-semibold dark:text-white">
                                <Link href={`/blog/${post.slug}`}>
                                    <a className="hover:text-blue-400">{post.frontMatter.title}</a>
                                </Link>
                            </h1>
                            <p className="font-light text-sm my-2 text-gray-400">
                                {post.frontMatter.description}
                            </p>
                            <div className="font-semibold text-sm mb-0.5 dark:text-white">
                                {post.frontMatter.author}
                            </div>
                            <div className="font-thin font-mono text-slate-500 text-xs">
                                {new Date(post.frontMatter.created).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center py-5">
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                </div>
            )
        }
    }
}

export type { BlogPostProps }

export default BlogPost
