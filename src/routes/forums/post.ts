import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../../utils.js"
import config from "../../config"
import { getForums } from "../../forum.js"
import forum from "./forum.js"

export default function (app: express.Application) {
    app.get("/forums/:c/:f/:p", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        var files: any = []
        fs.readdirSync("./pages").forEach(file => {
            if (path.extname(file) == ".md") {
                files.push(file.replace(".md",""))
            }
        })
        const forums = getForums()
        const category = forums.find(f => f.title === req.params.title)
        if (!category) {
            res.render("forums/post", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files, post: false})
            return
        }
        const forum = category.channels.find(f => f.title === req.params.title)
        if (!forum) {
            res.render("forums/post", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files, post: false})
            return
        }
        const post = forum.posts.find(f => f.title === req.params.title)
        if (!post) {
            res.render("forums/post", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files, post: false})
            return
        }
        res.render("forums/post", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files, post: post})
    })
}