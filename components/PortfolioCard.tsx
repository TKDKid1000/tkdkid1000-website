"use client"

import { RenderComponentProps } from "masonic"
import Image from "next/image"
import Link from "next/link"
import { PortfolioImage } from "./PortfolioViewer"

export default function PortfolioCard({
    index,
    data: { imageUrl, dimensions, caption, _id },
    width: cardWidth
}: RenderComponentProps<PortfolioImage>) {
    return (
        <Link href={`/portfolio/${_id}`}>
            <div className="w-full hover:scale-105 hover:z-10 transition-transform cursor-pointer relative group">
                <Image
                    src={imageUrl}
                    width={dimensions.width}
                    height={dimensions.height}
                    alt={caption}
                    className="w-full h-min group-hover:opacity-50 transition-opacity"
                />
                <div
                    style={{
                        width: cardWidth
                    }}
                    className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-white line-clamp-3"
                >
                    {caption}
                </div>
            </div>
        </Link>
    )
}
