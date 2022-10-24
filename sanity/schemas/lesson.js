export default {
    name: "lesson",
    type: "document",
    title: "Lesson",
    fields: [
        {
            name: "title",
            type: "string",
            title: "Title"
        },
        {
            name: "slug",
            type: "slug",
            title: "Slug",
            options: {
                source: "title",
                maxLength: 200
            }
        },
        {
            name: "description",
            type: "string",
            title: "Description"
        },
        {
            name: "image",
            type: "image",
            title: "Image"
        },
        {
            name: "steps",
            type: "array",
            title: "Steps",
            of: [
                {
                    name: "step",
                    type: "object",
                    title: "Step",
                    fields: [
                        {
                            name: "title",
                            type: "string",
                            title: "Title"
                        },
                        {
                            name: "content",
                            type: "markdown",
                            title: "Content"
                        }
                    ]
                }
            ]
        },
        {
            name: "files",
            type: "array",
            title: "Files",
            of: [
                {
                    name: "code",
                    type: "code",
                    title: "Code",
                    options: {
                        withFilename: true
                    }
                }
            ]
        }
    ]
}
