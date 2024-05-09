"use client"

import { Masonry } from "masonic"
import { useEffect, useState } from "react"
import PortfolioCard from "./PortfolioCard"

export type PortfolioImage = {
    caption: string
    imageUrl: string
    dimensions: { width: number; height: number }
    tags: string[]
    _updatedAt: string
    _id: string
}

export default function PortfolioViewer({ images }: { images: PortfolioImage[] }) {
    const [isServer, setIsServer] = useState(true)

    useEffect(() => {
        setIsServer(false)
    }, [])
    if (isServer) return <div></div>

    return <Masonry items={images} render={PortfolioCard} maxColumnCount={5} columnGutter={12} />
}
