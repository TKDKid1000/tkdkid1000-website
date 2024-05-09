export default {
    name: "piece",
    type: "document",
    title: "Portfolio Piece",
    fields: [
        {
            name: "caption",
            type: "string",
            title: "Caption"
        },
        {
            name: "image",
            type: "image",
            title: "Image"
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
            name: "takenAt",
            type: "datetime",
            title: "Photo Taken At",
            options: {
                dateFormat: "YYYY-MM-DD",
                timeFormat: "HH:mm",
                timeStep: 1
            }
        }
    ]
}
