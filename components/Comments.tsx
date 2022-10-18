import { Dropdown } from "@restart/ui"
import { collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import Image from "next/image"
import { useRef, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"
import { AiFillCaretDown, AiOutlineSend } from "react-icons/ai"
import { auth, firestore } from "../lib/firebase"
import MarkdownEditor from "./MarkdownEditor"
import MarkdownRenderer from "./MarkdownRenderer"

type CommentsProps = {
    postId: string
}

type CommentProps = {
    id: number
    uid: string
    content: string
    time: number
    edited: boolean
    postId: string
}

TimeAgo.addLocale(en)

const Comment = ({ id, uid, content, time, edited, postId }: CommentProps) => {
    const [user] = useAuthState(auth)
    const [authorData] = useDocument(doc(firestore, `/users/${uid}`), {
        snapshotListenOptions: { includeMetadataChanges: true }
    })
    const timeAgo = useRef(new TimeAgo("en-US"))
    const [editing, setEditing] = useState(false)
    const [text, setText] = useState(content)

    return (
        <div key={id} className="flex flex-row mb-4">
            <div className="flex items-start pr-3">
                <Image
                    src={authorData?.data()?.photo}
                    className="rounded"
                    layout="fixed"
                    width={48}
                    height={48}
                    alt="Profile photo"
                />
            </div>
            <div className="flex flex-col highlight-src w-full">
                <div className="flex justify-between items-center text-sm w-full">
                    <span className="divide-x divide-black dark:divide-white mb-2">
                        <span className="text-blue-500 pr-2">{authorData?.data()?.username}</span>
                        <span className="text-gray-600 dark:text-gray-300 px-2">
                            {timeAgo.current.format(new Date(time))}
                        </span>
                        {edited && (
                            <span className="text-gray-600 dark:text-gray-300 pl-2">Edited</span>
                        )}
                    </span>
                    {user?.uid === uid && (
                        <span>
                            <Dropdown>
                                <Dropdown.Toggle>
                                    {(props) => (
                                        <button {...props} className="flex flex-row items-center">
                                            More
                                            <AiFillCaretDown />
                                        </button>
                                    )}
                                </Dropdown.Toggle>
                                <Dropdown.Menu flip offset={[0, 8]}>
                                    {(menuProps, meta) => (
                                        <ul
                                            {...menuProps}
                                            className={`shadow-md bg-white dark:bg-black border border-black dark:border-white absolute z-10 transition-all ${
                                                meta.show
                                                    ? "visible opacity-100"
                                                    : "invisible opacity-0"
                                            }`}
                                        >
                                            <button
                                                className="text-black dark:text-white py-1 px-2 hover:bg-blue-400 transition-all list-item w-full"
                                                onClick={() => {
                                                    const shouldDelete = confirm(
                                                        "Are you sure you want to delete this comment? This action cannot be undone."
                                                    )
                                                    if (shouldDelete) {
                                                        deleteDoc(
                                                            doc(
                                                                firestore,
                                                                "/posts",
                                                                "/comments",
                                                                postId,
                                                                String(id)
                                                            )
                                                        )
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="text-black dark:text-white py-1 px-2 hover:bg-blue-400 transition-all list-item w-full"
                                                onClick={() => {
                                                    setEditing(true)
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </ul>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                    )}
                </div>
                {editing ? (
                    <div className="flex flex-col">
                        <MarkdownEditor value={text} onChange={setText} />
                        <div className="flex flex-row items-center justify-end mt-1">
                            <button
                                className="text-blue-400 hover:text-blue-700 py-1 px-2 transition-all"
                                onClick={() => {
                                    setEditing(false)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={text.length < 1}
                                className="text-white bg-gray-500 py-1 px-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                                onClick={() => {
                                    setEditing(false)
                                    updateDoc(
                                        doc(firestore, "/posts", "/comments", postId, String(id)),
                                        {
                                            content: text,
                                            edited: true
                                        }
                                    )
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <MarkdownRenderer>{content}</MarkdownRenderer>
                )}
            </div>
        </div>
    )
}

const Comments = ({ postId }: CommentsProps) => {
    const [user] = useAuthState(auth)
    const [value, loading, error] = useCollection(
        collection(firestore, `/posts/comments/${postId}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true }
        }
    )
    const [text, setText] = useState("")

    return (
        <div className="flex flex-col text-white">
            <div className="flex flex-col">
                {user ? (
                    <>
                        <div className="flex flex-row">
                            <div className="px-3">
                                <Image
                                    src={user.photoURL}
                                    alt={"Profile Photo"}
                                    layout="fixed"
                                    width={48}
                                    height={48}
                                    className="object-cover rounded"
                                />
                            </div>
                            <MarkdownEditor value={text} onChange={setText} />
                        </div>
                        <div className="flex justify-end items-center mt-2 text-black dark:text-white">
                            <div className="mr-2">
                                Your username and profile picture will be publicly shared.
                            </div>
                            <button
                                disabled={text.length < 1}
                                className="bg-gray-500 text-2xl px-5 py-2 rounded text-white transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                                onClick={() => {
                                    const id = Math.floor(Math.random() * Date.now())
                                    setDoc(
                                        doc(firestore, "/posts", "/comments", postId, String(id)),
                                        {
                                            id,
                                            uid: user.uid,
                                            content: text,
                                            time: Date.now(),
                                            edited: false
                                        }
                                    ).then(() => setText(""))
                                }}
                            >
                                <AiOutlineSend />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="font-bold text-black dark:text-white">
                            You must be logged in to comment!
                        </p>
                    </>
                )}
            </div>
            <div className="flex flex-col lg:px-24 mt-6">
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Loading...</span>}
                {value &&
                    value.docs
                        .sort((a, b) => a.data().time - b.data().time)
                        .reverse()
                        .map((doc) => (
                            <Comment
                                key={doc.data().id}
                                id={doc.data().id}
                                uid={doc.data().uid}
                                content={doc.data().content}
                                time={doc.data().time}
                                edited={doc.data().edited}
                                postId={postId}
                            />
                        ))}
            </div>
        </div>
    )
}

export default Comments
