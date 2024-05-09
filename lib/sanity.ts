import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"

const sanity = createClient({
    projectId: "jteh7nq1",
    dataset: "production",
    apiVersion: "2021-10-21",
    useCdn: false
})

const builder = imageUrlBuilder(sanity)

const sanityImage = (source: SanityImageSource) => builder.image(source)

export { sanity, sanityImage }
