export default {
    name: "post",
    type: "document",
    title: "Blog Post",
    fields: [
        {
            name: "title",
            type: "string",
            title: "Title"
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
            name: "author",
            type: "reference",
            title: "Author",
            to: [
                {
                    type: "author"
                }
            ]
        },
        {
            name: "tags",
            type: "array",
            title: "Tags",
            of: [
                {
                    type: "string"
                }
            ]
        },
        {
            name: "related",
            type: "array",
            title: "Related",
            of: [
                {
                    type: "reference",
                    to: [
                        {
                            type: "post"
                        }
                    ]
                }
            ]
        },
        {
            name: "content",
            type: "markdown",
            title: "Content"
        }
    ]
}
