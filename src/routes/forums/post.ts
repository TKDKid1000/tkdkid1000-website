import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../../utils.js"
import config from "../../config"

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
        const forums: any = utils.readJson("./data/forums.json")
        try {
            res.render("forums/post", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files, forums: forums, post: forums[req.params.c]["channels"][req.params.f]["posts"][req.params.p]})
        } catch (e) {
            res.render("forums/post", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files, forums: forums, post: false})
        }
    })
}