import { animated, useSpring } from "@react-spring/web"
import { doc, setDoc } from "firebase/firestore"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useDocument } from "react-firebase-hooks/firestore"
import {
    AiOutlineBulb,
    AiOutlineEdit,
    AiOutlineGithub,
    AiOutlineHome,
    AiOutlineMenu
} from "react-icons/ai"
import { FiUser } from "react-icons/fi"
import { useScroll } from "../hooks/scroll"
import { auth, firestore } from "../lib/firebase"
import favicon from "../public/img/head.png"
import styles from "../styles/navbar.module.scss"
import LoginMenu from "./LoginMenu"

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [user] = useAuthState(auth)
    const [userData] = useDocument(doc(firestore, `/users/${user?.uid}`), {
        snapshotListenOptions: { includeMetadataChanges: true }
    })
    const { scroll, direction } = useScroll()

    const navStyle = useSpring({
        transform:
            direction === "up" || scroll === 0 || open ? "translate(0, 0%)" : "translate(0, -100%)"
    })

    useEffect(() => {
        if (user) {
            if (userData && !userData.exists())
                setDoc(doc(firestore, `/users/${user?.uid}`), {
                    username: user.displayName,
                    photo: user.photoURL
                })
        }
    }, [user, userData])

    return (
        <animated.nav
            className={`bg-slate-500 px-8 md:px-32 py-4 flex flex-wrap items-center justify-between w-full sticky top-0 z-10 shadow shadow-gray-100 dark:shadow-gray-900`}
            style={navStyle}
        >
            <div className="flex items-center flex-shrink-0 mr-3">
                <Image
                    src={favicon}
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
                    title="Toggle navbar"
                >
                    <AiOutlineMenu />
                </button>
            </div>
            <div
                className={`w-full ${
                    open ? "max-h-36" : "max-h-0"
                } flex-grow lg:flex lg:max-h-36 lg:items-center lg:w-auto transition-all duration-500 motion-reduce:transition-none overflow-hidden`}
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
                        <Link href={"/learn"}>
                            <a className="flex items-center">
                                <AiOutlineBulb size={24} className="text-gray-700 mr-1" />{" "}
                                <span>Learn</span>
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
        </animated.nav>
    )
}

export default Navbar
