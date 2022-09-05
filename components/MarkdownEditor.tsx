import { getDownloadURL, ref } from "firebase/storage"
import { useCallback, useRef, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useUploadFile } from "react-firebase-hooks/storage"
import {
    AiOutlineBold,
    AiOutlineCode,
    AiOutlineEye,
    AiOutlineFileImage,
    AiOutlineItalic,
    AiOutlineLink,
    AiOutlineStrikethrough
} from "react-icons/ai"
import { auth, storage } from "../hooks/firebase"
import styles from "../styles/comments.module.scss"
import MarkdownRenderer from "./MarkdownRenderer"

type MarkdownEditorProps = {
    value: string
    onChange: (value: string) => void
}

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
    const [user] = useAuthState(auth)

    const [uploadFile] = useUploadFile()

    const textRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const writeTextbox = useCallback(
        (s: string) => {
            const start = textRef.current.selectionStart
            const end = textRef.current.selectionEnd
            const selection = value.substring(start, end)
            let t = value.slice(0, start) + value.slice(selection.length + start)
            t = t.slice(0, start) + s.replace("%selection%", selection) + t.slice(start)
            onChange(t)
            textRef.current.select()
        },
        [value, onChange]
    )

    const [preview, setPreview] = useState(false)

    return (
        <div className="flex flex-col w-full">
            {preview ? (
                <div className="text-black dark:text-white bg-white dark:bg-black p-2 w-full rounded-t border-gray-400 border-solid border-2 leading-tight outline-none min-h-[40px]">
                    <MarkdownRenderer>{value}</MarkdownRenderer>
                </div>
            ) : (
                <textarea
                    value={value}
                    ref={textRef}
                    placeholder="Write a comment..."
                    onChange={(e) => onChange(e.target.value)}
                    spellCheck={false}
                    className="text-black dark:text-white bg-white dark:bg-black p-2 w-full rounded-t border-gray-400 border-solid border-2 leading-tight outline-none min-h-[40px]"
                />
            )}
            <div className="flex items-center p-2 bg-gray-200 dark:bg-gray-900 w-full rounded-b border-gray-400 border-solid border-2 border-t-0 divide-x divide-gray-500">
                <span className="flex items-center">
                    <input
                        type={"file"}
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={(event) => {
                            const file = event.target.files ? event.target.files[0] : undefined

                            if (file && user?.uid) {
                                const photoId = Math.floor(Math.random() * Date.now())
                                const storageRef = ref(storage, `/posts/comments/${photoId}`)
                                uploadFile(storageRef, file, {
                                    contentType: file.type
                                })
                                    .then((res) =>
                                        getDownloadURL(ref(storage, res?.ref.toString()))
                                    )
                                    .then((url) => writeTextbox(`![%selection%](${url})`))
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
                </span>
                <span className="flex items-center">
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
                            const url = prompt("Enter URL:", "https://") || "https://"
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
                </span>
                <span className="flex items-center">
                    <button className={styles.editorbtn} onClick={() => setPreview(!preview)}>
                        <AiOutlineEye />
                    </button>
                </span>
            </div>
        </div>
    )
}

export default MarkdownEditor
