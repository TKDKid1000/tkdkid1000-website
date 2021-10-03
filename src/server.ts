#!/usr/bin/env node

import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "./utils"
import config from "./config"

const app: express.Application = express()
const engine: Liquid = new Liquid()

app.engine("liquid", engine.express())
app.set("views", "./views")
app.set("view engine", "liquid")
app.use("/assets", express.static("./assets"))
app.use(session({
    name: "session",
    keys: ["7ffe99ff16650c9f4c08"],
    maxAge: 24 * 60 * 60 * 1000
}))
app.use(express.urlencoded({
    extended: true
}))
app.use(require("serve-favicon")("./assets/head.png"))
app.use("/marked", express.static("node_modules/marked"))
app.use("/index.md", express.static("./index.md"))

import route_index from "./routes/index"; route_index (app)
import route_login from "./routes/login"; route_login (app)
import route_register from "./routes/register"; route_register (app)
import route_logout from "./routes/logout"; route_logout (app)
import route_pages from "./routes/pages"; route_pages (app)
import route_account from "./routes/account"; route_account (app)
import route_2fa from "./routes/2fa"; route_2fa (app)
import route_forums_forums from "./routes/forums/forums"; route_forums_forums (app)
import route_forums_post from "./routes/forums/post"; route_forums_post (app)
import route_forums_create from "./routes/forums/create"; route_forums_create (app)
import route_forums_category from "./routes/forums/category"; route_forums_category (app)
import route_forums_forum from "./routes/forums/forum"; route_forums_forum (app)
import route_admin from "./routes/admin";import { sendEmail } from "./email"
import { userExists, usernameTaken } from "./user"
 route_admin (app)

if (!fs.existsSync("./data/")) fs.mkdirSync("./data")
if (!fs.existsSync("./data/users.json")) utils.writeJson("./data/users.json", {})
if (!fs.existsSync("./data/forums.json")) utils.writeJson("./data/forums.json", {})
if (!fs.existsSync("./pages/")) fs.mkdirSync("./pages")
if (!fs.existsSync("./index.md")) fs.writeFileSync("./index.md", "# Your stuff here!")
app.get("*", (req: express.Request, res: express.Response) => {
    var session = req.session;
    if (session.attributes === undefined) {
        session.attributes = {}
    }
    var files:any = []
    fs.readdirSync("./pages").forEach(file => {
        if (path.extname(file) == ".md") {
            files.push(file.replace(".md",""))
        }
    })
    res.render("error/404", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files})
})

export default app