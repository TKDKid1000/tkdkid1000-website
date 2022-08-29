import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { AiOutlineEdit, AiOutlineGithub, AiOutlineHome, AiOutlineMenu } from "react-icons/ai"
import { FiUser } from "react-icons/fi"
import { auth } from "../hooks/firebase"
import styles from "../styles/navbar.module.scss"
import LoginMenu from "./LoginMenu"

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [user, loading, error] = useAuthState(auth)
    return (
        <nav
            className={`bg-slate-500 px-8 md:px-32 py-4 flex flex-wrap items-center justify-between w-full sticky top-0 z-10 shadow shadow-gray-100 dark:shadow-gray-900`}
        >
            <div className="flex items-center flex-shrink-0 mr-3">
                <Image
                    src="//img/head.png"
                    alt="Logo Image"
                    width={32}
                    height={32}
                    className="rounded-lg"
                />
                <span className="text-xl pl-2">
                    <Link href={"/"}>TKDKid1000</Link>
                </span>
            </div>
            <div className="block lg:hidden">
                <button
                    className="flex items-center rounded-lg border border-gray-600 px-5 py-2 transition-all focus:outline-4 outline-0 outline outline-gray-700"
                    onClick={() => setOpen(!open)}
                >
                    <AiOutlineMenu />
                </button>
            </div>
            <div
                className={`w-full ${
                    open ? "block" : "hidden"
                } flex-grow lg:flex lg:items-center lg:w-auto`}
            >
                <div className="flex lg:flex-grow lg:flex-row flex-col">
                    <span className={styles.navlink}>
                        <Link href={"/"}>
                            <a className="flex items-center">
                                <AiOutlineHome size={24} className="text-gray-700 mr-1" />{" "}
                                <span>Home</span>
                            </a>
                        </Link>
                    </span>
                    <span className={styles.navlink}>
                        <Link href={"/blog"}>
                            <a className="flex items-center">
                                <AiOutlineEdit size={24} className="text-gray-700 mr-1" />{" "}
                                <span>Blog</span>
                            </a>
                        </Link>
                    </span>
                    <span className={styles.navlink}>
                        <Link href={"https://github.com/TKDKid1000"}>
                            <a className="flex items-center">
                                <AiOutlineGithub size={24} className="text-gray-700 mr-1" />{" "}
                                <span>GitHub</span>
                            </a>
                        </Link>
                    </span>
                </div>
                <div className="flex lg:flex-row flex-col">
                    {user ? (
                        <button className={styles.navbtn}>
                            <Link href={"/profile"}>
                                <a className="flex items-center w-full">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt="Profile icon"
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <FiUser />
                                    )}
                                    <span className="ml-1 text-gray-400">Profile</span>
                                </a>
                            </Link>
                        </button>
                    ) : (
                        <LoginMenu />
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
