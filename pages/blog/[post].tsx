import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Image from "next/image"
import Link from "next/link"
import rehypeHighlight from "rehype-highlight"
import BlogPost, { Post } from "../../components/BlogPost"
import Comments from "../../components/Comments"
import Layout from "../../components/Layout"
import Terminology from "../../components/learn/Terminology"
import Spoiler from "../../components/Spoiler"
import { sanity } from "../../lib/sanity"

type PostPageProps = {
    post: Post
}

const PostPage: NextPage<PostPageProps> = ({ post }) => {
    const relatedPosts = post.related
    return (
        <Layout title={post.title} className="px-8 md:px-24 lg:px-32 pb-3">
            <div className="flex flex-col lg:px-24">
                <div className="mt-12 md:mt-24">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="w-min font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400 mr-4"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="my-5">
                    <h1 className="text-5xl font-bold text-black dark:text-white">{post.title}</h1>
                </div>
                <div className="text-gray-400 mb-16">{post.description}</div>
                <div className="w-full mb-4">
                    <Image
                        src={post.imageUrl}
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
                            {post.author.name}
                        </div>
                        <div className="font-thin font-mono text-slate-400 text-sm p-1 pl-6 border-l-[0.25px] border-slate-400 border-solid">
                            {new Date(post._updatedAt).toLocaleString("en-US", {
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
                        compiledSource={post.content}
                        components={{
                            Spoiler,
                            Link,
                            Terminology
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
                    {relatedPosts?.map((p) => (
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
    const query = `*[_type == "post"].slug.current`
    const slugs: string[] = await sanity.fetch(query)
    return {
        paths: slugs.map((slug) => ({
            params: {
                post: slug
            }
        })),
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const postSlug = ctx.params.post as string
    const query = `
    *[_type == "post" && "${postSlug}" match slug.current] {
        title, description,
        "imageUrl": image.asset->url,
        author->{
          name, description,
          "imageUrl": image.asset->url
        }
        ,
        tags, _updatedAt, content,
        "slug": slug.current,
        "related": related[]->{
          title, description,
          "imageUrl": image.asset->url,
          author->{
            name, description,
            "imageUrl": image.asset->url
          }
          ,
          tags, _updatedAt,
          "slug": slug.current
        }
      }[0]`

    let post = await sanity.fetch(query)
    const { compiledSource } = await serialize(post.content, {
        mdxOptions: {
            rehypePlugins: [rehypeHighlight]
        }
    })
    post.content = compiledSource
    return { props: { post }, revalidate: 300 }
}

export default PostPage
