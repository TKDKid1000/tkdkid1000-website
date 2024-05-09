import Image from "next/image"
import Highlight from "react-highlight"
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"

const MarkdownRenderer = ({ ...props }: Options) => {
    return (
        <div className="markup whitespace-pre-wrap break-all">
            <ReactMarkdown
                {...props}
                allowedElements={["p", "a", "strong", "em", "del", "img", "code", "pre"]}
                components={{
                    img({ node, className, children, src, ...props }) {
                        return (
                            <span className="w-1/4 block">
                                <Image
                                    src={src || ""}
                                    width={16}
                                    height={16}
                                    alt={props.alt || ""}
                                />
                            </span>
                        )
                    },
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return /*!inline &&*/ match ? (
                            <Highlight className={className}>
                                {String(children).replace(/\n$/, "")}
                            </Highlight>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
                remarkPlugins={[remarkGfm]}
            >
                {props.children}
            </ReactMarkdown>
        </div>
    )
}

export default MarkdownRenderer
