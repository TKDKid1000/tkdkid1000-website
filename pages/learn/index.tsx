import { GetStaticProps, NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import Layout from "../../components/Layout"
import { Lesson } from "../../components/learn/LessonViewer"
import { sanity } from "../../lib/sanity"

type LearnIndexProps = {
    lessons: Lesson[]
}

const LearnIndex: NextPage<LearnIndexProps> = ({ lessons }) => {
    return (
        <Layout title="Lessons">
            <div className="flex items-center flex-col gap-2 py-5">
                <div className="text-black dark:text-white text-4xl capitalize">Lessons</div>
                <div className="text-gray-500 text-lg">
                    Simple lessons and tutorials to learn web development skills!
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
                {lessons.map((lesson, i) => (
                    <div
                        key={i}
                        className="rounded-md hover:scale-105 transition-all duration-500 ease-in-out"
                    >
                        <Link href={`/learn/${lesson.slug}`}>
                            <Image
                                src={lesson.imageUrl}
                                alt="Lesson image"
                                width={300}
                                height={150}
                                className="rounded-t-md object-cover"
                            />
                            <div className="p-3">
                                <div className="text-black dark:text-white text-lg font-bold">
                                    {lesson.title}
                                </div>
                                <div className="text-gray-500">{lesson.description}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const query = `
    *[_type == "lesson"] {
        title, description, _updatedAt,
        "imageUrl": image.asset->url,
        "slug": slug.current
      }`
    const lessons: Lesson[] = await sanity.fetch(query)
    return {
        props: {
            lessons
        },
        revalidate: 300
    }
}

export default LearnIndex
