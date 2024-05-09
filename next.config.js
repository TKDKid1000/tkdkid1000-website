const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ["js", "jsx", "ts", "tsx"],
    images: {
        remotePatterns: [
            { hostname: "lh3.googleusercontent.com" },
            { hostname: "firebasestorage.googleapis.com" },
            { hostname: "avatars.githubusercontent.com" },
            { hostname: "cdn.sanity.io" },
            { hostname: "picsum.photos" },
            { hostname: "fastly.picsum.photos" }
        ]
        //     loader: "akamai",
        //     path: ""
    }
}

module.exports = withBundleAnalyzer(nextConfig)
