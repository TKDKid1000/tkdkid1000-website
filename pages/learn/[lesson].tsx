import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { serialize } from "next-mdx-remote/serialize"
import rehypeHighlight from "rehype-highlight"
import LessonViewer, { Lesson } from "../../components/learn/LessonViewer"
import { sanity } from "../../lib/sanity"

type LessonPageProps = {
    lesson: Lesson
}

const LessonPage: NextPage<LessonPageProps> = ({ lesson }) => {
    return <LessonViewer lesson={lesson} />
}

export const getStaticPaths: GetStaticPaths = async () => {
    const query = `*[_type == "lesson"].slug.current`
    const slugs: string[] = await sanity.fetch(query)
    return {
        paths: slugs.map((slug) => ({
            params: {
                lesson: slug
            }
        })),
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const lessonSlug = ctx.params.lesson as string
    const query = `
    *[_type == "lesson" && "${lessonSlug}" match slug.current] {
        title, description,
        "imageUrl": image.asset->url,
        steps,
        "files": files[]{
          code, filename
        },
        "steps": steps[]{
          title, content
        },
        "slug": slug.current
      }[0]`

    const lesson: Lesson = await sanity.fetch(query)
    await Promise.all(
        lesson.steps.map(async (step, index) => {
            const { compiledSource } = await serialize(step.content, {
                mdxOptions: {
                    rehypePlugins: [rehypeHighlight]
                }
            })
            lesson.steps[index].content = compiledSource
        })
    )
    return { props: { lesson }, revalidate: 300 }
}

export default LessonPage
