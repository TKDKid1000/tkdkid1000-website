import stackblitz, { VM } from "@stackblitz/sdk"
import { MDXRemote } from "next-mdx-remote"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useDarkMode } from "../../hooks/theme"
import favicon from "../../public/img/head.png"
import Spoiler from "../Spoiler"
import Terminology from "./Terminology"

type PackageJson = {
    name: string
    version: string
    description: string
    private: boolean
    scripts: { [key: string]: string }
    dependencies: { [key: string]: string }
    devDependencies: { [key: string]: string }
}

const defaultPackageJson = {
    name: "example",
    version: "0.0.0",
    description: "",
    private: true,
    scripts: {},
    dependencies: {},
    devDependencies: {}
}

type Lesson = {
    title: string
    slug: string
    description: string
    imageUrl: string
    _updatedAt: string
    files: [
        {
            filename: string
            code: string
        }
    ]
    steps: [
        {
            title: string
            content: string
        }
    ]
}

type LessonProps = {
    lesson: Lesson
}

const LessonViewer = ({ lesson }: LessonProps) => {
    const ref = useRef<HTMLIFrameElement>()
    const loaded = useRef(false)
    const [vm, setVM] = useState<VM>()
    const dark = useDarkMode()
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (ref.current && !loaded.current) {
            loaded.current = true

            const files = lesson.files.reduce(
                (a, v) => ({
                    ...a,
                    [v.filename]: v.code
                }),
                {}
            )
            const packageJson: PackageJson = {
                ...defaultPackageJson,
                ...JSON.parse(files["package.json"] ?? "{}")
            }

            stackblitz
                .embedProject(
                    ref.current,
                    {
                        title: packageJson.name,
                        description: packageJson.description,
                        template: "node",
                        files,
                        dependencies: {
                            ...packageJson.dependencies,
                            ...packageJson.devDependencies
                        }
                    },
                    {
                        theme: "dark"
                    }
                )
                .then(setVM)
        }
    }, [ref, lesson])

    useEffect(() => {
        if (vm) {
            vm.editor.setView("editor")
        }
    }, [vm])

    useEffect(() => {
        if (vm) {
            vm.editor.setTheme(dark ? "dark" : "light")
        }
    }, [dark, vm])

    return (
        <div>
            <nav
                className={`bg-blue-500 px-8 md:px-32 py-4 flex flex-wrap items-center justify-between w-full sticky top-0 z-10 shadow shadow-gray-100 dark:shadow-gray-900`}
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
                        <Link href={"/learn"}>Lessons</Link>
                    </span>
                </div>
            </nav>
            <div className="flex flex-col lg:flex-row relative h-full p-3 text-black dark:text-white">
                <div className="lg:w-1/2 p-1 lg:p-3 lg:pr-5 lg:overflow-scroll lg:h-[calc(100vh-100px)]">
                    <h1 className="text-4xl mb-2 text-center">{lesson.title}</h1>
                    <div className="flex justify-between">
                        <button
                            className="rounded border px-3 py-1 border-blue-500 transition-all hover:border-blue-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                            disabled={step === 0}
                            onClick={() => setStep(step - 1)}
                        >
                            Back
                        </button>
                        <button
                            className="rounded border px-3 py-1 border-blue-500 transition-all hover:border-blue-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                            disabled={step === lesson.steps.length - 1}
                            onClick={() => setStep(step + 1)}
                        >
                            Next
                        </button>
                    </div>
                    <h2 className="text-3xl">{lesson.steps[step].title}</h2>
                    <hr className="my-3" />
                    <div className="markup">
                        <MDXRemote
                            compiledSource={lesson.steps[step].content}
                            components={{
                                Spoiler,
                                Link,
                                Terminology
                            }}
                        />
                    </div>
                </div>
                <div className="lg:w-1/2">
                    <iframe ref={ref} className="select-none h-[calc(100vh-100px)]"></iframe>
                </div>
            </div>
        </div>
    )
}

export type { PackageJson, Lesson }

export default LessonViewer
