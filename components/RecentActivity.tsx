import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import { useDarkMode } from "../hooks/theme"

type ActivityEvent = {
    id: string
    type: string
    actor: {
        id: number
        login: string
        url: string
        avatar_url: string
    }
    repo: {
        id: number
        name: string
        url: string
    }
    payload: {
        push_id: number
        size: number
        ref: string
        head: string
        before: string
        commits: ActivityCommit[]
    }
    public: boolean
    created_at: string
}

type ActivityCommit = {
    sha: string
    author: {
        email: string
        name: string
    }
    message: string
    distinct: boolean
    url: string
}

const fetcher = (url: string) =>
    fetch(url)
        .then((res) => res.json())
        .then((data: ActivityEvent[]) => data.filter((e) => e.type === "PushEvent"))

const RecentActivity = ({ username }: { username: string }) => {
    const { data, error } = useSWR<ActivityEvent[]>(
        `https://api.github.com/users/${username}/events?page=1`,
        fetcher
    )
    const dark = useDarkMode()

    return (
        <div className="flex flex-col text-black dark:text-white bg-stone-300 dark:bg-stone-800 p-2 rounded">
            <div className="flex justify-between">
                <h2 className="text-3xl">Recent Contributions</h2>
                <Link href={"https://github.com/TKDKid1000"} className="flex items-center p-3 mr-1">
                    <Image
                        src={`/img/github-logo-${dark ? "light" : "dark"}.png`}
                        alt="GitHub Logo"
                        width={32}
                        height={32}
                    />
                </Link>
            </div>
            <div className="flex flex-col">
                {!data && <div>Loading...</div>}
                {error && (
                    <div>
                        Failed to fetch GitHub contribution data! It appears you aren&apos;t
                        connected to the internet
                    </div>
                )}
                {data &&
                    data.map((event) => (
                        <div key={event.id} className="p-3">
                            <h5 className="text-lg">
                                Created {event.payload.commits.length} commit
                                {event.payload.commits.length > 1 ? "s" : ""} in{" "}
                                <Link
                                    href={`https://github.com/${event.repo.name}`}
                                    className="text-sky-500 hover:underline"
                                >
                                    {event.repo.name}
                                </Link>
                            </h5>
                            <div className="flex flex-col">
                                <div className="text-gray-400">
                                    {new Date(Date.parse(event.created_at)).toLocaleString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric"
                                        }
                                    )}
                                </div>
                                <ul className="list-disc">
                                    {event.payload.commits.map((commit) => (
                                        <li key={commit.sha} className="ml-8 mt-1 mb-1 last:mb-0">
                                            <Link
                                                href={`https://github.com/${event.repo.name}`}
                                                className="text-sky-500 hover:underline"
                                            >
                                                {commit.message.length > 50
                                                    ? commit.message.substring(0, 50)
                                                    : commit.message}
                                                {commit.message.length > 50 && <>&hellip;</>}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default RecentActivity
