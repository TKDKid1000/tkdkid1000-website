import Image from "next/image"
import Highlight from "react-highlight"
import ReactMarkdown from "react-markdown"
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown"
import remarkGfm from "remark-gfm"

const MarkdownRenderer = ({ ...props }: ReactMarkdownOptions) => {
    return (
        <div className="markup whitespace-pre-wrap break-all">
            <ReactMarkdown
                {...props}
                allowedElements={["p", "a", "strong", "em", "del", "img", "code", "pre"]}
                components={{
                    img({ node, className, children, ...props }) {
                        return (
                            <span className="w-1/4 block">
                                <Image
                                    src={props.src}
                                    layout="responsive"
                                    width={16}
                                    height={16}
                                    alt={props.alt || ""}
                                />
                            </span>
                        )
                    },
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
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
