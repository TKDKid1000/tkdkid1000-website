const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ["js", "jsx", "ts", "tsx"],
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "firebasestorage.googleapis.com",
            "avatars.githubusercontent.com",
            "cdn.sanity.io"
        ]
        //     loader: "akamai",
        //     path: ""
    }
}

module.exports = withBundleAnalyzer(nextConfig)
