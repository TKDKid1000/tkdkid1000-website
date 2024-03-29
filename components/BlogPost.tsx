import Image from "next/image"
import Link from "next/link"
import { ForwardedRef, forwardRef, HTMLAttributes } from "react"
import { sanityImage } from "../lib/sanity"

type Author = {
    name: string
    description: string
    imageUrl: string
}

type Post = {
    title: string
    slug: string
    author: Author
    _updatedAt: string
    description: string
    imageUrl: string
    tags: string[]
    related?: Post[]
    content: string
}

type BlogPostProps = HTMLAttributes<HTMLDivElement> & {
    size: "sm" | "md" | "lg" | "xs"
    post: Post
}

const BlogPost = forwardRef(function BlogPost(
    { post, size, ...rest }: BlogPostProps,
    ref: ForwardedRef<HTMLDivElement>
) {
    switch (size) {
        case "lg": {
            return (
                <div
                    className="flex flex-col dark:text-white lg:w-7/12 mt-2 mr-2"
                    ref={ref}
                    {...rest}
                >
                    <div className="flex py-4 h-64 transition-all relative rounded-md overflow-hidden">
                        <Link href={`/blog/${post.slug}`}>
                            <Image
                                src={sanityImage(post.imageUrl).size(1024, 576).url()}
                                alt="Blog post image"
                                fill
                                placeholder="blur"
                                blurDataURL={sanityImage(post.imageUrl)
                                    .size(1024, 576)
                                    .blur(50)
                                    .toString()}
                                className="object-cover duration-500 hover:scale-105"
                            />
                        </Link>
                    </div>
                    <div>
                        <span className="w-max font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400">
                            {post.tags[0] || ""}
                        </span>
                        <h1 className="text-5xl font-bold mb-2">
                            <Link href={`/blog/${post.slug}`} className="hover:text-blue-400">
                                {post.title}
                            </Link>
                        </h1>
                        <p className="font-light text-lg my-2 text-gray-400">{post.description}</p>
                        <div className="flex flex-row items-center">
                            <div className="font-semibold text-sm mr-2 dark:text-white">
                                {post.author.name}
                            </div>
                            <div className="font-thin font-mono text-slate-500 text-xs">
                                {new Date(post._updatedAt).toLocaleString("en-US", {
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
                <div className="flex flex-col p-3 sm:w-1/2" ref={ref} {...rest}>
                    <div className="flex flex-col">
                        <div className="h-60 mr-3 relative rounded-md overflow-hidden">
                            <Link href={`/blog/${post.slug}`}>
                                <Image
                                    src={sanityImage(post.imageUrl).width(640).height(360).url()}
                                    alt="Blog post image"
                                    fill
                                    blurDataURL={sanityImage(post.imageUrl)
                                        .size(640, 360)
                                        .blur(50)
                                        .toString()}
                                    className="rounded-md object-cover duration-500 hover:scale-105"
                                />
                            </Link>
                        </div>
                        <div className="flex flex-col w-3/4">
                            <span className="w-max font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400">
                                {post.tags[0] || ""}
                            </span>
                            <h1 className="text-xl font-semibold dark:text-white">
                                <Link href={`/blog/${post.slug}`} className="hover:text-blue-400">
                                    {post.title}
                                </Link>
                            </h1>
                            <p className="font-light text-sm my-2 text-gray-400">
                                {post.description}
                            </p>
                            <div className="font-semibold text-sm mb-0.5 dark:text-white">
                                {post.author.name}
                            </div>
                            <div className="font-thin font-mono text-slate-500 text-xs">
                                {new Date(post._updatedAt).toLocaleString("en-US", {
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
                <div className="flex flex-col mt-2 lg:ml-2" ref={ref} {...rest}>
                    <div className="flex md:flex-row flex-col md:justify-evenly lg:justify-between">
                        <div className="md:w-40 md:h-40 relative rounded-md overflow-hidden">
                            <Link href={`/blog/${post.slug}`}>
                                <Image
                                    src={sanityImage(post.imageUrl).width(640).height(360).url()}
                                    alt="Blog post image"
                                    fill
                                    blurDataURL={sanityImage(post.imageUrl)
                                        .size(640, 360)
                                        .blur(50)
                                        .toString()}
                                    className="rounded-md object-cover duration-500 hover:scale-105"
                                />
                            </Link>
                        </div>
                        <div className="flex flex-col md:w-7/12">
                            <span className="w-max font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400">
                                {post.tags[0] || ""}
                            </span>
                            <h1 className="text-xl font-semibold dark:text-white">
                                <Link href={`/blog/${post.slug}`} className="hover:text-blue-400">
                                    {post.title}
                                </Link>
                            </h1>
                            <p className="font-light text-sm my-2 text-gray-400">
                                {post.description}
                            </p>
                            <div className="font-semibold text-sm mb-0.5 dark:text-white">
                                {post.author.name}
                            </div>
                            <div className="font-thin font-mono text-slate-500 text-xs">
                                {new Date(post._updatedAt).toLocaleString("en-US", {
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
        case "xs": {
            return (
                <div className="flex flex-col p-3" ref={ref} {...rest}>
                    <div className="flex flex-col">
                        <div className="mr-3">
                            <Link href={`/blog/${post.slug}`}>
                                <Image
                                    src={post.imageUrl}
                                    alt="Blog post image"
                                    // layout="responsive"
                                    width={300}
                                    height={150}
                                    className="rounded-md object-cover duration-500 hover:scale-105"
                                />
                            </Link>
                        </div>
                        <div className="flex flex-col w-3/4">
                            <span className="w-max font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400">
                                {post.tags[0] || ""}
                            </span>
                            <h1 className="text-xl font-semibold dark:text-white">
                                <Link href={`/blog/${post.slug}`} className="hover:text-blue-400">
                                    {post.title}
                                </Link>
                            </h1>
                            <p className="font-light text-sm my-2 text-gray-400">
                                {post.description}
                            </p>
                            <div className="font-semibold text-sm mb-0.5 dark:text-white">
                                {post.author.name}
                            </div>
                            <div className="font-thin font-mono text-slate-500 text-xs">
                                {new Date(post._updatedAt).toLocaleString("en-US", {
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
})

export type { BlogPostProps, Post, Author }

export default BlogPost
