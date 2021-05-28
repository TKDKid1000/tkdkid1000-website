#!/usr/bin/env node

const express = require("express")
const session = require("express-session")
const favicon = require("serve-favicon")
const {Liquid} = require("liquidjs")
const marked = require("marked")
const fs = require("fs")
const path = require('path')
const utils = require("./utils")
const config = require("./config")

const app = express()
const engine = new Liquid()

app.engine("liquid", engine.express())
app.set("views", "./views")
app.set("view engine", "liquid")
app.use(express.static("static"))
app.use(express.static("assets"))
app.use(session({secret: '947084975',saveUninitialized: true,resave: true}));
app.use(express.urlencoded({
    extended: true
}))
app.use(favicon("./assets/head.png"))
app.use("/marked", express.static("node_modules/marked"))
app.use("/index.md", express.static("index.md"))

require("./routes/index")(app)
require("./routes/login")(app)
require("./routes/register")(app)
require("./routes/logout")(app)
require("./routes/pages")(app)
require("./routes/forums/forums")(app)
require("./routes/forums/post")(app)
require("./routes/forums/create")(app)

if (!fs.existsSync("./data/")) fs.mkdirSync("./data")
if (!fs.existsSync("./data/users.json")) utils.writeJson("./data/users.json", {})
if (!fs.existsSync("./data/forums.json")) utils.writeJson("./data/forums.json", {General: {description: "General channels",channels: 
{General1: {description: "General chat channel 1",private: false,lastpost: 1,posts: [{title: "Hello World",timestamp: 1620615527544,
content: "Hello world! This is the test post.",author: "rhoneeiler@gmail.com",comments: [{timestamp: 1620615527544,
content: "Hello world! This is the test comment.",author: "rhoneeiler@gmail.com"}]}]}}}})
if (!fs.existsSync("./pages/")) fs.mkdirSync("./pages")

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

app.listen(config.server.port, config.server.hostname, () => {
    console.log(`Server listening on http://${config.server.hostname}:${config.server.port}`)
})