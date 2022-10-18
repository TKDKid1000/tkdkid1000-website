import sanityClient from "@sanity/client"

const sanity = sanityClient({
    projectId: "jteh7nq1",
    dataset: "production",
    apiVersion: "2021-10-21",
    useCdn: false
})

export { sanity }
