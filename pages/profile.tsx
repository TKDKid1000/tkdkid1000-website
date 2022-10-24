import { signOut } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import { NextPage } from "next"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useAuthState, useSendEmailVerification, useUpdateProfile } from "react-firebase-hooks/auth"
import { useUploadFile } from "react-firebase-hooks/storage"
import Layout from "../components/Layout"
import { auth, firestore, storage } from "../lib/firebase"

const Profile: NextPage = () => {
    const [user] = useAuthState(auth)
    const [uploadFile] = useUploadFile()
    const [sendEmailVerification] = useSendEmailVerification(auth)
    const [updateProfile] = useUpdateProfile(auth)

    const [name, setName] = useState("")
    const [photo, setPhoto] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [verificationSent, setVerificationSent] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.displayName || "")
        }
    }, [user])

    return (
        <Layout title="Profile" className="px-8 md:px-24 lg:px-32 pb-3">
            <div className="flex flex-col p-2 mb-8">
                <h1 className="text-4xl text-black dark:text-white font-bold">Profile</h1>
                {user && !user?.emailVerified && (
                    <div className="bg-red-600 text-white rounded mt-3 p-5 flex flex-row items-center justify-between">
                        <span>Your email is unverified!</span>
                        <button
                            disabled={verificationSent}
                            className="bg-emerald-500 py-2 px-5 rounded font-medium transition-colors hover:bg-emerald-400 disabled:bg-emerald-200 disabled:cursor-not-allowed w-max"
                            onClick={() => {
                                sendEmailVerification().then(() => setVerificationSent(true))
                            }}
                        >
                            {verificationSent ? "Verification Sent" : "Verify"}
                        </button>
                    </div>
                )}
                <div className="bg-slate-300 dark:bg-zinc-700 w-full rounded-md mt-3 p-5 flex flex-col">
                    <div className="text-black dark:text-white text-2xl mb-4">
                        Welcome Back, <span className="font-bold">{user?.displayName}</span>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row justify-between">
                        <div>
                            <div className="flex flex-col mb-4">
                                <span className="mr-2 text-black dark:text-white">Username:</span>
                                <div className="flex-flex-row">
                                    <input
                                        className="rounded-l px-2 py-2 outline-none bg-white w-2/3 sm:w-5/6 md:w-2/3"
                                        type={"text"}
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                    <button
                                        disabled={user?.displayName === name}
                                        className="bg-emerald-500 py-2 px-5 rounded-r font-medium transition-all hover:bg-emerald-400 disabled:bg-emerald-200 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            updateProfile({
                                                displayName: name
                                            })
                                            updateDoc(doc(firestore, "/users", user.uid), {
                                                username: name
                                            })
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col mb-4">
                                <span className="mr-2 text-black dark:text-white">Photo:</span>
                                <div className="flex-flex-row">
                                    <button
                                        className="rounded-l px-2 py-2 outline-none bg-white w-2/3 sm:w-5/6 md:w-2/3"
                                        onClick={() => {
                                            fileInputRef.current?.click()
                                        }}
                                    >
                                        {photo ? photo.name : "Select File"}
                                    </button>
                                    <button
                                        disabled={!photo}
                                        className="bg-emerald-500 py-2 px-5 rounded-r font-medium transition-all hover:bg-emerald-400 disabled:bg-emerald-200 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            if (photo && user?.uid) {
                                                const storageRef = ref(
                                                    storage,
                                                    `/users/${user?.uid}`
                                                )
                                                uploadFile(storageRef, photo, {
                                                    contentType: photo.type
                                                })
                                                    .then((res) =>
                                                        getDownloadURL(
                                                            ref(storage, res?.ref.toString())
                                                        )
                                                    )
                                                    .then((url) => {
                                                        updateProfile({
                                                            photoURL: url
                                                        })
                                                        updateDoc(
                                                            doc(firestore, "/users", user.uid),
                                                            {
                                                                username: name,
                                                                photo: url
                                                            }
                                                        )
                                                        setPhoto(undefined)
                                                    })
                                            }
                                        }}
                                    >
                                        Save
                                    </button>
                                    <input
                                        type={"file"}
                                        ref={fileInputRef}
                                        hidden
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files
                                                ? event.target.files[0]
                                                : undefined
                                            setPhoto(file)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col mb-4">
                                <button
                                    className="bg-rose-500 py-2 px-5 rounded font-medium transition-colors hover:bg-rose-400 w-2/3 sm:w-5/6 md:w-2/3"
                                    onClick={() => {
                                        signOut(auth)
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                        <div>
                            {user?.photoURL && (
                                <Image
                                    className=""
                                    src={user?.photoURL || ""}
                                    alt="User photo"
                                    layout="fixed"
                                    width={160}
                                    height={160}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile
