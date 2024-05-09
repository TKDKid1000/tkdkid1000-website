import BlogPost, { Post } from "../../components/BlogPost"
import { sanity } from "../../lib/sanity"

const groupList = <T,>(list: T[], size: number) => {
    const lists: T[][] = []
    const listCount = Math.ceil(list.length / size)
    for (let x = 0; x < listCount; x++) {
        lists.push(list.slice(x * size, x * size + size))
    }
    return lists
}

async function getData() {
    const query = `
    *[_type == "post"] | order(_updatedAt desc) {
        title, description,
        "imageUrl": image.asset->url,
        author->{
          name, description,
          "imageUrl": image.asset->url
        }
        ,
        tags, _updatedAt,
        "slug": slug.current
      }`
    const posts: Post[] = await sanity.fetch(query)
    return posts
}

export default async function BlogIndex() {
    const posts = await getData()
    const postGroups = groupList(posts, 6)

    return (
        <div className="px-8 md:px-24 lg:px-32 pb-3">
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
        </div>
    )
}
