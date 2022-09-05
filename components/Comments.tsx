import { Dropdown } from "@restart/ui"
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import Image from "next/image"
import { useCallback, useRef, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import { useUploadFile } from "react-firebase-hooks/storage"
import Highlight from "react-highlight"
import {
    AiFillCaretDown,
    AiOutlineBold,
    AiOutlineCode,
    AiOutlineFileImage,
    AiOutlineItalic,
    AiOutlineLink,
    AiOutlineSend,
    AiOutlineStrikethrough
} from "react-icons/ai"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { auth, firestore, storage } from "../hooks/firebase"
import styles from "../styles/comments.module.scss"

type CommentsProps = {
    postId: string
}

type CommentProps = {
    id: number
    uid: string
    author: string
    photo: string
    content: string
    time: number
    postId: string
}

TimeAgo.addLocale(en)

const Comment = ({ id, author, photo, content, time, postId }: CommentProps) => {
    const timeAgo = useRef(new TimeAgo("en-US"))

    return (
        <div key={id} className="flex flex-row mb-4">
            <div className="flex items-start pr-3">
                <Image
                    src={photo}
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
                        <span className="text-blue-500 pr-2">{author}</span>
                        <span className="text-gray-600 dark:text-gray-300 pl-2">
                            {timeAgo.current.format(new Date(time))}
                        </span>
                    </span>
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
                                            className="text-black dark:text-white py-1 px-2 hover:bg-blue-400 transition-all"
                                            onClick={() => {
                                                confirm(
                                                    "Are you sure you want to delete this comment? This action cannot be undone."
                                                )
                                                deleteDoc(
                                                    doc(
                                                        firestore,
                                                        "/posts",
                                                        "/comments",
                                                        postId,
                                                        String(id)
                                                    )
                                                ).then(() => {})
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </ul>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                </div>
                <ReactMarkdown
                    className={styles.comment}
                    allowedElements={["p", "a", "strong", "em", "del", "img", "code", "pre"]}
                    components={{
                        img({ node, className, children, ...props }) {
                            return (
                                <span className="w-1/4 block">
                                    <Image
                                        src={props.src}
                                        layout="responsive"
                                        width={16}
                                        height={16}
                                        alt={props.alt || ""}
                                    />
                                </span>
                            )
                        },
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "")
                            return !inline && match ? (
                                <Highlight className={className}>
                                    {String(children).replace(/\n$/, "")}
                                </Highlight>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                    remarkPlugins={[remarkGfm]}
                >
                    {content}
                </ReactMarkdown>
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
    const [uploadFile] = useUploadFile()

    const [text, setText] = useState("")
    const textRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const writeTextbox = useCallback(
        (s: string) => {
            const start = textRef.current.selectionStart
            const end = textRef.current.selectionEnd
            const selection = text.substring(start, end)
            let t = text.slice(0, start) + text.slice(selection.length + start)
            t = t.slice(0, start) + s.replace("%selection%", selection) + t.slice(start)
            setText(t)
            textRef.current.select()
        },
        [text]
    )

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
                            <div className="flex flex-col w-full">
                                <textarea
                                    value={text}
                                    ref={textRef}
                                    placeholder="Write a comment..."
                                    onChange={(e) => setText(e.target.value)}
                                    spellCheck={false}
                                    className="text-black dark:text-white bg-white dark:bg-black p-2 w-full rounded-t border-gray-400 border-solid border-2 leading-tight outline-none min-h-[40px]"
                                />
                                <div className="flex items-center p-2 bg-gray-200 dark:bg-gray-900 w-full rounded-b border-gray-400 border-solid border-2 border-t-0">
                                    <input
                                        type={"file"}
                                        ref={fileInputRef}
                                        hidden
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files
                                                ? event.target.files[0]
                                                : undefined

                                            if (file && user?.uid) {
                                                const photoId = Math.floor(
                                                    Math.random() * Date.now()
                                                )
                                                const storageRef = ref(
                                                    storage,
                                                    `/posts/comments/${photoId}`
                                                )
                                                uploadFile(storageRef, file, {
                                                    contentType: file.type
                                                })
                                                    .then((res) =>
                                                        getDownloadURL(
                                                            ref(storage, res?.ref.toString())
                                                        )
                                                    )
                                                    .then((url) =>
                                                        writeTextbox(`![%selection%](${url})`)
                                                    )
                                                    .catch(() => writeTextbox("![%selection%]()"))
                                            }
                                        }}
                                    />
                                    <button
                                        className={styles.editorbtn}
                                        onClick={() => {
                                            fileInputRef.current.click()
                                        }}
                                    >
                                        <AiOutlineFileImage />
                                    </button>
                                    <button
                                        className={styles.editorbtn}
                                        onClick={() => writeTextbox("**%selection%**")}
                                    >
                                        <AiOutlineBold />
                                    </button>
                                    <button
                                        className={styles.editorbtn}
                                        onClick={() => writeTextbox("_%selection%_")}
                                    >
                                        <AiOutlineItalic />
                                    </button>
                                    <button
                                        className={styles.editorbtn}
                                        onClick={() => writeTextbox("~~%selection%~~")}
                                    >
                                        <AiOutlineStrikethrough />
                                    </button>
                                    <button
                                        className={styles.editorbtn}
                                        onClick={() => {
                                            const url =
                                                prompt("Enter URL:", "https://") || "https://"
                                            writeTextbox(`[%selection%](${url})`)
                                        }}
                                    >
                                        <AiOutlineLink />
                                    </button>
                                    <button
                                        className={styles.editorbtn}
                                        onClick={() => writeTextbox("```%selection%```")}
                                    >
                                        <AiOutlineCode />
                                    </button>
                                </div>
                            </div>
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
                                            author: user.displayName,
                                            photo: user.photoURL,
                                            content: text,
                                            time: Date.now()
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
                {loading && <span>List: Loading...</span>}
                {value &&
                    value.docs
                        .sort((a, b) => a.data().time - b.data().time)
                        .reverse()
                        .map((doc) => (
                            <Comment
                                key={doc.data().id}
                                id={doc.data().id}
                                uid={doc.data().uid}
                                author={doc.data().author}
                                photo={doc.data().photo}
                                content={doc.data().content}
                                time={doc.data().time}
                                postId={postId}
                            />
                        ))}
            </div>
        </div>
    )
}

export default Comments
