import Image from "next/image"
import { PortfolioImage } from "../../../components/PortfolioViewer"
import { sanity } from "../../../lib/sanity"

type Props = {
    params: { id: number }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateStaticParams() {
    const query = `*[_type == "piece"]._id`
    const ids: string[] = await sanity.fetch(query)
    return ids.map((id) => ({
        params: {
            id
        }
    }))
}

async function getData(id: number) {
    const query = `
    *[_type == "piece" && "${id}" match _id] {
        caption,
        "imageUrl": image.asset->url,
        "dimensions": image.asset->metadata.dimensions,
        tags, takenAt, _id
      }[0]`

    let image: PortfolioImage = await sanity.fetch(query)
    // const mdxSource = await serialize(post.content, {
    //     mdxOptions: {
    //         rehypePlugins: [rehypeHighlight]
    //     }
    // })
    return image
}

// Images need to be CSS width 100% to work with masonry.

export default async function PortfolioItem({ params }: Props) {
    const image = await getData(params.id)
    return (
        <div className="px-8 md:px-24 lg:px-64 py-4">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="basis-3/4">
                    <Image
                        src={image.imageUrl}
                        width={image.dimensions.width}
                        height={image.dimensions.height}
                        alt={image.caption}
                        className="w-full h-min group-hover:opacity-50 transition-opacity"
                    />
                </div>
                <div className="basis-1/4 text-white">
                    <div>
                        {image.tags.map((tag) => (
                            <span
                                key={tag}
                                className="w-min font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-orange-400 mr-4"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p>{image.caption}</p>
                </div>
            </div>
        </div>
    )
}
