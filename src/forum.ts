interface Category {
    title: string,
    description: string,
    channels: Channel[]
}

interface Channel {
    title: string,
    description: string,
    private: boolean,
    lastpost: number,
    posts: Post[]
}

interface Post {
    title: string,
    timestamp: number,
    content: string,
    author: string,
    comments: Comment[]
}

interface Comment {
    timestamp: number,
    content: string,
    author: string
}

export {Category, Channel, Comment, Post}