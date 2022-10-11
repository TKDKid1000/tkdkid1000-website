import stackblitz, { ProjectFiles, VM } from "@stackblitz/sdk"
import Image from "next/image"
import Link from "next/link"
import { ReactElement, useEffect, useRef, useState } from "react"
import { useDarkMode } from "../../hooks/theme"

type PackageJson = {
    name: string
    version: string
    private: boolean
    scripts: { [key: string]: string }
    dependencies: { [key: string]: string }
    devDependencies: { [key: string]: string }
}

type LearnChallengeProps = {
    title: string
    packageJson: PackageJson
    files: ProjectFiles
    steps: LearnChallengeStep[]
    openFile: string
}

type LearnChallengeStep = {
    title: string
    content: ReactElement
    solution: ProjectFiles
}

const LearnChallenge = ({ packageJson, files, steps, title, openFile }: LearnChallengeProps) => {
    const ref = useRef<HTMLIFrameElement>()
    const loaded = useRef(false)
    const [vm, setVM] = useState<VM>()
    const dark = useDarkMode()
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (ref.current && !loaded.current) {
            loaded.current = true

            stackblitz
                .embedProject(
                    ref.current,
                    {
                        title: "title",
                        description: "description",
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
    }, [ref, files, packageJson])

    useEffect(() => {
        if (vm) {
            vm.editor.openFile(openFile)
            vm.editor.setView("editor")
        }
    }, [openFile, vm])

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
                        src="//img/head.png"
                        alt="Logo Image"
                        width={32}
                        height={32}
                        className="rounded-lg"
                    />
                    <span className="text-xl pl-2">
                        <Link href={"/learn"}>Challenges</Link>
                    </span>
                </div>
            </nav>
            <div className="flex flex-col lg:flex-row relative h-full p-3 text-black dark:text-white">
                <div className="lg:w-1/2 p-1 lg:p-3 lg:pr-5 lg:overflow-scroll lg:h-[calc(100vh-100px)]">
                    <h1 className="text-4xl mb-2 text-center">{title}</h1>
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
                            disabled={step === steps.length - 1}
                            onClick={() => setStep(step + 1)}
                        >
                            Next
                        </button>
                    </div>
                    <h2 className="text-3xl">{steps[step].title}</h2>
                    <hr className="my-3" />
                    <div className="markup">{steps[step].content}</div>
                </div>
                <div className="lg:w-1/2">
                    <iframe ref={ref} className="select-none h-[calc(100vh-100px)]"></iframe>
                </div>
            </div>
        </div>
    )
}

export default LearnChallenge
