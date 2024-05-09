import PortfolioViewer, { PortfolioImage } from "../../components/PortfolioViewer"
import { sanity } from "../../lib/sanity"

async function getData() {
    const query = `
    *[_type == "piece"] | order(takenAt desc) {
        caption,
        "imageUrl": image.asset->url,
        "dimensions": image.asset->metadata.dimensions,
        tags, takenAt, _id
      }`
    const images: PortfolioImage[] = await sanity.fetch(
        query,
        {},
        {
            next: {
                revalidate: 300
            }
        }
    )
    return images
}

// Images need to be CSS width 100% to work with masonry.

export default async function PortfolioIndex() {
    const images = await getData()
    return (
        <div className="px-8 md:px-24 lg:px-64 py-4">
            <PortfolioViewer images={images} />
        </div>
    )
}
