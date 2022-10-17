const remarkFrontmatter = import("remark-frontmatter")
const rehypeHighlight = import("rehype-highlight")

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ["js", "jsx", "ts", "tsx"],
    images: {
        domains: ["lh3.googleusercontent.com", "cdn.sanity.io"]
        //     loader: "akamai",
        //     path: ""
    },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.mdx?$/,
            use: [
                options.defaultLoaders.babel,
                {
                    loader: "@mdx-js/loader",
                    options: {
                        providerImportSource: "@mdx-js/react",
                        remarkPlugins: [remarkFrontmatter],
                        rehypeHighlight: [rehypeHighlight]
                    }
                }
            ]
        })
        return config
    }
}

module.exports = nextConfig
