import db from "./database"
import { User } from "./user"

if (!db.exists("/forums")) db.push("/forums", [])

function writeForums(categories: Category[]) {
    db.push("/forums", categories)
}

function getForums() {
    return <Category[]>db.getData("/forums")
}

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
    author: User,
    comments: Comment[]
}

interface Comment {
    timestamp: number,
    content: string,
    author: User
}

export {Category, Channel, Comment, Post, writeForums, getForums}