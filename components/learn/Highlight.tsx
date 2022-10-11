import hljs from "highlight.js"

type HighlightProps = {
    children: string
}

const Highlight = ({ children }: HighlightProps) => {
    return (
        <pre>
            <code ref={hljs.highlightElement}>{children}</code>
        </pre>
    )
}

export default Highlight
