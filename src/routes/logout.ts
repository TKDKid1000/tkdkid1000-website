import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils.js"
import config from "../config.json"

export default function (app: express.Application) {
    app.get("/logout", (req: express.Request, res: express.Response) => {
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
        res.render("logout", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [], custompages: files})
        delete session.attributes.user
    })
}
