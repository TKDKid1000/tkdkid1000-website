import db from "./database"
import { FindCallback } from "node-json-db"
import twofactor from "node-2fa"

if (!db.exists("/users")) db.push("/users", [])

function writeUser(user: User) {
    if (getUser(user.email)) {
        db.push(`/users[${getUsers().indexOf(user)}]`, user)
    } else {
        db.push("/users[]", user)
    }
}

function getUser(email: string): User | undefined {
    const user = getUsers().find(user => user.email === email)
    return user
}

function getUsers(): User[] {
    return <User[]>db.getData("/users")
}

function userExists(email: string): boolean {
    return getUser(email) ? true : false
}

function usernameTaken(username: string): boolean {
    const user = getUsers().find((user: User) => {return user.username.toLowerCase() === username.toLowerCase()})
    return user !== undefined
}

interface User {
    email: string,
    password: string,
    username: string,
    twoFactorAuth: {secret: string, uri: string, qr: string},
    twoFactorAuthEnabled: boolean,
    verified: boolean,
    verificationToken: string
}

export {getUser, getUsers, userExists, usernameTaken, writeUser, User}