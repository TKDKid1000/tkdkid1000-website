import Link from "next/link"
import React from "react"
import { AiFillGithub, AiFillRedditCircle, AiFillYoutube } from "react-icons/ai"

const Footer = () => {
    return (
        <div className="bg-stone-800 dark:bg-stone-200 px-24 py-6 text-xs text-gray-200 dark:text-gray-600 flex justify-between items-center">
            <div>
                <span className="text-white dark:text-black mr-3">
                    &copy; {new Date(Date.now()).getFullYear()} TKDKid1000
                </span>
                <span className="mr-1">
                    <Link href={"/terms"}>Terms</Link>
                </span>
                <span>
                    <Link href={"/privacy-policy"}>Privacy</Link>
                </span>
            </div>
            <div className="flex flex-row">
                <span className="mr-3">
                    <Link href={"https://github.com/TKDKid1000"}>
                        <a className="transition-all hover:brightness-125">
                            <AiFillGithub size={24} />
                        </a>
                    </Link>
                </span>
                <span className="mr-3">
                    <Link href={"https://youtube.com/channel/UC6OwB4gGOL-CaIWZ5uoE_sg"}>
                        <a className="transition-all hover:brightness-125">
                            <AiFillYoutube size={24} />
                        </a>
                    </Link>
                </span>
                <span className="mr-3">
                    <Link href={"https://reddit.com/u/TKDKid1000"}>
                        <a className="transition-all hover:brightness-125">
                            <AiFillRedditCircle size={24} />
                        </a>
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default Footer
