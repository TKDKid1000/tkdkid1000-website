import { ProjectFiles } from "@stackblitz/sdk"
import { stripIndent } from "common-tags"
import Highlight from "../components/learn/Highlight"
import LearnChallenge from "../components/learn/LearnChallenge"
import Terminology from "../components/learn/Terminology"

const packageJson = {
    name: "next-learn",
    version: "0.0.1",
    private: true,
    scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
    },
    dependencies: {
        next: "12.2.5",
        react: "18.2.0",
        "react-dom": "18.2.0"
    },
    devDependencies: {
        eslint: "8.23.0",
        "eslint-config-next": "12.2.5"
    }
}
const files: ProjectFiles = {
    "package.json": JSON.stringify(packageJson, null, 2),
    "README.md": "# challenge",
    "next.config.js": stripIndent`
        /** @type {import('next').NextConfig} */
        const nextConfig = {
            reactStrictMode: true,
            swcMinify: true,
        }
        
        module.exports = nextConfig
        `,
    ".eslintrc.json": stripIndent`
        {
            "extends": "next/core-web-vitals"
        }
        `,
    "styles/global.css": stripIndent`
        html,
        body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, 
                Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }
    
        a {
            color: inherit;
            text-decoration: none;
        }
    
        * {
            box-sizing: border-box;
        }
        `,
    "pages/_app.js": stripIndent`
        import "../styles/global.css"
    
        const App = ({Component, pageProps}) => <Component {...pageProps} />
    
        export default App
        `,
    "pages/index.js": stripIndent`
        const Home = () => {
            return (
                <div>
                    Home
                </div>
            )
        }
        
        export default Home
        `
}

const Learn = () => {
    return (
        <LearnChallenge
            title="Routing in Next.js"
            packageJson={packageJson}
            files={files}
            openFile={"pages/index.js"}
            steps={[
                {
                    title: "Setup your Project",
                    content: (
                        <div>
                            <p>
                                <em>
                                    I am assuming you have Node.js and npm/yarn/pnpm installed. If
                                    not, install those first!
                                </em>
                            </p>
                            <p>
                                First off, you need a basic Next.js project setup. If you are doing
                                this locally, open a terminal and run
                            </p>
                            <pre>
                                <code>npx create-next-app@latest</code>
                                <br />
                                # or
                                <br />
                                <code>yarn create next-app</code>
                                <br />
                                # or
                                <br />
                                <code>pnpm create next-app</code>
                            </pre>
                            <p>This will bootstrap a basic Next.js app</p>
                            <br />
                            <p>
                                If you just want to follow along with this tutorial, use the
                                embedded project editor on your screen. Everything is already setup
                                for you!
                            </p>
                            <p>
                                The built in editor runs thanks to the amazing{" "}
                                <a href="https://stackblitz.com/">Stackblitz</a>, so make sure to
                                check them out! They are doing some pretty amazing work, and have
                                even made running Node.js apps entirely possible in the browser!
                            </p>
                        </div>
                    ),
                    solution: {}
                },
                {
                    title: "The Pages Directory",
                    content: (
                        <div>
                            <p>
                                The pages directory is where all your accessible routes are. Be they
                                static, dynamic, api, etc, they are here.
                            </p>
                            <br />
                            <p>
                                Next has 2 main types of routes; pages and api routes. This guide
                                will cover both of them.
                            </p>
                            <p>
                                First of all, pages are what the user actually sees. They all export
                                a default React component. This component is{" "}
                                <Terminology definition="The initial rendering of a React component occurs on the server at runtime, then raw html is sent to the client. The client then hydrates this html to make it interactive">
                                    Server Side Rendered
                                </Terminology>{" "}
                                by the server, sending the raw html. You can also use{" "}
                                <Terminology definition="The initial rendering of a React component occurs on the server at build time, then the raw html is saved to a file. It can be then cached on a CDN (content delivery network). This html is sent to the client that then hydrates it, making the component interactive.">
                                    Static Site Generation
                                </Terminology>{" "}
                                to pre generate your html at build time.
                            </p>
                            <p>
                                The other type of route is an api route. These routes <em>must</em>{" "}
                                be run on the server - they do not work on the client. Api routes
                                allow you to generate dynamic data when a request hits an endpoint.
                            </p>
                            <p>
                                All routes are defined in the <code>pages</code> directory of a
                                Next.js app. Open this directory and create a file called{" "}
                                <code>about.js</code>.
                            </p>
                            <p>
                                You request routes based on their filesystem location,{" "}
                                <code>/about</code> would lead to <code>pages/about.js</code>. Api
                                routes <em>must</em> be placed in the <code>/api</code> directory,
                                otherwise they will not work.
                            </p>
                            <p>
                                Inside the <code>about.js</code> file, put the following code.
                                Don&apos;t worry, I will explain it in a second:
                            </p>
                            <Highlight>
                                {stripIndent`
                                    const About = () => {
                                        return (
                                            <div>
                                                I'm a developer learning Next.js!
                                            </div>
                                        )
                                    }
                                
                                    export default About`}
                            </Highlight>
                            <pre>
                                <code className="language-jsx"></code>
                            </pre>
                            <p>
                                This snippet is simply a stateless component named About that
                                returns some text saying you are learning Next.js!
                            </p>
                            <p>
                                Take a note of how About is the{" "}
                                <Terminology definition="The object imported when an ecmascript module is default imported. This is specified through 'export default'">
                                    default export
                                </Terminology>{" "}
                                of <code>about.js</code>, this is about as simple a Next.js page
                                gets.
                            </p>
                            <p>
                                Try to visit the <code>/about</code> page of the site, notice
                                anything familiar? How about{" "}
                                <strong>
                                    try changing the contents of About.js to link to your GitHub!
                                </strong>
                            </p>
                        </div>
                    ),
                    solution: {}
                }
            ]}
        />
    )
}

export default Learn
