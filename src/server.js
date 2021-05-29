#!/usr/bin/env node

import express from "express"
import session from "express-session"
import favicon from "serve-favicon"
import { Liquid } from "liquidjs"
import sasscompiler from "express-compile-sass"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "./utils.js"
import config from "../config.js"

const app = express()
const engine = new Liquid()

app.engine("liquid", engine.express())
app.set("views", "./src/views")
app.set("view engine", "liquid")
app.use("/assets", express.static("./assets"))
app.use(session({secret: '947084975',saveUninitialized: true,resave: true}));
app.use(express.urlencoded({
    extended: true
}))
app.use(favicon("./assets/head.png"))
app.use("/marked", express.static("node_modules/marked"))
app.use("/index.md", express.static("./index.md"))

import route_index from "./routes/index.js"; route_index (app)
import route_login from "./routes/login.js"; route_login (app)
import route_register from "./routes/register.js"; route_register (app)
import route_logout from "./routes/logout.js"; route_logout (app)
import route_pages from "./routes/pages.js"; route_pages (app)
import route_forums_forums from "./routes/forums/forums.js"; route_forums_forums (app)
import route_forums_post from "./routes/forums/post.js"; route_forums_post (app)
import route_forums_create from "./routes/forums/create.js"; route_forums_create (app)

if (!fs.existsSync("./data/")) fs.mkdirSync("./data")
if (!fs.existsSync("./data/users.json")) utils.writeJson("./data/users.json", {})
if (!fs.existsSync("./data/forums.json")) utils.writeJson("./data/forums.json", {})
if (!fs.existsSync("./pages/")) fs.mkdirSync("./pages")
if (!fs.existsSync("./index.md")) fs.writeFileSync("./index.md", "# Your stuff here!")
app.get("*", (req, res) => {
    var session = req.session;
    if (session.attributes === undefined) {
        session.attributes = {}
    }
    var files = []
    fs.readdirSync("./pages").forEach(file => {
        if (path.extname(file) == ".md") {
            files.push(file.replace(".md",""))
        }
    })
    res.render("error/404", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files})
})


export default app