import { Modal } from "@restart/ui"
import Image from "next/image"
import React, { useState } from "react"
import {
    useAuthState,
    useCreateUserWithEmailAndPassword,
    useSignInWithEmailAndPassword,
    useSignInWithGithub,
    useSignInWithGoogle
} from "react-firebase-hooks/auth"
import { FiUserPlus } from "react-icons/fi"
import { auth } from "../hooks/firebase"
import styles from "../styles/navbar.module.scss"

const validateEmail = (email: string) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
    )

const LoginMenu = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [user, loading, error] = useAuthState(auth)
    const [signInWithGoogle] = useSignInWithGoogle(auth)
    const [signInWithGithub] = useSignInWithGithub(auth)
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)

    return (
        <>
            <button className={styles.navbtn} onClick={() => setShow(true)}>
                <FiUserPlus className="mr-1" size={24} />
                <span className="text-slate-400">Login</span>
            </button>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                renderBackdrop={(props) => (
                    <div {...props} className="fixed inset-0 bg-black/90 z-[300]"></div>
                )}
                className="fixed z-[301] top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-sm bg-gray-300 dark:bg-gray-800 shadow-lg p-5 w-2/3 lg:w-1/3"
            >
                <div className="text-black dark:text-white flex flex-col items-center">
                    <button
                        className="bg-white rounded py-4 px-8 border-2 mb-2 border-black border-solid dark:border-none transition-all hover:scale-105"
                        onClick={() => {
                            signInWithGoogle()
                        }}
                    >
                        <div className="flex flex-row items-center">
                            <div className="mr-3">
                                <Image
                                    src="/img/google-logo.svg"
                                    alt="Google logo"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <span className="text-black font-bold">Sign in with Google</span>
                        </div>
                    </button>
                    <button
                        className="bg-white rounded py-4 px-8 border-2 mb-2 border-black border-solid dark:border-none transition-all hover:scale-105"
                        onClick={() => {
                            signInWithGithub(["user"])
                        }}
                    >
                        <div className="flex flex-row items-center">
                            <div className="mr-3">
                                <Image
                                    src="/img/github-logo-dark.png"
                                    alt="GitHub logo"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <span className="text-black font-bold">Sign in with GitHub</span>
                        </div>
                    </button>
                    <div className="my-3 self-start w-full">
                        <div className="mb-4">
                            <h4 className="text-xl font-bold">Login with email and password</h4>
                        </div>
                        <div className="mb-1">
                            <h4 className="text-xl font-bold text-gray-500">Email</h4>
                            <input
                                type="email"
                                className="w-full p-2 text-black dark:text-white outline-none transition-all bg-slate-200 dark:bg-slate-700 border-b-4 border-solid border-b-rose-500 focus:border-b-rose-400"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="mb-1">
                            <h4 className="text-xl font-bold text-gray-500">Password</h4>
                            <input
                                type="password"
                                className="w-full p-2 text-black dark:text-white outline-none transition-all bg-slate-200 dark:bg-slate-700 border-b-4 border-solid border-b-rose-500 focus:border-b-rose-400"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className="mb-1 flex justify-between">
                            <button
                                onClick={() => signInWithEmailAndPassword(email, password)}
                                className="bg-emerald-500 py-2 px-5 rounded font-medium transition-all hover:bg-emerald-400 disabled:bg-emerald-200 disabled:cursor-not-allowed"
                                disabled={
                                    !validateEmail(email.toLowerCase()) || password.length < 6
                                }
                            >
                                Login
                            </button>
                            <button
                                onClick={() => {
                                    createUserWithEmailAndPassword(email, password)
                                }}
                                className="bg-emerald-500 py-2 px-5 rounded font-medium transition-all hover:bg-emerald-400 disabled:bg-emerald-200 disabled:cursor-not-allowed"
                                disabled={
                                    !validateEmail(email.toLowerCase()) || password.length < 6
                                }
                            >
                                Register
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => setShow(false)}
                        className="bg-rose-500 py-1 px-3 rounded font-medium transition-all hover:bg-rose-400"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default LoginMenu
