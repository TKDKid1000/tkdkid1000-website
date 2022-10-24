import { ReactNode, useState } from "react"

const Spoiler = ({ children }: { children: ReactNode | ReactNode[] }) => {
    const [visible, setVisible] = useState(false)
    return (
        <span
            onClick={() => setVisible(true)}
            className={`bg-gray-300 dark:bg-gray-700 cursor-pointer ${
                !visible && "text-transparent"
            }`}
        >
            {children}
        </span>
    )
}

export default Spoiler
