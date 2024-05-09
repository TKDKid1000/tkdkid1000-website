"use client"

import { ReactNode, useState } from "react"

type TerminologyProps = {
    children: ReactNode
    definition: string
}

const Terminology = ({ children, definition }: TerminologyProps) => {
    const [open, setOpen] = useState(false)

    return (
        <span
            className="text-blue-400 cursor-pointer hover:text-blue-300"
            onClick={() => setOpen(!open)}
        >
            {children}
            {open && `: [${definition}]`}
        </span>
    )
}

export default Terminology
