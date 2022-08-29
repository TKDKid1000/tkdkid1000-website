import React, { ReactNode, useState } from "react"

type TooltipProps = {
    render: ReactNode
    children: ReactNode | ReactNode[]
}

const Tooltip = ({ render, children }: TooltipProps) => {
    const [hover, setHover] = useState(false)
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="relative"
        >
            <div>{children}</div>
            <div
                className={`absolute top-0 transition-all ${
                    hover ? "scale-100 top-12" : "scale-0 top-0"
                }`}
            >
                {render}
            </div>
        </div>
    )
}

export default Tooltip
